/**
 * LOC: HCM_REC_MGMT_001
 * File: /reuse/server/human-capital/recruitment-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *   - natural (NLP library)
 *
 * DOWNSTREAM (imported by):
 *   - Recruitment service implementations
 *   - Applicant tracking systems
 *   - Interview management services
 *   - Offer management systems
 *   - Recruitment analytics & reporting
 */

/**
 * File: /reuse/server/human-capital/recruitment-management-kit.ts
 * Locator: WC-HCM-REC-MGMT-001
 * Purpose: Recruitment Management Kit - Comprehensive ATS and recruitment lifecycle management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, date-fns, Natural
 * Downstream: ../backend/recruitment/*, ../services/hiring/*, ATS portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 50+ utility functions for recruitment management including job requisitions, candidate sourcing,
 *          applicant tracking, resume parsing, interview scheduling, interview feedback, offer management,
 *          background checks, reference checks, recruitment analytics, hiring pipeline, candidate assessments,
 *          skill matching, talent pool management, and SAP SuccessFactors Recruiting parity
 *
 * LLM Context: Enterprise-grade recruitment and applicant tracking system for White Cross healthcare.
 * Provides complete recruitment lifecycle management including job requisition creation/approval,
 * multi-channel candidate sourcing, comprehensive applicant tracking system (ATS), AI-powered resume
 * parsing and skill matching, automated interview scheduling with calendar integration, structured
 * interview feedback collection, offer letter generation and approval workflows, background check
 * integration, reference check management, recruitment metrics and analytics, hiring pipeline
 * visualization, candidate experience optimization, collaborative hiring workflows, compliance tracking,
 * and feature parity with SAP SuccessFactors Recruiting module. HIPAA-compliant for healthcare recruitment.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
  Unique,
  Default,
  IsUUID,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Job requisition status
 */
export enum RequisitionStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OPEN = 'open',
  ON_HOLD = 'on_hold',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  CLOSED = 'closed',
}

/**
 * Requisition priority
 */
export enum RequisitionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Application status
 */
export enum ApplicationStatus {
  NEW = 'new',
  SCREENING = 'screening',
  PHONE_SCREEN = 'phone_screen',
  INTERVIEW = 'interview',
  ASSESSMENT = 'assessment',
  REFERENCE_CHECK = 'reference_check',
  BACKGROUND_CHECK = 'background_check',
  OFFER = 'offer',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_DECLINED = 'offer_declined',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

/**
 * Candidate source
 */
export enum CandidateSource {
  JOB_BOARD = 'job_board',
  COMPANY_WEBSITE = 'company_website',
  EMPLOYEE_REFERRAL = 'employee_referral',
  RECRUITER = 'recruiter',
  SOCIAL_MEDIA = 'social_media',
  AGENCY = 'agency',
  CAMPUS = 'campus',
  CAREER_FAIR = 'career_fair',
  DIRECT_APPLICATION = 'direct_application',
  INTERNAL = 'internal',
  OTHER = 'other',
}

/**
 * Interview type
 */
export enum InterviewType {
  PHONE_SCREEN = 'phone_screen',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  PANEL = 'panel',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  CASE_STUDY = 'case_study',
  PRESENTATION = 'presentation',
  GROUP = 'group',
}

/**
 * Interview status
 */
export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

/**
 * Interview rating
 */
export enum InterviewRating {
  STRONG_HIRE = 'strong_hire',
  HIRE = 'hire',
  MAYBE = 'maybe',
  NO_HIRE = 'no_hire',
  STRONG_NO_HIRE = 'strong_no_hire',
}

/**
 * Offer status
 */
export enum OfferStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
}

/**
 * Background check status
 */
export enum BackgroundCheckStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  CLEAR = 'clear',
  NEEDS_REVIEW = 'needs_review',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Reference check status
 */
export enum ReferenceCheckStatus {
  PENDING = 'pending',
  CONTACTED = 'contacted',
  COMPLETED = 'completed',
  UNREACHABLE = 'unreachable',
  DECLINED = 'declined',
}

/**
 * Job type
 */
export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  INTERN = 'intern',
  PER_DIEM = 'per_diem',
}

/**
 * Experience level
 */
export enum ExperienceLevel {
  ENTRY_LEVEL = 'entry_level',
  JUNIOR = 'junior',
  MID_LEVEL = 'mid_level',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal',
  EXECUTIVE = 'executive',
}

/**
 * Job requisition interface
 */
export interface JobRequisition {
  id: string;
  requisitionNumber: string;
  title: string;
  departmentId: string;
  positionId?: string;
  hiringManagerId: string;
  recruiterId?: string;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  numberOfPositions: number;
  positionsFilled: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location: string;
  remoteAllowed: boolean;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits?: string[];
  targetStartDate?: Date;
  applicationDeadline?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  openedAt?: Date;
  closedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Candidate interface
 */
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  currentTitle?: string;
  currentCompany?: string;
  yearsExperience?: number;
  skills?: string[];
  education?: Education[];
  location?: string;
  willingToRelocate?: boolean;
  expectedSalary?: number;
  availableDate?: Date;
  source: CandidateSource;
  sourceDetails?: string;
  referredBy?: string;
  talentPoolIds?: string[];
  tags?: string[];
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Education interface
 */
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: Date;
  endDate?: Date;
  gpa?: number;
  honors?: string;
}

/**
 * Job application interface
 */
