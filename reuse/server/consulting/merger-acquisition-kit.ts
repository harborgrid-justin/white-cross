/**
 * LOC: CONS-MA-001
 * File: /reuse/server/consulting/merger-acquisition-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/ma-advisory.service.ts
 *   - backend/consulting/deal-management.controller.ts
 *   - backend/consulting/integration.service.ts
 */

/**
 * File: /reuse/server/consulting/merger-acquisition-kit.ts
 * Locator: WC-CONS-MA-001
 * Purpose: Enterprise-grade Merger & Acquisition Kit - due diligence, valuation, synergy analysis, integration planning
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: M&A advisory services, deal management controllers, integration processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for M&A transactions competing with top-tier investment banks and consulting firms
 *
 * LLM Context: Comprehensive M&A utilities for production-ready investment banking and consulting applications.
 * Provides due diligence checklists, valuation models (DCF, comparables, precedent transactions), synergy analysis,
 * integration planning, cultural assessment, deal structure optimization, post-merger integration tracking,
 * risk assessment, regulatory compliance, stakeholder management, and value creation roadmaps.
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
 * Deal types
 */
export enum DealType {
  MERGER = 'merger',
  ACQUISITION = 'acquisition',
  DIVESTITURE = 'divestiture',
  JOINT_VENTURE = 'joint_venture',
  STRATEGIC_ALLIANCE = 'strategic_alliance',
  ASSET_PURCHASE = 'asset_purchase',
  STOCK_PURCHASE = 'stock_purchase',
}

/**
 * Deal status
 */
export enum DealStatus {
  IDEATION = 'ideation',
  PRELIMINARY_REVIEW = 'preliminary_review',
  DUE_DILIGENCE = 'due_diligence',
  NEGOTIATION = 'negotiation',
  AGREEMENT = 'agreement',
  REGULATORY_APPROVAL = 'regulatory_approval',
  CLOSING = 'closing',
  INTEGRATION = 'integration',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
}

/**
 * Valuation methodologies
 */
export enum ValuationMethod {
  DCF = 'dcf',
  COMPARABLE_COMPANIES = 'comparable_companies',
  PRECEDENT_TRANSACTIONS = 'precedent_transactions',
  ASSET_BASED = 'asset_based',
  MARKET_CAPITALIZATION = 'market_capitalization',
  EARNINGS_MULTIPLE = 'earnings_multiple',
  REVENUE_MULTIPLE = 'revenue_multiple',
  BOOK_VALUE = 'book_value',
}

/**
 * Due diligence areas
 */
export enum DiligenceArea {
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  OPERATIONAL = 'operational',
  COMMERCIAL = 'commercial',
  TECHNOLOGY = 'technology',
  HR = 'hr',
  ENVIRONMENTAL = 'environmental',
  TAX = 'tax',
  REGULATORY = 'regulatory',
  CULTURAL = 'cultural',
}

/**
 * Synergy types
 */
export enum SynergyType {
  REVENUE = 'revenue',
  COST = 'cost',
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  TECHNOLOGY = 'technology',
  TALENT = 'talent',
  MARKET = 'market',
}

/**
 * Integration workstream types
 */
export enum IntegrationWorkstream {
  LEADERSHIP = 'leadership',
  ORGANIZATION = 'organization',
  OPERATIONS = 'operations',
  SYSTEMS = 'systems',
  CULTURE = 'culture',
  CUSTOMER = 'customer',
  COMPLIANCE = 'compliance',
  COMMUNICATIONS = 'communications',
}

/**
 * Risk severity levels
 */
export enum RiskSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NEGLIGIBLE = 'negligible',
}

/**
 * Cultural fit dimensions
 */
export enum CulturalDimension {
  LEADERSHIP_STYLE = 'leadership_style',
  DECISION_MAKING = 'decision_making',
  COMMUNICATION = 'communication',
  RISK_TOLERANCE = 'risk_tolerance',
  INNOVATION = 'innovation',
  CUSTOMER_FOCUS = 'customer_focus',
  EMPLOYEE_ENGAGEMENT = 'employee_engagement',
  PERFORMANCE_MANAGEMENT = 'performance_management',
}

/**
 * Deal structure components
 */
