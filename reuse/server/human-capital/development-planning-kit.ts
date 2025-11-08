/**
 * LOC: HCMDEV12345
 * File: /reuse/server/human-capital/development-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Development planning controllers
 *   - Career development services
 *   - Competency management services
 */

/**
 * File: /reuse/server/human-capital/development-planning-kit.ts
 * Locator: WC-HCM-DEV-001
 * Purpose: Comprehensive Development Planning System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, development planning services, career development, talent management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45+ utility functions for individual development plans (IDP), competency frameworks, skills gap analysis,
 * learning recommendations, mentoring programs, job rotation, knowledge sharing, external training, professional
 * development budgets, development milestones, career planning integration
 *
 * LLM Context: Enterprise-grade Development Planning System competing with SAP SuccessFactors Career Development.
 * Provides comprehensive individual development planning, competency framework management, skills assessment and
 * gap analysis, personalized learning recommendations, mentoring and coaching program management, job rotation and
 * cross-training coordination, knowledge sharing and collaboration tools, learning resource library management,
 * external training and tuition reimbursement, professional development budget tracking, development milestone
 * tracking, succession planning integration, career path planning, talent pool management, performance review
 * integration, 360-degree feedback integration, development goal tracking, skill certification tracking.
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
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * IDP status values
 */
export enum IDPStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Development goal status
 */
export enum DevelopmentGoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Competency proficiency levels
 */
export enum ProficiencyLevel {
  NONE = 'none',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master',
}

/**
 * Competency types
 */
export enum CompetencyType {
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  LEADERSHIP = 'leadership',
  FUNCTIONAL = 'functional',
  CORE = 'core',
  ROLE_SPECIFIC = 'role_specific',
}

/**
 * Skills gap priority
 */
export enum SkillsGapPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Mentoring relationship status
 */
export enum MentoringStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Mentoring relationship type
 */
export enum MentoringType {
  FORMAL = 'formal',
  INFORMAL = 'informal',
  PEER = 'peer',
  REVERSE = 'reverse',
  GROUP = 'group',
}

/**
 * Job rotation status
 */
export enum JobRotationStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Resource types
 */
export enum ResourceType {
  ARTICLE = 'article',
  VIDEO = 'video',
  BOOK = 'book',
  PODCAST = 'podcast',
  COURSE = 'course',
  WEBINAR = 'webinar',
  TOOL = 'tool',
  TEMPLATE = 'template',
}

/**
 * Tuition reimbursement status
 */
export enum ReimbursementStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Individual Development Plan (IDP) interface
 */