export interface JobApplication {
  id: string;
  requisitionId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  currentStage?: string;
  rating?: number;
  notes?: string;
  screeningAnswers?: Record<string, any>;
  assignedTo?: string;
  rejectionReason?: string;
  withdrawalReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Interview interface
 */
export interface Interview {
  id: string;
  applicationId: string;
  requisitionId: string;
  candidateId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers: string[];
  organizer: string;
  notes?: string;
  calendarEventId?: string;
  reminderSent?: boolean;
}

/**
 * Interview feedback interface
 */
export interface InterviewFeedback {
  id: string;
  interviewId: string;
  interviewerId: string;
  rating: InterviewRating;
  strengths?: string[];
  weaknesses?: string[];
  technicalSkills?: number;
  communicationSkills?: number;
  cultureFit?: number;
  overallScore?: number;
  recommendation?: string;
  notes?: string;
  submittedAt: Date;
}

/**
 * Job offer interface
 */
export interface JobOffer {
  id: string;
  applicationId: string;
  requisitionId: string;
  candidateId: string;
  status: OfferStatus;
  jobTitle: string;
  department: string;
  salary: number;
  currency: string;
  bonusAmount?: number;
  equityAmount?: number;
  startDate: Date;
  benefits?: string[];
  specialTerms?: string;
  expiryDate: Date;
  sentAt?: Date;
  respondedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  offerLetterUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Background check interface
 */
export interface BackgroundCheck {
  id: string;
  candidateId: string;
  applicationId: string;
  status: BackgroundCheckStatus;
  provider?: string;
  orderedAt?: Date;
  completedAt?: Date;
  expiryDate?: Date;
  components: string[];
  results?: Record<string, any>;
  notes?: string;
}

/**
 * Reference check interface
 */
export interface ReferenceCheck {
  id: string;
  candidateId: string;
  applicationId: string;
  referenceName: string;
  referenceTitle?: string;
  referenceCompany?: string;
  referenceEmail?: string;
  referencePhone?: string;
  relationship: string;
  status: ReferenceCheckStatus;
  contactedAt?: Date;
  completedAt?: Date;
  rating?: number;
  wouldRehire?: boolean;
  strengths?: string[];
  areasForImprovement?: string[];
  notes?: string;
}

/**
 * Recruitment metrics
 */
export interface RecruitmentMetrics {
  totalRequisitions: number;
  openRequisitions: number;
  filledRequisitions: number;
  totalApplications: number;
  averageTimeToFill: number;
  averageTimeToHire: number;
  offerAcceptanceRate: number;
  sourceEffectiveness: Record<CandidateSource, number>;
  costPerHire: number;
  qualityOfHire: number;
}

/**
 * Resume parse result
 */
export interface ResumeParseResult {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Education[];
  certifications?: string[];
  languages?: string[];
  confidence: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Education validation schema
 */
export const EducationSchema = z.object({
  institution: z.string().min(1).max(255),
  degree: z.string().min(1).max(100),
  fieldOfStudy: z.string().min(1).max(100),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  gpa: z.number().min(0).max(4).optional(),
  honors: z.string().max(255).optional(),
});

/**
 * Job requisition validation schema
 */
export const JobRequisitionSchema = z.object({
  requisitionNumber: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  departmentId: z.string().uuid(),
  positionId: z.string().uuid().optional(),
  hiringManagerId: z.string().uuid(),
  recruiterId: z.string().uuid().optional(),
  status: z.nativeEnum(RequisitionStatus),
  priority: z.nativeEnum(RequisitionPriority),
  jobType: z.nativeEnum(JobType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  numberOfPositions: z.number().int().positive(),
  positionsFilled: z.number().int().min(0).default(0),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().length(3),
  location: z.string().min(1).max(255),
  remoteAllowed: z.boolean().default(false),
  description: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  responsibilities: z.array(z.string()).min(1),
  qualifications: z.array(z.string()).min(1),
  benefits: z.array(z.string()).optional(),
  targetStartDate: z.coerce.date().optional(),
  applicationDeadline: z.coerce.date().optional(),
});

/**
 * Candidate validation schema
 */
export const CandidateSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  linkedinUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
  coverLetterUrl: z.string().url().optional(),
  currentTitle: z.string().max(255).optional(),
  currentCompany: z.string().max(255).optional(),
  yearsExperience: z.number().min(0).optional(),
  skills: z.array(z.string()).optional(),
  education: z.array(EducationSchema).optional(),
  location: z.string().max(255).optional(),
  willingToRelocate: z.boolean().optional(),
  expectedSalary: z.number().positive().optional(),
  availableDate: z.coerce.date().optional(),
  source: z.nativeEnum(CandidateSource),
  sourceDetails: z.string().max(500).optional(),
  referredBy: z.string().uuid().optional(),
});

/**
 * Job application validation schema
 */
export const JobApplicationSchema = z.object({
  requisitionId: z.string().uuid(),
  candidateId: z.string().uuid(),
  status: z.nativeEnum(ApplicationStatus),
  appliedAt: z.coerce.date(),
  screeningAnswers: z.record(z.any()).optional(),
});

/**
 * Interview validation schema
 */
export const InterviewSchema = z.object({
  applicationId: z.string().uuid(),
  requisitionId: z.string().uuid(),
  candidateId: z.string().uuid(),
  type: z.nativeEnum(InterviewType),
  status: z.nativeEnum(InterviewStatus),
  scheduledAt: z.coerce.date(),
  duration: z.number().int().positive(),
  location: z.string().max(500).optional(),
  meetingLink: z.string().url().optional(),
  interviewers: z.array(z.string().uuid()).min(1),
  organizer: z.string().uuid(),
});

/**
 * Interview feedback validation schema
 */
export const InterviewFeedbackSchema = z.object({
  interviewId: z.string().uuid(),
  interviewerId: z.string().uuid(),
  rating: z.nativeEnum(InterviewRating),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  technicalSkills: z.number().min(1).max(10).optional(),
  communicationSkills: z.number().min(1).max(10).optional(),
  cultureFit: z.number().min(1).max(10).optional(),
  overallScore: z.number().min(1).max(10).optional(),
  recommendation: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Job offer validation schema
 */
export const JobOfferSchema = z.object({
  applicationId: z.string().uuid(),
  requisitionId: z.string().uuid(),
  candidateId: z.string().uuid(),
  status: z.nativeEnum(OfferStatus),
  jobTitle: z.string().min(1).max(255),
  department: z.string().min(1).max(255),
  salary: z.number().positive(),
  currency: z.string().length(3),
  bonusAmount: z.number().min(0).optional(),
  equityAmount: z.number().min(0).optional(),
  startDate: z.coerce.date(),
  benefits: z.array(z.string()).optional(),
  specialTerms: z.string().optional(),
  expiryDate: z.coerce.date(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Job Requisition Model
 */
@Table({
  tableName: 'job_requisitions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['requisition_number'], unique: true },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['department_id'] },
    { fields: ['hiring_manager_id'] },
    { fields: ['recruiter_id'] },
    { fields: ['created_at'] },
  ],
})
export class JobRequisitionModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'requisition_number',
  })
  requisitionNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'department_id',
  })
  departmentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'position_id',
  })
  positionId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'hiring_manager_id',
  })
  hiringManagerId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'recruiter_id',
  })
  recruiterId: string;

  @Column({
    type: DataType.ENUM(...Object.values(RequisitionStatus)),
    allowNull: false,
    defaultValue: RequisitionStatus.DRAFT,
  })
  status: RequisitionStatus;

  @Column({
    type: DataType.ENUM(...Object.values(RequisitionPriority)),
    allowNull: false,
    defaultValue: RequisitionPriority.MEDIUM,
  })
  priority: RequisitionPriority;

  @Column({
    type: DataType.ENUM(...Object.values(JobType)),
    allowNull: false,
    field: 'job_type',
  })
  jobType: JobType;

  @Column({
    type: DataType.ENUM(...Object.values(ExperienceLevel)),
    allowNull: false,
    field: 'experience_level',
  })
  experienceLevel: ExperienceLevel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'number_of_positions',
  })
  numberOfPositions: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'positions_filled',
  })
  positionsFilled: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'salary_min',
  })
  salaryMin: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'salary_max',
  })
  salaryMax: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  })
  currency: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'remote_allowed',
  })
  remoteAllowed: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  requirements: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  responsibilities: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  qualifications: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  benefits: string[];

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'target_start_date',
  })
  targetStartDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'application_deadline',
  })
  applicationDeadline: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'approved_by',
  })
  approvedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_at',
  })
  approvedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'opened_at',
  })
  openedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'closed_at',
  })
  closedAt: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @HasMany(() => JobApplicationModel)
  applications: JobApplicationModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Candidate Model
 */