export enum DealStructure {
  CASH = 'cash',
  STOCK = 'stock',
  DEBT = 'debt',
  EARNOUT = 'earnout',
  CONTINGENT_PAYMENT = 'contingent_payment',
  MIXED = 'mixed',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface DealData {
  dealId: string;
  dealName: string;
  dealType: DealType;
  acquirerCompanyId: string;
  targetCompanyId: string;
  dealValue: number;
  currency: string;
  status: DealStatus;
  announcedDate?: Date;
  expectedClosingDate?: Date;
  actualClosingDate?: Date;
  dealStructure: DealStructure;
  strategicRationale: string;
  dealLeadId: string;
  advisors: string[];
  confidentialityLevel: 'public' | 'confidential' | 'highly_confidential';
  metadata?: Record<string, any>;
}

interface DueDiligenceChecklist {
  checklistId: string;
  dealId: string;
  area: DiligenceArea;
  checklistName: string;
  items: DiligenceItem[];
  completionPercentage: number;
  redFlags: RedFlag[];
  leadAssigneeId: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

interface DiligenceItem {
  itemId: string;
  category: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  assigneeId?: string;
  findings?: string;
  documents: string[];
  completedDate?: Date;
}

interface RedFlag {
  flagId: string;
  area: DiligenceArea;
  severity: RiskSeverity;
  description: string;
  potentialImpact: string;
  recommendedAction: string;
  identifiedDate: Date;
  resolvedDate?: Date;
  status: 'open' | 'mitigated' | 'accepted' | 'resolved';
}

interface ValuationModel {
  modelId: string;
  dealId: string;
  targetCompanyId: string;
  method: ValuationMethod;
  baseValue: number;
  adjustments: ValuationAdjustment[];
  finalValue: number;
  valuationDate: Date;
  assumptions: string[];
  sensitivityAnalysis: SensitivityScenario[];
  confidence: 'high' | 'medium' | 'low';
  preparedById: string;
}

interface ValuationAdjustment {
  adjustmentType: string;
  description: string;
  amount: number;
  rationale: string;
}

interface SensitivityScenario {
  scenarioName: string;
  variables: Record<string, number>;
  resultingValue: number;
  probabilityPercentage: number;
}

interface DCFValuation {
  modelId: string;
  targetCompanyId: string;
  projectionYears: number;
  freeCashFlows: number[];
  terminalGrowthRate: number;
  wacc: number;
  terminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  sharesOutstanding: number;
  valuePerShare: number;
}

interface ComparableCompanyAnalysis {
  analysisId: string;
  targetCompanyId: string;
  comparableCompanies: ComparableCompany[];
  averageMultiples: Record<string, number>;
  medianMultiples: Record<string, number>;
  impliedValue: number;
  premiumDiscount: number;
}

interface ComparableCompany {
  companyId: string;
  companyName: string;
  industry: string;
  revenue: number;
  ebitda: number;
  marketCap: number;
  evToRevenue: number;
  evToEbitda: number;
  peRatio: number;
  growthRate: number;
}

interface PrecedentTransaction {
  transactionId: string;
  acquirerName: string;
  targetName: string;
  announcedDate: Date;
  dealValue: number;
  targetRevenue: number;
  targetEbitda: number;
  evToRevenue: number;
  evToEbitda: number;
  premiumPaid: number;
  synergiesAnnounced?: number;
}

interface SynergyAnalysis {
  analysisId: string;
  dealId: string;
  totalSynergies: number;
  revenueSynergies: number;
  costSynergies: number;
  synergies: SynergyItem[];
  realizationTimeline: SynergyTimeline[];
  implementationCost: number;
  netPresentValue: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

interface SynergyItem {
  synergyId: string;
  type: SynergyType;
  category: string;
  description: string;
  annualValue: number;
  realizationYear: number;
  probability: number;
  implementationCost: number;
  dependencies: string[];
  ownerWorkstream: IntegrationWorkstream;
}

interface SynergyTimeline {
  year: number;
  revenueSynergies: number;
  costSynergies: number;
  totalSynergies: number;
  cumulativeSynergies: number;
  realizationPercentage: number;
}

interface IntegrationPlan {
  planId: string;
  dealId: string;
  planName: string;
  startDate: Date;
  targetCompletionDate: Date;
  workstreams: IntegrationWorkstreamPlan[];
  totalBudget: number;
  totalDays: number;
  overallStatus: 'planning' | 'executing' | 'completed' | 'delayed';
  completionPercentage: number;
  criticalPath: string[];
}

interface IntegrationWorkstreamPlan {
  workstreamId: string;
  workstream: IntegrationWorkstream;
  leadId: string;
  objectives: string[];
  activities: IntegrationActivity[];
  budget: number;
  headcount: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  completionPercentage: number;
}

interface IntegrationActivity {
  activityId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  assigneeId: string;
  dependencies: string[];
  deliverables: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  progressPercentage: number;
}

interface CulturalAssessment {
  assessmentId: string;
  dealId: string;
  acquirerCompanyId: string;
  targetCompanyId: string;
  assessmentDate: Date;
  dimensions: CulturalDimensionScore[];
  overallFitScore: number;
  riskLevel: RiskSeverity;
  keyFindings: string[];
  recommendations: string[];
  integrationChallenges: string[];
}

interface CulturalDimensionScore {
  dimension: CulturalDimension;
  acquirerScore: number;
  targetScore: number;
  gapScore: number;
  alignment: 'high' | 'medium' | 'low';
  integrationComplexity: 'simple' | 'moderate' | 'complex';
  recommendations: string[];
}

interface DealStructureAnalysis {
  analysisId: string;
  dealId: string;
  proposedStructures: DealStructureOption[];
  recommendedStructureId: string;
  taxImplications: TaxImplication[];
  accountingTreatment: string;
  regulatoryConsiderations: string[];
}

interface DealStructureOption {
  optionId: string;
  structureType: DealStructure;
  cashComponent: number;
  stockComponent: number;
  debtComponent: number;
  earnoutComponent: number;
  totalConsideration: number;
  acquirerDilution: number;
  taxEfficiency: number;
  financingRisk: RiskSeverity;
  advantages: string[];
  disadvantages: string[];
}

interface TaxImplication {
  jurisdiction: string;
  taxType: string;
  estimatedAmount: number;
  dueDate?: Date;
  mitigationStrategies: string[];
}

interface PostMergerIntegration {
  integrationId: string;
  dealId: string;
  day1Status: Day1Readiness;
  day100Milestones: Milestone[];
  synergyCaptureProgress: SynergyCaptureStatus;
  organizationalHealth: number;
  employeeRetention: number;
  customerRetention: number;
  integrationRisks: IntegrationRisk[];
}

interface Day1Readiness {
  readinessScore: number;
  criticalSystems: SystemReadiness[];
  communicationsPlan: boolean;
  leadershipAlignment: boolean;
  employeeNotifications: boolean;
  customerCommunications: boolean;
  regulatoryFilings: boolean;
  openIssues: number;
}

interface SystemReadiness {
  systemName: string;
  category: 'erp' | 'crm' | 'hr' | 'finance' | 'operations' | 'other';
  integrationApproach: 'integrate' | 'coexist' | 'migrate' | 'sunset';
  readinessStatus: 'ready' | 'at_risk' | 'not_ready';
  contingencyPlan?: string;
}

interface Milestone {
  milestoneId: string;
  name: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  completionDate?: Date;
  owner: string;
  dependencies: string[];
  successCriteria: string[];
}

interface SynergyCaptureStatus {
  targetSynergies: number;
  capturedSynergies: number;
  captureRate: number;
  revenueSynergyProgress: number;
  costSynergyProgress: number;
  atRiskSynergies: number;
  blockedSynergies: SynergyBlockage[];
}

interface SynergyBlockage {
  synergyId: string;
  blocker: string;
  impact: number;
  mitigationPlan: string;
  ownerWorkstream: IntegrationWorkstream;
}

interface IntegrationRisk {
  riskId: string;
  category: string;
  description: string;
  severity: RiskSeverity;
  probability: number;
  impact: number;
  riskScore: number;
  mitigationActions: string[];
  ownerWorkstream: IntegrationWorkstream;
  status: 'identified' | 'mitigating' | 'mitigated' | 'realized';
}

interface StakeholderMap {
  dealId: string;
  stakeholders: Stakeholder[];
  influenceImpactMatrix: InfluenceImpactQuadrant[];
  engagementStrategy: EngagementPlan[];
}

interface Stakeholder {
  stakeholderId: string;
  name: string;
  role: string;
  organization: string;
  influence: number;
  impact: number;
  supportLevel: 'champion' | 'supporter' | 'neutral' | 'resistant' | 'blocker';
  concerns: string[];
  communicationPreference: string;
}

interface InfluenceImpactQuadrant {
  quadrant: 'high_influence_high_impact' | 'high_influence_low_impact' | 'low_influence_high_impact' | 'low_influence_low_impact';
  stakeholderIds: string[];
  strategy: string;
}

interface EngagementPlan {
  stakeholderId: string;
  objectives: string[];
  tactics: string[];
  frequency: string;
  channels: string[];
  ownerId: string;
}

interface RegulatoryApproval {
  approvalId: string;
  dealId: string;
  jurisdiction: string;
  regulatoryBody: string;
  approvalType: string;
  filingDate?: Date;
  expectedDecisionDate?: Date;
  actualDecisionDate?: Date;
  status: 'pending' | 'under_review' | 'approved' | 'conditionally_approved' | 'rejected';
  conditions: string[];
  risks: string[];
}

interface ValueCreationPlan {
  planId: string;
  dealId: string;
  valueDrivers: ValueDriver[];
  initiatives: ValueCreationInitiative[];
  totalValuePotential: number;
  realizationTimeline: number;
  investmentRequired: number;
  expectedROI: number;
}

interface ValueDriver {
  driverId: string;
  category: 'growth' | 'margin' | 'capital' | 'multiple';
  description: string;
  currentState: number;
  targetState: number;
  valuePotential: number;
  timeframe: number;
}

interface ValueCreationInitiative {
  initiativeId: string;
  name: string;
  description: string;
  valueDriverIds: string[];
  expectedValue: number;
  investmentRequired: number;
  startDate: Date;
  completionDate: Date;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed' | 'deferred';
}

// ============================================================================
// DTO DEFINITIONS
// ============================================================================

/**
 * Create Deal DTO
 */
export class CreateDealDto {
  @ApiProperty({ description: 'Deal name', example: 'Project Apollo - Acquisition of HealthTech Inc' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  dealName: string;

  @ApiProperty({ description: 'Deal type', enum: DealType })
  @IsEnum(DealType)
  dealType: DealType;

  @ApiProperty({ description: 'Acquirer company ID', example: 'uuid-acquirer' })
  @IsUUID()
  acquirerCompanyId: string;

  @ApiProperty({ description: 'Target company ID', example: 'uuid-target' })
  @IsUUID()
  targetCompanyId: string;

  @ApiProperty({ description: 'Deal value', example: 150000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  dealValue: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @MaxLength(3)
  currency: string;

  @ApiProperty({ description: 'Deal structure', enum: DealStructure })
  @IsEnum(DealStructure)
  dealStructure: DealStructure;

  @ApiProperty({ description: 'Strategic rationale', example: 'Expand into new geographic markets and acquire key technology' })
  @IsString()
  @MaxLength(2000)
  strategicRationale: string;

  @ApiProperty({ description: 'Deal lead ID', example: 'uuid-lead' })
  @IsUUID()
  dealLeadId: string;

  @ApiProperty({ description: 'Expected closing date', example: '2025-06-30' })
  @Type(() => Date)
  @IsDate()
  expectedClosingDate: Date;
}

/**
 * Due Diligence Item DTO
 */
export class DiligenceItemDto {
  @ApiProperty({ description: 'Category', example: 'Financial Statements' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Item description', example: 'Review audited financial statements for past 3 years' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Priority level', enum: ['critical', 'high', 'medium', 'low'] })
  @IsEnum(['critical', 'high', 'medium', 'low'])
  priority: 'critical' | 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Assignee ID', example: 'uuid-assignee', required: false })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiProperty({ description: 'Document references', example: ['doc-123', 'doc-456'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  documents: string[];
}

/**
 * Create DCF Valuation DTO
 */
export class CreateDCFValuationDto {
  @ApiProperty({ description: 'Target company ID', example: 'uuid-target' })
  @IsUUID()
  targetCompanyId: string;

  @ApiProperty({ description: 'Projection years', example: 5, minimum: 3, maximum: 10 })
  @IsNumber()
  @Min(3)
  @Max(10)
  projectionYears: number;

  @ApiProperty({ description: 'Free cash flows array', example: [10000000, 12000000, 14500000, 17000000, 20000000], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  freeCashFlows: number[];

  @ApiProperty({ description: 'Terminal growth rate', example: 0.025, minimum: 0, maximum: 0.1 })
  @IsNumber()
  @Min(0)
  @Max(0.1)
  terminalGrowthRate: number;

  @ApiProperty({ description: 'WACC (Weighted Average Cost of Capital)', example: 0.09, minimum: 0, maximum: 0.3 })
  @IsNumber()
  @Min(0)
  @Max(0.3)
  wacc: number;

  @ApiProperty({ description: 'Net debt', example: 25000000 })
  @IsNumber()
  netDebt: number;

  @ApiProperty({ description: 'Shares outstanding', example: 10000000, minimum: 1 })
  @IsNumber()
  @Min(1)
  sharesOutstanding: number;
}

/**
 * Comparable Company DTO
 */
export class ComparableCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'HealthCare Solutions Inc' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ description: 'Industry', example: 'Healthcare Technology' })
  @IsString()
  industry: string;

  @ApiProperty({ description: 'Annual revenue', example: 500000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  revenue: number;

  @ApiProperty({ description: 'EBITDA', example: 75000000 })
  @IsNumber()
  ebitda: number;

  @ApiProperty({ description: 'Market capitalization', example: 800000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  marketCap: number;

  @ApiProperty({ description: 'Revenue growth rate', example: 0.15, minimum: -1, maximum: 5 })
  @IsNumber()
  @Min(-1)
  @Max(5)
  growthRate: number;
}

/**
 * Synergy Item DTO
 */
export class SynergyItemDto {
  @ApiProperty({ description: 'Synergy type', enum: SynergyType })
  @IsEnum(SynergyType)
  type: SynergyType;

  @ApiProperty({ description: 'Category', example: 'Procurement consolidation' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Description', example: 'Consolidate supplier contracts to achieve volume discounts' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Annual value', example: 2500000, minimum: 0 })
  @IsNumber()
  @Min(0)
  annualValue: number;

  @ApiProperty({ description: 'Realization year', example: 2, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  realizationYear: number;

  @ApiProperty({ description: 'Probability (0-1)', example: 0.85, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @ApiProperty({ description: 'Implementation cost', example: 500000, minimum: 0 })
  @IsNumber()
  @Min(0)
  implementationCost: number;

  @ApiProperty({ description: 'Owner workstream', enum: IntegrationWorkstream })
  @IsEnum(IntegrationWorkstream)
  ownerWorkstream: IntegrationWorkstream;
}

/**
 * Create Integration Plan DTO
 */
export class CreateIntegrationPlanDto {
  @ApiProperty({ description: 'Deal ID', example: 'uuid-deal' })
  @IsUUID()
  dealId: string;

  @ApiProperty({ description: 'Plan name', example: 'Project Apollo Integration Plan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  planName: string;

  @ApiProperty({ description: 'Start date', example: '2025-07-01' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'Target completion date', example: '2026-06-30' })
  @Type(() => Date)
  @IsDate()
  targetCompletionDate: Date;

  @ApiProperty({ description: 'Total budget', example: 15000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  totalBudget: number;
}

/**
 * Integration Activity DTO
 */
export class IntegrationActivityDto {
  @ApiProperty({ description: 'Activity name', example: 'Integrate ERP systems' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description', example: 'Migrate target company financial data to acquirer ERP' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Start date', example: '2025-08-01' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2025-11-30' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Assignee ID', example: 'uuid-assignee' })
  @IsUUID()
  assigneeId: string;

  @ApiProperty({ description: 'Dependencies (activity IDs)', example: ['act-001', 'act-002'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  dependencies: string[];

  @ApiProperty({ description: 'Deliverables', example: ['Migrated financial data', 'System integration document'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  deliverables: string[];
}

/**
 * Cultural Dimension Score DTO
 */
export class CulturalDimensionScoreDto {
  @ApiProperty({ description: 'Cultural dimension', enum: CulturalDimension })
  @IsEnum(CulturalDimension)
  dimension: CulturalDimension;

  @ApiProperty({ description: 'Acquirer score (1-10)', example: 7, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  acquirerScore: number;

  @ApiProperty({ description: 'Target score (1-10)', example: 5, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  targetScore: number;
}

/**
 * Deal Structure Option DTO
 */
export class DealStructureOptionDto {
  @ApiProperty({ description: 'Structure type', enum: DealStructure })
  @IsEnum(DealStructure)
  structureType: DealStructure;

  @ApiProperty({ description: 'Cash component', example: 75000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  cashComponent: number;

  @ApiProperty({ description: 'Stock component', example: 50000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  stockComponent: number;

  @ApiProperty({ description: 'Debt component', example: 25000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  debtComponent: number;

  @ApiProperty({ description: 'Earnout component', example: 10000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  earnoutComponent: number;

  @ApiProperty({ description: 'Acquirer dilution percentage', example: 0.15, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  acquirerDilution: number;
}

/**
 * Stakeholder DTO
 */
export class StakeholderDto {
  @ApiProperty({ description: 'Stakeholder name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Role', example: 'CEO' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Organization', example: 'Target Company' })
  @IsString()
  organization: string;

  @ApiProperty({ description: 'Influence score (1-10)', example: 9, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  influence: number;

  @ApiProperty({ description: 'Impact score (1-10)', example: 8, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  impact: number;

  @ApiProperty({ description: 'Support level', enum: ['champion', 'supporter', 'neutral', 'resistant', 'blocker'] })
  @IsEnum(['champion', 'supporter', 'neutral', 'resistant', 'blocker'])
  supportLevel: 'champion' | 'supporter' | 'neutral' | 'resistant' | 'blocker';

  @ApiProperty({ description: 'Key concerns', example: ['Job security', 'Cultural fit'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  concerns: string[];
}

/**
 * Value Driver DTO
 */
export class ValueDriverDto {
  @ApiProperty({ description: 'Value driver category', enum: ['growth', 'margin', 'capital', 'multiple'] })
  @IsEnum(['growth', 'margin', 'capital', 'multiple'])
  category: 'growth' | 'margin' | 'capital' | 'multiple';

  @ApiProperty({ description: 'Description', example: 'Cross-sell to target customer base' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Current state value', example: 50000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  currentState: number;

  @ApiProperty({ description: 'Target state value', example: 75000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  targetState: number;

  @ApiProperty({ description: 'Timeframe in months', example: 24, minimum: 1 })
  @IsNumber()
  @Min(1)
  timeframe: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Deal Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Deal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         dealId:
 *           type: string
 *         dealName:
 *           type: string
 *         dealType:
 *           type: string
 *           enum: [merger, acquisition, divestiture, joint_venture, strategic_alliance, asset_purchase, stock_purchase]
 *         dealValue:
 *           type: number
 *         status:
 *           type: string
 *           enum: [ideation, preliminary_review, due_diligence, negotiation, agreement, regulatory_approval, closing, integration, completed, terminated]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class Deal extends Model {
  public id!: string;
  public dealId!: string;
  public dealName!: string;
  public dealType!: DealType;
  public acquirerCompanyId!: string;
  public targetCompanyId!: string;
  public dealValue!: number;
  public currency!: string;
  public status!: DealStatus;
  public announcedDate?: Date;
  public expectedClosingDate?: Date;
  public actualClosingDate?: Date;
  public dealStructure!: DealStructure;
  public strategicRationale!: string;
  public dealLeadId!: string;
  public advisors!: string[];
  public confidentialityLevel!: string;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initDealModel(sequelize: Sequelize): typeof Deal {
  Deal.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dealId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      dealName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      dealType: {
        type: DataTypes.ENUM(...Object.values(DealType)),
        allowNull: false,
      },
      acquirerCompanyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      targetCompanyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      dealValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DealStatus)),
        allowNull: false,
        defaultValue: DealStatus.IDEATION,
      },
      announcedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expectedClosingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actualClosingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dealStructure: {
        type: DataTypes.ENUM(...Object.values(DealStructure)),
        allowNull: false,
      },
      strategicRationale: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dealLeadId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      advisors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      confidentialityLevel: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'confidential',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'deals',
      timestamps: true,
      indexes: [
        { fields: ['dealId'] },
        { fields: ['status'] },
        { fields: ['acquirerCompanyId'] },
        { fields: ['targetCompanyId'] },
      ],
    }
  );

  return Deal;
}

/**
 * Due Diligence Checklist Sequelize model.
 */
export class DueDiligenceChecklist extends Model {
  public id!: string;
  public checklistId!: string;
  public dealId!: string;
  public area!: DiligenceArea;
  public checklistName!: string;
  public items!: DiligenceItem[];
  public completionPercentage!: number;
  public redFlags!: RedFlag[];
  public leadAssigneeId!: string;
  public dueDate!: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initDueDiligenceChecklistModel(sequelize: Sequelize): typeof DueDiligenceChecklist {
  DueDiligenceChecklist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      checklistId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      dealId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      area: {
        type: DataTypes.ENUM(...Object.values(DiligenceArea)),
        allowNull: false,
      },
      checklistName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      completionPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      redFlags: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      leadAssigneeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'not_started',
      },
    },
    {
      sequelize,
      tableName: 'due_diligence_checklists',
      timestamps: true,
      indexes: [
        { fields: ['dealId'] },
        { fields: ['area'] },
        { fields: ['status'] },
      ],
    }
  );

  return DueDiligenceChecklist;
}

/**
 * Valuation Model Sequelize model.
 */
export class ValuationModelEntity extends Model {
  public id!: string;
  public modelId!: string;
  public dealId!: string;
  public targetCompanyId!: string;
  public method!: ValuationMethod;
  public baseValue!: number;
  public adjustments!: ValuationAdjustment[];
  public finalValue!: number;
  public valuationDate!: Date;
  public assumptions!: string[];
  public sensitivityAnalysis!: SensitivityScenario[];
  public confidence!: string;
  public preparedById!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initValuationModelEntity(sequelize: Sequelize): typeof ValuationModelEntity {
  ValuationModelEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      modelId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      dealId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      targetCompanyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM(...Object.values(ValuationMethod)),
        allowNull: false,
      },
      baseValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      adjustments: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      finalValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assumptions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      sensitivityAnalysis: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      confidence: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      preparedById: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'valuation_models',
      timestamps: true,
      indexes: [
        { fields: ['dealId'] },
        { fields: ['targetCompanyId'] },
        { fields: ['method'] },
      ],
    }
  );

  return ValuationModelEntity;
}

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Creates a new M&A deal.
 *
 * @swagger
 * @openapi
 * /api/ma/deals:
 *   post:
 *     tags:
 *       - M&A
 *     summary: Create deal
 *     description: Creates a new M&A deal with specified parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDealDto'
 *     responses:
 *       201:
 *         description: Deal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deal'
 *
 * @param {Partial<DealData>} data - Deal creation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<DealData>} Created deal
 *
 * @example
 * ```typescript
 * const deal = await createDeal({
 *   dealName: 'Project Apollo',
 *   dealType: DealType.ACQUISITION,
 *   acquirerCompanyId: 'uuid-acq',
 *   targetCompanyId: 'uuid-tgt',
 *   dealValue: 150000000,
 *   currency: 'USD',
 *   dealStructure: DealStructure.MIXED,
 *   strategicRationale: 'Expand market presence'
 * });
 * ```
 */
export async function createDeal(
  data: Partial<DealData>,
  transaction?: Transaction
): Promise<DealData> {
  const dealId = data.dealId || `DEAL-${Date.now()}`;

  return {
    dealId,
    dealName: data.dealName || '',
    dealType: data.dealType || DealType.ACQUISITION,
    acquirerCompanyId: data.acquirerCompanyId || '',
    targetCompanyId: data.targetCompanyId || '',
    dealValue: data.dealValue || 0,
    currency: data.currency || 'USD',
    status: data.status || DealStatus.IDEATION,
    announcedDate: data.announcedDate,
    expectedClosingDate: data.expectedClosingDate,
    actualClosingDate: data.actualClosingDate,
    dealStructure: data.dealStructure || DealStructure.CASH,
    strategicRationale: data.strategicRationale || '',
    dealLeadId: data.dealLeadId || '',
    advisors: data.advisors || [],
    confidentialityLevel: data.confidentialityLevel || 'confidential',
    metadata: data.metadata || {},
  };
}

/**
 * Creates a comprehensive due diligence checklist.
 *
 * @param {string} dealId - Deal identifier
 * @param {DiligenceArea} area - Due diligence area
 * @param {string} leadAssigneeId - Lead assignee
 * @param {Date} dueDate - Due date
 * @returns {Promise<DueDiligenceChecklist>} Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createDueDiligenceChecklist(
 *   'DEAL-001',
 *   DiligenceArea.FINANCIAL,
 *   'uuid-lead',
 *   new Date('2025-05-31')
 * );
 * ```
 */
export async function createDueDiligenceChecklist(
  dealId: string,
  area: DiligenceArea,
  leadAssigneeId: string,
  dueDate: Date
): Promise<DueDiligenceChecklist> {
  const checklistId = `DD-${dealId}-${area}-${Date.now()}`;

  const templateItems: Record<DiligenceArea, DiligenceItem[]> = {
    [DiligenceArea.FINANCIAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Financial Statements',
        description: 'Review audited financial statements for past 3-5 years',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
      {
        itemId: `${checklistId}-2`,
        category: 'Revenue Quality',
        description: 'Analyze revenue recognition policies and trends',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
      {
        itemId: `${checklistId}-3`,
        category: 'Working Capital',
        description: 'Assess working capital requirements and trends',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.LEGAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Corporate Structure',
        description: 'Review corporate organization and ownership structure',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
      {
        itemId: `${checklistId}-2`,
        category: 'Material Contracts',
        description: 'Review all material customer and supplier contracts',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.OPERATIONAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Operations Overview',
        description: 'Understand operational model and key processes',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.COMMERCIAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Customer Analysis',
        description: 'Analyze customer concentration and retention',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.TECHNOLOGY]: [
      {
        itemId: `${checklistId}-1`,
        category: 'IT Infrastructure',
        description: 'Assess technology stack and infrastructure',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.HR]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Key Personnel',
        description: 'Identify key employees and retention risks',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.ENVIRONMENTAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Environmental Compliance',
        description: 'Review environmental permits and compliance',
        priority: 'medium',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.TAX]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Tax Returns',
        description: 'Review tax returns and positions',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.REGULATORY]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Regulatory Compliance',
        description: 'Assess regulatory compliance and licenses',
        priority: 'critical',
        status: 'pending',
        documents: [],
      },
    ],
    [DiligenceArea.CULTURAL]: [
      {
        itemId: `${checklistId}-1`,
        category: 'Culture Assessment',
        description: 'Conduct cultural fit assessment',
        priority: 'high',
        status: 'pending',
        documents: [],
      },
    ],
  };

  return {
    checklistId,
    dealId,
    area,
    checklistName: `${area} Due Diligence`,
    items: templateItems[area] || [],
    completionPercentage: 0,
    redFlags: [],
    leadAssigneeId,
    dueDate,
    status: 'not_started',
  } as any;
}

/**
 * Performs DCF (Discounted Cash Flow) valuation.
 *
 * @param {Partial<DCFValuation>} data - DCF valuation parameters
 * @returns {Promise<DCFValuation>} DCF valuation result
 *
 * @example
 * ```typescript
 * const dcf = await performDCFValuation({
 *   targetCompanyId: 'uuid-target',
 *   projectionYears: 5,
 *   freeCashFlows: [10M, 12M, 14.5M, 17M, 20M],
 *   terminalGrowthRate: 0.025,
 *   wacc: 0.09,
 *   netDebt: 25M,
 *   sharesOutstanding: 10M
 * });
 * console.log(`Equity value per share: $${dcf.valuePerShare.toFixed(2)}`);
 * ```
 */
export async function performDCFValuation(
  data: Partial<DCFValuation>
): Promise<DCFValuation> {
  const modelId = `DCF-${data.targetCompanyId}-${Date.now()}`;
  const fcfs = data.freeCashFlows || [];
  const wacc = data.wacc || 0.09;
  const terminalGrowthRate = data.terminalGrowthRate || 0.025;

  // Calculate present value of projected cash flows
  let pvOfFCF = 0;
  fcfs.forEach((fcf, index) => {
    const year = index + 1;
    const discountFactor = Math.pow(1 + wacc, year);
    pvOfFCF += fcf / discountFactor;
  });

  // Calculate terminal value
  const finalYearFCF = fcfs[fcfs.length - 1] || 0;
  const terminalValue = (finalYearFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
  const pvOfTerminalValue = terminalValue / Math.pow(1 + wacc, fcfs.length);

  // Calculate enterprise value and equity value
  const enterpriseValue = pvOfFCF + pvOfTerminalValue;
  const netDebt = data.netDebt || 0;
  const equityValue = enterpriseValue - netDebt;
  const sharesOutstanding = data.sharesOutstanding || 1;
  const valuePerShare = equityValue / sharesOutstanding;

  return {
    modelId,
    targetCompanyId: data.targetCompanyId || '',
    projectionYears: fcfs.length,
    freeCashFlows: fcfs,
    terminalGrowthRate,
    wacc,
    terminalValue,
    enterpriseValue,
    netDebt,
    equityValue,
    sharesOutstanding,
    valuePerShare,
  };
}

/**
 * Performs comparable company analysis.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {ComparableCompany[]} comparables - Comparable companies
 * @param {number} targetRevenue - Target company revenue
 * @param {number} targetEbitda - Target company EBITDA
 * @returns {Promise<ComparableCompanyAnalysis>} Comparable analysis
 *
 * @example
 * ```typescript
 * const compAnalysis = await performComparableCompanyAnalysis(
 *   'uuid-target',
 *   comparableCompanies,
 *   500000000,
 *   75000000
 * );
 * console.log(`Implied value: $${compAnalysis.impliedValue.toLocaleString()}`);
 * ```
 */
export async function performComparableCompanyAnalysis(
  targetCompanyId: string,
  comparables: ComparableCompany[],
  targetRevenue: number,
  targetEbitda: number
): Promise<ComparableCompanyAnalysis> {
  const analysisId = `COMP-${targetCompanyId}-${Date.now()}`;

  // Calculate multiples for each comparable
  const comparablesWithMultiples = comparables.map(comp => ({
    ...comp,
    evToRevenue: comp.marketCap / comp.revenue,
    evToEbitda: comp.marketCap / comp.ebitda,
    peRatio: comp.marketCap / (comp.ebitda * 0.7), // Simplified P/E approximation
  }));

  // Calculate average and median multiples
  const evToRevenues = comparablesWithMultiples.map(c => c.evToRevenue);
  const evToEbitdas = comparablesWithMultiples.map(c => c.evToEbitda);

  const avgEvToRevenue = evToRevenues.reduce((a, b) => a + b, 0) / evToRevenues.length;
  const avgEvToEbitda = evToEbitdas.reduce((a, b) => a + b, 0) / evToEbitdas.length;

  const medianEvToRevenue = evToRevenues.sort((a, b) => a - b)[Math.floor(evToRevenues.length / 2)];
  const medianEvToEbitda = evToEbitdas.sort((a, b) => a - b)[Math.floor(evToEbitdas.length / 2)];

  // Calculate implied value using average multiples
  const impliedValueRevenue = targetRevenue * avgEvToRevenue;
  const impliedValueEbitda = targetEbitda * avgEvToEbitda;
  const impliedValue = (impliedValueRevenue + impliedValueEbitda) / 2;

  return {
    analysisId,
    targetCompanyId,
    comparableCompanies: comparablesWithMultiples,
    averageMultiples: {
      evToRevenue: avgEvToRevenue,
      evToEbitda: avgEvToEbitda,
    },
    medianMultiples: {
      evToRevenue: medianEvToRevenue,
      evToEbitda: medianEvToEbitda,
    },
    impliedValue,
    premiumDiscount: 0, // Can be adjusted based on specific factors
  };
}

/**
 * Analyzes precedent transactions.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {PrecedentTransaction[]} precedents - Precedent transactions
 * @param {number} targetRevenue - Target revenue
 * @param {number} targetEbitda - Target EBITDA
 * @returns {Promise<{ impliedValue: number; averageMultiples: Record<string, number> }>} Analysis result
 *
 * @example
 * ```typescript
 * const precedentAnalysis = await analyzePrecedentTransactions(
 *   'uuid-target',
 *   precedentTransactions,
 *   500000000,
 *   75000000
 * );
 * ```
 */
export async function analyzePrecedentTransactions(
  targetCompanyId: string,
  precedents: PrecedentTransaction[],
  targetRevenue: number,
  targetEbitda: number
): Promise<{ impliedValue: number; averageMultiples: Record<string, number>; medianPremium: number }> {
  // Calculate average multiples from precedent transactions
  const evToRevenues = precedents.map(p => p.evToRevenue);
  const evToEbitdas = precedents.map(p => p.evToEbitda);
  const premiums = precedents.map(p => p.premiumPaid);

  const avgEvToRevenue = evToRevenues.reduce((a, b) => a + b, 0) / evToRevenues.length;
  const avgEvToEbitda = evToEbitdas.reduce((a, b) => a + b, 0) / evToEbitdas.length;
  const medianPremium = premiums.sort((a, b) => a - b)[Math.floor(premiums.length / 2)];

  // Calculate implied value
  const impliedValueRevenue = targetRevenue * avgEvToRevenue;
  const impliedValueEbitda = targetEbitda * avgEvToEbitda;
  const impliedValue = (impliedValueRevenue + impliedValueEbitda) / 2;

  return {
    impliedValue,
    averageMultiples: {
      evToRevenue: avgEvToRevenue,
      evToEbitda: avgEvToEbitda,
    },
    medianPremium,
  };
}

/**
 * Performs comprehensive synergy analysis.
 *
 * @param {string} dealId - Deal ID
 * @param {SynergyItem[]} synergies - Synergy items
 * @param {number} discountRate - Discount rate for NPV
 * @returns {Promise<SynergyAnalysis>} Synergy analysis
 *
 * @example
 * ```typescript
 * const synergyAnalysis = await performSynergyAnalysis(
 *   'DEAL-001',
 *   synergyItems,
 *   0.09
 * );
 * console.log(`Total synergies: $${synergyAnalysis.totalSynergies.toLocaleString()}`);
 * ```
 */
export async function performSynergyAnalysis(
  dealId: string,
  synergies: SynergyItem[],
  discountRate: number = 0.09
): Promise<SynergyAnalysis> {
  const analysisId = `SYN-${dealId}-${Date.now()}`;

  // Calculate probability-adjusted synergies
  const adjustedSynergies = synergies.map(s => ({
    ...s,
    adjustedValue: s.annualValue * s.probability,
  }));

  // Aggregate by type
  const revenueSynergies = adjustedSynergies
    .filter(s => s.type === SynergyType.REVENUE)
    .reduce((sum, s) => sum + s.adjustedValue, 0);

  const costSynergies = adjustedSynergies
    .filter(s => s.type === SynergyType.COST)
    .reduce((sum, s) => sum + s.adjustedValue, 0);

  const totalSynergies = revenueSynergies + costSynergies;

  // Calculate implementation cost
  const implementationCost = synergies.reduce((sum, s) => sum + s.implementationCost, 0);

  // Build realization timeline (5 years)
  const timeline: SynergyTimeline[] = [];
  for (let year = 1; year <= 5; year++) {
    const yearSynergies = adjustedSynergies.filter(s => s.realizationYear === year);
    const yearRevenue = yearSynergies.filter(s => s.type === SynergyType.REVENUE).reduce((sum, s) => sum + s.adjustedValue, 0);
    const yearCost = yearSynergies.filter(s => s.type === SynergyType.COST).reduce((sum, s) => sum + s.adjustedValue, 0);
    const yearTotal = yearRevenue + yearCost;

    const cumulativeSynergies = timeline.length > 0
      ? timeline[timeline.length - 1].cumulativeSynergies + yearTotal
      : yearTotal;

    timeline.push({
      year,
      revenueSynergies: yearRevenue,
      costSynergies: yearCost,
      totalSynergies: yearTotal,
      cumulativeSynergies,
      realizationPercentage: (cumulativeSynergies / totalSynergies) * 100,
    });
  }

  // Calculate NPV of synergies
  let npv = -implementationCost; // Initial investment
  timeline.forEach(t => {
    npv += t.totalSynergies / Math.pow(1 + discountRate, t.year);
  });

  return {
    analysisId,
    dealId,
    totalSynergies,
    revenueSynergies,
    costSynergies,
    synergies: adjustedSynergies,
    realizationTimeline: timeline,
    implementationCost,
    netPresentValue: npv,
    confidenceLevel: npv > 0 ? 'high' : 'medium',
  };
}

/**
 * Creates integration plan with workstreams.
 *
 * @param {Partial<IntegrationPlan>} data - Integration plan data
 * @returns {Promise<IntegrationPlan>} Created integration plan
 *
 * @example
 * ```typescript
 * const integrationPlan = await createIntegrationPlan({
 *   dealId: 'DEAL-001',
 *   planName: 'Project Apollo Integration',
 *   startDate: new Date('2025-07-01'),
 *   targetCompletionDate: new Date('2026-06-30'),
 *   totalBudget: 15000000
 * });
 * ```
 */
export async function createIntegrationPlan(
  data: Partial<IntegrationPlan>
): Promise<IntegrationPlan> {
  const planId = `INT-${data.dealId}-${Date.now()}`;

  const startDate = data.startDate || new Date();
  const targetCompletionDate = data.targetCompletionDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const totalDays = Math.floor((targetCompletionDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

  // Create default workstreams
  const workstreamTypes = Object.values(IntegrationWorkstream);
  const workstreams: IntegrationWorkstreamPlan[] = workstreamTypes.map(ws => ({
    workstreamId: `WS-${planId}-${ws}`,
    workstream: ws,
    leadId: '',
    objectives: [],
    activities: [],
    budget: 0,
    headcount: 0,
    status: 'not_started',
    completionPercentage: 0,
  }));

  return {
    planId,
    dealId: data.dealId || '',
    planName: data.planName || '',
    startDate,
    targetCompletionDate,
    workstreams: data.workstreams || workstreams,
    totalBudget: data.totalBudget || 0,
    totalDays,
    overallStatus: 'planning',
    completionPercentage: 0,
    criticalPath: data.criticalPath || [],
  };
}

/**
 * Adds activity to integration workstream.
 *
 * @param {string} planId - Integration plan ID
 * @param {string} workstreamId - Workstream ID
 * @param {Partial<IntegrationActivity>} activity - Activity data
 * @returns {Promise<IntegrationActivity>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await addIntegrationActivity(
 *   'INT-001',
 *   'WS-001',
 *   {
 *     name: 'Integrate ERP systems',
 *     description: 'Migrate financial data',
 *     startDate: new Date('2025-08-01'),
 *     endDate: new Date('2025-11-30'),
 *     assigneeId: 'uuid-assignee'
 *   }
 * );
 * ```
 */
export async function addIntegrationActivity(
  planId: string,
  workstreamId: string,
  activity: Partial<IntegrationActivity>
): Promise<IntegrationActivity> {
  const activityId = `ACT-${workstreamId}-${Date.now()}`;

  return {
    activityId,
    name: activity.name || '',
    description: activity.description || '',
    startDate: activity.startDate || new Date(),
    endDate: activity.endDate || new Date(),
    assigneeId: activity.assigneeId || '',
    dependencies: activity.dependencies || [],
    deliverables: activity.deliverables || [],
    status: 'pending',
    progressPercentage: 0,
  };
}

/**
 * Performs cultural assessment between acquirer and target.
 *
 * @param {string} dealId - Deal ID
 * @param {string} acquirerCompanyId - Acquirer company ID
 * @param {string} targetCompanyId - Target company ID
 * @param {CulturalDimensionScore[]} dimensionScores - Cultural dimension scores
 * @returns {Promise<CulturalAssessment>} Cultural assessment
 *
 * @example
 * ```typescript
 * const culturalAssessment = await performCulturalAssessment(
 *   'DEAL-001',
 *   'uuid-acq',
 *   'uuid-tgt',
 *   dimensionScores
 * );
 * console.log(`Overall fit score: ${culturalAssessment.overallFitScore}`);
 * ```
 */
export async function performCulturalAssessment(
  dealId: string,
  acquirerCompanyId: string,
  targetCompanyId: string,
  dimensionScores: CulturalDimensionScore[]
): Promise<CulturalAssessment> {
  const assessmentId = `CULT-${dealId}-${Date.now()}`;

  // Calculate dimensions with gap scores
  const dimensions = dimensionScores.map(ds => {
    const gapScore = Math.abs(ds.acquirerScore - ds.targetScore);
    let alignment: 'high' | 'medium' | 'low';
    let integrationComplexity: 'simple' | 'moderate' | 'complex';

    if (gapScore <= 2) {
      alignment = 'high';
      integrationComplexity = 'simple';
    } else if (gapScore <= 4) {
      alignment = 'medium';
      integrationComplexity = 'moderate';
    } else {
      alignment = 'low';
      integrationComplexity = 'complex';
    }

    return {
      ...ds,
      gapScore,
      alignment,
      integrationComplexity,
      recommendations: [],
    };
  });

  // Calculate overall fit score (0-100)
  const totalGap = dimensions.reduce((sum, d) => sum + d.gapScore, 0);
  const maxPossibleGap = dimensions.length * 10; // Max gap is 10 per dimension
  const overallFitScore = Math.max(0, 100 - (totalGap / maxPossibleGap) * 100);

  // Determine risk level
  let riskLevel: RiskSeverity;
  if (overallFitScore >= 75) {
    riskLevel = RiskSeverity.LOW;
  } else if (overallFitScore >= 50) {
    riskLevel = RiskSeverity.MEDIUM;
  } else if (overallFitScore >= 30) {
    riskLevel = RiskSeverity.HIGH;
  } else {
    riskLevel = RiskSeverity.CRITICAL;
  }

  return {
    assessmentId,
    dealId,
    acquirerCompanyId,
    targetCompanyId,
    assessmentDate: new Date(),
    dimensions,
    overallFitScore,
    riskLevel,
    keyFindings: [],
    recommendations: [],
    integrationChallenges: [],
  };
}

/**
 * Analyzes deal structure options.
 *
 * @param {string} dealId - Deal ID
 * @param {DealStructureOption[]} structureOptions - Structure options
 * @returns {Promise<DealStructureAnalysis>} Deal structure analysis
 *
 * @example
 * ```typescript
 * const structureAnalysis = await analyzeDealStructure(
 *   'DEAL-001',
 *   structureOptions
 * );
 * console.log(`Recommended structure: ${structureAnalysis.recommendedStructureId}`);
 * ```
 */
export async function analyzeDealStructure(
  dealId: string,
  structureOptions: DealStructureOption[]
): Promise<DealStructureAnalysis> {
  const analysisId = `STRUCT-${dealId}-${Date.now()}`;

  // Score each option
  const scoredOptions = structureOptions.map(option => {
    let score = 0;

    // Tax efficiency (0-40 points)
    score += option.taxEfficiency * 40;

    // Lower dilution is better (0-30 points)
    score += (1 - option.acquirerDilution) * 30;

    // Lower financing risk is better (0-30 points)
    const riskScores = {
      [RiskSeverity.NEGLIGIBLE]: 30,
      [RiskSeverity.LOW]: 24,
      [RiskSeverity.MEDIUM]: 18,
      [RiskSeverity.HIGH]: 12,
      [RiskSeverity.CRITICAL]: 6,
    };
    score += riskScores[option.financingRisk] || 0;

    return { option, score };
  });

  // Find recommended option (highest score)
  const recommended = scoredOptions.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  return {
    analysisId,
    dealId,
    proposedStructures: structureOptions,
    recommendedStructureId: recommended.option.optionId,
    taxImplications: [],
    accountingTreatment: '',
    regulatoryConsiderations: [],
  };
}

/**
 * Calculates deal premium paid.
 *
 * @param {number} dealValue - Deal value
 * @param {number} targetMarketCap - Target's pre-announcement market cap
 * @returns {Promise<{ premiumAmount: number; premiumPercentage: number }>} Premium calculation
 *
 * @example
 * ```typescript
 * const premium = await calculateDealPremium(150000000, 120000000);
 * console.log(`Premium: ${premium.premiumPercentage.toFixed(2)}%`);
 * ```
 */
export async function calculateDealPremium(
  dealValue: number,
  targetMarketCap: number
): Promise<{ premiumAmount: number; premiumPercentage: number }> {
  const premiumAmount = dealValue - targetMarketCap;
  const premiumPercentage = (premiumAmount / targetMarketCap) * 100;

  return {
    premiumAmount,
    premiumPercentage,
  };
}

/**
 * Tracks post-merger integration progress.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<PostMergerIntegration>} data - PMI data
 * @returns {Promise<PostMergerIntegration>} PMI tracking
 *
 * @example
 * ```typescript
 * const pmi = await trackPostMergerIntegration('DEAL-001', pmiData);
 * console.log(`Day 1 readiness: ${pmi.day1Status.readinessScore}%`);
 * ```
 */
export async function trackPostMergerIntegration(
  dealId: string,
  data: Partial<PostMergerIntegration>
): Promise<PostMergerIntegration> {
  const integrationId = `PMI-${dealId}-${Date.now()}`;

  const defaultDay1Status: Day1Readiness = {
    readinessScore: 0,
    criticalSystems: [],
    communicationsPlan: false,
    leadershipAlignment: false,
    employeeNotifications: false,
    customerCommunications: false,
    regulatoryFilings: false,
    openIssues: 0,
  };

  const defaultSynergyCaptureStatus: SynergyCaptureStatus = {
    targetSynergies: 0,
    capturedSynergies: 0,
    captureRate: 0,
    revenueSynergyProgress: 0,
    costSynergyProgress: 0,
    atRiskSynergies: 0,
    blockedSynergies: [],
  };

  return {
    integrationId,
    dealId,
    day1Status: data.day1Status || defaultDay1Status,
    day100Milestones: data.day100Milestones || [],
    synergyCaptureProgress: data.synergyCaptureProgress || defaultSynergyCaptureStatus,
    organizationalHealth: data.organizationalHealth || 0,
    employeeRetention: data.employeeRetention || 0,
    customerRetention: data.customerRetention || 0,
    integrationRisks: data.integrationRisks || [],
  };
}

/**
 * Creates Day 1 readiness checklist.
 *
 * @param {string} dealId - Deal ID
 * @returns {Promise<Day1Readiness>} Day 1 readiness
 *
 * @example
 * ```typescript
 * const day1 = await createDay1ReadinessChecklist('DEAL-001');
 * ```
 */
export async function createDay1ReadinessChecklist(
  dealId: string
): Promise<Day1Readiness> {
  const criticalSystems: SystemReadiness[] = [
    {
      systemName: 'ERP',
      category: 'erp',
      integrationApproach: 'coexist',
      readinessStatus: 'ready',
    },
    {
      systemName: 'CRM',
      category: 'crm',
      integrationApproach: 'coexist',
      readinessStatus: 'ready',
    },
    {
      systemName: 'HR System',
      category: 'hr',
      integrationApproach: 'integrate',
      readinessStatus: 'at_risk',
    },
  ];

  return {
    readinessScore: 75,
    criticalSystems,
    communicationsPlan: true,
    leadershipAlignment: true,
    employeeNotifications: true,
    customerCommunications: true,
    regulatoryFilings: true,
    openIssues: 3,
  };
}

/**
 * Maps deal stakeholders with influence-impact analysis.
 *
 * @param {string} dealId - Deal ID
 * @param {Stakeholder[]} stakeholders - Stakeholders
 * @returns {Promise<StakeholderMap>} Stakeholder map
 *
 * @example
 * ```typescript
 * const stakeholderMap = await mapDealStakeholders('DEAL-001', stakeholders);
 * ```
 */
export async function mapDealStakeholders(
  dealId: string,
  stakeholders: Stakeholder[]
): Promise<StakeholderMap> {
  // Categorize stakeholders into influence-impact quadrants
  const quadrants: InfluenceImpactQuadrant[] = [
    {
      quadrant: 'high_influence_high_impact',
      stakeholderIds: stakeholders.filter(s => s.influence >= 7 && s.impact >= 7).map(s => s.stakeholderId),
      strategy: 'Manage closely - key players requiring active engagement',
    },
    {
      quadrant: 'high_influence_low_impact',
      stakeholderIds: stakeholders.filter(s => s.influence >= 7 && s.impact < 7).map(s => s.stakeholderId),
      strategy: 'Keep satisfied - consult regularly but don\'t over-communicate',
    },
    {
      quadrant: 'low_influence_high_impact',
      stakeholderIds: stakeholders.filter(s => s.influence < 7 && s.impact >= 7).map(s => s.stakeholderId),
      strategy: 'Keep informed - ensure they understand benefits',
    },
    {
      quadrant: 'low_influence_low_impact',
      stakeholderIds: stakeholders.filter(s => s.influence < 7 && s.impact < 7).map(s => s.stakeholderId),
      strategy: 'Monitor - minimal effort required',
    },
  ];

  // Create engagement plans
  const engagementPlans: EngagementPlan[] = stakeholders.map(s => ({
    stakeholderId: s.stakeholderId,
    objectives: s.supportLevel === 'blocker' ? ['Address concerns', 'Build support'] : ['Maintain support'],
    tactics: s.influence >= 7 ? ['1-on-1 meetings', 'Executive briefings'] : ['Email updates', 'Town halls'],
    frequency: s.influence >= 7 && s.impact >= 7 ? 'Weekly' : 'Monthly',
    channels: [s.communicationPreference],
    ownerId: '',
  }));

  return {
    dealId,
    stakeholders,
    influenceImpactMatrix: quadrants,
    engagementStrategy: engagementPlans,
  };
}

/**
 * Tracks regulatory approval status.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<RegulatoryApproval>} data - Regulatory approval data
 * @returns {Promise<RegulatoryApproval>} Regulatory approval
 *
 * @example
 * ```typescript
 * const approval = await trackRegulatoryApproval('DEAL-001', approvalData);
 * ```
 */
export async function trackRegulatoryApproval(
  dealId: string,
  data: Partial<RegulatoryApproval>
): Promise<RegulatoryApproval> {
  const approvalId = `REG-${dealId}-${data.jurisdiction}-${Date.now()}`;

  return {
    approvalId,
    dealId,
    jurisdiction: data.jurisdiction || '',
    regulatoryBody: data.regulatoryBody || '',
    approvalType: data.approvalType || '',
    filingDate: data.filingDate,
    expectedDecisionDate: data.expectedDecisionDate,
    actualDecisionDate: data.actualDecisionDate,
    status: data.status || 'pending',
    conditions: data.conditions || [],
    risks: data.risks || [],
  };
}

/**
 * Creates value creation plan for deal.
 *
 * @param {string} dealId - Deal ID
 * @param {Partial<ValueCreationPlan>} data - Value creation plan data
 * @returns {Promise<ValueCreationPlan>} Value creation plan
 *
 * @example
 * ```typescript
 * const valuePlan = await createValueCreationPlan('DEAL-001', planData);
 * console.log(`Expected ROI: ${valuePlan.expectedROI.toFixed(2)}`);
 * ```
 */
export async function createValueCreationPlan(
  dealId: string,
  data: Partial<ValueCreationPlan>
): Promise<ValueCreationPlan> {
  const planId = `VAL-${dealId}-${Date.now()}`;

  const valueDrivers = data.valueDrivers || [];
  const initiatives = data.initiatives || [];

  const totalValuePotential = valueDrivers.reduce((sum, vd) => sum + vd.valuePotential, 0);
  const investmentRequired = initiatives.reduce((sum, i) => sum + i.investmentRequired, 0);
  const expectedROI = investmentRequired > 0 ? (totalValuePotential - investmentRequired) / investmentRequired : 0;

  const maxTimeframe = Math.max(...valueDrivers.map(vd => vd.timeframe), 12);

  return {
    planId,
    dealId,
    valueDrivers,
    initiatives,
    totalValuePotential,
    realizationTimeline: maxTimeframe,
    investmentRequired,
    expectedROI,
  };
}

/**
 * Identifies integration risks.
 *
 * @param {string} dealId - Deal ID
 * @param {string[]} riskCategories - Risk categories to assess
 * @returns {Promise<IntegrationRisk[]>} Identified risks
 *
 * @example
 * ```typescript
 * const risks = await identifyIntegrationRisks('DEAL-001', ['systems', 'culture', 'operations']);
 * ```
 */
export async function identifyIntegrationRisks(
  dealId: string,
  riskCategories: string[]
): Promise<IntegrationRisk[]> {
  const risks: IntegrationRisk[] = [];

  riskCategories.forEach((category, index) => {
    const riskId = `RISK-${dealId}-${category}-${index}`;

    // Example risk templates
    if (category === 'systems') {
      risks.push({
        riskId,
        category,
        description: 'System integration complexity and data migration risks',
        severity: RiskSeverity.HIGH,
        probability: 0.7,
        impact: 8,
        riskScore: 0.7 * 8,
        mitigationActions: ['Conduct thorough system assessment', 'Develop detailed integration plan', 'Run parallel systems initially'],
        ownerWorkstream: IntegrationWorkstream.SYSTEMS,
        status: 'identified',
      });
    } else if (category === 'culture') {
      risks.push({
        riskId,
        category,
        description: 'Cultural misalignment leading to employee attrition',
        severity: RiskSeverity.MEDIUM,
        probability: 0.5,
        impact: 7,
        riskScore: 0.5 * 7,
        mitigationActions: ['Cultural integration workshops', 'Leadership alignment sessions', 'Clear communication plan'],
        ownerWorkstream: IntegrationWorkstream.CULTURE,
        status: 'identified',
      });
    } else if (category === 'operations') {
      risks.push({
        riskId,
        category,
        description: 'Operational disruption during integration',
        severity: RiskSeverity.MEDIUM,
        probability: 0.6,
        impact: 6,
        riskScore: 0.6 * 6,
        mitigationActions: ['Phased integration approach', 'Maintain operational continuity', 'Resource redundancy'],
        ownerWorkstream: IntegrationWorkstream.OPERATIONS,
        status: 'identified',
      });
    }
  });

  return risks;
}

/**
 * Calculates accretion/dilution analysis.
 *
 * @param {number} acquirerEPS - Acquirer's EPS
 * @param {number} targetEarnings - Target's net earnings
 * @param {number} newSharesIssued - New shares issued in deal
 * @param {number} acquirerSharesOutstanding - Acquirer's shares outstanding
 * @returns {Promise<{ proFormaEPS: number; accretionDilution: number; isAccretive: boolean }>} Analysis
 *
 * @example
 * ```typescript
 * const adAnalysis = await calculateAccretionDilution(5.00, 10000000, 2000000, 50000000);
 * console.log(`Pro forma EPS: $${adAnalysis.proFormaEPS.toFixed(2)}`);
 * ```
 */
export async function calculateAccretionDilution(
  acquirerEPS: number,
  targetEarnings: number,
  newSharesIssued: number,
  acquirerSharesOutstanding: number
): Promise<{ proFormaEPS: number; accretionDilution: number; isAccretive: boolean }> {
  const acquirerEarnings = acquirerEPS * acquirerSharesOutstanding;
  const combinedEarnings = acquirerEarnings + targetEarnings;
  const combinedShares = acquirerSharesOutstanding + newSharesIssued;
  const proFormaEPS = combinedEarnings / combinedShares;

  const accretionDilution = ((proFormaEPS - acquirerEPS) / acquirerEPS) * 100;
  const isAccretive = accretionDilution > 0;

  return {
    proFormaEPS,
    accretionDilution,
    isAccretive,
  };
}

/**
 * Performs break-up valuation analysis.
 *
 * @param {string} targetCompanyId - Target company ID
 * @param {Array<{ segment: string; value: number }>} segmentValues - Business segment values
 * @returns {Promise<{ totalBreakupValue: number; premiumToWhole: number }>} Break-up analysis
 *
 * @example
 * ```typescript
 * const breakup = await performBreakupValuation('uuid-target', segmentValues);
 * console.log(`Break-up value premium: ${breakup.premiumToWhole.toFixed(2)}%`);
 * ```
 */
export async function performBreakupValuation(
  targetCompanyId: string,
  segmentValues: Array<{ segment: string; value: number }>,
  wholeCompanyValue: number
): Promise<{ totalBreakupValue: number; premiumToWhole: number; segments: typeof segmentValues }> {
  const totalBreakupValue = segmentValues.reduce((sum, seg) => sum + seg.value, 0);
  const premiumToWhole = ((totalBreakupValue - wholeCompanyValue) / wholeCompanyValue) * 100;

  return {
    totalBreakupValue,
    premiumToWhole,
    segments: segmentValues,
  };
}

/**
 * Calculates cost of capital for deal financing.
 *
 * @param {number} debtAmount - Debt financing amount
 * @param {number} equityAmount - Equity financing amount
 * @param {number} debtRate - Cost of debt (after-tax)
 * @param {number} equityRate - Cost of equity
 * @returns {Promise<{ wacc: number; debtWeight: number; equityWeight: number }>} Cost of capital
 *
 * @example
 * ```typescript
 * const costOfCapital = await calculateCostOfCapital(50000000, 100000000, 0.05, 0.12);
 * console.log(`WACC: ${costOfCapital.wacc.toFixed(4)}`);
 * ```
 */
export async function calculateCostOfCapital(
  debtAmount: number,
  equityAmount: number,
  debtRate: number,
  equityRate: number
): Promise<{ wacc: number; debtWeight: number; equityWeight: number }> {
  const totalCapital = debtAmount + equityAmount;
  const debtWeight = debtAmount / totalCapital;
  const equityWeight = equityAmount / totalCapital;

  const wacc = (debtWeight * debtRate) + (equityWeight * equityRate);

  return {
    wacc,
    debtWeight,
    equityWeight,
  };
}

/**
 * Estimates cost to achieve synergies.
 *
 * @param {SynergyItem[]} synergies - Synergy items
 * @param {number} baselineMultiplier - Multiplier for baseline costs (default 0.3)
 * @returns {Promise<{ totalCost: number; costBySynergy: Record<string, number> }>} Cost estimate
 *
 * @example
 * ```typescript
 * const synergyCost = await estimateCostToAchieve(synergyItems, 0.3);
 * console.log(`Total cost to achieve: $${synergyCost.totalCost.toLocaleString()}`);
 * ```
 */
export async function estimateCostToAchieve(
  synergies: SynergyItem[],
  baselineMultiplier: number = 0.3
): Promise<{ totalCost: number; costBySynergy: Record<string, number> }> {
  const costBySynergy: Record<string, number> = {};
  let totalCost = 0;

  synergies.forEach(syn => {
    // Cost is either explicit implementation cost or estimated as % of annual value
    const cost = syn.implementationCost > 0
      ? syn.implementationCost
      : syn.annualValue * baselineMultiplier;

    costBySynergy[syn.synergyId] = cost;
    totalCost += cost;
  });

  return {
    totalCost,
    costBySynergy,
  };
}

/**
 * Performs sensitivity analysis on deal value.
 *
 * @param {number} baseValue - Base valuation
 * @param {Record<string, number[]>} variables - Variables to test (e.g., {growthRate: [0.02, 0.03, 0.04]})
 * @returns {Promise<SensitivityScenario[]>} Sensitivity scenarios
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(100000000, {
 *   growthRate: [0.02, 0.025, 0.03],
 *   wacc: [0.08, 0.09, 0.10]
 * });
 * ```
 */
export async function performSensitivityAnalysis(
  baseValue: number,
  variables: Record<string, number[]>
): Promise<SensitivityScenario[]> {
  const scenarios: SensitivityScenario[] = [];

  // Generate scenarios for each variable combination
  const variableNames = Object.keys(variables);
  const variableValues = Object.values(variables);

  // Simple 1-dimensional sensitivity (vary one at a time)
  variableNames.forEach((varName, varIndex) => {
    variableValues[varIndex].forEach(value => {
      // Simple model: value changes proportionally
      const impact = (value - variableValues[varIndex][1]) / variableValues[varIndex][1];
      const resultingValue = baseValue * (1 + impact);

      scenarios.push({
        scenarioName: `${varName} = ${value}`,
        variables: { [varName]: value },
        resultingValue,
        probabilityPercentage: 33, // Equal probability for demonstration
      });
    });
  });

  return scenarios;
}

/**
 * Generates management presentation deck outline.
 *
 * @param {string} dealId - Deal ID
 * @param {string} presentationType - Presentation type (board, investor, employee)
 * @returns {Promise<{ sections: Array<{ title: string; content: string[] }> }>} Deck outline
 *
 * @example
 * ```typescript
 * const deckOutline = await generateManagementPresentation('DEAL-001', 'board');
 * ```
 */
export async function generateManagementPresentation(
  dealId: string,
  presentationType: 'board' | 'investor' | 'employee' | 'customer'
): Promise<{ sections: Array<{ title: string; content: string[] }> }> {
  const sections: Array<{ title: string; content: string[] }> = [];

  if (presentationType === 'board') {
    sections.push(
      { title: 'Executive Summary', content: ['Strategic rationale', 'Deal structure', 'Valuation summary'] },
      { title: 'Strategic Rationale', content: ['Market opportunity', 'Competitive positioning', 'Value creation thesis'] },
      { title: 'Valuation Analysis', content: ['DCF valuation', 'Comparable companies', 'Precedent transactions', 'Football field chart'] },
      { title: 'Synergies', content: ['Revenue synergies', 'Cost synergies', 'Realization timeline', 'Risk-adjusted NPV'] },
      { title: 'Integration Plan', content: ['Key workstreams', 'Day 1 readiness', 'Critical milestones', 'Resource requirements'] },
      { title: 'Risks & Mitigations', content: ['Key risks', 'Mitigation strategies', 'Contingency plans'] },
      { title: 'Financial Impact', content: ['Accretion/dilution analysis', 'Balance sheet impact', 'Credit metrics'] },
      { title: 'Recommendation & Next Steps', content: ['Board recommendation', 'Required approvals', 'Timeline to close'] },
    );
  } else if (presentationType === 'investor') {
    sections.push(
      { title: 'Transaction Overview', content: ['Deal highlights', 'Financial terms', 'Strategic fit'] },
      { title: 'Investment Thesis', content: ['Value creation opportunities', 'Market dynamics', 'Competitive advantages'] },
      { title: 'Financial Analysis', content: ['Valuation metrics', 'Synergy potential', 'Pro forma financials'] },
      { title: 'Integration & Execution', content: ['Integration approach', 'Key milestones', 'Management team'] },
      { title: 'Q&A', content: [] },
    );
  } else if (presentationType === 'employee') {
    sections.push(
      { title: 'Why This Deal', content: ['Strategic vision', 'Benefits to employees', 'Cultural fit'] },
      { title: 'What It Means For You', content: ['Organizational changes', 'Opportunities', 'Timeline'] },
      { title: 'Integration Process', content: ['Key activities', 'Communication plan', 'Support resources'] },
      { title: 'Q&A', content: [] },
    );
  } else if (presentationType === 'customer') {
    sections.push(
      { title: 'Transaction Announcement', content: ['Combined company vision', 'Benefits to customers', 'Continuity commitment'] },
      { title: 'Enhanced Capabilities', content: ['Expanded offerings', 'Improved service', 'Innovation roadmap'] },
      { title: 'Your Experience', content: ['What stays the same', 'What improves', 'Transition timeline'] },
      { title: 'Q&A', content: [] },
    );
  }

  return { sections };
}

/**
 * Calculates earnout valuation.
 *
 * @param {number} basePayment - Base payment at closing
 * @param {Array<{ metric: string; target: number; payment: number; probability: number }>} earnoutTerms - Earnout terms
 * @param {number} discountRate - Discount rate
 * @returns {Promise<{ totalExpectedValue: number; earnoutPV: number }>} Earnout valuation
 *
 * @example
 * ```typescript
 * const earnout = await calculateEarnoutValuation(100000000, earnoutTerms, 0.09);
 * console.log(`Total expected value: $${earnout.totalExpectedValue.toLocaleString()}`);
 * ```
 */
export async function calculateEarnoutValuation(
  basePayment: number,
  earnoutTerms: Array<{ metric: string; target: number; payment: number; probability: number; year: number }>,
  discountRate: number
): Promise<{ totalExpectedValue: number; earnoutPV: number; earnoutComponents: typeof earnoutTerms }> {
  let earnoutPV = 0;

  earnoutTerms.forEach(term => {
    const expectedPayment = term.payment * term.probability;
    const pv = expectedPayment / Math.pow(1 + discountRate, term.year);
    earnoutPV += pv;
  });

  const totalExpectedValue = basePayment + earnoutPV;

  return {
    totalExpectedValue,
    earnoutPV,
    earnoutComponents: earnoutTerms,
  };
}

/**
 * Assesses target company quality of earnings.
 *
 * @param {number} reportedEarnings - Reported net income
 * @param {Record<string, number>} adjustments - Earnings adjustments
 * @returns {Promise<{ adjustedEarnings: number; qualityScore: number; adjustmentDetails: Record<string, number> }>} QoE assessment
 *
 * @example
 * ```typescript
 * const qoe = await assessQualityOfEarnings(50000000, {
 *   oneTimeGains: -5000000,
 *   nonCashCharges: 2000000,
 *   workingCapitalChanges: -1000000
 * });
 * console.log(`Adjusted earnings: $${qoe.adjustedEarnings.toLocaleString()}`);
 * ```
 */
export async function assessQualityOfEarnings(
  reportedEarnings: number,
  adjustments: Record<string, number>
): Promise<{ adjustedEarnings: number; qualityScore: number; adjustmentDetails: Record<string, number> }> {
  let adjustedEarnings = reportedEarnings;

  Object.values(adjustments).forEach(adj => {
    adjustedEarnings += adj;
  });

  // Quality score: closer adjusted is to reported, higher the quality
  const adjustmentMagnitude = Math.abs(adjustedEarnings - reportedEarnings);
  const adjustmentPercentage = Math.abs(adjustmentMagnitude / reportedEarnings);
  const qualityScore = Math.max(0, 100 - (adjustmentPercentage * 100));

  return {
    adjustedEarnings,
    qualityScore,
    adjustmentDetails: adjustments,
  };
}

/**
 * Generates integration communication plan.
 *
 * @param {string} dealId - Deal ID
 * @param {string[]} audienceSegments - Audience segments
 * @returns {Promise<Array<{ audience: string; messages: string[]; channels: string[]; frequency: string }>>} Communication plan
 *
 * @example
 * ```typescript
 * const commPlan = await generateIntegrationCommunicationPlan('DEAL-001', ['employees', 'customers', 'investors']);
 * ```
 */
export async function generateIntegrationCommunicationPlan(
  dealId: string,
  audienceSegments: string[]
): Promise<Array<{ audience: string; messages: string[]; channels: string[]; frequency: string; timing: string }>> {
  const plan = audienceSegments.map(audience => {
    if (audience === 'employees') {
      return {
        audience,
        messages: [
          'Vision for combined company',
          'Impact on roles and responsibilities',
          'Integration timeline',
          'Support resources available',
        ],
        channels: ['Town halls', 'Email', 'Intranet', 'Manager cascade'],
        frequency: 'Weekly',
        timing: 'Starting Day 1',
      };
    } else if (audience === 'customers') {
      return {
        audience,
        messages: [
          'Continuity of service',
          'Enhanced capabilities',
          'Single point of contact',
          'Transition support',
        ],
        channels: ['Direct outreach', 'Webinars', 'Email', 'Website'],
        frequency: 'Bi-weekly',
        timing: 'Week 1 post-close',
      };
    } else if (audience === 'investors') {
      return {
        audience,
        messages: [
          'Strategic rationale',
          'Financial impact',
          'Integration progress',
          'Synergy realization',
        ],
        channels: ['Earnings calls', 'Investor presentations', 'Press releases', 'SEC filings'],
        frequency: 'Quarterly',
        timing: 'At announcement and quarterly thereafter',
      };
    } else if (audience === 'suppliers') {
      return {
        audience,
        messages: [
          'Continuity of relationship',
          'Procurement process changes',
          'Payment terms',
          'Future opportunities',
        ],
        channels: ['Direct communication', 'Supplier portal', 'Email'],
        frequency: 'Monthly',
        timing: 'Week 2 post-close',
      };
    } else {
      return {
        audience,
        messages: [],
        channels: [],
        frequency: '',
        timing: '',
      };
    }
  });

  return plan;
}

/**
 * Calculates working capital adjustment for deal.
 *
 * @param {number} targetWorkingCapital - Target's normalized working capital
 * @param {number} actualWorkingCapital - Actual working capital at closing
 * @param {number} dealValue - Deal value
 * @returns {Promise<{ adjustment: number; adjustedDealValue: number }>} Working capital adjustment
 *
 * @example
 * ```typescript
 * const wcAdjustment = await calculateWorkingCapitalAdjustment(15000000, 12000000, 150000000);
 * console.log(`WC adjustment: $${wcAdjustment.adjustment.toLocaleString()}`);
 * ```
 */
export async function calculateWorkingCapitalAdjustment(
  targetWorkingCapital: number,
  actualWorkingCapital: number,
  dealValue: number
): Promise<{ adjustment: number; adjustedDealValue: number; adjustmentPercentage: number }> {
  const adjustment = actualWorkingCapital - targetWorkingCapital;
  const adjustedDealValue = dealValue + adjustment;
  const adjustmentPercentage = (adjustment / dealValue) * 100;

  return {
    adjustment,
    adjustedDealValue,
    adjustmentPercentage,
  };
}

/**
 * Performs anti-trust analysis for deal.
 *
 * @param {string} dealId - Deal ID
 * @param {number} combinedMarketShare - Combined market share percentage
 * @param {string[]} overlappingProducts - Overlapping product lines
 * @param {string[]} jurisdictions - Relevant jurisdictions
 * @returns {Promise<{ riskLevel: RiskSeverity; requiredFilings: string[]; estimatedTimeframe: number; recommendations: string[] }>} Anti-trust analysis
 *
 * @example
 * ```typescript
 * const antitrustAnalysis = await performAntiTrustAnalysis('DEAL-001', 35, overlappingProducts, ['US', 'EU']);
 * console.log(`Antitrust risk: ${antitrustAnalysis.riskLevel}`);
 * ```
 */
export async function performAntiTrustAnalysis(
  dealId: string,
  combinedMarketShare: number,
  overlappingProducts: string[],
  jurisdictions: string[]
): Promise<{ riskLevel: RiskSeverity; requiredFilings: string[]; estimatedTimeframe: number; recommendations: string[] }> {
  let riskLevel: RiskSeverity;

  if (combinedMarketShare >= 40) {
    riskLevel = RiskSeverity.HIGH;
  } else if (combinedMarketShare >= 25) {
    riskLevel = RiskSeverity.MEDIUM;
  } else {
    riskLevel = RiskSeverity.LOW;
  }

  const requiredFilings: string[] = [];
  let estimatedTimeframe = 30; // Base 30 days

  jurisdictions.forEach(jurisdiction => {
    if (jurisdiction === 'US') {
      requiredFilings.push('HSR Filing (Hart-Scott-Rodino)');
      estimatedTimeframe = Math.max(estimatedTimeframe, 90);
    } else if (jurisdiction === 'EU') {
      requiredFilings.push('EU Merger Regulation Filing');
      estimatedTimeframe = Math.max(estimatedTimeframe, 90);
    } else if (jurisdiction === 'UK') {
      requiredFilings.push('CMA Review');
      estimatedTimeframe = Math.max(estimatedTimeframe, 60);
    }
  });

  const recommendations: string[] = [
    'Engage antitrust counsel early',
    'Prepare detailed market share analysis',
    'Identify potential divestitures if needed',
    'Develop regulatory strategy and timeline',
  ];

  if (overlappingProducts.length > 5) {
    recommendations.push('Consider product line divestitures to reduce overlap');
  }

  return {
    riskLevel,
    requiredFilings,
    estimatedTimeframe,
    recommendations,
  };
}

/**
 * Calculates internal rate of return for deal.
 *
 * @param {number} initialInvestment - Initial investment (negative)
 * @param {number[]} cashFlows - Annual cash flows
 * @returns {Promise<{ irr: number; npv: number }>} IRR calculation
 *
 * @example
 * ```typescript
 * const irr = await calculateDealIRR(-150000000, [20000000, 25000000, 30000000, 35000000, 40000000]);
 * console.log(`IRR: ${(irr.irr * 100).toFixed(2)}%`);
 * ```
 */
export async function calculateDealIRR(
  initialInvestment: number,
  cashFlows: number[]
): Promise<{ irr: number; npv: number }> {
  // Simple IRR approximation using Newton-Raphson method
  let rate = 0.1; // Initial guess
  const tolerance = 0.0001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    let npv = initialInvestment;
    let dnpv = 0;

    cashFlows.forEach((cf, year) => {
      const t = year + 1;
      npv += cf / Math.pow(1 + rate, t);
      dnpv -= (t * cf) / Math.pow(1 + rate, t + 1);
    });

    if (Math.abs(npv) < tolerance) {
      break;
    }

    rate = rate - npv / dnpv;
  }

  // Calculate NPV at the found IRR
  let npv = initialInvestment;
  cashFlows.forEach((cf, year) => {
    npv += cf / Math.pow(1 + rate, year + 1);
  });

  return {
    irr: rate,
    npv,
  };
}

/**
 * Generates integration success metrics dashboard.
 *
 * @param {string} dealId - Deal ID
 * @returns {Promise<{ metrics: Array<{ category: string; metric: string; target: number; actual: number; status: string }> }>} Success metrics
 *
 * @example
 * ```typescript
 * const successMetrics = await generateIntegrationSuccessMetrics('DEAL-001');
 * ```
 */
export async function generateIntegrationSuccessMetrics(
  dealId: string
): Promise<{ metrics: Array<{ category: string; metric: string; target: number; actual: number; status: string; unit: string }> }> {
  const metrics = [
    { category: 'Synergies', metric: 'Synergy Capture Rate', target: 80, actual: 65, status: 'on_track', unit: '%' },
    { category: 'People', metric: 'Employee Retention', target: 90, actual: 88, status: 'on_track', unit: '%' },
    { category: 'People', metric: 'Key Talent Retention', target: 95, actual: 92, status: 'at_risk', unit: '%' },
    { category: 'Customers', metric: 'Customer Retention', target: 95, actual: 96, status: 'ahead', unit: '%' },
    { category: 'Customers', metric: 'Cross-sell Success', target: 20, actual: 15, status: 'on_track', unit: '%' },
    { category: 'Operations', metric: 'System Integration', target: 100, actual: 75, status: 'on_track', unit: '%' },
    { category: 'Operations', metric: 'Process Standardization', target: 80, actual: 70, status: 'on_track', unit: '%' },
    { category: 'Financial', metric: 'Revenue Growth', target: 15, actual: 12, status: 'at_risk', unit: '%' },
    { category: 'Financial', metric: 'Cost Reduction', target: 10000000, actual: 8500000, status: 'on_track', unit: '$' },
    { category: 'Culture', metric: 'Employee Engagement', target: 75, actual: 70, status: 'at_risk', unit: 'score' },
  ];

  return { metrics };
}

/**
 * Estimates deal transaction costs.
 *
 * @param {number} dealValue - Deal value
 * @param {DealType} dealType - Deal type
 * @param {boolean} isPublicTarget - Whether target is public company
 * @returns {Promise<{ totalCosts: number; breakdown: Record<string, number> }>} Transaction costs
 *
 * @example
 * ```typescript
 * const txCosts = await estimateTransactionCosts(150000000, DealType.ACQUISITION, true);
 * console.log(`Total transaction costs: $${txCosts.totalCosts.toLocaleString()}`);
 * ```
 */
export async function estimateTransactionCosts(
  dealValue: number,
  dealType: DealType,
  isPublicTarget: boolean
): Promise<{ totalCosts: number; breakdown: Record<string, number> }> {
  const breakdown: Record<string, number> = {};

  // Investment banking fees (1-3% of deal value)
  breakdown.investmentBanking = dealValue * 0.02;

  // Legal fees
  breakdown.legal = isPublicTarget ? dealValue * 0.008 : dealValue * 0.005;

  // Accounting and financial due diligence
  breakdown.accounting = dealValue * 0.003;

  // Consulting fees (integration planning)
  breakdown.consulting = dealValue * 0.002;

  // Regulatory filing fees
  breakdown.regulatory = isPublicTarget ? 500000 : 100000;

  // Financing fees (if debt financing is used)
  breakdown.financing = dealValue * 0.015;

  const totalCosts = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);

  return {
    totalCosts,
    breakdown,
  };
}

/**
 * Performs goodwill impairment test.
 *
 * @param {number} goodwillAmount - Goodwill on balance sheet
 * @param {number} fairValueOfReportingUnit - Fair value of reporting unit
 * @param {number} carryingValueOfReportingUnit - Carrying value of reporting unit
 * @returns {Promise<{ impairmentCharge: number; revisedGoodwill: number; isPassed: boolean }>} Impairment test
 *
 * @example
 * ```typescript
 * const impairmentTest = await performGoodwillImpairmentTest(50000000, 180000000, 200000000);
 * console.log(`Impairment charge: $${impairmentTest.impairmentCharge.toLocaleString()}`);
 * ```
 */
export async function performGoodwillImpairmentTest(
  goodwillAmount: number,
  fairValueOfReportingUnit: number,
  carryingValueOfReportingUnit: number
): Promise<{ impairmentCharge: number; revisedGoodwill: number; isPassed: boolean }> {
  let impairmentCharge = 0;
  let isPassed = true;

  // Step 1: Compare fair value to carrying value
  if (fairValueOfReportingUnit < carryingValueOfReportingUnit) {
    // Impairment exists
    const deficiency = carryingValueOfReportingUnit - fairValueOfReportingUnit;
    impairmentCharge = Math.min(goodwillAmount, deficiency);
    isPassed = false;
  }

  const revisedGoodwill = goodwillAmount - impairmentCharge;

  return {
    impairmentCharge,
    revisedGoodwill,
    isPassed,
  };
}

/**
 * Generates purchase price allocation.
 *
 * @param {number} purchasePrice - Total purchase price
 * @param {Record<string, number>} fairValues - Fair values of acquired assets
 * @param {number} assumedLiabilities - Assumed liabilities
 * @returns {Promise<{ goodwill: number; allocation: Record<string, number> }>} Purchase price allocation
 *
 * @example
 * ```typescript
 * const ppa = await generatePurchasePriceAllocation(150000000, fairValues, 30000000);
 * console.log(`Goodwill: $${ppa.goodwill.toLocaleString()}`);
 * ```
 */
export async function generatePurchasePriceAllocation(
  purchasePrice: number,
  fairValues: Record<string, number>,
  assumedLiabilities: number
): Promise<{ goodwill: number; allocation: Record<string, number>; totalIdentifiableAssets: number }> {
  const allocation = { ...fairValues };
  const totalIdentifiableAssets = Object.values(fairValues).reduce((sum, val) => sum + val, 0);

  // Goodwill = Purchase Price - (Fair Value of Assets - Assumed Liabilities)
  const goodwill = purchasePrice - (totalIdentifiableAssets - assumedLiabilities);

  allocation.goodwill = goodwill;
  allocation.assumedLiabilities = assumedLiabilities;

  return {
    goodwill,
    allocation,
    totalIdentifiableAssets,
  };
}

/**
 * Calculates customer lifetime value impact from acquisition.
 *
 * @param {number} acquiredCustomers - Number of acquired customers
 * @param {number} averageCustomerValue - Average customer lifetime value
 * @param {number} retentionRate - Expected retention rate
 * @param {number} crossSellUplift - Cross-sell revenue uplift percentage
 * @returns {Promise<{ baseValue: number; enhancedValue: number; valueCreated: number }>} CLV impact
 *
 * @example
 * ```typescript
 * const clvImpact = await calculateCustomerLifetimeValueImpact(10000, 5000, 0.90, 0.20);
 * console.log(`Value created from customer base: $${clvImpact.valueCreated.toLocaleString()}`);
 * ```
 */
export async function calculateCustomerLifetimeValueImpact(
  acquiredCustomers: number,
  averageCustomerValue: number,
  retentionRate: number,
  crossSellUplift: number
): Promise<{ baseValue: number; enhancedValue: number; valueCreated: number }> {
  const baseValue = acquiredCustomers * averageCustomerValue * retentionRate;
  const enhancedValue = baseValue * (1 + crossSellUplift);
  const valueCreated = enhancedValue - baseValue;

  return {
    baseValue,
    enhancedValue,
    valueCreated,
  };
}