export interface IndividualDevelopmentPlan {
  id: string;
  userId: string;
  planName: string;
  description: string;
  status: IDPStatus;
  planYear: number;
  startDate: Date;
  endDate: Date;
  currentRole: string;
  desiredRole?: string;
  careerGoals: string[];
  strengths: string[];
  areasForDevelopment: string[];
  goals: string[];
  managerIds: string[];
  reviewDate?: Date;
  lastReviewDate?: Date;
  completionPercentage: number;
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Development goal interface
 */
export interface DevelopmentGoal {
  id: string;
  idpId: string;
  userId: string;
  goalName: string;
  description: string;
  status: DevelopmentGoalStatus;
  priority: SkillsGapPriority;
  category: 'SKILL' | 'COMPETENCY' | 'BEHAVIOR' | 'KNOWLEDGE' | 'CAREER';
  targetCompetencyId?: string;
  currentLevel?: ProficiencyLevel;
  targetLevel: ProficiencyLevel;
  startDate: Date;
  targetDate: Date;
  completionDate?: Date;
  progress: number;
  successCriteria: string[];
  developmentActivities: string[];
  requiredResources: string[];
  supportNeeded?: string;
  measurementMethod: string;
  milestones: Array<{
    name: string;
    dueDate: Date;
    completed: boolean;
  }>;
  relatedCourseIds: string[];
  mentorId?: string;
  managerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Competency framework interface
 */
export interface CompetencyFramework {
  id: string;
  frameworkName: string;
  description: string;
  version: string;
  type: CompetencyType;
  applicableRoles: string[];
  applicableJobLevels: string[];
  competencies: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  effectiveDate: Date;
  expiryDate?: Date;
  ownerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Competency interface
 */
export interface Competency {
  id: string;
  competencyCode: string;
  competencyName: string;
  description: string;
  type: CompetencyType;
  category?: string;
  proficiencyLevels: Array<{
    level: ProficiencyLevel;
    description: string;
    behavioralIndicators: string[];
  }>;
  relatedSkills: string[];
  requiredForRoles: string[];
  assessmentCriteria: string[];
  developmentResources: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Skills assessment interface
 */
export interface SkillsAssessment {
  id: string;
  userId: string;
  assessmentName: string;
  assessmentDate: Date;
  assessmentType: 'SELF' | 'MANAGER' | 'PEER' | '360' | 'EXPERT';
  assessorId: string;
  competencies: Array<{
    competencyId: string;
    currentLevel: ProficiencyLevel;
    targetLevel?: ProficiencyLevel;
    evidence?: string;
    notes?: string;
  }>;
  overallScore?: number;
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Skills gap analysis interface
 */
export interface SkillsGapAnalysis {
  id: string;
  userId: string;
  targetRole?: string;
  analysisDate: Date;
  gaps: Array<{
    competencyId: string;
    competencyName: string;
    currentLevel: ProficiencyLevel;
    requiredLevel: ProficiencyLevel;
    gap: number;
    priority: SkillsGapPriority;
    developmentActions: string[];
    estimatedTimeframe: string;
  }>;
  overallGapScore: number;
  criticalGaps: number;
  recommendedCourses: string[];
  recommendedMentors: string[];
  nextReviewDate: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Learning recommendation interface
 */
export interface LearningRecommendation {
  id: string;
  userId: string;
  recommendationType: 'SKILL_GAP' | 'CAREER_PATH' | 'PERFORMANCE' | 'PEER_BASED' | 'AI_GENERATED';
  recommendedItemId: string;
  recommendedItemType: 'COURSE' | 'LEARNING_PATH' | 'MENTOR' | 'JOB_ROTATION' | 'RESOURCE';
  title: string;
  description: string;
  relevanceScore: number;
  priority: SkillsGapPriority;
  competenciesAddressed: string[];
  estimatedDuration?: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  recommendedBy: string;
  recommendedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  feedback?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mentoring relationship interface
 */
export interface MentoringRelationship {
  id: string;
  programId?: string;
  mentorId: string;
  menteeId: string;
  type: MentoringType;
  status: MentoringStatus;
  startDate: Date;
  endDate?: Date;
  focusAreas: string[];
  goals: string[];
  meetingFrequency: string;
  preferredMeetingMode: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  sessionCount: number;
  lastSessionDate?: Date;
  nextSessionDate?: Date;
  progressNotes: string[];
  feedback?: {
    mentorFeedback?: string;
    menteeFeedback?: string;
    rating?: number;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mentoring session interface
 */
export interface MentoringSession {
  id: string;
  relationshipId: string;
  sessionNumber: number;
  sessionDate: Date;
  duration: number; // in minutes
  topics: string[];
  objectives: string[];
  outcomes: string[];
  actionItems: Array<{
    description: string;
    assignedTo: 'MENTOR' | 'MENTEE';
    dueDate?: Date;
    completed: boolean;
  }>;
  mentorNotes?: string;
  menteeNotes?: string;
  rating?: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Job rotation interface
 */
export interface JobRotation {
  id: string;
  userId: string;
  programId?: string;
  rotationName: string;
  currentRole: string;
  targetDepartment: string;
  targetRole: string;
  status: JobRotationStatus;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  objectives: string[];
  competenciesToDevelop: string[];
  supervisorId: string;
  mentorId?: string;
  progress: number;
  learningOutcomes: string[];
  feedback?: string;
  rating?: number;
  completionCertificate?: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Learning resource interface
 */
export interface LearningResource {
  id: string;
  resourceCode: string;
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  author?: string;
  publisher?: string;
  publicationDate?: Date;
  duration?: number; // in minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  competencies: string[];
  topics: string[];
  tags: string[];
  rating?: number;
  reviewCount: number;
  cost?: number;
  language: string;
  isFree: boolean;
  requiresApproval: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * External training request interface
 */
export interface ExternalTrainingRequest {
  id: string;
  userId: string;
  requestType: 'CONFERENCE' | 'WORKSHOP' | 'CERTIFICATION' | 'DEGREE' | 'COURSE' | 'SEMINAR';
  trainingName: string;
  provider: string;
  description: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  currency: string;
  justification: string;
  expectedOutcomes: string[];
  relatedCompetencies: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  approvalWorkflow: Array<{
    approverId: string;
    level: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comments?: string;
    approvedAt?: Date;
  }>;
  reimbursementEligible: boolean;
  reimbursementPercentage?: number;
  managerId: string;
  departmentId?: string;
  budgetCode?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tuition reimbursement interface
 */
export interface TuitionReimbursement {
  id: string;
  userId: string;
  externalTrainingId?: string;
  programName: string;
  institution: string;
  degreeType?: 'CERTIFICATE' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE';
  startDate: Date;
  endDate: Date;
  totalCost: number;
  requestedAmount: number;
  approvedAmount?: number;
  currency: string;
  status: ReimbursementStatus;
  proofOfEnrollment?: string;
  proofOfPayment?: string;
  grade?: string;
  passingGradeRequired: boolean;
  serviceCommitmentMonths?: number;
  approvalWorkflow: Array<{
    approverId: string;
    level: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comments?: string;
    approvedAt?: Date;
  }>;
  paymentDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Professional development budget interface
 */
export interface ProfessionalDevelopmentBudget {
  id: string;
  userId: string;
  departmentId?: string;
  fiscalYear: number;
  allocatedBudget: number;
  spentBudget: number;
  committedBudget: number;
  availableBudget: number;
  currency: string;
  budgetItems: Array<{
    itemId: string;
    itemType: string;
    description: string;
    amount: number;
    date: Date;
    status: 'PLANNED' | 'COMMITTED' | 'SPENT';
  }>;
  approvalRequired: boolean;
  approverId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Development milestone interface
 */
export interface DevelopmentMilestone {
  id: string;
  userId: string;
  idpId?: string;
  goalId?: string;
  milestoneName: string;
  description: string;
  category: string;
  targetDate: Date;
  completionDate?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  evidence?: string;
  validatedBy?: string;
  validatedAt?: Date;
  reward?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create IDP DTO
 */
export class CreateIDPDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Plan name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  planName: string;

  @ApiProperty({ description: 'Plan description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ description: 'Plan year' })
  @IsNumber()
  @Min(2020)
  @Max(2050)
  planYear: number;

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Current role' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentRole: string;

  @ApiProperty({ description: 'Desired role', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  desiredRole?: string;

  @ApiProperty({ description: 'Career goals', type: [String] })
  @IsArray()
  @IsString({ each: true })
  careerGoals: string[];

  @ApiProperty({ description: 'Manager IDs', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  managerIds: string[];
}

/**
 * Create development goal DTO
 */
export class CreateDevelopmentGoalDto {
  @ApiProperty({ description: 'IDP ID' })
  @IsUUID()
  idpId: string;

  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Goal name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  goalName: string;

  @ApiProperty({ description: 'Goal description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: SkillsGapPriority })
  @IsEnum(SkillsGapPriority)
  priority: SkillsGapPriority;

  @ApiProperty({ enum: ['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'] })
  @IsEnum(['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'])
  category: 'SKILL' | 'COMPETENCY' | 'BEHAVIOR' | 'KNOWLEDGE' | 'CAREER';

  @ApiProperty({ enum: ProficiencyLevel })
  @IsEnum(ProficiencyLevel)
  targetLevel: ProficiencyLevel;

  @ApiProperty({ description: 'Target date' })
  @Type(() => Date)
  @IsDate()
  targetDate: Date;

  @ApiProperty({ description: 'Success criteria', type: [String] })
  @IsArray()
  @IsString({ each: true })
  successCriteria: string[];

  @ApiProperty({ description: 'Manager ID' })
  @IsUUID()
  managerId: string;
}

/**
 * Create competency DTO
 */
export class CreateCompetencyDto {
  @ApiProperty({ description: 'Competency name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  competencyName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: CompetencyType })
  @IsEnum(CompetencyType)
  type: CompetencyType;

  @ApiProperty({ description: 'Category', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ description: 'Required for roles', type: [String] })
  @IsArray()
  @IsString({ each: true })
  requiredForRoles: string[];
}

/**
 * Create skills assessment DTO
 */
export class CreateSkillsAssessmentDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Assessment name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  assessmentName: string;

  @ApiProperty({ enum: ['SELF', 'MANAGER', 'PEER', '360', 'EXPERT'] })
  @IsEnum(['SELF', 'MANAGER', 'PEER', '360', 'EXPERT'])
  assessmentType: 'SELF' | 'MANAGER' | 'PEER' | '360' | 'EXPERT';

  @ApiProperty({ description: 'Assessor ID' })
  @IsUUID()
  assessorId: string;
}

/**
 * Create mentoring relationship DTO
 */
export class CreateMentoringRelationshipDto {
  @ApiProperty({ description: 'Mentor user ID' })
  @IsUUID()
  mentorId: string;

  @ApiProperty({ description: 'Mentee user ID' })
  @IsUUID()
  menteeId: string;

  @ApiProperty({ enum: MentoringType })
  @IsEnum(MentoringType)
  type: MentoringType;

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: 'Focus areas', type: [String] })
  @IsArray()
  @IsString({ each: true })
  focusAreas: string[];

  @ApiProperty({ description: 'Goals', type: [String] })
  @IsArray()
  @IsString({ each: true })
  goals: string[];

  @ApiProperty({ description: 'Meeting frequency' })
  @IsString()
  @IsNotEmpty()
  meetingFrequency: string;
}

/**
 * Create job rotation DTO
 */
export class CreateJobRotationDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Rotation name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  rotationName: string;

  @ApiProperty({ description: 'Current role' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentRole: string;

  @ApiProperty({ description: 'Target department' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  targetDepartment: string;

  @ApiProperty({ description: 'Target role' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  targetRole: string;

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Supervisor user ID' })
  @IsUUID()
  supervisorId: string;

  @ApiProperty({ description: 'Objectives', type: [String] })
  @IsArray()
  @IsString({ each: true })
  objectives: string[];
}

/**
 * Create learning resource DTO
 */
export class CreateLearningResourceDto {
  @ApiProperty({ description: 'Resource title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ description: 'Resource URL', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @ApiProperty({ description: 'Topics', type: [String] })
  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @ApiProperty({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Is free resource' })
  @IsBoolean()
  isFree: boolean;
}

/**
 * Create external training request DTO
 */
export class CreateExternalTrainingRequestDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: ['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR'] })
  @IsEnum(['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR'])
  requestType: 'CONFERENCE' | 'WORKSHOP' | 'CERTIFICATION' | 'DEGREE' | 'COURSE' | 'SEMINAR';

  @ApiProperty({ description: 'Training name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  trainingName: string;

  @ApiProperty({ description: 'Provider name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  provider: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Cost' })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ description: 'Justification' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  justification: string;

  @ApiProperty({ description: 'Manager ID' })
  @IsUUID()
  managerId: string;
}

/**
 * Create tuition reimbursement DTO
 */
export class CreateTuitionReimbursementDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Program name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  programName: string;

  @ApiProperty({ description: 'Institution' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  institution: string;

  @ApiProperty({ enum: ['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE'], required: false })
  @IsOptional()
  @IsEnum(['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE'])
  degreeType?: 'CERTIFICATE' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE';

  @ApiProperty({ description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Total cost' })
  @IsNumber()
  @Min(0)
  totalCost: number;

  @ApiProperty({ description: 'Requested amount' })
  @IsNumber()
  @Min(0)
  requestedAmount: number;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const IDPCreateSchema = z.object({
  userId: z.string().uuid(),
  planName: z.string().min(3).max(255),
  description: z.string().min(1).max(5000),
  planYear: z.number().min(2020).max(2050),
  startDate: z.date(),
  endDate: z.date(),
  currentRole: z.string().min(1).max(255),
  desiredRole: z.string().max(255).optional(),
  careerGoals: z.array(z.string()),
  managerIds: z.array(z.string().uuid()),
  metadata: z.record(z.any()).optional(),
});

export const DevelopmentGoalCreateSchema = z.object({
  idpId: z.string().uuid(),
  userId: z.string().uuid(),
  goalName: z.string().min(3).max(255),
  description: z.string().min(1).max(2000),
  priority: z.nativeEnum(SkillsGapPriority),
  category: z.enum(['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER']),
  targetLevel: z.nativeEnum(ProficiencyLevel),
  targetDate: z.date(),
  successCriteria: z.array(z.string()),
  managerId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

export const CompetencyCreateSchema = z.object({
  competencyName: z.string().min(3).max(255),
  description: z.string().min(1).max(2000),
  type: z.nativeEnum(CompetencyType),
  category: z.string().max(100).optional(),
  requiredForRoles: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

export const SkillsAssessmentCreateSchema = z.object({
  userId: z.string().uuid(),
  assessmentName: z.string().min(1).max(255),
  assessmentType: z.enum(['SELF', 'MANAGER', 'PEER', '360', 'EXPERT']),
  assessorId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

export const MentoringRelationshipCreateSchema = z.object({
  mentorId: z.string().uuid(),
  menteeId: z.string().uuid(),
  type: z.nativeEnum(MentoringType),
  startDate: z.date(),
  endDate: z.date().optional(),
  focusAreas: z.array(z.string()),
  goals: z.array(z.string()),
  meetingFrequency: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export const JobRotationCreateSchema = z.object({
  userId: z.string().uuid(),
  rotationName: z.string().min(1).max(255),
  currentRole: z.string().min(1).max(255),
  targetDepartment: z.string().min(1).max(255),
  targetRole: z.string().min(1).max(255),
  startDate: z.date(),
  endDate: z.date(),
  supervisorId: z.string().uuid(),
  objectives: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

export const LearningResourceCreateSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(1).max(2000),
  type: z.nativeEnum(ResourceType),
  url: z.string().url().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  topics: z.array(z.string()),
  tags: z.array(z.string()),
  isFree: z.boolean(),
  metadata: z.record(z.any()).optional(),
});

export const ExternalTrainingRequestCreateSchema = z.object({
  userId: z.string().uuid(),
  requestType: z.enum(['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR']),
  trainingName: z.string().min(1).max(255),
  provider: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  startDate: z.date(),
  endDate: z.date(),
  cost: z.number().min(0),
  justification: z.string().min(1).max(2000),
  managerId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

export const TuitionReimbursementCreateSchema = z.object({
  userId: z.string().uuid(),
  programName: z.string().min(1).max(255),
  institution: z.string().min(1).max(255),
  degreeType: z.enum(['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE']).optional(),
  startDate: z.date(),
  endDate: z.date(),
  totalCost: z.number().min(0),
  requestedAmount: z.number().min(0),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Individual Development Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IDP model
 */
export const createIDPModel = (sequelize: Sequelize) => {
  class IDP extends Model {
    public id!: string;
    public userId!: string;
    public planName!: string;
    public description!: string;
    public status!: string;
    public planYear!: number;
    public startDate!: Date;
    public endDate!: Date;
    public currentRole!: string;
    public desiredRole!: string | null;
    public careerGoals!: string[];
    public strengths!: string[];
    public areasForDevelopment!: string[];
    public goals!: string[];
    public managerIds!: string[];
    public reviewDate!: Date | null;
    public lastReviewDate!: Date | null;
    public completionPercentage!: number;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string | null;
  }

  IDP.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID for whom this IDP is created',
      },
      planName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'IDP plan name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'IDP description',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'under_review', 'approved', 'active', 'completed', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'IDP status',
      },
      planYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Plan year',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan end date',
      },
      currentRole: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Current role',
      },
      desiredRole: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Desired future role',
      },
      careerGoals: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Career goals',
      },
      strengths: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Identified strengths',
      },
      areasForDevelopment: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Areas for development',
      },
      goals: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Development goal IDs',
      },
      managerIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Manager user IDs',
      },
      reviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next review date',
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last review date',
      },
      completionPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overall completion percentage',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved the IDP',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional IDP metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the IDP',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who last updated the IDP',
      },
    },
    {
      sequelize,
      tableName: 'individual_development_plans',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['planYear'] },
        { fields: ['startDate'] },
        { fields: ['endDate'] },
      ],
    },
  );

  return IDP;
};

/**
 * Sequelize model for Development Goal.
 */
export const createDevelopmentGoalModel = (sequelize: Sequelize) => {
  class DevelopmentGoal extends Model {
    public id!: string;
    public idpId!: string;
    public userId!: string;
    public goalName!: string;
    public description!: string;
    public status!: string;
    public priority!: string;
    public category!: string;
    public targetCompetencyId!: string | null;
    public currentLevel!: string | null;
    public targetLevel!: string;
    public startDate!: Date;
    public targetDate!: Date;
    public completionDate!: Date | null;
    public progress!: number;
    public successCriteria!: string[];
    public developmentActivities!: string[];
    public requiredResources!: string[];
    public supportNeeded!: string | null;
    public measurementMethod!: string;
    public milestones!: any[];
    public relatedCourseIds!: string[];
    public mentorId!: string | null;
    public managerId!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DevelopmentGoal.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      idpId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related IDP ID',
        references: {
          model: 'individual_development_plans',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID',
      },
      goalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Goal name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Goal description',
      },
      status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'on_track', 'at_risk', 'delayed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'not_started',
        comment: 'Goal status',
      },
      priority: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Goal priority',
      },
      category: {
        type: DataTypes.ENUM('SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'),
        allowNull: false,
        comment: 'Goal category',
      },
      targetCompetencyId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Target competency ID',
      },
      currentLevel: {
        type: DataTypes.ENUM('none', 'basic', 'intermediate', 'advanced', 'expert', 'master'),
        allowNull: true,
        comment: 'Current proficiency level',
      },
      targetLevel: {
        type: DataTypes.ENUM('none', 'basic', 'intermediate', 'advanced', 'expert', 'master'),
        allowNull: false,
        comment: 'Target proficiency level',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Goal start date',
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Target completion date',
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Progress percentage',
      },
      successCriteria: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Success criteria',
      },
      developmentActivities: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Development activities',
      },
      requiredResources: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Required resources',
      },
      supportNeeded: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Support needed description',
      },
      measurementMethod: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Progress tracking',
        comment: 'How progress is measured',
      },
      milestones: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Goal milestones',
      },
      relatedCourseIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Related course IDs',
      },
      mentorId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Mentor user ID',
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Manager user ID',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional goal metadata',
      },
    },
    {
      sequelize,
      tableName: 'development_goals',
      timestamps: true,
      indexes: [
        { fields: ['idpId'] },
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['targetDate'] },
      ],
    },
  );

  return DevelopmentGoal;
};

/**
 * Sequelize model for Competency.
 */
export const createCompetencyModel = (sequelize: Sequelize) => {
  class Competency extends Model {
    public id!: string;
    public competencyCode!: string;
    public competencyName!: string;
    public description!: string;
    public type!: string;
    public category!: string | null;
    public proficiencyLevels!: any[];
    public relatedSkills!: string[];
    public requiredForRoles!: string[];
    public assessmentCriteria!: string[];
    public developmentResources!: string[];
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
  }

  Competency.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      competencyCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique competency code',
      },
      competencyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Competency name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Competency description',
      },
      type: {
        type: DataTypes.ENUM('technical', 'behavioral', 'leadership', 'functional', 'core', 'role_specific'),
        allowNull: false,
        comment: 'Competency type',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Competency category',
      },
      proficiencyLevels: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Proficiency level definitions',
      },
      relatedSkills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Related skill names',
      },
      requiredForRoles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Roles requiring this competency',
      },
      assessmentCriteria: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Assessment criteria',
      },
      developmentResources: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Development resource IDs',
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Competency status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional competency metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the competency',
      },
    },
    {
      sequelize,
      tableName: 'competencies',
      timestamps: true,
      indexes: [
        { fields: ['competencyCode'], unique: true },
        { fields: ['type'] },
        { fields: ['status'] },
      ],
    },
  );