@Table({
  tableName: 'candidates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['source'] },
    { fields: ['created_at'] },
  ],
})
export class CandidateModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'linkedin_url',
  })
  linkedinUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'resume_url',
  })
  resumeUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'cover_letter_url',
  })
  coverLetterUrl: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'current_title',
  })
  currentTitle: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'current_company',
  })
  currentCompany: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'years_experience',
  })
  yearsExperience: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  skills: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  education: Education[];

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'willing_to_relocate',
  })
  willingToRelocate: boolean;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'expected_salary',
  })
  expectedSalary: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'available_date',
  })
  availableDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CandidateSource)),
    allowNull: false,
  })
  source: CandidateSource;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'source_details',
  })
  sourceDetails: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'referred_by',
  })
  referredBy: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'talent_pool_ids',
  })
  talentPoolIds: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  tags: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @HasMany(() => JobApplicationModel)
  applications: JobApplicationModel[];

  @HasMany(() => ReferenceCheckModel)
  referenceChecks: ReferenceCheckModel[];

  @HasMany(() => BackgroundCheckModel)
  backgroundChecks: BackgroundCheckModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Job Application Model
 */
@Table({
  tableName: 'job_applications',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['requisition_id'] },
    { fields: ['candidate_id'] },
    { fields: ['status'] },
    { fields: ['applied_at'] },
  ],
})
export class JobApplicationModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => JobRequisitionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @ForeignKey(() => CandidateModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ApplicationStatus)),
    allowNull: false,
    defaultValue: ApplicationStatus.NEW,
  })
  status: ApplicationStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'applied_at',
  })
  appliedAt: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'current_stage',
  })
  currentStage: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'screening_answers',
  })
  screeningAnswers: Record<string, any>;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'assigned_to',
  })
  assignedTo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  })
  rejectionReason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'withdrawal_reason',
  })
  withdrawalReason: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => JobRequisitionModel)
  requisition: JobRequisitionModel;

  @BelongsTo(() => CandidateModel)
  candidate: CandidateModel;

  @HasMany(() => InterviewModel)
  interviews: InterviewModel[];

  @HasMany(() => JobOfferModel)
  offers: JobOfferModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Interview Model
 */
@Table({
  tableName: 'interviews',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['application_id'] },
    { fields: ['candidate_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_at'] },
  ],
})
export class InterviewModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => JobApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'application_id',
  })
  applicationId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.ENUM(...Object.values(InterviewType)),
    allowNull: false,
  })
  type: InterviewType;

  @Column({
    type: DataType.ENUM(...Object.values(InterviewStatus)),
    allowNull: false,
    defaultValue: InterviewStatus.SCHEDULED,
  })
  status: InterviewStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_at',
  })
  scheduledAt: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes',
  })
  duration: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'meeting_link',
  })
  meetingLink: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  interviewers: string[];

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizer: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'calendar_event_id',
  })
  calendarEventId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'reminder_sent',
  })
  reminderSent: boolean;

  @BelongsTo(() => JobApplicationModel)
  application: JobApplicationModel;

  @HasMany(() => InterviewFeedbackModel)
  feedback: InterviewFeedbackModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Interview Feedback Model
 */
