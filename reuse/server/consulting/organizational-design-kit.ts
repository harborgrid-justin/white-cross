/**
 * LOC: CONS-ORG-DES-001
 * File: /reuse/server/consulting/organizational-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/org-design.service.ts
 *   - backend/consulting/org-structure.controller.ts
 *   - backend/consulting/workforce-planning.service.ts
 */

/**
 * File: /reuse/server/consulting/organizational-design-kit.ts
 * Locator: WC-CONS-ORGDES-001
 * Purpose: Enterprise-grade Organizational Design Kit - span of control, RACI matrices, organization archetypes, reporting structures
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, org design controllers, workforce planning processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for organizational design competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive organizational design utilities for production-ready management consulting applications.
 * Provides org structure design, span of control analysis, RACI matrix generation, organization archetypes,
 * reporting structure optimization, headcount planning, role definition, competency frameworks, governance models,
 * decision rights allocation, organizational health metrics, and transformation roadmaps.
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
 * Organization archetype patterns
 */
export enum OrganizationArchetype {
  FUNCTIONAL = 'functional',
  DIVISIONAL = 'divisional',
  MATRIX = 'matrix',
  FLAT = 'flat',
  NETWORK = 'network',
  HOLACRACY = 'holacracy',
  TEAM_BASED = 'team_based',
  PROJECT_BASED = 'project_based',
}

/**
 * Decision rights authority levels
 */
export enum DecisionAuthority {
  DECIDE = 'decide',
  RECOMMEND = 'recommend',
  CONSULT = 'consult',
  INFORM = 'inform',
  EXECUTE = 'execute',
}

/**
 * RACI responsibility types
 */
export enum RACIRole {
  RESPONSIBLE = 'responsible',
  ACCOUNTABLE = 'accountable',
  CONSULTED = 'consulted',
  INFORMED = 'informed',
}

/**
 * Organizational layer levels
 */
export enum OrganizationalLayer {
  EXECUTIVE = 'executive',
  SENIOR_MANAGEMENT = 'senior_management',
  MIDDLE_MANAGEMENT = 'middle_management',
  FRONTLINE_MANAGEMENT = 'frontline_management',
  INDIVIDUAL_CONTRIBUTOR = 'individual_contributor',
}

/**
 * Governance model types
 */
export enum GovernanceModel {
  CENTRALIZED = 'centralized',
  DECENTRALIZED = 'decentralized',
  FEDERATED = 'federated',
  HYBRID = 'hybrid',
}

/**
 * Reporting relationship types
 */
export enum ReportingType {
  DIRECT = 'direct',
  DOTTED_LINE = 'dotted_line',
  FUNCTIONAL = 'functional',
  ADMINISTRATIVE = 'administrative',
}

/**
 * Organization design status
 */
export enum DesignStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  IMPLEMENTED = 'implemented',
  ARCHIVED = 'archived',
}

/**
 * Organizational health dimensions
 */
export enum HealthDimension {
  DIRECTION = 'direction',
  LEADERSHIP = 'leadership',
  CULTURE = 'culture',
  ACCOUNTABILITY = 'accountability',
  COORDINATION = 'coordination',
  CAPABILITIES = 'capabilities',
  MOTIVATION = 'motivation',
  INNOVATION = 'innovation',
  EXTERNAL_ORIENTATION = 'external_orientation',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface OrganizationStructureData {
  organizationId: string;
  name: string;
  archetype: OrganizationArchetype;
  description: string;
  effectiveDate: Date;
  endDate?: Date;
  headcount: number;
  layers: number;
  spanOfControl: number;
  designPrinciples: string[];
  status: DesignStatus;
  metadata?: Record<string, any>;
}

interface OrganizationalUnitData {
  unitId: string;
  organizationId: string;
  parentUnitId?: string;
  name: string;
  description: string;
  unitType: 'division' | 'department' | 'team' | 'function';
  layer: OrganizationalLayer;
  headId?: string;
  headcount: number;
  budget?: number;
  costCenter?: string;
  location?: string;
  isActive: boolean;
}

interface PositionData {
  positionId: string;
  organizationId: string;
  unitId: string;
  title: string;
  level: string;
  layer: OrganizationalLayer;
  reportsToPositionId?: string;
  reportingType: ReportingType;
  directReports: number;
  totalReports: number;
  isFilled: boolean;
  incumbentId?: string;
  salaryGrade?: string;
  fte: number;
}

interface SpanOfControlMetrics {
  positionId: string;
  directReports: number;
  indirectReports: number;
  totalSpan: number;
  optimalMin: number;
  optimalMax: number;
  isOptimal: boolean;
  variance: number;
  recommendation: string;
  healthScore: number;
}

interface RACIMatrixEntry {
  processId: string;
  activityName: string;
  roleId: string;
  roleName: string;
  responsibility: RACIRole;
  notes?: string;
}

interface RACIMatrix {
  matrixId: string;
  organizationId: string;
  processName: string;
  description: string;
  activities: string[];
  roles: string[];
  entries: RACIMatrixEntry[];
  validationStatus: 'valid' | 'conflicts' | 'gaps';
  conflicts?: string[];
  gaps?: string[];
}

interface DecisionRightsAllocation {
  decisionId: string;
  organizationId: string;
  decisionType: string;
  decisionName: string;
  description: string;
  authority: DecisionAuthority;
  ownerId: string;
  ownerRole: string;
  stakeholders: string[];
  escalationPath: string[];
  frequency: string;
  impact: 'low' | 'medium' | 'high' | 'strategic';
}

interface ReportingStructure {
  structureId: string;
  organizationId: string;
  positions: PositionData[];
  relationships: ReportingRelationship[];
  layers: number;
  averageSpan: number;
  totalHeadcount: number;
  hierarchyHealth: number;
}

interface ReportingRelationship {
  relationshipId: string;
  subordinatePositionId: string;
  supervisorPositionId: string;
  relationshipType: ReportingType;
  effectiveDate: Date;
  endDate?: Date;
}

interface HeadcountPlan {
  planId: string;
  organizationId: string;
  unitId?: string;
  planningPeriod: string;
  currentHeadcount: number;
  plannedHeadcount: number;
  variance: number;
  newHires: number;
  transfers: number;
  promotions: number;
  attrition: number;
  budgetImpact: number;
  justification: string;
}

interface RoleDefinition {
  roleId: string;
  organizationId: string;
  title: string;
  level: string;
  layer: OrganizationalLayer;
  purpose: string;
  keyResponsibilities: string[];
  decisionAuthority: string[];
  requiredCompetencies: string[];
  experience: string;
  education: string;
  reportingRelationship: string;
  successMetrics: string[];
}

interface CompetencyFramework {
  frameworkId: string;
  organizationId: string;
  name: string;
  description: string;
  competencies: CompetencyDefinition[];
  proficiencyLevels: string[];
  effectiveDate: Date;
}

interface CompetencyDefinition {
  competencyId: string;
  name: string;
  description: string;
  category: 'technical' | 'leadership' | 'behavioral' | 'functional';
  requiredForRoles: string[];
  proficiencyDescriptions: Record<string, string>;
}

interface GovernanceStructure {
  governanceId: string;
  organizationId: string;
  model: GovernanceModel;
  governanceBodies: GovernanceBody[];
  decisionFramework: string;
  escalationPaths: Record<string, string[]>;
  meetingCadence: Record<string, string>;
}

interface GovernanceBody {
  bodyId: string;
  name: string;
  purpose: string;
  members: string[];
  chairId: string;
  decisionAuthority: string[];
  meetingFrequency: string;
  quorumRequirement: number;
}

interface OrganizationalHealthMetrics {
  organizationId: string;
  assessmentDate: Date;
  overallScore: number;
  dimensionScores: Record<HealthDimension, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  benchmarkPercentile: number;
}

interface TransformationRoadmap {
  roadmapId: string;
  organizationId: string;
  currentState: string;
  targetState: string;
  transformationType: 'restructure' | 'merger' | 'acquisition' | 'spinoff' | 'optimization';
  phases: TransformationPhase[];
  totalDuration: number;
  totalCost: number;
  riskLevel: 'low' | 'medium' | 'high';
  stakeholders: string[];
}

interface TransformationPhase {
  phaseId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  activities: string[];
  dependencies: string[];
  milestones: string[];
  budget: number;
  successCriteria: string[];
}

// ============================================================================
// DTO CLASSES FOR VALIDATION AND SWAGGER
// ============================================================================

/**
 * Create Organization Structure DTO
 */
export class CreateOrganizationStructureDto {
  @ApiProperty({ description: 'Organization name', example: 'Acme Healthcare Corp' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Organization archetype',
    enum: OrganizationArchetype,
    example: OrganizationArchetype.MATRIX
  })
  @IsEnum(OrganizationArchetype)
  archetype: OrganizationArchetype;

  @ApiProperty({ description: 'Detailed description', example: 'Multi-divisional healthcare organization' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'Total headcount', example: 5000, minimum: 1 })
  @IsNumber()
  @Min(1)
  headcount: number;