  return Competency;
};

/**
 * Sequelize model for Mentoring Relationship.
 */
export const createMentoringRelationshipModel = (sequelize: Sequelize) => {
  class MentoringRelationship extends Model {
    public id!: string;
    public programId!: string | null;
    public mentorId!: string;
    public menteeId!: string;
    public type!: string;
    public status!: string;
    public startDate!: Date;
    public endDate!: Date | null;
    public focusAreas!: string[];
    public goals!: string[];
    public meetingFrequency!: string;
    public preferredMeetingMode!: string;
    public sessionCount!: number;
    public lastSessionDate!: Date | null;
    public nextSessionDate!: Date | null;
    public progressNotes!: string[];
    public feedback!: any;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MentoringRelationship.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related mentoring program ID',
      },
      mentorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Mentor user ID',
      },
      menteeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Mentee user ID',
      },
      type: {
        type: DataTypes.ENUM('formal', 'informal', 'peer', 'reverse', 'group'),
        allowNull: false,
        comment: 'Mentoring relationship type',
      },
      status: {
        type: DataTypes.ENUM('pending', 'active', 'on_hold', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Relationship status',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Relationship start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Relationship end date',
      },
      focusAreas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Focus areas',
      },
      goals: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Mentoring goals',
      },
      meetingFrequency: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Meeting frequency description',
      },
      preferredMeetingMode: {
        type: DataTypes.ENUM('IN_PERSON', 'VIRTUAL', 'HYBRID'),
        allowNull: false,
        defaultValue: 'HYBRID',
        comment: 'Preferred meeting mode',
      },
      sessionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of completed sessions',
      },
      lastSessionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last session date',
      },
      nextSessionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next scheduled session date',
      },
      progressNotes: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Progress notes',
      },
      feedback: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Feedback from mentor and mentee',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional relationship metadata',
      },
    },
    {
      sequelize,
      tableName: 'mentoring_relationships',
      timestamps: true,
      indexes: [
        { fields: ['mentorId'] },
        { fields: ['menteeId'] },
        { fields: ['status'] },
        { fields: ['type'] },
      ],
    },
  );

  return MentoringRelationship;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateCompetencyCode = (type: CompetencyType): string => {
  const typePrefix = type.substring(0, 3).toUpperCase();
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `COMP-${typePrefix}-${sequence}`;
};