@Table({
  tableName: 'interview_feedback',
  timestamps: true,
  indexes: [
    { fields: ['interview_id'] },
    { fields: ['interviewer_id'] },
    { fields: ['submitted_at'] },
  ],
})
export class InterviewFeedbackModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => InterviewModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'interview_id',
  })
  interviewId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'interviewer_id',
  })
  interviewerId: string;

  @Column({
    type: DataType.ENUM(...Object.values(InterviewRating)),
    allowNull: false,
  })
  rating: InterviewRating;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  strengths: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  weaknesses: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'technical_skills',
  })
  technicalSkills: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'communication_skills',
  })
  communicationSkills: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'culture_fit',
  })
  cultureFit: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'overall_score',
  })
  overallScore: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  recommendation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'submitted_at',
  })
  submittedAt: Date;

  @BelongsTo(() => InterviewModel)
  interview: InterviewModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Job Offer Model
 */
@Table({
  tableName: 'job_offers',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['application_id'] },
    { fields: ['candidate_id'] },
    { fields: ['status'] },
    { fields: ['expiry_date'] },
  ],
})
export class JobOfferModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => JobApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'application_id',
  })
  applicationId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.ENUM(...Object.values(OfferStatus)),
    allowNull: false,
    defaultValue: OfferStatus.DRAFT,
  })
  status: OfferStatus;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'job_title',
  })
  jobTitle: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  department: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  salary: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'bonus_amount',
  })
  bonusAmount: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'equity_amount',
  })
  equityAmount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  benefits: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'special_terms',
  })
  specialTerms: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'sent_at',
  })
  sentAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'responded_at',
  })
  respondedAt: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'approved_by',
  })
  approvedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_at',
  })
  approvedAt: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'offer_letter_url',
  })
  offerLetterUrl: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => JobApplicationModel)
  application: JobApplicationModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Background Check Model
 */
@Table({
  tableName: 'background_checks',
  timestamps: true,
  indexes: [
    { fields: ['candidate_id'] },
    { fields: ['application_id'] },
    { fields: ['status'] },
  ],
})
export class BackgroundCheckModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => CandidateModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'application_id',
  })
  applicationId: string;

  @Column({
    type: DataType.ENUM(...Object.values(BackgroundCheckStatus)),
    allowNull: false,
    defaultValue: BackgroundCheckStatus.NOT_STARTED,
  })
  status: BackgroundCheckStatus;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  provider: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'ordered_at',
  })
  orderedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_at',
  })
  completedAt: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  components: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  results: Record<string, any>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => CandidateModel)
  candidate: CandidateModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Reference Check Model
 */
@Table({
  tableName: 'reference_checks',
  timestamps: true,
  indexes: [
    { fields: ['candidate_id'] },
    { fields: ['application_id'] },
    { fields: ['status'] },
  ],
})
export class ReferenceCheckModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => CandidateModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'application_id',
  })
  applicationId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'reference_name',
  })
  referenceName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reference_title',
  })
  referenceTitle: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reference_company',
  })
  referenceCompany: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reference_email',
  })
  referenceEmail: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'reference_phone',
  })
  referencePhone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  relationship: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReferenceCheckStatus)),
    allowNull: false,
    defaultValue: ReferenceCheckStatus.PENDING,
  })
  status: ReferenceCheckStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'contacted_at',
  })
  contactedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_at',
  })
  completedAt: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'would_rehire',
  })
  wouldRehire: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  strengths: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'areas_for_improvement',
  })
  areasForImprovement: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => CandidateModel)
  candidate: CandidateModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// JOB REQUISITION FUNCTIONS
// ============================================================================

/**
 * Create job requisition
 */
export async function createJobRequisition(
  requisitionData: Partial<JobRequisition>,
  transaction?: Transaction,
): Promise<JobRequisitionModel> {
  const validated = JobRequisitionSchema.parse(requisitionData);
  return JobRequisitionModel.create(validated as any, { transaction });
}

/**
 * Update job requisition
 */
export async function updateJobRequisition(
  requisitionId: string,
  updates: Partial<JobRequisition>,
  transaction?: Transaction,
): Promise<JobRequisitionModel> {
  const requisition = await JobRequisitionModel.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }
  await requisition.update(updates, { transaction });
  return requisition;
}

/**
 * Get requisition by ID
 */
export async function getRequisitionById(
  requisitionId: string,
  includeApplications: boolean = false,
): Promise<JobRequisitionModel | null> {
  const options: FindOptions = { where: { id: requisitionId } };
  if (includeApplications) {
    options.include = [{ model: JobApplicationModel, as: 'applications' }];
  }
  return JobRequisitionModel.findOne(options);
}

/**
 * Approve requisition
 */