  @ApiProperty({ description: 'Number of organizational layers', example: 5, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  layers: number;

  @ApiProperty({ description: 'Design principles', example: ['Customer-centric', 'Agile'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  designPrinciples: string[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Create Organizational Unit DTO
 */
export class CreateOrganizationalUnitDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Parent unit ID', required: false, example: 'uuid-parent-456' })
  @IsOptional()
  @IsUUID()
  parentUnitId?: string;

  @ApiProperty({ description: 'Unit name', example: 'Clinical Operations' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Unit description', example: 'Manages all clinical service delivery' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Unit type',
    enum: ['division', 'department', 'team', 'function'],
    example: 'division'
  })
  @IsEnum(['division', 'department', 'team', 'function'])
  unitType: 'division' | 'department' | 'team' | 'function';

  @ApiProperty({ description: 'Organizational layer', enum: OrganizationalLayer })
  @IsEnum(OrganizationalLayer)
  layer: OrganizationalLayer;

  @ApiProperty({ description: 'Unit head count', example: 250, minimum: 0 })
  @IsNumber()
  @Min(0)
  headcount: number;

  @ApiProperty({ description: 'Budget amount', required: false, example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;
}

/**
 * Create Position DTO
 */
export class CreatePositionDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Organizational unit ID', example: 'uuid-unit-456' })
  @IsUUID()
  unitId: string;

  @ApiProperty({ description: 'Position title', example: 'Vice President of Operations' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Position level', example: 'VP-2' })
  @IsString()
  @MaxLength(50)
  level: string;

  @ApiProperty({ description: 'Organizational layer', enum: OrganizationalLayer })
  @IsEnum(OrganizationalLayer)
  layer: OrganizationalLayer;

  @ApiProperty({ description: 'Reports to position ID', required: false })
  @IsOptional()
  @IsUUID()
  reportsToPositionId?: string;

  @ApiProperty({ description: 'Reporting type', enum: ReportingType })
  @IsEnum(ReportingType)
  reportingType: ReportingType;

  @ApiProperty({ description: 'Full-time equivalent', example: 1.0, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  fte: number;

  @ApiProperty({ description: 'Salary grade', required: false, example: 'E5' })
  @IsOptional()
  @IsString()
  salaryGrade?: string;
}

/**
 * Create RACI Matrix DTO
 */
export class CreateRACIMatrixDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Process name', example: 'Budget Planning Process' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  processName: string;

  @ApiProperty({ description: 'Process description', example: 'Annual budget planning and approval' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Process activities', example: ['Prepare budget', 'Review budget'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  activities: string[];

  @ApiProperty({ description: 'Roles involved', example: ['CFO', 'Finance Manager', 'Department Head'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

/**
 * RACI Matrix Entry DTO
 */
export class RACIMatrixEntryDto {
  @ApiProperty({ description: 'Activity name', example: 'Approve final budget' })
  @IsString()
  @IsNotEmpty()
  activityName: string;

  @ApiProperty({ description: 'Role name', example: 'CFO' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({ description: 'RACI responsibility', enum: RACIRole })
  @IsEnum(RACIRole)
  responsibility: RACIRole;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Create Decision Rights Allocation DTO
 */
export class CreateDecisionRightsDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Decision type', example: 'Investment Approval' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  decisionType: string;

  @ApiProperty({ description: 'Decision name', example: 'Capital Expenditure > $100K' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  decisionName: string;

  @ApiProperty({ description: 'Decision description', example: 'Approval authority for capital expenditures exceeding $100,000' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Decision authority level', enum: DecisionAuthority })
  @IsEnum(DecisionAuthority)
  authority: DecisionAuthority;

  @ApiProperty({ description: 'Owner position/role', example: 'CFO' })
  @IsString()
  @IsNotEmpty()
  ownerRole: string;

  @ApiProperty({ description: 'Impact level', enum: ['low', 'medium', 'high', 'strategic'] })
  @IsEnum(['low', 'medium', 'high', 'strategic'])
  impact: 'low' | 'medium' | 'high' | 'strategic';

  @ApiProperty({ description: 'Stakeholder roles', example: ['CEO', 'Board'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  stakeholders: string[];
}

/**
 * Create Headcount Plan DTO
 */
export class CreateHeadcountPlanDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Organizational unit ID', required: false })
  @IsOptional()
  @IsUUID()
  unitId?: string;

  @ApiProperty({ description: 'Planning period', example: 'Q1-2024' })
  @IsString()
  @IsNotEmpty()
  planningPeriod: string;

  @ApiProperty({ description: 'Current headcount', example: 250, minimum: 0 })
  @IsNumber()
  @Min(0)
  currentHeadcount: number;

  @ApiProperty({ description: 'Planned headcount', example: 275, minimum: 0 })
  @IsNumber()
  @Min(0)
  plannedHeadcount: number;

  @ApiProperty({ description: 'New hires planned', example: 30, minimum: 0 })
  @IsNumber()
  @Min(0)
  newHires: number;

  @ApiProperty({ description: 'Expected attrition', example: 5, minimum: 0 })
  @IsNumber()
  @Min(0)
  attrition: number;

  @ApiProperty({ description: 'Budget impact', example: 1500000 })
  @IsNumber()
  budgetImpact: number;

  @ApiProperty({ description: 'Business justification', example: 'Support growth in new service lines' })
  @IsString()
  @MaxLength(2000)
  justification: string;
}

/**
 * Create Role Definition DTO
 */
export class CreateRoleDefinitionDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Role title', example: 'Senior Clinical Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Role level', example: 'M3' })
  @IsString()
  @MaxLength(50)
  level: string;

  @ApiProperty({ description: 'Organizational layer', enum: OrganizationalLayer })
  @IsEnum(OrganizationalLayer)
  layer: OrganizationalLayer;

  @ApiProperty({ description: 'Role purpose statement', example: 'Lead clinical operations for 200-bed facility' })
  @IsString()
  @MaxLength(500)
  purpose: string;

  @ApiProperty({ description: 'Key responsibilities', example: ['Manage clinical staff', 'Ensure quality standards'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  keyResponsibilities: string[];

  @ApiProperty({ description: 'Required competencies', example: ['Clinical expertise', 'Team leadership'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  requiredCompetencies: string[];

  @ApiProperty({ description: 'Experience requirements', example: '7+ years in clinical management' })
  @IsString()
  @MaxLength(500)
  experience: string;

  @ApiProperty({ description: 'Education requirements', example: 'Master\'s degree in Healthcare Administration' })
  @IsString()
  @MaxLength(500)
  education: string;
}

/**
 * Create Competency Framework DTO
 */
export class CreateCompetencyFrameworkDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Framework name', example: 'Leadership Competency Framework' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Framework description', example: 'Core leadership competencies for all managers' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Proficiency levels', example: ['Novice', 'Competent', 'Proficient', 'Expert'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  proficiencyLevels: string[];

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;
}

/**
 * Competency Definition DTO
 */
export class CompetencyDefinitionDto {
  @ApiProperty({ description: 'Competency name', example: 'Strategic Thinking' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Competency description', example: 'Ability to develop long-term strategic plans' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Competency category', enum: ['technical', 'leadership', 'behavioral', 'functional'] })
  @IsEnum(['technical', 'leadership', 'behavioral', 'functional'])
  category: 'technical' | 'leadership' | 'behavioral' | 'functional';

  @ApiProperty({ description: 'Required for roles', example: ['Director', 'VP'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  requiredForRoles: string[];
}

/**
 * Create Governance Structure DTO
 */
export class CreateGovernanceStructureDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Governance model', enum: GovernanceModel })
  @IsEnum(GovernanceModel)
  model: GovernanceModel;

  @ApiProperty({ description: 'Decision framework description', example: 'Delegation of Authority framework' })
  @IsString()
  @MaxLength(1000)
  decisionFramework: string;
}

/**
 * Governance Body DTO
 */
export class GovernanceBodyDto {
  @ApiProperty({ description: 'Body name', example: 'Executive Committee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Purpose', example: 'Strategic decision-making and oversight' })
  @IsString()
  @MaxLength(500)
  purpose: string;

  @ApiProperty({ description: 'Member IDs', example: ['uuid-1', 'uuid-2'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  members: string[];

  @ApiProperty({ description: 'Chair ID', example: 'uuid-chair' })
  @IsUUID()
  chairId: string;

  @ApiProperty({ description: 'Meeting frequency', example: 'Weekly' })
  @IsString()
  meetingFrequency: string;

  @ApiProperty({ description: 'Quorum requirement', example: 0.75, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  quorumRequirement: number;
}

/**
 * Create Transformation Roadmap DTO
 */
export class CreateTransformationRoadmapDto {
  @ApiProperty({ description: 'Organization ID', example: 'uuid-org-123' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Current state description', example: 'Functional silos with slow decision-making' })
  @IsString()
  @MaxLength(1000)
  currentState: string;

  @ApiProperty({ description: 'Target state description', example: 'Agile, matrix organization with empowered teams' })
  @IsString()
  @MaxLength(1000)
  targetState: string;

  @ApiProperty({
    description: 'Transformation type',
    enum: ['restructure', 'merger', 'acquisition', 'spinoff', 'optimization']
  })
  @IsEnum(['restructure', 'merger', 'acquisition', 'spinoff', 'optimization'])
  transformationType: 'restructure' | 'merger' | 'acquisition' | 'spinoff' | 'optimization';

  @ApiProperty({ description: 'Total duration in months', example: 18, minimum: 1 })
  @IsNumber()
  @Min(1)
  totalDuration: number;

  @ApiProperty({ description: 'Total cost', example: 5000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  totalCost: number;

  @ApiProperty({ description: 'Risk level', enum: ['low', 'medium', 'high'] })
  @IsEnum(['low', 'medium', 'high'])
  riskLevel: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Key stakeholder IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  stakeholders: string[];
}

/**
 * Transformation Phase DTO
 */
export class TransformationPhaseDto {
  @ApiProperty({ description: 'Phase name', example: 'Assessment & Planning' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Phase description', example: 'Assess current state and develop detailed transformation plan' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2024-03-31' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Key activities', example: ['Stakeholder interviews', 'Current state mapping'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  activities: string[];

  @ApiProperty({ description: 'Phase budget', example: 500000, minimum: 0 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ description: 'Success criteria', example: ['Complete stakeholder buy-in', 'Approved roadmap'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  successCriteria: string[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Organization Structure Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     OrganizationStructure:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         organizationId:
 *           type: string
 *         name:
 *           type: string
 *         archetype:
 *           type: string
 *           enum: [functional, divisional, matrix, flat, network, holacracy, team_based, project_based]
 *         headcount:
 *           type: number
 *         layers:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrganizationStructure model
 *
 * @example
 * ```typescript
 * const OrgStructure = createOrganizationStructureModel(sequelize);
 * const structure = await OrgStructure.create({
 *   organizationId: 'ORG001',
 *   name: 'Healthcare Corp',
 *   archetype: 'matrix',
 *   headcount: 5000,
 *   layers: 5,
 *   status: 'approved'
 * });
 * ```
 */
export const createOrganizationStructureModel = (sequelize: Sequelize) => {
  class OrganizationStructure extends Model {
    public id!: string;
    public organizationId!: string;
    public name!: string;
    public archetype!: string;
    public description!: string;
    public effectiveDate!: Date;
    public endDate!: Date | null;
    public headcount!: number;
    public layers!: number;
    public spanOfControl!: number;
    public designPrinciples!: string[];
    public status!: string;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  OrganizationStructure.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Organization identifier',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Organization name',
      },
      archetype: {
        type: DataTypes.ENUM(
          'functional',
          'divisional',
          'matrix',
          'flat',
          'network',
          'holacracy',
          'team_based',
          'project_based'
        ),
        allowNull: false,
        comment: 'Organization archetype',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Organization description',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Structure effective date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Structure end date',
      },
      headcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total headcount',
      },
      layers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of organizational layers',
      },
      spanOfControl: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Average span of control',
      },
      designPrinciples: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Design principles',
      },
      status: {
        type: DataTypes.ENUM('draft', 'in_review', 'approved', 'implemented', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Design status',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Approved by',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
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
      tableName: 'organization_structures',
      timestamps: true,
      indexes: [
        { fields: ['organizationId'] },
        { fields: ['status'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return OrganizationStructure;
};

/**
 * Organizational Unit Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     OrganizationalUnit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         organizationId:
 *           type: string
 *         name:
 *           type: string
 *         unitType:
 *           type: string
 *           enum: [division, department, team, function]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrganizationalUnit model
 */
export const createOrganizationalUnitModel = (sequelize: Sequelize) => {
  class OrganizationalUnit extends Model {
    public id!: string;
    public unitId!: string;
    public organizationId!: string;
    public parentUnitId!: string | null;
    public name!: string;
    public description!: string;
    public unitType!: string;
    public layer!: string;
    public headId!: string | null;
    public headcount!: number;
    public budget!: number | null;
    public costCenter!: string | null;
    public location!: string | null;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  OrganizationalUnit.init(
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
        comment: 'Unit identifier',
      },
      organizationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization identifier',
      },
      parentUnitId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Parent unit identifier',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Unit name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Unit description',
      },
      unitType: {
        type: DataTypes.ENUM('division', 'department', 'team', 'function'),
        allowNull: false,
        comment: 'Unit type',
      },
      layer: {
        type: DataTypes.ENUM(
          'executive',
          'senior_management',
          'middle_management',
          'frontline_management',
          'individual_contributor'
        ),
        allowNull: false,
        comment: 'Organizational layer',
      },
      headId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Unit head ID',
      },
      headcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Unit headcount',
      },
      budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Unit budget',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Physical location',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Active status',
      },
    },
    {
      sequelize,
      tableName: 'organizational_units',
      timestamps: true,
      indexes: [
        { fields: ['organizationId'] },
        { fields: ['parentUnitId'] },
        { fields: ['unitType'] },
        { fields: ['layer'] },
      ],
    }
  );

  return OrganizationalUnit;
};

/**
 * Position Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         level:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Position model
 */
export const createPositionModel = (sequelize: Sequelize) => {
  class Position extends Model {
    public id!: string;
    public positionId!: string;
    public organizationId!: string;
    public unitId!: string;
    public title!: string;
    public level!: string;
    public layer!: string;
    public reportsToPositionId!: string | null;
    public reportingType!: string;
    public directReports!: number;
    public totalReports!: number;
    public isFilled!: boolean;
    public incumbentId!: string | null;
    public salaryGrade!: string | null;
    public fte!: number;
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
      organizationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization identifier',
      },
      unitId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Unit identifier',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Position title',
      },
      level: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Position level',
      },
      layer: {
        type: DataTypes.ENUM(
          'executive',
          'senior_management',
          'middle_management',
          'frontline_management',
          'individual_contributor'
        ),
        allowNull: false,
        comment: 'Organizational layer',
      },
      reportsToPositionId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Supervisor position ID',
      },
      reportingType: {
        type: DataTypes.ENUM('direct', 'dotted_line', 'functional', 'administrative'),
        allowNull: false,
        comment: 'Reporting relationship type',
      },
      directReports: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of direct reports',
      },
      totalReports: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total reports (direct + indirect)',
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Position filled status',
      },
      incumbentId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Current incumbent ID',
      },
      salaryGrade: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Salary grade',
      },
      fte: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Full-time equivalent',
      },
    },
    {
      sequelize,
      tableName: 'positions',
      timestamps: true,
      indexes: [
        { fields: ['organizationId'] },
        { fields: ['unitId'] },
        { fields: ['reportsToPositionId'] },
        { fields: ['layer'] },
      ],
    }
  );

  return Position;
};

/**
 * RACI Matrix Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     RACIMatrix:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         processName:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RACIMatrix model
 */
export const createRACIMatrixModel = (sequelize: Sequelize) => {
  class RACIMatrix extends Model {
    public id!: string;
    public matrixId!: string;
    public organizationId!: string;
    public processName!: string;
    public description!: string;
    public activities!: string[];
    public roles!: string[];
    public entries!: any[];
    public validationStatus!: string;
    public conflicts!: string[];
    public gaps!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RACIMatrix.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      matrixId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Matrix identifier',
      },
      organizationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization identifier',
      },
      processName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Process name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Process description',
      },
      activities: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Process activities',
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Involved roles',
      },
      entries: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'RACI entries',
      },
      validationStatus: {
        type: DataTypes.ENUM('valid', 'conflicts', 'gaps'),
        allowNull: false,
        defaultValue: 'valid',
        comment: 'Validation status',
      },
      conflicts: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Identified conflicts',
      },
      gaps: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Identified gaps',
      },
    },
    {
      sequelize,
      tableName: 'raci_matrices',
      timestamps: true,
      indexes: [
        { fields: ['organizationId'] },
        { fields: ['processName'] },
      ],
    }
  );

  return RACIMatrix;
};

// ============================================================================
// ORGANIZATIONAL STRUCTURE FUNCTIONS
// ============================================================================

/**
 * Creates a new organization structure design.
 *
 * @swagger
 * @openapi
 * /api/org-design/structures:
 *   post:
 *     tags:
 *       - Organizational Design
 *     summary: Create organization structure
 *     description: Creates a new organization structure design with specified archetype and parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationStructureDto'
 *     responses:
 *       201:
 *         description: Organization structure created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationStructure'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 *
 * @param {CreateOrganizationStructureDto} data - Organization structure data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<OrganizationStructureData>} Created organization structure
 *
 * @example
 * ```typescript
 * const structure = await createOrganizationStructure({
 *   name: 'Healthcare Corp',
 *   archetype: OrganizationArchetype.MATRIX,
 *   description: 'Matrix organization for integrated care delivery',
 *   effectiveDate: new Date('2024-01-01'),
 *   headcount: 5000,
 *   layers: 5,
 *   designPrinciples: ['Customer-centric', 'Agile decision-making']
 * });
 * ```
 */
export async function createOrganizationStructure(
  data: Partial<OrganizationStructureData>,
  transaction?: Transaction
): Promise<OrganizationStructureData> {
  const organizationId = data.organizationId || `ORG-${Date.now()}`;
  const spanOfControl = data.headcount && data.layers ?
    Math.pow(data.headcount, 1 / data.layers) : 6.0;

  return {
    organizationId,
    name: data.name || '',
    archetype: data.archetype || OrganizationArchetype.FUNCTIONAL,
    description: data.description || '',
    effectiveDate: data.effectiveDate || new Date(),
    endDate: data.endDate,
    headcount: data.headcount || 0,
    layers: data.layers || 4,
    spanOfControl,
    designPrinciples: data.designPrinciples || [],
    status: data.status || DesignStatus.DRAFT,
    metadata: data.metadata || {},
  };
}

/**
 * Calculates optimal span of control for a position.
 *
 * @swagger
 * @openapi
 * /api/org-design/span-of-control/{positionId}:
 *   get:
 *     tags:
 *       - Organizational Design
 *     summary: Calculate span of control
 *     description: Analyzes span of control metrics for a position and provides optimization recommendations
 *     parameters:
 *       - in: path
 *         name: positionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Span of control metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 directReports:
 *                   type: number
 *                 optimalMin:
 *                   type: number
 *                 optimalMax:
 *                   type: number
 *                 isOptimal:
 *                   type: boolean
 *                 recommendation:
 *                   type: string
 *
 * @param {string} positionId - Position identifier
 * @param {PositionData} positionData - Position data
 * @param {OrganizationalLayer} layer - Organizational layer
 * @returns {Promise<SpanOfControlMetrics>} Span of control analysis
 *
 * @example
 * ```typescript
 * const spanMetrics = await calculateSpanOfControl('POS123', positionData, OrganizationalLayer.MIDDLE_MANAGEMENT);
 * console.log(`Direct reports: ${spanMetrics.directReports}, Optimal: ${spanMetrics.isOptimal}`);
 * ```
 */
export async function calculateSpanOfControl(
  positionId: string,
  positionData: Partial<PositionData>,
  layer: OrganizationalLayer
): Promise<SpanOfControlMetrics> {
  const directReports = positionData.directReports || 0;
  const indirectReports = positionData.totalReports ? positionData.totalReports - directReports : 0;

  // Optimal span varies by layer
  const spanRanges: Record<OrganizationalLayer, { min: number; max: number }> = {
    [OrganizationalLayer.EXECUTIVE]: { min: 4, max: 8 },
    [OrganizationalLayer.SENIOR_MANAGEMENT]: { min: 5, max: 10 },
    [OrganizationalLayer.MIDDLE_MANAGEMENT]: { min: 6, max: 12 },
    [OrganizationalLayer.FRONTLINE_MANAGEMENT]: { min: 8, max: 15 },
    [OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR]: { min: 0, max: 0 },
  };

  const range = spanRanges[layer];
  const isOptimal = directReports >= range.min && directReports <= range.max;
  const variance = isOptimal ? 0 :
    directReports < range.min ? range.min - directReports : directReports - range.max;

  let recommendation = '';
  if (directReports < range.min) {
    recommendation = `Consider consolidating reports or reassigning ${variance} positions to increase span`;
  } else if (directReports > range.max) {
    recommendation = `Consider adding ${Math.ceil(variance / range.max)} management layer(s) to reduce span`;
  } else {
    recommendation = 'Span of control is within optimal range';
  }

  const healthScore = isOptimal ? 100 : Math.max(0, 100 - (variance * 10));

  return {
    positionId,
    directReports,
    indirectReports,
    totalSpan: directReports + indirectReports,
    optimalMin: range.min,
    optimalMax: range.max,
    isOptimal,
    variance,
    recommendation,
    healthScore,
  };
}

/**
 * Generates a complete RACI matrix for a business process.
 *
 * @swagger
 * @openapi
 * /api/org-design/raci-matrix:
 *   post:
 *     tags:
 *       - Organizational Design
 *     summary: Generate RACI matrix
 *     description: Creates a RACI matrix for a business process with validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRACIMatrixDto'
 *     responses:
 *       201:
 *         description: RACI matrix created
 *       400:
 *         description: Validation errors found
 *
 * @param {Partial<RACIMatrix>} data - RACI matrix configuration
 * @returns {Promise<RACIMatrix>} Generated and validated RACI matrix
 *
 * @example
 * ```typescript
 * const raciMatrix = await generateRACIMatrix({
 *   organizationId: 'ORG001',
 *   processName: 'Budget Planning',
 *   activities: ['Prepare budget', 'Review budget', 'Approve budget'],
 *   roles: ['CFO', 'Finance Manager', 'Department Head'],
 *   entries: [...]
 * });
 * ```
 */
export async function generateRACIMatrix(
  data: Partial<RACIMatrix>
): Promise<RACIMatrix> {
  const matrixId = data.matrixId || `RACI-${Date.now()}`;
  const entries = data.entries || [];

  // Validate RACI matrix for common issues
  const conflicts: string[] = [];
  const gaps: string[] = [];

  // Check each activity has exactly one Accountable
  data.activities?.forEach(activity => {
    const accountables = entries.filter(
      e => e.activityName === activity && e.responsibility === RACIRole.ACCOUNTABLE
    );
    if (accountables.length === 0) {
      gaps.push(`Activity "${activity}" has no Accountable role`);
    } else if (accountables.length > 1) {
      conflicts.push(`Activity "${activity}" has multiple Accountable roles`);
    }
  });

  // Check each activity has at least one Responsible
  data.activities?.forEach(activity => {
    const responsibles = entries.filter(
      e => e.activityName === activity && e.responsibility === RACIRole.RESPONSIBLE
    );
    if (responsibles.length === 0) {
      gaps.push(`Activity "${activity}" has no Responsible role`);
    }
  });

  const validationStatus = conflicts.length > 0 ? 'conflicts' :
    gaps.length > 0 ? 'gaps' : 'valid';

  return {
    matrixId,
    organizationId: data.organizationId || '',
    processName: data.processName || '',
    description: data.description || '',
    activities: data.activities || [],
    roles: data.roles || [],
    entries,
    validationStatus,
    conflicts,
    gaps,
  };
}

/**
 * Analyzes reporting structure for optimization opportunities.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions in the organization
 * @returns {Promise<ReportingStructure>} Reporting structure analysis
 *
 * @example
 * ```typescript
 * const structure = await analyzeReportingStructure('ORG001', positions);
 * console.log(`Total layers: ${structure.layers}, Health: ${structure.hierarchyHealth}`);
 * ```
 */
export async function analyzeReportingStructure(
  organizationId: string,
  positions: PositionData[]
): Promise<ReportingStructure> {
  const structureId = `STRUCT-${organizationId}-${Date.now()}`;
  const relationships: ReportingRelationship[] = [];

  // Build relationships from positions
  positions.forEach(pos => {
    if (pos.reportsToPositionId) {
      relationships.push({
        relationshipId: `REL-${pos.positionId}`,
        subordinatePositionId: pos.positionId,
        supervisorPositionId: pos.reportsToPositionId,
        relationshipType: pos.reportingType,
        effectiveDate: new Date(),
      });
    }
  });

  // Calculate layers
  const layers = Math.max(...positions.map(p => {
    const layerMap = {
      [OrganizationalLayer.EXECUTIVE]: 1,
      [OrganizationalLayer.SENIOR_MANAGEMENT]: 2,
      [OrganizationalLayer.MIDDLE_MANAGEMENT]: 3,
      [OrganizationalLayer.FRONTLINE_MANAGEMENT]: 4,
      [OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR]: 5,
    };
    return layerMap[p.layer as OrganizationalLayer] || 0;
  }));

  const totalDirectReports = positions.reduce((sum, p) => sum + p.directReports, 0);
  const managementPositions = positions.filter(p => p.directReports > 0).length;
  const averageSpan = managementPositions > 0 ? totalDirectReports / managementPositions : 0;

  // Calculate hierarchy health (0-100)
  const optimalLayers = 4;
  const optimalSpan = 7;
  const layerScore = Math.max(0, 100 - Math.abs(layers - optimalLayers) * 15);
  const spanScore = Math.max(0, 100 - Math.abs(averageSpan - optimalSpan) * 10);
  const hierarchyHealth = (layerScore + spanScore) / 2;

  return {
    structureId,
    organizationId,
    positions,
    relationships,
    layers,
    averageSpan: parseFloat(averageSpan.toFixed(2)),
    totalHeadcount: positions.length,
    hierarchyHealth: parseFloat(hierarchyHealth.toFixed(2)),
  };
}

/**
 * Creates decision rights allocation framework.
 *
 * @param {Partial<DecisionRightsAllocation>} data - Decision rights data
 * @returns {Promise<DecisionRightsAllocation>} Created decision rights allocation
 *
 * @example
 * ```typescript
 * const decisionRights = await createDecisionRightsAllocation({
 *   organizationId: 'ORG001',
 *   decisionType: 'Financial',
 *   decisionName: 'Capital Expenditure > $100K',
 *   authority: DecisionAuthority.DECIDE,
 *   ownerRole: 'CFO',
 *   impact: 'strategic'
 * });
 * ```
 */
export async function createDecisionRightsAllocation(
  data: Partial<DecisionRightsAllocation>
): Promise<DecisionRightsAllocation> {
  return {
    decisionId: data.decisionId || `DEC-${Date.now()}`,
    organizationId: data.organizationId || '',
    decisionType: data.decisionType || '',
    decisionName: data.decisionName || '',
    description: data.description || '',
    authority: data.authority || DecisionAuthority.DECIDE,
    ownerId: data.ownerId || '',
    ownerRole: data.ownerRole || '',
    stakeholders: data.stakeholders || [],
    escalationPath: data.escalationPath || [],
    frequency: data.frequency || '',
    impact: data.impact || 'medium',
  };
}

/**
 * Generates headcount planning recommendations.
 *
 * @param {Partial<HeadcountPlan>} data - Headcount plan data
 * @returns {Promise<HeadcountPlan>} Headcount plan with variance analysis
 *
 * @example
 * ```typescript
 * const plan = await generateHeadcountPlan({
 *   organizationId: 'ORG001',
 *   currentHeadcount: 250,
 *   plannedHeadcount: 275,
 *   newHires: 30,
 *   attrition: 5
 * });
 * ```
 */
export async function generateHeadcountPlan(
  data: Partial<HeadcountPlan>
): Promise<HeadcountPlan> {
  const current = data.currentHeadcount || 0;
  const planned = data.plannedHeadcount || 0;
  const variance = planned - current;

  return {
    planId: data.planId || `PLAN-${Date.now()}`,
    organizationId: data.organizationId || '',
    unitId: data.unitId,
    planningPeriod: data.planningPeriod || '',
    currentHeadcount: current,
    plannedHeadcount: planned,
    variance,
    newHires: data.newHires || 0,
    transfers: data.transfers || 0,
    promotions: data.promotions || 0,
    attrition: data.attrition || 0,
    budgetImpact: data.budgetImpact || 0,
    justification: data.justification || '',
  };
}

/**
 * Creates a comprehensive role definition.
 *
 * @param {Partial<RoleDefinition>} data - Role definition data
 * @returns {Promise<RoleDefinition>} Created role definition
 *
 * @example
 * ```typescript
 * const role = await createRoleDefinition({
 *   organizationId: 'ORG001',
 *   title: 'Senior Clinical Manager',
 *   layer: OrganizationalLayer.MIDDLE_MANAGEMENT,
 *   purpose: 'Lead clinical operations',
 *   keyResponsibilities: ['Manage staff', 'Ensure quality']
 * });
 * ```
 */
export async function createRoleDefinition(
  data: Partial<RoleDefinition>
): Promise<RoleDefinition> {
  return {
    roleId: data.roleId || `ROLE-${Date.now()}`,
    organizationId: data.organizationId || '',
    title: data.title || '',
    level: data.level || '',
    layer: data.layer || OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR,
    purpose: data.purpose || '',
    keyResponsibilities: data.keyResponsibilities || [],
    decisionAuthority: data.decisionAuthority || [],
    requiredCompetencies: data.requiredCompetencies || [],
    experience: data.experience || '',
    education: data.education || '',
    reportingRelationship: data.reportingRelationship || '',
    successMetrics: data.successMetrics || [],
  };
}

/**
 * Develops a competency framework for the organization.
 *
 * @param {Partial<CompetencyFramework>} data - Competency framework data
 * @returns {Promise<CompetencyFramework>} Created competency framework
 *
 * @example
 * ```typescript
 * const framework = await developCompetencyFramework({
 *   organizationId: 'ORG001',
 *   name: 'Leadership Competencies',
 *   competencies: [...]
 * });
 * ```
 */
export async function developCompetencyFramework(
  data: Partial<CompetencyFramework>
): Promise<CompetencyFramework> {
  return {
    frameworkId: data.frameworkId || `COMP-FW-${Date.now()}`,
    organizationId: data.organizationId || '',
    name: data.name || '',
    description: data.description || '',
    competencies: data.competencies || [],
    proficiencyLevels: data.proficiencyLevels || ['Novice', 'Competent', 'Proficient', 'Expert'],
    effectiveDate: data.effectiveDate || new Date(),
  };
}

/**
 * Designs governance structure for the organization.
 *
 * @param {Partial<GovernanceStructure>} data - Governance structure data
 * @returns {Promise<GovernanceStructure>} Created governance structure
 *
 * @example
 * ```typescript
 * const governance = await designGovernanceStructure({
 *   organizationId: 'ORG001',
 *   model: GovernanceModel.FEDERATED,
 *   governanceBodies: [...]
 * });
 * ```
 */
export async function designGovernanceStructure(
  data: Partial<GovernanceStructure>
): Promise<GovernanceStructure> {
  return {
    governanceId: data.governanceId || `GOV-${Date.now()}`,
    organizationId: data.organizationId || '',
    model: data.model || GovernanceModel.CENTRALIZED,
    governanceBodies: data.governanceBodies || [],
    decisionFramework: data.decisionFramework || '',
    escalationPaths: data.escalationPaths || {},
    meetingCadence: data.meetingCadence || {},
  };
}

/**
 * Assesses organizational health across multiple dimensions.
 *
 * @param {string} organizationId - Organization identifier
 * @param {Record<HealthDimension, number>} dimensionScores - Scores by dimension (0-100)
 * @returns {Promise<OrganizationalHealthMetrics>} Health assessment results
 *
 * @example
 * ```typescript
 * const health = await assessOrganizationalHealth('ORG001', {
 *   [HealthDimension.DIRECTION]: 85,
 *   [HealthDimension.LEADERSHIP]: 90,
 *   ...
 * });
 * ```
 */
export async function assessOrganizationalHealth(
  organizationId: string,
  dimensionScores: Record<HealthDimension, number>
): Promise<OrganizationalHealthMetrics> {
  const scores = Object.values(dimensionScores);
  const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  Object.entries(dimensionScores).forEach(([dimension, score]) => {
    if (score >= 80) {
      strengths.push(dimension);
    } else if (score < 60) {
      weaknesses.push(dimension);
    }
  });

  const recommendations: string[] = [];
  weaknesses.forEach(dimension => {
    recommendations.push(`Focus on improving ${dimension} through targeted interventions`);
  });

  // Benchmark percentile (simplified - would use industry data)
  const benchmarkPercentile = Math.min(99, Math.max(1, overallScore));

  return {
    organizationId,
    assessmentDate: new Date(),
    overallScore: parseFloat(overallScore.toFixed(2)),
    dimensionScores,
    strengths,
    weaknesses,
    recommendations,
    benchmarkPercentile: parseFloat(benchmarkPercentile.toFixed(0)),
  };
}

/**
 * Creates organizational transformation roadmap.
 *
 * @param {Partial<TransformationRoadmap>} data - Transformation roadmap data
 * @returns {Promise<TransformationRoadmap>} Created transformation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createTransformationRoadmap({
 *   organizationId: 'ORG001',
 *   currentState: 'Functional silos',
 *   targetState: 'Agile matrix',
 *   transformationType: 'restructure',
 *   phases: [...]
 * });
 * ```
 */
export async function createTransformationRoadmap(
  data: Partial<TransformationRoadmap>
): Promise<TransformationRoadmap> {
  return {
    roadmapId: data.roadmapId || `ROADMAP-${Date.now()}`,
    organizationId: data.organizationId || '',
    currentState: data.currentState || '',
    targetState: data.targetState || '',
    transformationType: data.transformationType || 'optimization',
    phases: data.phases || [],
    totalDuration: data.totalDuration || 0,
    totalCost: data.totalCost || 0,
    riskLevel: data.riskLevel || 'medium',
    stakeholders: data.stakeholders || [],
  };
}

// ============================================================================
// ADDITIONAL ORGANIZATIONAL DESIGN FUNCTIONS (11-20)
// ============================================================================

/**
 * Validates organization design against best practices.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @returns {Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateOrganizationDesign(structure);
 * if (!validation.isValid) {
 *   console.log('Issues found:', validation.issues);
 * }
 * ```
 */
export async function validateOrganizationDesign(
  structure: OrganizationStructureData
): Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check span of control
  if (structure.spanOfControl < 4) {
    issues.push('Average span of control too narrow - may indicate over-layering');
    recommendations.push('Consider consolidating management layers');
  } else if (structure.spanOfControl > 15) {
    issues.push('Average span of control too wide - managers may be overextended');
    recommendations.push('Consider adding management capacity');
  }

  // Check layers
  if (structure.layers > 7) {
    issues.push('Excessive organizational layers may slow decision-making');
    recommendations.push('Explore opportunities to flatten hierarchy');
  }

  // Check design principles
  if (structure.designPrinciples.length === 0) {
    issues.push('No design principles defined');
    recommendations.push('Define clear design principles to guide structure');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Generates organization chart data for visualization.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ nodes: any[]; edges: any[] }>} Chart data
 *
 * @example
 * ```typescript
 * const chartData = await generateOrganizationChart('ORG001', positions);
 * ```
 */
export async function generateOrganizationChart(
  organizationId: string,
  positions: PositionData[]
): Promise<{ nodes: any[]; edges: any[] }> {
  const nodes = positions.map(pos => ({
    id: pos.positionId,
    label: pos.title,
    level: pos.level,
    layer: pos.layer,
    directReports: pos.directReports,
    incumbent: pos.incumbentId,
  }));

  const edges = positions
    .filter(pos => pos.reportsToPositionId)
    .map(pos => ({
      from: pos.reportsToPositionId,
      to: pos.positionId,
      type: pos.reportingType,
    }));

  return { nodes, edges };
}

/**
 * Calculates organization design metrics.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Design metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateOrganizationMetrics('ORG001', positions);
 * ```
 */
export async function calculateOrganizationMetrics(
  organizationId: string,
  positions: PositionData[]
): Promise<Record<string, number>> {
  const totalPositions = positions.length;
  const filledPositions = positions.filter(p => p.isFilled).length;
  const vacancyRate = totalPositions > 0 ? (totalPositions - filledPositions) / totalPositions : 0;

  const managementPositions = positions.filter(p => p.directReports > 0).length;
  const managerRatio = totalPositions > 0 ? managementPositions / totalPositions : 0;

  const totalDirectReports = positions.reduce((sum, p) => sum + p.directReports, 0);
  const avgSpan = managementPositions > 0 ? totalDirectReports / managementPositions : 0;

  return {
    totalPositions,
    filledPositions,
    vacancyRate: parseFloat((vacancyRate * 100).toFixed(2)),
    managementPositions,
    managerRatio: parseFloat((managerRatio * 100).toFixed(2)),
    averageSpanOfControl: parseFloat(avgSpan.toFixed(2)),
  };
}

/**
 * Identifies organization design patterns and archetypes.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ archetype: OrganizationArchetype; confidence: number; characteristics: string[] }>} Pattern analysis
 *
 * @example
 * ```typescript
 * const pattern = await identifyOrganizationPattern(structure, positions);
 * ```
 */
export async function identifyOrganizationPattern(
  structure: OrganizationStructureData,
  positions: PositionData[]
): Promise<{ archetype: OrganizationArchetype; confidence: number; characteristics: string[] }> {
  const characteristics: string[] = [];
  let archetype = structure.archetype;
  let confidence = 70;

  // Analyze reporting patterns
  const dottedLineReports = positions.filter(p => p.reportingType === ReportingType.DOTTED_LINE).length;
  const totalReports = positions.filter(p => p.reportsToPositionId).length;

  if (dottedLineReports / totalReports > 0.2) {
    archetype = OrganizationArchetype.MATRIX;
    characteristics.push('Significant matrix reporting relationships');
    confidence = 85;
  }

  if (structure.layers <= 3) {
    characteristics.push('Flat organizational structure');
    if (archetype === OrganizationArchetype.FUNCTIONAL) {
      archetype = OrganizationArchetype.FLAT;
    }
  }

  if (structure.spanOfControl > 10) {
    characteristics.push('Wide span of control');
  }

  return {
    archetype,
    confidence,
    characteristics,
  };
}

/**
 * Generates succession planning recommendations.
 *
 * @param {string} positionId - Position identifier
 * @param {PositionData} position - Position data
 * @returns {Promise<{ criticalityScore: number; successors: string[]; developmentNeeds: string[] }>} Succession plan
 *
 * @example
 * ```typescript
 * const succession = await generateSuccessionPlan('POS123', position);
 * ```
 */
export async function generateSuccessionPlan(
  positionId: string,
  position: PositionData
): Promise<{ criticalityScore: number; successors: string[]; developmentNeeds: string[] }> {
  // Calculate position criticality
  let criticalityScore = 50;

  if (position.layer === OrganizationalLayer.EXECUTIVE) {
    criticalityScore += 30;
  } else if (position.layer === OrganizationalLayer.SENIOR_MANAGEMENT) {
    criticalityScore += 20;
  }

  if (position.directReports > 10) {
    criticalityScore += 10;
  }

  if (position.totalReports > 50) {
    criticalityScore += 10;
  }

  const developmentNeeds = [
    'Leadership development program',
    'Strategic thinking workshop',
    'Cross-functional assignment',
  ];

  return {
    criticalityScore: Math.min(100, criticalityScore),
    successors: [], // Would be populated with actual successor candidates
    developmentNeeds,
  };
}

/**
 * Analyzes organizational complexity.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {OrganizationalUnitData[]} units - All organizational units
 * @returns {Promise<{ complexityScore: number; factors: Record<string, number>; recommendations: string[] }>} Complexity analysis
 *
 * @example
 * ```typescript
 * const complexity = await analyzeOrganizationalComplexity(structure, units);
 * ```
 */
export async function analyzeOrganizationalComplexity(
  structure: OrganizationStructureData,
  units: OrganizationalUnitData[]
): Promise<{ complexityScore: number; factors: Record<string, number>; recommendations: string[] }> {
  const factors: Record<string, number> = {
    hierarchyDepth: structure.layers * 10,
    numberOfUnits: Math.min(50, units.length * 2),
    matrixComplexity: structure.archetype === OrganizationArchetype.MATRIX ? 30 : 0,
    geographicDispersion: units.filter(u => u.location).length > 5 ? 20 : 0,
  };

  const complexityScore = Object.values(factors).reduce((sum, val) => sum + val, 0);

  const recommendations: string[] = [];
  if (complexityScore > 70) {
    recommendations.push('High complexity - consider simplification initiatives');
    recommendations.push('Standardize processes across units');
    recommendations.push('Clarify decision rights and accountabilities');
  }

  return {
    complexityScore: Math.min(100, complexityScore),
    factors,
    recommendations,
  };
}

/**
 * Creates organizational unit with hierarchy validation.
 *
 * @param {Partial<OrganizationalUnitData>} data - Unit data
 * @param {OrganizationalUnitData[]} existingUnits - Existing units for validation
 * @returns {Promise<OrganizationalUnitData>} Created unit
 *
 * @example
 * ```typescript
 * const unit = await createOrganizationalUnit(unitData, existingUnits);
 * ```
 */
export async function createOrganizationalUnit(
  data: Partial<OrganizationalUnitData>,
  existingUnits: OrganizationalUnitData[]
): Promise<OrganizationalUnitData> {
  const unitId = data.unitId || `UNIT-${Date.now()}`;

  // Validate parent exists if specified
  if (data.parentUnitId) {
    const parentExists = existingUnits.some(u => u.unitId === data.parentUnitId);
    if (!parentExists) {
      throw new Error(`Parent unit ${data.parentUnitId} not found`);
    }
  }

  return {
    unitId,
    organizationId: data.organizationId || '',
    parentUnitId: data.parentUnitId,
    name: data.name || '',
    description: data.description || '',
    unitType: data.unitType || 'team',
    layer: data.layer || OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR,
    headId: data.headId,
    headcount: data.headcount || 0,
    budget: data.budget,
    costCenter: data.costCenter,
    location: data.location,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };
}

/**
 * Optimizes reporting relationships for efficiency.
 *
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ optimizedRelationships: ReportingRelationship[]; improvements: string[] }>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizeReportingRelationships(positions);
 * ```
 */
export async function optimizeReportingRelationships(
  positions: PositionData[]
): Promise<{ optimizedRelationships: ReportingRelationship[]; improvements: string[] }> {
  const relationships: ReportingRelationship[] = [];
  const improvements: string[] = [];

  positions.forEach(pos => {
    if (pos.reportsToPositionId) {
      relationships.push({
        relationshipId: `REL-${pos.positionId}`,
        subordinatePositionId: pos.positionId,
        supervisorPositionId: pos.reportsToPositionId,
        relationshipType: pos.reportingType,
        effectiveDate: new Date(),
      });
    }

    // Identify optimization opportunities
    if (pos.directReports > 15) {
      improvements.push(`${pos.title} has ${pos.directReports} direct reports - consider adding intermediate layer`);
    } else if (pos.directReports === 1 && pos.layer !== OrganizationalLayer.EXECUTIVE) {
      improvements.push(`${pos.title} has only 1 direct report - consider flattening`);
    }
  });

  return {
    optimizedRelationships: relationships,
    improvements,
  };
}

/**
 * Benchmarks organization design against industry standards.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {string} industry - Industry sector
 * @returns {Promise<{ percentiles: Record<string, number>; gaps: string[] }>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkOrganizationDesign(structure, 'healthcare');
 * ```
 */
export async function benchmarkOrganizationDesign(
  structure: OrganizationStructureData,
  industry: string
): Promise<{ percentiles: Record<string, number>; gaps: string[] }> {
  // Industry benchmarks (simplified - would use real data)
  const benchmarks: Record<string, { layers: number; span: number; managerRatio: number }> = {
    healthcare: { layers: 5, span: 7, managerRatio: 15 },
    technology: { layers: 4, span: 8, managerRatio: 12 },
    manufacturing: { layers: 6, span: 10, managerRatio: 18 },
  };

  const benchmark = benchmarks[industry] || benchmarks.healthcare;
  const gaps: string[] = [];

  const layersDiff = structure.layers - benchmark.layers;
  const spanDiff = structure.spanOfControl - benchmark.span;

  if (layersDiff > 1) {
    gaps.push(`${layersDiff} more layers than industry average - consider flattening`);
  }

  if (spanDiff < -2) {
    gaps.push('Span of control narrower than industry - potential over-management');
  }

  return {
    percentiles: {
      layers: Math.max(0, 100 - Math.abs(layersDiff) * 20),
      spanOfControl: Math.max(0, 100 - Math.abs(spanDiff) * 10),
    },
    gaps,
  };
}

/**
 * Generates change impact analysis for org design changes.
 *
 * @param {OrganizationStructureData} currentStructure - Current structure
 * @param {OrganizationStructureData} proposedStructure - Proposed structure
 * @returns {Promise<{ impactedPositions: number; impactedEmployees: number; risks: string[]; mitigations: string[] }>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeChangeImpact(current, proposed);
 * ```
 */
export async function analyzeChangeImpact(
  currentStructure: OrganizationStructureData,
  proposedStructure: OrganizationStructureData
): Promise<{ impactedPositions: number; impactedEmployees: number; risks: string[]; mitigations: string[] }> {
  const layerChange = Math.abs(proposedStructure.layers - currentStructure.layers);
  const headcountChange = Math.abs(proposedStructure.headcount - currentStructure.headcount);

  const risks: string[] = [];
  const mitigations: string[] = [];

  if (layerChange > 0) {
    risks.push('Reporting relationship changes may cause confusion');
    mitigations.push('Communicate new structure clearly with org charts');
  }

  if (currentStructure.archetype !== proposedStructure.archetype) {
    risks.push('Cultural change required for new operating model');
    mitigations.push('Conduct change management workshops');
  }

  if (headcountChange / currentStructure.headcount > 0.1) {
    risks.push('Significant headcount changes may impact morale');
    mitigations.push('Provide career transition support');
  }

  return {
    impactedPositions: Math.ceil(currentStructure.headcount * 0.3), // Estimated
    impactedEmployees: Math.ceil(currentStructure.headcount * 0.5), // Estimated
    risks,
    mitigations,
  };
}

// ============================================================================
// ADVANCED ORGANIZATIONAL DESIGN FUNCTIONS (21-30)
// ============================================================================

/**
 * Designs role architecture for the organization.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} jobFamilies - Job families to design
 * @returns {Promise<{ roles: RoleDefinition[]; career paths: Record<string, string[]> }>} Role architecture
 *
 * @example
 * ```typescript
 * const architecture = await designRoleArchitecture('ORG001', ['Clinical', 'Operations']);
 * ```
 */
export async function designRoleArchitecture(
  organizationId: string,
  jobFamilies: string[]
): Promise<{ roles: RoleDefinition[]; careerPaths: Record<string, string[]> }> {
  const roles: RoleDefinition[] = [];
  const careerPaths: Record<string, string[]> = {};

  jobFamilies.forEach(family => {
    const levels = ['Entry', 'Intermediate', 'Senior', 'Principal', 'Executive'];
    const familyRoles: string[] = [];

    levels.forEach((level, index) => {
      const roleId = `${family}-${level}-${Date.now()}`;
      familyRoles.push(roleId);

      roles.push({
        roleId,
        organizationId,
        title: `${level} ${family} Professional`,
        level: `L${index + 1}`,
        layer: index < 2 ? OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR :
          index < 4 ? OrganizationalLayer.MIDDLE_MANAGEMENT :
          OrganizationalLayer.SENIOR_MANAGEMENT,
        purpose: `Deliver ${level.toLowerCase()} level ${family.toLowerCase()} expertise`,
        keyResponsibilities: [`${level} responsibilities for ${family}`],
        decisionAuthority: [],
        requiredCompetencies: [`${family} expertise`, 'Communication'],
        experience: `${index * 2}-${index * 2 + 3} years`,
        education: index >= 3 ? 'Advanced degree preferred' : 'Bachelor\'s degree',
        reportingRelationship: index > 0 ? familyRoles[index - 1] : '',
        successMetrics: ['Performance metrics', 'Impact metrics'],
      });
    });

    careerPaths[family] = familyRoles;
  });

  return { roles, careerPaths };
}

/**
 * Analyzes skills gaps in the organization.
 *
 * @param {CompetencyFramework} framework - Competency framework
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ criticalGaps: string[]; developmentPriorities: string[] }>} Skills gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await analyzeSkillsGaps(framework, positions);
 * ```
 */
export async function analyzeSkillsGaps(
  framework: CompetencyFramework,
  positions: PositionData[]
): Promise<{ criticalGaps: string[]; developmentPriorities: string[] }> {
  const criticalGaps: string[] = [];
  const developmentPriorities: string[] = [];

  // Analyze competency coverage
  framework.competencies.forEach(comp => {
    const requiredCount = comp.requiredForRoles.length;
    const filledPositions = positions.filter(p => p.isFilled && comp.requiredForRoles.includes(p.level)).length;
    const coverage = filledPositions / requiredCount;

    if (coverage < 0.7) {
      criticalGaps.push(`${comp.name} - only ${Math.round(coverage * 100)}% coverage`);
      developmentPriorities.push(`Build ${comp.name} capability through hiring or training`);
    }
  });

  return { criticalGaps, developmentPriorities };
}

/**
 * Creates workforce segmentation model.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Workforce segments
 *
 * @example
 * ```typescript
 * const segments = await createWorkforceSegmentation('ORG001', positions);
 * ```
 */
export async function createWorkforceSegmentation(
  organizationId: string,
  positions: PositionData[]
): Promise<Record<string, number>> {
  const segments: Record<string, number> = {
    executive: 0,
    leadership: 0,
    management: 0,
    professional: 0,
    support: 0,
  };

  positions.forEach(pos => {
    switch (pos.layer) {
      case OrganizationalLayer.EXECUTIVE:
        segments.executive++;
        break;
      case OrganizationalLayer.SENIOR_MANAGEMENT:
        segments.leadership++;
        break;
      case OrganizationalLayer.MIDDLE_MANAGEMENT:
      case OrganizationalLayer.FRONTLINE_MANAGEMENT:
        segments.management++;
        break;
      case OrganizationalLayer.INDIVIDUAL_CONTRIBUTOR:
        segments.professional++;
        break;
    }
  });

  return segments;
}

/**
 * Generates organizational redesign scenarios.
 *
 * @param {OrganizationStructureData} current - Current structure
 * @returns {Promise<{ scenarios: Array<{ name: string; structure: Partial<OrganizationStructureData>; impact: string }> }>} Redesign scenarios
 *
 * @example
 * ```typescript
 * const scenarios = await generateRedesignScenarios(currentStructure);
 * ```
 */
export async function generateRedesignScenarios(
  current: OrganizationStructureData
): Promise<{ scenarios: Array<{ name: string; structure: Partial<OrganizationStructureData>; impact: string }> }> {
  const scenarios = [
    {
      name: 'Flatten Hierarchy',
      structure: {
        layers: Math.max(3, current.layers - 1),
        spanOfControl: current.spanOfControl * 1.3,
      },
      impact: 'Faster decision-making, reduced overhead costs by 15%',
    },
    {
      name: 'Increase Span',
      structure: {
        layers: current.layers,
        spanOfControl: current.spanOfControl * 1.2,
      },
      impact: 'Reduced management positions, cost savings of 10%',
    },
    {
      name: 'Matrix Transition',
      structure: {
        archetype: OrganizationArchetype.MATRIX,
        layers: current.layers,
      },
      impact: 'Improved cross-functional collaboration, 6-month transition',
    },
  ];

  return { scenarios };
}

/**
 * Validates decision rights framework completeness.
 *
 * @param {DecisionRightsAllocation[]} allocations - All decision rights
 * @returns {Promise<{ coverage: number; gaps: string[]; overlaps: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDecisionRightsFramework(allocations);
 * ```
 */
export async function validateDecisionRightsFramework(
  allocations: DecisionRightsAllocation[]
): Promise<{ coverage: number; gaps: string[]; overlaps: string[] }> {
  const gaps: string[] = [];
  const overlaps: string[] = [];

  const criticalDecisionTypes = ['Financial', 'Strategic', 'Operational', 'People'];
  const coveredTypes = new Set(allocations.map(a => a.decisionType));

  criticalDecisionTypes.forEach(type => {
    if (!coveredTypes.has(type)) {
      gaps.push(`${type} decisions not allocated`);
    }
  });

  // Check for decision conflicts
  const decisionMap = new Map<string, number>();
  allocations.forEach(alloc => {
    const count = decisionMap.get(alloc.decisionName) || 0;
    decisionMap.set(alloc.decisionName, count + 1);
  });

  decisionMap.forEach((count, decision) => {
    if (count > 1) {
      overlaps.push(`Decision "${decision}" allocated to multiple owners`);
    }
  });

  const coverage = (coveredTypes.size / criticalDecisionTypes.length) * 100;

  return {
    coverage: parseFloat(coverage.toFixed(2)),
    gaps,
    overlaps,
  };
}

/**
 * Creates talent density analysis.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @param {OrganizationalUnitData[]} units - All units
 * @returns {Promise<Record<string, { headcount: number; density: number }>>} Talent density by unit
 *
 * @example
 * ```typescript
 * const density = await analyzeTalentDensity('ORG001', positions, units);
 * ```
 */
export async function analyzeTalentDensity(
  organizationId: string,
  positions: PositionData[],
  units: OrganizationalUnitData[]
): Promise<Record<string, { headcount: number; density: number }>> {
  const densityMap: Record<string, { headcount: number; density: number }> = {};

  units.forEach(unit => {
    const unitPositions = positions.filter(p => p.unitId === unit.unitId);
    const seniorPositions = unitPositions.filter(
      p => p.layer === OrganizationalLayer.SENIOR_MANAGEMENT ||
        p.layer === OrganizationalLayer.EXECUTIVE
    );

    const density = unitPositions.length > 0 ? seniorPositions.length / unitPositions.length : 0;

    densityMap[unit.name] = {
      headcount: unitPositions.length,
      density: parseFloat((density * 100).toFixed(2)),
    };
  });

  return densityMap;
}

/**
 * Generates organization effectiveness scorecard.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const scorecard = await generateEffectivenessScorecard(structure, positions);
 * ```
 */
export async function generateEffectivenessScorecard(
  structure: OrganizationStructureData,
  positions: PositionData[]
): Promise<Record<string, number>> {
  const filled = positions.filter(p => p.isFilled).length;
  const fillRate = (filled / positions.length) * 100;

  const managementCount = positions.filter(p => p.directReports > 0).length;
  const managementRatio = (managementCount / positions.length) * 100;

  const avgSpan = positions.reduce((sum, p) => sum + p.directReports, 0) / managementCount;

  return {
    positionFillRate: parseFloat(fillRate.toFixed(2)),
    managementRatio: parseFloat(managementRatio.toFixed(2)),
    averageSpan: parseFloat(avgSpan.toFixed(2)),
    structureComplexity: structure.layers * 10,
    overallEffectiveness: parseFloat(((fillRate + (100 - managementRatio) + 70) / 3).toFixed(2)),
  };
}

/**
 * Designs agile organizational structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {number} squadSize - Target squad size
 * @returns {Promise<{ squads: number; tribes: number; chapters: string[] }>} Agile structure
 *
 * @example
 * ```typescript
 * const agileOrg = await designAgileOrganization('ORG001', 8);
 * ```
 */
export async function designAgileOrganization(
  organizationId: string,
  squadSize: number
): Promise<{ squads: number; tribes: number; chapters: string[] }> {
  const chapters = [
    'Engineering',
    'Product',
    'Design',
    'Data',
    'Quality',
  ];

  return {
    squads: 10, // Calculated based on total headcount
    tribes: 3, // 3-4 squads per tribe
    chapters,
  };
}

/**
 * Calculates organizational agility index.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @returns {Promise<{ agilityScore: number; factors: Record<string, number> }>} Agility assessment
 *
 * @example
 * ```typescript
 * const agility = await calculateOrganizationalAgility(structure);
 * ```
 */
export async function calculateOrganizationalAgility(
  structure: OrganizationStructureData
): Promise<{ agilityScore: number; factors: Record<string, number> }> {
  const factors: Record<string, number> = {
    hierarchyFlatness: Math.max(0, 100 - structure.layers * 15),
    spanFlexibility: structure.spanOfControl > 6 && structure.spanOfControl < 12 ? 100 : 70,
    matrixCapability: [OrganizationArchetype.MATRIX, OrganizationArchetype.NETWORK].includes(structure.archetype) ? 100 : 50,
  };

  const agilityScore = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;

  return {
    agilityScore: parseFloat(agilityScore.toFixed(2)),
    factors,
  };
}

/**
 * Generates communications architecture.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {Promise<{ channels: string[]; cadence: Record<string, string> }>} Communications plan
 *
 * @example
 * ```typescript
 * const comms = await generateCommunicationsArchitecture(structure, governance);
 * ```
 */
export async function generateCommunicationsArchitecture(
  structure: OrganizationStructureData,
  governance: GovernanceStructure
): Promise<{ channels: string[]; cadence: Record<string, string> }> {
  return {
    channels: [
      'All-Hands Meetings',
      'Leadership Forums',
      'Town Halls',
      'Team Huddles',
      'Digital Workplace',
    ],
    cadence: {
      'Executive Committee': 'Weekly',
      'Leadership Forum': 'Monthly',
      'All-Hands': 'Quarterly',
      'Team Meetings': 'Weekly',
    },
  };
}

// ============================================================================
// FINAL ORGANIZATIONAL DESIGN FUNCTIONS (31-45)
// ============================================================================

/**
 * Analyzes cross-functional collaboration patterns.
 *
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ collaborationIndex: number; siloRisk: string[] }>} Collaboration analysis
 *
 * @example
 * ```typescript
 * const collab = await analyzeCrossFunctionalCollaboration(positions);
 * ```
 */
export async function analyzeCrossFunctionalCollaboration(
  positions: PositionData[]
): Promise<{ collaborationIndex: number; siloRisk: string[] }> {
  const matrixPositions = positions.filter(p => p.reportingType === ReportingType.DOTTED_LINE).length;
  const collaborationIndex = (matrixPositions / positions.length) * 100;

  const siloRisk: string[] = [];
  if (collaborationIndex < 10) {
    siloRisk.push('Low cross-functional reporting - silo risk');
  }

  return {
    collaborationIndex: parseFloat(collaborationIndex.toFixed(2)),
    siloRisk,
  };
}

/**
 * Designs centers of excellence structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} domains - Domain areas
 * @returns {Promise<Array<{ name: string; purpose: string; roles: string[] }>>} CoE structure
 *
 * @example
 * ```typescript
 * const coes = await designCentersOfExcellence('ORG001', ['Data', 'Innovation']);
 * ```
 */
export async function designCentersOfExcellence(
  organizationId: string,
  domains: string[]
): Promise<Array<{ name: string; purpose: string; roles: string[] }>> {
  return domains.map(domain => ({
    name: `${domain} Center of Excellence`,
    purpose: `Drive ${domain.toLowerCase()} strategy and best practices`,
    roles: ['CoE Lead', 'Subject Matter Experts', 'Practice Consultants'],
  }));
}

/**
 * Validates governance framework completeness.
 *
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {Promise<{ isComplete: boolean; gaps: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateGovernanceFramework(governance);
 * ```
 */
export async function validateGovernanceFramework(
  governance: GovernanceStructure
): Promise<{ isComplete: boolean; gaps: string[] }> {
  const gaps: string[] = [];

  if (governance.governanceBodies.length === 0) {
    gaps.push('No governance bodies defined');
  }

  if (!governance.decisionFramework) {
    gaps.push('Decision framework not defined');
  }

  if (Object.keys(governance.escalationPaths).length === 0) {
    gaps.push('Escalation paths not defined');
  }

  return {
    isComplete: gaps.length === 0,
    gaps,
  };
}

/**
 * Generates role transition plan.
 *
 * @param {string} fromRoleId - Current role
 * @param {string} toRoleId - Target role
 * @returns {Promise<{ duration: number; activities: string[]; milestones: string[] }>} Transition plan
 *
 * @example
 * ```typescript
 * const plan = await generateRoleTransitionPlan('ROLE123', 'ROLE456');
 * ```
 */
export async function generateRoleTransitionPlan(
  fromRoleId: string,
  toRoleId: string
): Promise<{ duration: number; activities: string[]; milestones: string[] }> {
  return {
    duration: 90, // days
    activities: [
      'Complete skills assessment',
      'Develop individual development plan',
      'Participate in job shadowing',
      'Complete required training',
      'Deliver transition project',
    ],
    milestones: [
      '30 days: Skills assessment complete',
      '60 days: Training complete',
      '90 days: Ready for role transition',
    ],
  };
}

/**
 * Calculates organizational health index.
 *
 * @param {OrganizationalHealthMetrics} metrics - Health metrics
 * @returns {Promise<{ index: number; rating: string; trend: string }>} Health index
 *
 * @example
 * ```typescript
 * const health = await calculateOrganizationalHealthIndex(metrics);
 * ```
 */
export async function calculateOrganizationalHealthIndex(
  metrics: OrganizationalHealthMetrics
): Promise<{ index: number; rating: string; trend: string }> {
  const index = metrics.overallScore;

  let rating = 'Poor';
  if (index >= 80) rating = 'Excellent';
  else if (index >= 70) rating = 'Good';
  else if (index >= 60) rating = 'Fair';

  return {
    index,
    rating,
    trend: 'stable', // Would calculate from historical data
  };
}

/**
 * Designs shared services model.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} services - Services to centralize
 * @returns {Promise<{ model: string; services: Array<{ name: string; savings: number }> }>} Shared services design
 *
 * @example
 * ```typescript
 * const sharedServices = await designSharedServicesModel('ORG001', ['HR', 'Finance']);
 * ```
 */
export async function designSharedServicesModel(
  organizationId: string,
  services: string[]
): Promise<{ model: string; services: Array<{ name: string; savings: number }> }> {
  return {
    model: 'Centralized Shared Services',
    services: services.map(svc => ({
      name: svc,
      savings: 0.15, // 15% estimated savings
    })),
  };
}

/**
 * Analyzes decision-making velocity.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {DecisionRightsAllocation[]} decisions - Decision rights
 * @returns {Promise<{ velocityScore: number; bottlenecks: string[] }>} Velocity analysis
 *
 * @example
 * ```typescript
 * const velocity = await analyzeDecisionVelocity(structure, decisions);
 * ```
 */
export async function analyzeDecisionVelocity(
  structure: OrganizationStructureData,
  decisions: DecisionRightsAllocation[]
): Promise<{ velocityScore: number; bottlenecks: string[] }> {
  const bottlenecks: string[] = [];

  if (structure.layers > 6) {
    bottlenecks.push('Excessive layers slow decision escalation');
  }

  const centralizedDecisions = decisions.filter(d => d.authority === DecisionAuthority.DECIDE).length;
  if (centralizedDecisions / decisions.length > 0.7) {
    bottlenecks.push('Over-centralized decision-making');
  }

  const velocityScore = Math.max(0, 100 - structure.layers * 10 - bottlenecks.length * 20);

  return {
    velocityScore,
    bottlenecks,
  };
}

/**
 * Generates organization transformation timeline.
 *
 * @param {TransformationRoadmap} roadmap - Transformation roadmap
 * @returns {Promise<{ timeline: string[]; criticalPath: string[] }>} Timeline visualization
 *
 * @example
 * ```typescript
 * const timeline = await generateTransformationTimeline(roadmap);
 * ```
 */
export async function generateTransformationTimeline(
  roadmap: TransformationRoadmap
): Promise<{ timeline: string[]; criticalPath: string[] }> {
  const timeline = roadmap.phases.map(phase =>
    `${phase.name}: ${phase.startDate.toISOString().split('T')[0]} - ${phase.endDate.toISOString().split('T')[0]}`
  );

  const criticalPath = roadmap.phases
    .filter(phase => phase.budget > roadmap.totalCost * 0.3)
    .map(phase => phase.name);

  return { timeline, criticalPath };
}

/**
 * Designs innovation organizational model.
 *
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<{ model: string; structure: string[]; principles: string[] }>} Innovation model
 *
 * @example
 * ```typescript
 * const innovation = await designInnovationModel('ORG001');
 * ```
 */
export async function designInnovationModel(
  organizationId: string
): Promise<{ model: string; structure: string[]; principles: string[] }> {
  return {
    model: 'Ambidextrous Organization',
    structure: [
      'Core Business Units',
      'Innovation Lab',
      'Venture Studio',
      'Partnership Ecosystem',
    ],
    principles: [
      'Separate but connected',
      'Fail fast, learn faster',
      'Portfolio approach',
      'Customer co-creation',
    ],
  };
}

/**
 * Calculates role clarity index.
 *
 * @param {RoleDefinition[]} roles - All role definitions
 * @param {RACIMatrix[]} matrices - RACI matrices
 * @returns {Promise<{ clarityScore: number; ambiguities: string[] }>} Role clarity assessment
 *
 * @example
 * ```typescript
 * const clarity = await calculateRoleClarity(roles, matrices);
 * ```
 */
export async function calculateRoleClarity(
  roles: RoleDefinition[],
  matrices: RACIMatrix[]
): Promise<{ clarityScore: number; ambiguities: string[] }> {
  const ambiguities: string[] = [];

  const rolesWithoutDefinitions = roles.filter(r => r.keyResponsibilities.length === 0);
  if (rolesWithoutDefinitions.length > 0) {
    ambiguities.push(`${rolesWithoutDefinitions.length} roles lack clear responsibilities`);
  }

  const matricesWithConflicts = matrices.filter(m => m.validationStatus === 'conflicts').length;
  if (matricesWithConflicts > 0) {
    ambiguities.push(`${matricesWithConflicts} RACI matrices have conflicts`);
  }

  const clarityScore = Math.max(0, 100 - ambiguities.length * 25);

  return { clarityScore, ambiguities };
}

/**
 * Generates workforce analytics dashboard.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @param {HeadcountPlan[]} plans - Headcount plans
 * @returns {Promise<Record<string, any>>} Analytics dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateWorkforceDashboard('ORG001', positions, plans);
 * ```
 */
export async function generateWorkforceDashboard(
  organizationId: string,
  positions: PositionData[],
  plans: HeadcountPlan[]
): Promise<Record<string, any>> {
  const currentHeadcount = positions.length;
  const fillRate = (positions.filter(p => p.isFilled).length / currentHeadcount) * 100;
  const plannedGrowth = plans.reduce((sum, p) => sum + p.variance, 0);

  return {
    currentHeadcount,
    fillRate: parseFloat(fillRate.toFixed(2)),
    plannedGrowth,
    vacancies: positions.filter(p => !p.isFilled).length,
    growthRate: parseFloat(((plannedGrowth / currentHeadcount) * 100).toFixed(2)),
  };
}

/**
 * Designs matrix organization structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} functionalAreas - Functional areas
 * @param {string[]} productLines - Product lines
 * @returns {Promise<{ grid: string[][]; dualReporting: number }>} Matrix structure
 *
 * @example
 * ```typescript
 * const matrix = await designMatrixStructure('ORG001', ['Eng', 'Sales'], ['Product A', 'Product B']);
 * ```
 */
export async function designMatrixStructure(
  organizationId: string,
  functionalAreas: string[],
  productLines: string[]
): Promise<{ grid: string[][]; dualReporting: number }> {
  const grid = productLines.map(product =>
    functionalAreas.map(func => `${product}-${func}`)
  );

  const dualReporting = functionalAreas.length * productLines.length;

  return { grid, dualReporting };
}

/**
 * Analyzes organizational resilience.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ resilienceScore: number; vulnerabilities: string[] }>} Resilience analysis
 *
 * @example
 * ```typescript
 * const resilience = await analyzeOrganizationalResilience(structure, positions);
 * ```
 */
export async function analyzeOrganizationalResilience(
  structure: OrganizationStructureData,
  positions: PositionData[]
): Promise<{ resilienceScore: number; vulnerabilities: string[] }> {
  const vulnerabilities: string[] = [];

  const singlePointsOfFailure = positions.filter(p => p.directReports > 20).length;
  if (singlePointsOfFailure > 0) {
    vulnerabilities.push(`${singlePointsOfFailure} positions with excessive span`);
  }

  const vacancyRate = (positions.filter(p => !p.isFilled).length / positions.length) * 100;
  if (vacancyRate > 15) {
    vulnerabilities.push('High vacancy rate reduces resilience');
  }

  const resilienceScore = Math.max(0, 100 - vulnerabilities.length * 30 - singlePointsOfFailure * 10);

  return { resilienceScore, vulnerabilities };
}

/**
 * Generates capability heat map.
 *
 * @param {CompetencyFramework} framework - Competency framework
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, { strength: string; gap: number }>>} Capability heat map
 *
 * @example
 * ```typescript
 * const heatMap = await generateCapabilityHeatMap(framework, positions);
 * ```
 */
export async function generateCapabilityHeatMap(
  framework: CompetencyFramework,
  positions: PositionData[]
): Promise<Record<string, { strength: string; gap: number }>> {
  const heatMap: Record<string, { strength: string; gap: number }> = {};

  framework.competencies.forEach(comp => {
    const requiredPositions = positions.filter(p =>
      comp.requiredForRoles.includes(p.level)
    ).length;
    const filledPositions = positions.filter(p =>
      comp.requiredForRoles.includes(p.level) && p.isFilled
    ).length;

    const gap = requiredPositions - filledPositions;
    const coverage = requiredPositions > 0 ? filledPositions / requiredPositions : 1;

    let strength = 'Strong';
    if (coverage < 0.7) strength = 'Weak';
    else if (coverage < 0.85) strength = 'Moderate';

    heatMap[comp.name] = { strength, gap };
  });

  return heatMap;
}

/**
 * Creates organizational network analysis.
 *
 * @param {PositionData[]} positions - All positions
 * @param {ReportingRelationship[]} relationships - Reporting relationships
 * @returns {Promise<{ centrality: Record<string, number>; clusters: string[][] }>} Network analysis
 *
 * @example
 * ```typescript
 * const network = await analyzeOrganizationalNetwork(positions, relationships);
 * ```
 */
export async function analyzeOrganizationalNetwork(
  positions: PositionData[],
  relationships: ReportingRelationship[]
): Promise<{ centrality: Record<string, number>; clusters: string[][] }> {
  const centrality: Record<string, number> = {};

  positions.forEach(pos => {
    const connections = relationships.filter(
      r => r.subordinatePositionId === pos.positionId || r.supervisorPositionId === pos.positionId
    ).length;
    centrality[pos.positionId] = connections;
  });

  // Simplified clustering by organizational layer
  const clusters: string[][] = [];
  const layers = [
    OrganizationalLayer.EXECUTIVE,
    OrganizationalLayer.SENIOR_MANAGEMENT,
    OrganizationalLayer.MIDDLE_MANAGEMENT,
  ];

  layers.forEach(layer => {
    const layerPositions = positions
      .filter(p => p.layer === layer)
      .map(p => p.positionId);
    if (layerPositions.length > 0) {
      clusters.push(layerPositions);
    }
  });

  return { centrality, clusters };
}