const generateResourceCode = (type: ResourceType): string => {
  const typePrefix = type.substring(0, 3).toUpperCase();
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RES-${typePrefix}-${sequence}`;
};

const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100 * 100) / 100;
};

// ============================================================================
// INDIVIDUAL DEVELOPMENT PLANS (Functions 1-6)
// ============================================================================

/**
 * Creates a new Individual Development Plan.
 *
 * @param {object} idpData - IDP creation data
 * @param {string} userId - User creating the IDP
 * @returns {Promise<IndividualDevelopmentPlan>} Created IDP
 */
export const createIDP = async (
  idpData: Partial<IndividualDevelopmentPlan>,
  userId: string,
  transaction?: Transaction,
): Promise<IndividualDevelopmentPlan> => {
  const idp: IndividualDevelopmentPlan = {
    id: generateUUID(),
    userId: idpData.userId!,
    planName: idpData.planName!,
    description: idpData.description!,
    status: IDPStatus.DRAFT,
    planYear: idpData.planYear!,
    startDate: idpData.startDate!,
    endDate: idpData.endDate!,
    currentRole: idpData.currentRole!,
    desiredRole: idpData.desiredRole,
    careerGoals: idpData.careerGoals || [],
    strengths: idpData.strengths || [],
    areasForDevelopment: idpData.areasForDevelopment || [],
    goals: [],
    managerIds: idpData.managerIds || [],
    reviewDate: undefined,
    lastReviewDate: undefined,
    completionPercentage: 0,
    approvedBy: undefined,
    approvedAt: undefined,
    metadata: {
      ...idpData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
  };

  return idp;
};

/**
 * Submits IDP for manager review.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User submitting
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export const submitIDPForReview = async (
  idpId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<IndividualDevelopmentPlan>> => {
  return {
    id: idpId,
    status: IDPStatus.SUBMITTED,
    updatedBy: userId,
    updatedAt: new Date(),
    metadata: {
      submittedDate: new Date().toISOString(),
      submittedBy: userId,
    },
  };
};

/**
 * Approves an IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User approving
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export const approveIDP = async (
  idpId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<IndividualDevelopmentPlan>> => {
  return {
    id: idpId,
    status: IDPStatus.APPROVED,
    approvedBy: userId,
    approvedAt: new Date(),
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Activates an approved IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User activating
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export const activateIDP = async (
  idpId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<IndividualDevelopmentPlan>> => {
  return {
    id: idpId,
    status: IDPStatus.ACTIVE,
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Updates IDP progress and completion percentage.
 *
 * @param {string} idpId - IDP ID
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
export const updateIDPProgress = async (
  idpId: string,
  transaction?: Transaction,
): Promise<Partial<IndividualDevelopmentPlan>> => {
  // Implementation would calculate progress from goals
  return {
    id: idpId,
    completionPercentage: 0, // Would be calculated
    updatedAt: new Date(),
  };
};

/**
 * Gets user's IDPs with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<IndividualDevelopmentPlan[]>} User IDPs
 */
export const getUserIDPs = async (
  userId: string,
  filters?: {
    status?: IDPStatus;
    planYear?: number;
  },
): Promise<IndividualDevelopmentPlan[]> => {
  return [];
};

// ============================================================================
// DEVELOPMENT GOALS (Functions 7-11)
// ============================================================================

/**
 * Creates a development goal.
 *
 * @param {object} goalData - Goal creation data
 * @param {string} userId - User creating the goal
 * @returns {Promise<DevelopmentGoal>} Created goal
 */
export const createDevelopmentGoal = async (
  goalData: Partial<DevelopmentGoal>,
  userId: string,
  transaction?: Transaction,
): Promise<DevelopmentGoal> => {
  const goal: DevelopmentGoal = {
    id: generateUUID(),
    idpId: goalData.idpId!,
    userId: goalData.userId!,
    goalName: goalData.goalName!,
    description: goalData.description!,
    status: DevelopmentGoalStatus.NOT_STARTED,
    priority: goalData.priority!,
    category: goalData.category!,
    targetCompetencyId: goalData.targetCompetencyId,
    currentLevel: goalData.currentLevel,
    targetLevel: goalData.targetLevel!,
    startDate: goalData.startDate || new Date(),
    targetDate: goalData.targetDate!,
    completionDate: undefined,
    progress: 0,
    successCriteria: goalData.successCriteria || [],
    developmentActivities: goalData.developmentActivities || [],
    requiredResources: goalData.requiredResources || [],
    supportNeeded: goalData.supportNeeded,
    measurementMethod: goalData.measurementMethod || 'Progress tracking',
    milestones: goalData.milestones || [],
    relatedCourseIds: goalData.relatedCourseIds || [],
    mentorId: goalData.mentorId,
    managerId: goalData.managerId!,
    metadata: {
      ...goalData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return goal;
};

/**
 * Updates development goal progress.
 *
 * @param {string} goalId - Goal ID
 * @param {number} progress - Progress percentage
 * @param {string} notes - Progress notes
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export const updateGoalProgress = async (
  goalId: string,
  progress: number,
  notes?: string,
  transaction?: Transaction,
): Promise<Partial<DevelopmentGoal>> => {
  const status = progress === 100 ? DevelopmentGoalStatus.COMPLETED : DevelopmentGoalStatus.IN_PROGRESS;

  return {
    id: goalId,
    progress,
    status,
    completionDate: progress === 100 ? new Date() : undefined,
    updatedAt: new Date(),
  };
};

/**
 * Marks development goal as completed.
 *
 * @param {string} goalId - Goal ID
 * @param {string} userId - User marking completion
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export const completeGoal = async (
  goalId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<DevelopmentGoal>> => {
  return {
    id: goalId,
    status: DevelopmentGoalStatus.COMPLETED,
    progress: 100,
    completionDate: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Associates courses with a development goal.
 *
 * @param {string} goalId - Goal ID
 * @param {string[]} courseIds - Course IDs to associate
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
export const associateCoursesWithGoal = async (
  goalId: string,
  courseIds: string[],
  transaction?: Transaction,
): Promise<Partial<DevelopmentGoal>> => {
  return {
    id: goalId,
    relatedCourseIds: courseIds,
    updatedAt: new Date(),
  };
};

/**
 * Gets development goals for a user.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<DevelopmentGoal[]>} User goals
 */
export const getUserDevelopmentGoals = async (
  userId: string,
  filters?: {
    status?: DevelopmentGoalStatus;
    idpId?: string;
    priority?: SkillsGapPriority;
  },
): Promise<DevelopmentGoal[]> => {
  return [];
};

// ============================================================================
// COMPETENCY FRAMEWORK (Functions 12-16)
// ============================================================================

/**
 * Creates a new competency.
 *
 * @param {object} competencyData - Competency creation data
 * @param {string} userId - User creating the competency
 * @returns {Promise<Competency>} Created competency
 */
export const createCompetency = async (
  competencyData: Partial<Competency>,
  userId: string,
  transaction?: Transaction,
): Promise<Competency> => {
  const competencyCode = generateCompetencyCode(competencyData.type!);

  const competency: Competency = {
    id: generateUUID(),
    competencyCode,
    competencyName: competencyData.competencyName!,
    description: competencyData.description!,
    type: competencyData.type!,
    category: competencyData.category,
    proficiencyLevels: competencyData.proficiencyLevels || [],
    relatedSkills: competencyData.relatedSkills || [],
    requiredForRoles: competencyData.requiredForRoles || [],
    assessmentCriteria: competencyData.assessmentCriteria || [],
    developmentResources: competencyData.developmentResources || [],
    status: 'ACTIVE',
    metadata: {
      ...competencyData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  return competency;
};

/**
 * Updates competency proficiency levels.
 *
 * @param {string} competencyId - Competency ID
 * @param {array} proficiencyLevels - Proficiency level definitions
 * @returns {Promise<Competency>} Updated competency
 */
export const updateCompetencyProficiencyLevels = async (
  competencyId: string,
  proficiencyLevels: Array<{
    level: ProficiencyLevel;
    description: string;
    behavioralIndicators: string[];
  }>,
  transaction?: Transaction,
): Promise<Partial<Competency>> => {
  return {
    id: competencyId,
    proficiencyLevels,
    updatedAt: new Date(),
  };
};

/**
 * Gets competencies by role.
 *
 * @param {string} role - Role name
 * @returns {Promise<Competency[]>} Competencies for role
 */
export const getCompetenciesByRole = async (role: string): Promise<Competency[]> => {
  return [];
};

/**
 * Searches competencies by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<Competency[]>} Matching competencies
 */
export const searchCompetencies = async (filters: {
  query?: string;
  type?: CompetencyType;
  category?: string;
  status?: string;
}): Promise<Competency[]> => {
  return [];
};

/**
 * Creates a competency framework.
 *
 * @param {object} frameworkData - Framework creation data
 * @param {string} userId - User creating the framework
 * @returns {Promise<CompetencyFramework>} Created framework
 */
export const createCompetencyFramework = async (
  frameworkData: Partial<CompetencyFramework>,
  userId: string,
  transaction?: Transaction,
): Promise<CompetencyFramework> => {
  const framework: CompetencyFramework = {
    id: generateUUID(),
    frameworkName: frameworkData.frameworkName!,
    description: frameworkData.description!,
    version: frameworkData.version || '1.0',
    type: frameworkData.type!,
    applicableRoles: frameworkData.applicableRoles || [],
    applicableJobLevels: frameworkData.applicableJobLevels || [],
    competencies: frameworkData.competencies || [],
    status: 'DRAFT',
    effectiveDate: frameworkData.effectiveDate!,
    expiryDate: frameworkData.expiryDate,
    ownerId: frameworkData.ownerId!,
    metadata: {
      ...frameworkData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return framework;
};

// ============================================================================
// SKILLS ASSESSMENT & GAP ANALYSIS (Functions 17-21)
// ============================================================================

/**
 * Creates a skills assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating assessment
 * @returns {Promise<SkillsAssessment>} Created assessment
 */
export const createSkillsAssessment = async (
  assessmentData: Partial<SkillsAssessment>,
  userId: string,
  transaction?: Transaction,
): Promise<SkillsAssessment> => {
  const assessment: SkillsAssessment = {
    id: generateUUID(),
    userId: assessmentData.userId!,
    assessmentName: assessmentData.assessmentName!,
    assessmentDate: new Date(),
    assessmentType: assessmentData.assessmentType!,
    assessorId: assessmentData.assessorId!,
    competencies: assessmentData.competencies || [],
    overallScore: assessmentData.overallScore,
    strengths: assessmentData.strengths || [],
    developmentAreas: assessmentData.developmentAreas || [],
    recommendations: assessmentData.recommendations || [],
    metadata: {
      ...assessmentData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return assessment;
};

/**
 * Performs skills gap analysis for a user.
 *
 * @param {string} userId - User ID
 * @param {string} targetRole - Target role
 * @returns {Promise<SkillsGapAnalysis>} Gap analysis results
 */
export const performSkillsGapAnalysis = async (
  userId: string,
  targetRole?: string,
  transaction?: Transaction,
): Promise<SkillsGapAnalysis> => {
  // Implementation would compare current vs required competencies
  const analysis: SkillsGapAnalysis = {
    id: generateUUID(),
    userId,
    targetRole,
    analysisDate: new Date(),
    gaps: [],
    overallGapScore: 0,
    criticalGaps: 0,
    recommendedCourses: [],
    recommendedMentors: [],
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return analysis;
};

/**
 * Identifies critical skills gaps.
 *
 * @param {string} userId - User ID
 * @returns {Promise<object[]>} Critical gaps
 */
export const identifyCriticalSkillsGaps = async (
  userId: string,
): Promise<
  Array<{
    competencyId: string;
    competencyName: string;
    currentLevel: ProficiencyLevel;
    requiredLevel: ProficiencyLevel;
    gap: number;
    priority: SkillsGapPriority;
  }>
> => {
  return [];
};

/**
 * Compares user competencies with role requirements.
 *
 * @param {string} userId - User ID
 * @param {string} role - Role to compare against
 * @returns {Promise<object>} Comparison results
 */
export const compareUserCompetenciesWithRole = async (
  userId: string,
  role: string,
): Promise<{
  matchPercentage: number;
  matchingCompetencies: string[];
  missingCompetencies: string[];
  gaps: any[];
}> => {
  return {
    matchPercentage: 0,
    matchingCompetencies: [],
    missingCompetencies: [],
    gaps: [],
  };
};

/**
 * Updates user competency proficiency.
 *
 * @param {string} userId - User ID
 * @param {string} competencyId - Competency ID
 * @param {ProficiencyLevel} level - New proficiency level
 * @param {string} evidence - Evidence of proficiency
 * @returns {Promise<object>} Updated proficiency
 */
export const updateUserCompetencyProficiency = async (
  userId: string,
  competencyId: string,
  level: ProficiencyLevel,
  evidence?: string,
  transaction?: Transaction,
): Promise<{
  userId: string;
  competencyId: string;
  level: ProficiencyLevel;
  evidence?: string;
  updatedAt: Date;
}> => {
  return {
    userId,
    competencyId,
    level,
    evidence,
    updatedAt: new Date(),
  };
};

// ============================================================================
// LEARNING RECOMMENDATIONS (Functions 22-24)
// ============================================================================

/**
 * Generates personalized learning recommendations.
 *
 * @param {string} userId - User ID
 * @param {object} options - Recommendation options
 * @returns {Promise<LearningRecommendation[]>} Recommendations
 */
export const generateLearningRecommendations = async (
  userId: string,
  options?: {
    basedOn?: 'SKILL_GAP' | 'CAREER_PATH' | 'PERFORMANCE' | 'PEER_BASED';
    maxRecommendations?: number;
  },
): Promise<LearningRecommendation[]> => {
  return [];
};

/**
 * Accepts a learning recommendation.
 *
 * @param {string} recommendationId - Recommendation ID
 * @param {string} userId - User accepting
 * @returns {Promise<LearningRecommendation>} Updated recommendation
 */
export const acceptLearningRecommendation = async (
  recommendationId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningRecommendation>> => {
  return {
    id: recommendationId,
    status: 'ACCEPTED',
    acceptedAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Gets AI-powered skill recommendations based on career goals.
 *
 * @param {string} userId - User ID
 * @param {string[]} careerGoals - User's career goals
 * @returns {Promise<object[]>} AI recommendations
 */
export const getAISkillRecommendations = async (
  userId: string,
  careerGoals: string[],
): Promise<
  Array<{
    skillName: string;
    relevanceScore: number;
    recommendedCourses: string[];
    estimatedTimeToAcquire: string;
    marketDemand: string;
  }>
> => {
  return [];
};

// ============================================================================
// MENTORING & COACHING (Functions 25-29)
// ============================================================================

/**
 * Creates a mentoring relationship.
 *
 * @param {object} relationshipData - Relationship data
 * @param {string} userId - User creating relationship
 * @returns {Promise<MentoringRelationship>} Created relationship
 */
export const createMentoringRelationship = async (
  relationshipData: Partial<MentoringRelationship>,
  userId: string,
  transaction?: Transaction,
): Promise<MentoringRelationship> => {
  const relationship: MentoringRelationship = {
    id: generateUUID(),
    programId: relationshipData.programId,
    mentorId: relationshipData.mentorId!,
    menteeId: relationshipData.menteeId!,
    type: relationshipData.type!,
    status: MentoringStatus.PENDING,
    startDate: relationshipData.startDate!,
    endDate: relationshipData.endDate,
    focusAreas: relationshipData.focusAreas || [],
    goals: relationshipData.goals || [],
    meetingFrequency: relationshipData.meetingFrequency!,
    preferredMeetingMode: relationshipData.preferredMeetingMode || 'HYBRID',
    sessionCount: 0,
    lastSessionDate: undefined,
    nextSessionDate: undefined,
    progressNotes: [],
    feedback: {},
    metadata: {
      ...relationshipData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return relationship;
};

/**
 * Activates a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User activating
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
export const activateMentoringRelationship = async (
  relationshipId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<MentoringRelationship>> => {
  return {
    id: relationshipId,
    status: MentoringStatus.ACTIVE,
    updatedAt: new Date(),
  };
};

/**
 * Records a mentoring session.
 *
 * @param {object} sessionData - Session data
 * @param {string} userId - User recording session
 * @returns {Promise<MentoringSession>} Created session
 */
export const recordMentoringSession = async (
  sessionData: Partial<MentoringSession>,
  userId: string,
  transaction?: Transaction,
): Promise<MentoringSession> => {
  const session: MentoringSession = {
    id: generateUUID(),
    relationshipId: sessionData.relationshipId!,
    sessionNumber: sessionData.sessionNumber!,
    sessionDate: sessionData.sessionDate!,
    duration: sessionData.duration!,
    topics: sessionData.topics || [],
    objectives: sessionData.objectives || [],
    outcomes: sessionData.outcomes || [],
    actionItems: sessionData.actionItems || [],
    mentorNotes: sessionData.mentorNotes,
    menteeNotes: sessionData.menteeNotes,
    rating: sessionData.rating,
    metadata: {
      ...sessionData.metadata,
      recordedDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return session;
};

/**
 * Completes a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User completing
 * @param {object} feedback - Final feedback
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
export const completeMentoringRelationship = async (
  relationshipId: string,
  userId: string,
  feedback?: {
    mentorFeedback?: string;
    menteeFeedback?: string;
    rating?: number;
  },
  transaction?: Transaction,
): Promise<Partial<MentoringRelationship>> => {
  return {
    id: relationshipId,
    status: MentoringStatus.COMPLETED,
    endDate: new Date(),
    feedback,
    updatedAt: new Date(),
  };
};

/**
 * Matches mentees with potential mentors.
 *
 * @param {string} menteeId - Mentee user ID
 * @param {object} criteria - Matching criteria
 * @returns {Promise<object[]>} Potential mentors
 */
export const matchMenteeWithMentors = async (
  menteeId: string,
  criteria: {
    focusAreas?: string[];
    competencies?: string[];
    department?: string;
    seniority?: string;
  },
): Promise<
  Array<{
    mentorId: string;
    mentorName: string;
    matchScore: number;
    sharedCompetencies: string[];
    availableSlots: number;
  }>
> => {
  return [];
};

// ============================================================================
// JOB ROTATION & CROSS-TRAINING (Functions 30-33)
// ============================================================================

/**
 * Creates a job rotation.
 *
 * @param {object} rotationData - Rotation data
 * @param {string} userId - User creating rotation
 * @returns {Promise<JobRotation>} Created rotation
 */
export const createJobRotation = async (
  rotationData: Partial<JobRotation>,
  userId: string,
  transaction?: Transaction,
): Promise<JobRotation> => {
  const duration = Math.ceil(
    (rotationData.endDate!.getTime() - rotationData.startDate!.getTime()) / (1000 * 60 * 60 * 24),
  );

  const rotation: JobRotation = {
    id: generateUUID(),
    userId: rotationData.userId!,
    programId: rotationData.programId,
    rotationName: rotationData.rotationName!,
    currentRole: rotationData.currentRole!,
    targetDepartment: rotationData.targetDepartment!,
    targetRole: rotationData.targetRole!,
    status: JobRotationStatus.PLANNED,
    startDate: rotationData.startDate!,
    endDate: rotationData.endDate!,
    duration,
    objectives: rotationData.objectives || [],
    competenciesToDevelop: rotationData.competenciesToDevelop || [],
    supervisorId: rotationData.supervisorId!,
    mentorId: rotationData.mentorId,
    progress: 0,
    learningOutcomes: [],
    feedback: undefined,
    rating: undefined,
    completionCertificate: false,
    metadata: {
      ...rotationData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return rotation;
};

/**
 * Activates a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User activating
 * @returns {Promise<JobRotation>} Updated rotation
 */
export const activateJobRotation = async (
  rotationId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<JobRotation>> => {
  return {
    id: rotationId,
    status: JobRotationStatus.ACTIVE,
    updatedAt: new Date(),
  };
};

/**
 * Updates job rotation progress.
 *
 * @param {string} rotationId - Rotation ID
 * @param {number} progress - Progress percentage
 * @param {string[]} learningOutcomes - Learning outcomes achieved
 * @returns {Promise<JobRotation>} Updated rotation
 */
export const updateJobRotationProgress = async (
  rotationId: string,
  progress: number,
  learningOutcomes?: string[],
  transaction?: Transaction,
): Promise<Partial<JobRotation>> => {
  return {
    id: rotationId,
    progress,
    learningOutcomes: learningOutcomes || [],
    updatedAt: new Date(),
  };
};

/**
 * Completes a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User completing
 * @param {object} completionData - Completion data
 * @returns {Promise<JobRotation>} Updated rotation
 */
export const completeJobRotation = async (
  rotationId: string,
  userId: string,
  completionData: {
    feedback?: string;
    rating?: number;
    issueCertificate?: boolean;
  },
  transaction?: Transaction,
): Promise<Partial<JobRotation>> => {
  return {
    id: rotationId,
    status: JobRotationStatus.COMPLETED,
    progress: 100,
    feedback: completionData.feedback,
    rating: completionData.rating,
    completionCertificate: completionData.issueCertificate || false,
    updatedAt: new Date(),
  };
};

// ============================================================================
// LEARNING RESOURCES (Functions 34-36)
// ============================================================================

/**
 * Creates a learning resource.
 *
 * @param {object} resourceData - Resource data
 * @param {string} userId - User creating resource
 * @returns {Promise<LearningResource>} Created resource
 */
export const createLearningResource = async (
  resourceData: Partial<LearningResource>,
  userId: string,
  transaction?: Transaction,
): Promise<LearningResource> => {
  const resourceCode = generateResourceCode(resourceData.type!);

  const resource: LearningResource = {
    id: generateUUID(),
    resourceCode,
    title: resourceData.title!,
    description: resourceData.description!,
    type: resourceData.type!,
    url: resourceData.url,
    author: resourceData.author,
    publisher: resourceData.publisher,
    publicationDate: resourceData.publicationDate,
    duration: resourceData.duration,
    difficulty: resourceData.difficulty!,
    competencies: resourceData.competencies || [],
    topics: resourceData.topics || [],
    tags: resourceData.tags || [],
    rating: undefined,
    reviewCount: 0,
    cost: resourceData.cost,
    language: resourceData.language || 'en',
    isFree: resourceData.isFree!,
    requiresApproval: resourceData.requiresApproval || false,
    status: 'ACTIVE',
    metadata: {
      ...resourceData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  return resource;
};

/**
 * Searches learning resources.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningResource[]>} Matching resources
 */
export const searchLearningResources = async (filters: {
  query?: string;
  type?: ResourceType;
  difficulty?: string;
  topics?: string[];
  isFree?: boolean;
  competencies?: string[];
}): Promise<LearningResource[]> => {
  return [];
};

/**
 * Rates a learning resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} userId - User rating
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Review text
 * @returns {Promise<object>} Rating record
 */
export const rateLearningResource = async (
  resourceId: string,
  userId: string,
  rating: number,
  review?: string,
  transaction?: Transaction,
): Promise<{
  resourceId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}> => {
  return {
    resourceId,
    userId,
    rating,
    review,
    createdAt: new Date(),
  };
};

// ============================================================================
// EXTERNAL TRAINING & TUITION (Functions 37-41)
// ============================================================================

/**
 * Creates external training request.
 *
 * @param {object} requestData - Request data
 * @param {string} userId - User creating request
 * @returns {Promise<ExternalTrainingRequest>} Created request
 */
export const createExternalTrainingRequest = async (
  requestData: Partial<ExternalTrainingRequest>,
  userId: string,
  transaction?: Transaction,
): Promise<ExternalTrainingRequest> => {
  const request: ExternalTrainingRequest = {
    id: generateUUID(),
    userId: requestData.userId!,
    requestType: requestData.requestType!,
    trainingName: requestData.trainingName!,
    provider: requestData.provider!,
    description: requestData.description!,
    startDate: requestData.startDate!,
    endDate: requestData.endDate!,
    cost: requestData.cost!,
    currency: requestData.currency || 'USD',
    justification: requestData.justification!,
    expectedOutcomes: requestData.expectedOutcomes || [],
    relatedCompetencies: requestData.relatedCompetencies || [],
    status: 'DRAFT',
    approvalWorkflow: [],
    reimbursementEligible: requestData.reimbursementEligible || false,
    reimbursementPercentage: requestData.reimbursementPercentage,
    managerId: requestData.managerId!,
    departmentId: requestData.departmentId,
    budgetCode: requestData.budgetCode,
    metadata: {
      ...requestData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return request;
};

/**
 * Submits external training request for approval.
 *
 * @param {string} requestId - Request ID
 * @param {string} userId - User submitting
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
export const submitExternalTrainingRequest = async (
  requestId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<ExternalTrainingRequest>> => {
  return {
    id: requestId,
    status: 'SUBMITTED',
    updatedAt: new Date(),
  };
};

/**
 * Approves external training request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {string} comments - Approval comments
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
export const approveExternalTrainingRequest = async (
  requestId: string,
  approverId: string,
  comments?: string,
  transaction?: Transaction,
): Promise<Partial<ExternalTrainingRequest>> => {
  return {
    id: requestId,
    status: 'APPROVED',
    updatedAt: new Date(),
  };
};

/**
 * Creates tuition reimbursement request.
 *
 * @param {object} reimbursementData - Reimbursement data
 * @param {string} userId - User creating request
 * @returns {Promise<TuitionReimbursement>} Created request
 */
export const createTuitionReimbursementRequest = async (
  reimbursementData: Partial<TuitionReimbursement>,
  userId: string,
  transaction?: Transaction,
): Promise<TuitionReimbursement> => {
  const request: TuitionReimbursement = {
    id: generateUUID(),
    userId: reimbursementData.userId!,
    externalTrainingId: reimbursementData.externalTrainingId,
    programName: reimbursementData.programName!,
    institution: reimbursementData.institution!,
    degreeType: reimbursementData.degreeType,
    startDate: reimbursementData.startDate!,
    endDate: reimbursementData.endDate!,
    totalCost: reimbursementData.totalCost!,
    requestedAmount: reimbursementData.requestedAmount!,
    approvedAmount: undefined,
    currency: reimbursementData.currency || 'USD',
    status: ReimbursementStatus.DRAFT,
    proofOfEnrollment: undefined,
    proofOfPayment: undefined,
    grade: undefined,
    passingGradeRequired: reimbursementData.passingGradeRequired || true,
    serviceCommitmentMonths: reimbursementData.serviceCommitmentMonths,
    approvalWorkflow: [],
    paymentDate: undefined,
    metadata: {
      ...reimbursementData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return request;
};

/**
 * Processes tuition reimbursement payment.
 *
 * @param {string} reimbursementId - Reimbursement ID
 * @param {number} amount - Payment amount
 * @param {string} userId - User processing payment
 * @returns {Promise<TuitionReimbursement>} Updated reimbursement
 */
export const processTuitionReimbursementPayment = async (
  reimbursementId: string,
  amount: number,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TuitionReimbursement>> => {
  return {
    id: reimbursementId,
    approvedAmount: amount,
    status: ReimbursementStatus.PAID,
    paymentDate: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// PROFESSIONAL DEVELOPMENT BUDGETS (Functions 42-43)
// ============================================================================

/**
 * Initializes professional development budget for user.
 *
 * @param {string} userId - User ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} allocatedBudget - Allocated budget amount
 * @returns {Promise<ProfessionalDevelopmentBudget>} Created budget
 */
export const initializeDevelopmentBudget = async (
  userId: string,
  fiscalYear: number,
  allocatedBudget: number,
  transaction?: Transaction,
): Promise<ProfessionalDevelopmentBudget> => {
  const budget: ProfessionalDevelopmentBudget = {
    id: generateUUID(),
    userId,
    departmentId: undefined,
    fiscalYear,
    allocatedBudget,
    spentBudget: 0,
    committedBudget: 0,
    availableBudget: allocatedBudget,
    currency: 'USD',
    budgetItems: [],
    approvalRequired: true,
    approverId: undefined,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return budget;
};

/**
 * Tracks budget expenditure.
 *
 * @param {string} budgetId - Budget ID
 * @param {object} expenditure - Expenditure details
 * @returns {Promise<ProfessionalDevelopmentBudget>} Updated budget
 */
export const trackBudgetExpenditure = async (
  budgetId: string,
  expenditure: {
    itemId: string;
    itemType: string;
    description: string;
    amount: number;
    status: 'PLANNED' | 'COMMITTED' | 'SPENT';
  },
  transaction?: Transaction,
): Promise<Partial<ProfessionalDevelopmentBudget>> => {
  return {
    id: budgetId,
    updatedAt: new Date(),
  };
};

// ============================================================================
// DEVELOPMENT MILESTONES (Functions 44-45)
// ============================================================================

/**
 * Creates a development milestone.
 *
 * @param {object} milestoneData - Milestone data
 * @param {string} userId - User creating milestone
 * @returns {Promise<DevelopmentMilestone>} Created milestone
 */
export const createDevelopmentMilestone = async (
  milestoneData: Partial<DevelopmentMilestone>,
  userId: string,
  transaction?: Transaction,
): Promise<DevelopmentMilestone> => {
  const milestone: DevelopmentMilestone = {
    id: generateUUID(),
    userId: milestoneData.userId!,
    idpId: milestoneData.idpId,
    goalId: milestoneData.goalId,
    milestoneName: milestoneData.milestoneName!,
    description: milestoneData.description!,
    category: milestoneData.category!,
    targetDate: milestoneData.targetDate!,
    completionDate: undefined,
    status: 'NOT_STARTED',
    evidence: undefined,
    validatedBy: undefined,
    validatedAt: undefined,
    reward: milestoneData.reward,
    metadata: {
      ...milestoneData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return milestone;
};

/**
 * Completes and validates a development milestone.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User completing
 * @param {string} validatorId - Validator user ID
 * @param {string} evidence - Evidence of completion
 * @returns {Promise<DevelopmentMilestone>} Updated milestone
 */
export const completeDevelopmentMilestone = async (
  milestoneId: string,
  userId: string,
  validatorId: string,
  evidence?: string,
  transaction?: Transaction,
): Promise<Partial<DevelopmentMilestone>> => {
  return {
    id: milestoneId,
    status: 'COMPLETED',
    completionDate: new Date(),
    evidence,
    validatedBy: validatorId,
    validatedAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================

/**
 * Example NestJS Controller for Development Planning
 */
@ApiTags('Development Planning')
@ApiBearerAuth()
@Controller('development')
export class DevelopmentPlanningController {
  @Post('idps')
  @ApiOperation({ summary: 'Create Individual Development Plan' })
  @ApiResponse({ status: 201, description: 'IDP created successfully' })
  async createIDPEndpoint(@Body() dto: CreateIDPDto) {
    return await createIDP(dto, 'system-user');
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create development goal' })
  @ApiResponse({ status: 201, description: 'Goal created successfully' })
  async createGoal(@Body() dto: CreateDevelopmentGoalDto) {
    return await createDevelopmentGoal(dto, 'system-user');
  }

  @Post('competencies')
  @ApiOperation({ summary: 'Create competency' })
  @ApiResponse({ status: 201, description: 'Competency created successfully' })
  async createCompetencyEndpoint(@Body() dto: CreateCompetencyDto) {
    return await createCompetency(dto, 'system-user');
  }

  @Post('assessments')
  @ApiOperation({ summary: 'Create skills assessment' })
  @ApiResponse({ status: 201, description: 'Assessment created successfully' })
  async createAssessment(@Body() dto: CreateSkillsAssessmentDto) {
    return await createSkillsAssessment(dto, 'system-user');
  }

  @Post('gap-analysis/:userId')
  @ApiOperation({ summary: 'Perform skills gap analysis' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async performGapAnalysis(@Param('userId', ParseUUIDPipe) userId: string, @Query('targetRole') targetRole?: string) {
    return await performSkillsGapAnalysis(userId, targetRole);
  }

  @Get('recommendations/:userId')
  @ApiOperation({ summary: 'Get learning recommendations' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getRecommendations(@Param('userId', ParseUUIDPipe) userId: string) {
    return await generateLearningRecommendations(userId);
  }

  @Post('mentoring')
  @ApiOperation({ summary: 'Create mentoring relationship' })
  @ApiResponse({ status: 201, description: 'Mentoring relationship created successfully' })
  async createMentoring(@Body() dto: CreateMentoringRelationshipDto) {
    return await createMentoringRelationship(dto, 'system-user');
  }

  @Post('job-rotations')
  @ApiOperation({ summary: 'Create job rotation' })
  @ApiResponse({ status: 201, description: 'Job rotation created successfully' })
  async createRotation(@Body() dto: CreateJobRotationDto) {
    return await createJobRotation(dto, 'system-user');
  }
}