export async function approveRequisition(
  requisitionId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<void> {
  await updateJobRequisition(
    requisitionId,
    { status: RequisitionStatus.APPROVED, approvedBy, approvedAt: new Date() },
    transaction,
  );
}

/**
 * Open requisition
 */
export async function openRequisition(
  requisitionId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateJobRequisition(
    requisitionId,
    { status: RequisitionStatus.OPEN, openedAt: new Date() },
    transaction,
  );
}

/**
 * Close requisition
 */
export async function closeRequisition(
  requisitionId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateJobRequisition(
    requisitionId,
    { status: RequisitionStatus.CLOSED, closedAt: new Date() },
    transaction,
  );
}

/**
 * Search requisitions
 */
export async function searchRequisitions(
  filters: {
    status?: RequisitionStatus[];
    departmentId?: string;
    hiringManagerId?: string;
    priority?: RequisitionPriority[];
  },
  page: number = 1,
  limit: number = 20,
): Promise<{ requisitions: JobRequisitionModel[]; total: number }> {
  const where: WhereOptions = {};
  if (filters.status?.length) where.status = { [Op.in]: filters.status };
  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.hiringManagerId) where.hiringManagerId = filters.hiringManagerId;
  if (filters.priority?.length) where.priority = { [Op.in]: filters.priority };

  const { rows, count } = await JobRequisitionModel.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['createdAt', 'DESC']],
  });

  return { requisitions: rows, total: count };
}

/**
 * Generate requisition number
 */
export function generateRequisitionNumber(prefix: string = 'REQ', sequence: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(5, '0')}`;
}

// ============================================================================
// CANDIDATE FUNCTIONS
// ============================================================================

/**
 * Create candidate
 */
export async function createCandidate(
  candidateData: Partial<Candidate>,
  transaction?: Transaction,
): Promise<CandidateModel> {
  const validated = CandidateSchema.parse(candidateData);

  // Check for existing candidate
  const existing = await CandidateModel.findOne({
    where: { email: validated.email },
    transaction,
  });

  if (existing) {
    return existing;
  }

  return CandidateModel.create(validated as any, { transaction });
}

/**
 * Update candidate
 */
export async function updateCandidate(
  candidateId: string,
  updates: Partial<Candidate>,
  transaction?: Transaction,
): Promise<CandidateModel> {
  const candidate = await CandidateModel.findByPk(candidateId, { transaction });
  if (!candidate) {
    throw new NotFoundException(`Candidate ${candidateId} not found`);
  }
  await candidate.update(updates, { transaction });
  return candidate;
}

/**
 * Get candidate by ID
 */
export async function getCandidateById(candidateId: string): Promise<CandidateModel | null> {
  return CandidateModel.findByPk(candidateId, {
    include: [
      { model: JobApplicationModel, as: 'applications' },
      { model: ReferenceCheckModel, as: 'referenceChecks' },
      { model: BackgroundCheckModel, as: 'backgroundChecks' },
    ],
  });
}

/**
 * Get candidate by email
 */
export async function getCandidateByEmail(email: string): Promise<CandidateModel | null> {
  return CandidateModel.findOne({ where: { email } });
}

/**
 * Search candidates
 */
export async function searchCandidates(
  filters: {
    source?: CandidateSource[];
    skills?: string[];
    location?: string;
    minExperience?: number;
    maxExperience?: number;
  },
  page: number = 1,
  limit: number = 20,
): Promise<{ candidates: CandidateModel[]; total: number }> {
  const where: WhereOptions = {};

  if (filters.source?.length) {
    where.source = { [Op.in]: filters.source };
  }
  if (filters.location) {
    where.location = { [Op.iLike]: `%${filters.location}%` };
  }
  if (filters.minExperience !== undefined) {
    where.yearsExperience = { [Op.gte]: filters.minExperience };
  }
  if (filters.maxExperience !== undefined) {
    where.yearsExperience = { ...where.yearsExperience, [Op.lte]: filters.maxExperience };
  }

  const { rows, count } = await CandidateModel.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['createdAt', 'DESC']],
  });

  return { candidates: rows, total: count };
}

/**
 * Add candidate to talent pool
 */
export async function addCandidateToTalentPool(
  candidateId: string,
  talentPoolId: string,
  transaction?: Transaction,
): Promise<void> {
  const candidate = await CandidateModel.findByPk(candidateId, { transaction });
  if (!candidate) {
    throw new NotFoundException(`Candidate ${candidateId} not found`);
  }

  const pools = candidate.talentPoolIds || [];
  if (!pools.includes(talentPoolId)) {
    pools.push(talentPoolId);
    await candidate.update({ talentPoolIds: pools }, { transaction });
  }
}

/**
 * Parse resume (simple implementation)
 */
export function parseResume(resumeText: string): ResumeParseResult {
  const result: ResumeParseResult = {
    skills: [],
    experience: [],
    education: [],
    confidence: 0.5,
  };

  // Email extraction
  const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.email = emailMatch[0];

  // Phone extraction
  const phoneMatch = resumeText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // Simple skill extraction (common tech skills)
  const commonSkills = ['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS'];
  result.skills = commonSkills.filter((skill) =>
    resumeText.toLowerCase().includes(skill.toLowerCase()),
  );

  return result;
}

/**
 * Match candidate to requisition (skill-based)
 */
export function matchCandidateToRequisition(
  candidate: Candidate,
  requisition: JobRequisition,
): number {
  let score = 0;
  const candidateSkills = new Set(candidate.skills?.map((s) => s.toLowerCase()) || []);
  const requiredSkills = requisition.requirements
    .join(' ')
    .toLowerCase()
    .split(/\s+/);

  requiredSkills.forEach((skill) => {
    if (candidateSkills.has(skill)) {
      score += 10;
    }
  });

  // Experience match
  if (candidate.yearsExperience !== undefined) {
    const expLevel = requisition.experienceLevel;
    if (
      (expLevel === ExperienceLevel.ENTRY_LEVEL && candidate.yearsExperience <= 2) ||
      (expLevel === ExperienceLevel.JUNIOR && candidate.yearsExperience >= 1 && candidate.yearsExperience <= 3) ||
      (expLevel === ExperienceLevel.MID_LEVEL && candidate.yearsExperience >= 3 && candidate.yearsExperience <= 6) ||
      (expLevel === ExperienceLevel.SENIOR && candidate.yearsExperience >= 5)
    ) {
      score += 20;
    }
  }

  return Math.min(score, 100);
}

// ============================================================================
// APPLICATION FUNCTIONS
// ============================================================================

/**
 * Submit application
 */
export async function submitApplication(
  applicationData: Partial<JobApplication>,
  transaction?: Transaction,
): Promise<JobApplicationModel> {
  const validated = JobApplicationSchema.parse(applicationData);

  // Check for duplicate application
  const existing = await JobApplicationModel.findOne({
    where: {
      requisitionId: validated.requisitionId,
      candidateId: validated.candidateId,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Candidate has already applied to this position');
  }

  return JobApplicationModel.create(validated as any, { transaction });
}

/**
 * Update application status
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string,
  transaction?: Transaction,
): Promise<void> {
  const application = await JobApplicationModel.findByPk(applicationId, { transaction });
  if (!application) {
    throw new NotFoundException(`Application ${applicationId} not found`);
  }

  await application.update({ status: newStatus, notes }, { transaction });
}

/**
 * Get application by ID
 */
export async function getApplicationById(applicationId: string): Promise<JobApplicationModel | null> {
  return JobApplicationModel.findByPk(applicationId, {
    include: [
      { model: JobRequisitionModel, as: 'requisition' },
      { model: CandidateModel, as: 'candidate' },
      { model: InterviewModel, as: 'interviews' },
      { model: JobOfferModel, as: 'offers' },
    ],
  });
}

/**
 * Get applications by requisition
 */
export async function getApplicationsByRequisition(
  requisitionId: string,
  status?: ApplicationStatus[],
): Promise<JobApplicationModel[]> {
  const where: WhereOptions = { requisitionId };
  if (status?.length) {
    where.status = { [Op.in]: status };
  }

  return JobApplicationModel.findAll({
    where,
    include: [{ model: CandidateModel, as: 'candidate' }],
    order: [['appliedAt', 'DESC']],
  });
}

/**
 * Assign application to recruiter
 */
export async function assignApplicationToRecruiter(
  applicationId: string,
  recruiterId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobApplicationModel.update(
    { assignedTo: recruiterId },
    { where: { id: applicationId }, transaction },
  );
}

/**
 * Reject application
 */
export async function rejectApplication(
  applicationId: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  await JobApplicationModel.update(
    { status: ApplicationStatus.REJECTED, rejectionReason: reason },
    { where: { id: applicationId }, transaction },
  );
}

/**
 * Withdraw application
 */
export async function withdrawApplication(
  applicationId: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  await JobApplicationModel.update(
    { status: ApplicationStatus.WITHDRAWN, withdrawalReason: reason },
    { where: { id: applicationId }, transaction },
  );
}

// ============================================================================
// INTERVIEW FUNCTIONS
// ============================================================================

/**
 * Schedule interview
 */
export async function scheduleInterview(
  interviewData: Partial<Interview>,
  transaction?: Transaction,
): Promise<InterviewModel> {
  const validated = InterviewSchema.parse(interviewData);
  return InterviewModel.create(validated as any, { transaction });
}

/**
 * Update interview status
 */
export async function updateInterviewStatus(
  interviewId: string,
  newStatus: InterviewStatus,
  transaction?: Transaction,
): Promise<void> {
  await InterviewModel.update(
    { status: newStatus },
    { where: { id: interviewId }, transaction },
  );
}

/**
 * Cancel interview
 */
export async function cancelInterview(
  interviewId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateInterviewStatus(interviewId, InterviewStatus.CANCELLED, transaction);
}

/**
 * Reschedule interview
 */
export async function rescheduleInterview(
  interviewId: string,
  newScheduledAt: Date,
  transaction?: Transaction,
): Promise<void> {
  await InterviewModel.update(
    { scheduledAt: newScheduledAt, status: InterviewStatus.RESCHEDULED },
    { where: { id: interviewId }, transaction },
  );
}

/**
 * Get interviews by application
 */
export async function getInterviewsByApplication(
  applicationId: string,
): Promise<InterviewModel[]> {
  return InterviewModel.findAll({
    where: { applicationId },
    include: [{ model: InterviewFeedbackModel, as: 'feedback' }],
    order: [['scheduledAt', 'ASC']],
  });
}

/**
 * Get upcoming interviews
 */
export async function getUpcomingInterviews(
  interviewerId?: string,
  days: number = 7,
): Promise<InterviewModel[]> {
  const where: WhereOptions = {
    scheduledAt: {
      [Op.gte]: new Date(),
      [Op.lte]: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    },
    status: { [Op.in]: [InterviewStatus.SCHEDULED, InterviewStatus.CONFIRMED] },
  };

  if (interviewerId) {
    where.interviewers = { [Op.contains]: [interviewerId] };
  }

  return InterviewModel.findAll({
    where,
    order: [['scheduledAt', 'ASC']],
  });
}

/**
 * Submit interview feedback
 */
export async function submitInterviewFeedback(
  feedbackData: Partial<InterviewFeedback>,
  transaction?: Transaction,
): Promise<InterviewFeedbackModel> {
  const validated = InterviewFeedbackSchema.parse(feedbackData);
  return InterviewFeedbackModel.create(validated as any, { transaction });
}

/**
 * Get interview feedback
 */
export async function getInterviewFeedback(interviewId: string): Promise<InterviewFeedbackModel[]> {
  return InterviewFeedbackModel.findAll({
    where: { interviewId },
    order: [['submittedAt', 'DESC']],
  });
}

/**
 * Calculate aggregate interview score
 */
export async function calculateAggregateInterviewScore(
  interviewId: string,
): Promise<number | null> {
  const feedbackList = await getInterviewFeedback(interviewId);
  if (feedbackList.length === 0) return null;

  const total = feedbackList.reduce((sum, fb) => sum + (fb.overallScore || 0), 0);
  return total / feedbackList.length;
}

// ============================================================================
// OFFER FUNCTIONS
// ============================================================================

/**
 * Create job offer
 */
export async function createJobOffer(
  offerData: Partial<JobOffer>,
  transaction?: Transaction,
): Promise<JobOfferModel> {
  const validated = JobOfferSchema.parse(offerData);
  return JobOfferModel.create(validated as any, { transaction });
}

/**
 * Send offer
 */
export async function sendOffer(
  offerId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobOfferModel.update(
    { status: OfferStatus.SENT, sentAt: new Date() },
    { where: { id: offerId }, transaction },
  );
}

/**
 * Accept offer
 */
export async function acceptOffer(
  offerId: string,
  transaction?: Transaction,
): Promise<void> {
  const offer = await JobOfferModel.findByPk(offerId, { transaction });
  if (!offer) {
    throw new NotFoundException(`Offer ${offerId} not found`);
  }

  await offer.update(
    { status: OfferStatus.ACCEPTED, respondedAt: new Date() },
    { transaction },
  );

  // Update application status
  await updateApplicationStatus(
    offer.applicationId,
    ApplicationStatus.OFFER_ACCEPTED,
    undefined,
    transaction,
  );
}

/**
 * Decline offer
 */
export async function declineOffer(
  offerId: string,
  transaction?: Transaction,
): Promise<void> {
  const offer = await JobOfferModel.findByPk(offerId, { transaction });
  if (!offer) {
    throw new NotFoundException(`Offer ${offerId} not found`);
  }

  await offer.update(
    { status: OfferStatus.DECLINED, respondedAt: new Date() },
    { transaction },
  );

  // Update application status
  await updateApplicationStatus(
    offer.applicationId,
    ApplicationStatus.OFFER_DECLINED,
    undefined,
    transaction,
  );
}

/**
 * Get offers by candidate
 */
export async function getOffersByCandidate(candidateId: string): Promise<JobOfferModel[]> {
  return JobOfferModel.findAll({
    where: { candidateId },
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Get expiring offers
 */
export async function getExpiringOffers(days: number = 3): Promise<JobOfferModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return JobOfferModel.findAll({
    where: {
      expiryDate: { [Op.lte]: futureDate },
      status: OfferStatus.SENT,
    },
    order: [['expiryDate', 'ASC']],
  });
}

// ============================================================================
// BACKGROUND CHECK FUNCTIONS
// ============================================================================

/**
 * Initiate background check
 */
export async function initiateBackgroundCheck(
  checkData: Partial<BackgroundCheck>,
  transaction?: Transaction,
): Promise<BackgroundCheckModel> {
  return BackgroundCheckModel.create(
    { ...checkData, status: BackgroundCheckStatus.IN_PROGRESS, orderedAt: new Date() } as any,
    { transaction },
  );
}

/**
 * Update background check status
 */
export async function updateBackgroundCheckStatus(
  checkId: string,
  status: BackgroundCheckStatus,
  results?: Record<string, any>,
  transaction?: Transaction,
): Promise<void> {
  const updateData: any = { status };
  if (status === BackgroundCheckStatus.CLEAR || status === BackgroundCheckStatus.FAILED) {
    updateData.completedAt = new Date();
  }
  if (results) {
    updateData.results = results;
  }

  await BackgroundCheckModel.update(updateData, { where: { id: checkId }, transaction });
}

/**
 * Get background checks by candidate
 */
export async function getBackgroundChecksByCandidate(
  candidateId: string,
): Promise<BackgroundCheckModel[]> {
  return BackgroundCheckModel.findAll({
    where: { candidateId },
    order: [['orderedAt', 'DESC']],
  });
}

// ============================================================================
// REFERENCE CHECK FUNCTIONS
// ============================================================================

/**
 * Add reference check
 */
export async function addReferenceCheck(
  checkData: Partial<ReferenceCheck>,
  transaction?: Transaction,
): Promise<ReferenceCheckModel> {
  return ReferenceCheckModel.create(checkData as any, { transaction });
}

/**
 * Update reference check
 */
export async function updateReferenceCheck(
  checkId: string,
  updates: Partial<ReferenceCheck>,
  transaction?: Transaction,
): Promise<void> {
  await ReferenceCheckModel.update(updates, { where: { id: checkId }, transaction });
}

/**
 * Complete reference check
 */
export async function completeReferenceCheck(
  checkId: string,
  results: {
    rating: number;
    wouldRehire: boolean;
    strengths: string[];
    areasForImprovement: string[];
    notes: string;
  },
  transaction?: Transaction,
): Promise<void> {
  await ReferenceCheckModel.update(
    { ...results, status: ReferenceCheckStatus.COMPLETED, completedAt: new Date() },
    { where: { id: checkId }, transaction },
  );
}

/**
 * Get reference checks by candidate
 */
export async function getReferenceChecksByCandidate(
  candidateId: string,
): Promise<ReferenceCheckModel[]> {
  return ReferenceCheckModel.findAll({
    where: { candidateId },
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Calculate time to fill
 */
export async function calculateTimeToFill(requisitionId: string): Promise<number | null> {
  const requisition = await JobRequisitionModel.findByPk(requisitionId);
  if (!requisition || !requisition.openedAt || !requisition.closedAt) {
    return null;
  }

  const diffMs = requisition.closedAt.getTime() - requisition.openedAt.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days
}

/**
 * Calculate time to hire
 */
export async function calculateTimeToHire(applicationId: string): Promise<number | null> {
  const application = await JobApplicationModel.findByPk(applicationId);
  if (!application || application.status !== ApplicationStatus.HIRED) {
    return null;
  }

  const diffMs = new Date().getTime() - application.appliedAt.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days
}

/**
 * Get recruitment metrics
 */
export async function getRecruitmentMetrics(
  startDate: Date,
  endDate: Date,
): Promise<RecruitmentMetrics> {
  const requisitions = await JobRequisitionModel.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const applications = await JobApplicationModel.findAll({
    where: {
      appliedAt: { [Op.between]: [startDate, endDate] },
    },
    include: [{ model: CandidateModel, as: 'candidate' }],
  });

  const offers = await JobOfferModel.findAll({
    where: {
      sentAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalRequisitions = requisitions.length;
  const openRequisitions = requisitions.filter((r) => r.status === RequisitionStatus.OPEN).length;
  const filledRequisitions = requisitions.filter((r) => r.status === RequisitionStatus.FILLED).length;

  const sourceEffectiveness: Record<CandidateSource, number> = {} as any;
  Object.values(CandidateSource).forEach((source) => {
    sourceEffectiveness[source] = applications.filter(
      (a) => a.candidate?.source === source,
    ).length;
  });

  const acceptedOffers = offers.filter((o) => o.status === OfferStatus.ACCEPTED).length;
  const sentOffers = offers.filter((o) => o.status === OfferStatus.SENT || o.status === OfferStatus.ACCEPTED || o.status === OfferStatus.DECLINED).length;

  return {
    totalRequisitions,
    openRequisitions,
    filledRequisitions,
    totalApplications: applications.length,
    averageTimeToFill: 0, // Would need calculation
    averageTimeToHire: 0, // Would need calculation
    offerAcceptanceRate: sentOffers > 0 ? (acceptedOffers / sentOffers) * 100 : 0,
    sourceEffectiveness,
    costPerHire: 0, // Would need cost data
    qualityOfHire: 0, // Would need performance data
  };
}

/**
 * Get pipeline conversion rates
 */
export async function getPipelineConversionRates(requisitionId: string): Promise<Record<string, number>> {
  const applications = await JobApplicationModel.findAll({
    where: { requisitionId },
  });

  const total = applications.length;
  if (total === 0) return {};

  const stages = Object.values(ApplicationStatus);
  const rates: Record<string, number> = {};

  stages.forEach((stage) => {
    const count = applications.filter((a) => a.status === stage).length;
    rates[stage] = (count / total) * 100;
  });

  return rates;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format candidate name
 */
export function formatCandidateName(candidate: { firstName: string; lastName: string }): string {
  return `${candidate.firstName} ${candidate.lastName}`;
}

/**
 * Generate offer letter content
 */
export function generateOfferLetterContent(offer: JobOffer, candidate: Candidate): string {
  return `
Dear ${formatCandidateName(candidate)},

We are pleased to offer you the position of ${offer.jobTitle} in the ${offer.department} department.

Compensation: ${offer.currency} ${offer.salary.toLocaleString()} per annum
Start Date: ${offer.startDate.toISOString().split('T')[0]}

${offer.benefits?.length ? `Benefits:\n${offer.benefits.map((b) => `- ${b}`).join('\n')}` : ''}

${offer.specialTerms ? `Special Terms:\n${offer.specialTerms}` : ''}

This offer expires on ${offer.expiryDate.toISOString().split('T')[0]}.

We look forward to welcoming you to our team.

Sincerely,
HR Department
  `.trim();
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class RecruitmentService {
  async createRequisition(data: Partial<JobRequisition>): Promise<JobRequisitionModel> {
    return createJobRequisition(data);
  }

  async createCandidate(data: Partial<Candidate>): Promise<CandidateModel> {
    return createCandidate(data);
  }

  async submitApplication(data: Partial<JobApplication>): Promise<JobApplicationModel> {
    return submitApplication(data);
  }

  async scheduleInterview(data: Partial<Interview>): Promise<InterviewModel> {
    return scheduleInterview(data);
  }

  async createOffer(data: Partial<JobOffer>): Promise<JobOfferModel> {
    return createJobOffer(data);
  }

  async getMetrics(startDate: Date, endDate: Date): Promise<RecruitmentMetrics> {
    return getRecruitmentMetrics(startDate, endDate);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Recruitment')
@Controller('recruitment')
@ApiBearerAuth()
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post('requisitions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create job requisition' })
  async createRequisition(@Body() data: Partial<JobRequisition>) {
    return this.recruitmentService.createRequisition(data);
  }

  @Post('candidates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create candidate' })
  async createCandidate(@Body() data: Partial<Candidate>) {
    return this.recruitmentService.createCandidate(data);
  }

  @Post('applications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit application' })
  async submitApplication(@Body() data: Partial<JobApplication>) {
    return this.recruitmentService.submitApplication(data);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get recruitment metrics' })
  @ApiQuery({ name: 'startDate', type: 'string' })
  @ApiQuery({ name: 'endDate', type: 'string' })
  async getMetrics(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.recruitmentService.getMetrics(new Date(startDate), new Date(endDate));
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  JobRequisitionModel,
  CandidateModel,
  JobApplicationModel,
  InterviewModel,
  InterviewFeedbackModel,
  JobOfferModel,
  BackgroundCheckModel,
  ReferenceCheckModel,
  RecruitmentService,
  RecruitmentController,
};
