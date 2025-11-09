/**
 * LOC: HCM_TAL_ACQ_001
 * File: /reuse/server/human-capital/talent-acquisition-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *   - uuid
 *
 * DOWNSTREAM (imported by):
 *   - Talent acquisition service implementations
 *   - Career site applications
 *   - Recruitment marketing systems
 *   - Referral program services
 *   - Compliance & reporting systems
 */

/**
 * File: /reuse/server/human-capital/talent-acquisition-kit.ts
 * Locator: WC-HCM-TAL-ACQ-001
 * Purpose: Talent Acquisition Kit - Comprehensive talent pipeline and recruitment marketing
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, date-fns, uuid
 * Downstream: ../backend/talent/*, ../services/careers/*, Career portals, Marketing automation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 45+ utility functions for talent acquisition including talent pipeline management, career site
 *          content management, job posting and distribution, candidate CRM and engagement, recruitment
 *          marketing campaigns, employee referral programs, campus recruitment, agency/vendor management,
 *          diversity recruitment initiatives, EEOC/OFCCP compliance, talent communities, sourcing strategies,
 *          employer branding, and SAP SuccessFactors Recruiting Marketing parity
 *
 * LLM Context: Enterprise-grade talent acquisition and recruitment marketing for White Cross healthcare.
 * Provides comprehensive talent pipeline management including proactive sourcing, talent pool segmentation,
 * career site content management with job search and application tracking, multi-channel job posting
 * distribution, candidate relationship management (CRM) with automated nurture campaigns, recruitment
 * marketing automation, employee referral program with rewards tracking, campus recruitment with university
 * partnerships, agency/vendor management with performance tracking, diversity and inclusion recruiting
 * initiatives, EEO/OFCCP compliance reporting, talent community building, social media recruitment,
 * employer branding, candidate experience optimization, and feature parity with SAP SuccessFactors
 * Recruiting Marketing. HIPAA-compliant for healthcare talent acquisition.
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
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Talent pool type
 */
export enum TalentPoolType {
  ACTIVE = 'active',
  PASSIVE = 'passive',
  SILVER_MEDALISTS = 'silver_medalists',
  ALUMNI = 'alumni',
  REFERRALS = 'referrals',
  CAMPUS = 'campus',
  DIVERSITY = 'diversity',
  SPECIALIST = 'specialist',
  EXECUTIVE = 'executive',
}

/**
 * Job posting status
 */
export enum JobPostingStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  CLOSED = 'closed',
}

/**
 * Job board
 */
export enum JobBoard {
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  GLASSDOOR = 'glassdoor',
  MONSTER = 'monster',
  ZIPRECRUITER = 'ziprecruiter',
  CAREERBUILDER = 'careerbuilder',
  HEALTHCAREJOBSITE = 'healthcarejobsite',
  NURSE_COM = 'nurse_com',
  COMPANY_WEBSITE = 'company_website',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
}

/**
 * Campaign type
 */
export enum CampaignType {
  EMAIL = 'email',
  SMS = 'sms',
  SOCIAL_MEDIA = 'social_media',
  DISPLAY_AD = 'display_ad',
  JOB_ALERT = 'job_alert',
  EVENT = 'event',
  WEBINAR = 'webinar',
}

/**
 * Campaign status
 */
export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Referral status
 */
export enum ReferralStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  CONTACTED = 'contacted',
  INTERVIEWING = 'interviewing',
  HIRED = 'hired',
  NOT_SELECTED = 'not_selected',
  WITHDRAWN = 'withdrawn',
}

/**
 * Referral reward status
 */
export enum ReferralRewardStatus {
  PENDING = 'pending',
  ELIGIBLE = 'eligible',
  APPROVED = 'approved',
  PAID = 'paid',
  DENIED = 'denied',
}

/**
 * Campus recruitment stage
 */
export enum CampusRecruitmentStage {
  PLANNING = 'planning',
  REGISTRATION = 'registration',
  PRE_EVENT = 'pre_event',
  EVENT_DAY = 'event_day',
  POST_EVENT = 'post_event',
  FOLLOW_UP = 'follow_up',
  COMPLETED = 'completed',
}

/**
 * Agency status
 */
export enum AgencyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
}

/**
 * Diversity category
 */
export enum DiversityCategory {
  GENDER = 'gender',
  ETHNICITY = 'ethnicity',
  VETERAN = 'veteran',
  DISABILITY = 'disability',
  LGBTQ = 'lgbtq',
  AGE = 'age',
}

/**
 * EEO category
 */
export enum EEOCategory {
  EXECUTIVES_SENIOR_OFFICIALS = '1.1',
  FIRST_MID_OFFICIALS_MANAGERS = '1.2',
  PROFESSIONALS = '2',
  TECHNICIANS = '3',
  SALES_WORKERS = '4',
  ADMINISTRATIVE_SUPPORT = '5',
  CRAFT_WORKERS = '6',
  OPERATIVES = '7',
  LABORERS_HELPERS = '8',
  SERVICE_WORKERS = '9',
}

/**
 * Talent pool interface
 */
export interface TalentPool {
  id: string;
  name: string;
  description?: string;
  type: TalentPoolType;
  criteria?: Record<string, any>;
  ownerId: string;
  isActive: boolean;
  tags?: string[];
  memberCount?: number;
  metadata?: Record<string, any>;
}

/**
 * Job posting interface
 */
export interface JobPosting {
  id: string;
  requisitionId: string;
  status: JobPostingStatus;
  title: string;
  description: string;
  shortDescription?: string;
  boards: JobBoard[];
  publishedAt?: Date;
  expiresAt?: Date;
  views: number;
  applications: number;
  clicks: number;
  seoKeywords?: string[];
  metadata?: Record<string, any>;
}

/**
 * Career site page interface
 */
export interface CareerSitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isPublished: boolean;
  publishedAt?: Date;
  order: number;
}

/**
 * Recruitment campaign interface
 */
export interface RecruitmentCampaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  targetAudience?: string;
  talentPoolIds?: string[];
  requisitionIds?: string[];
  startDate: Date;
  endDate?: Date;
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Employee referral interface
 */
export interface EmployeeReferral {
  id: string;
  referrerId: string;
  candidateEmail: string;
  candidateName: string;
  candidatePhone?: string;
  candidateResume?: string;
  requisitionId: string;
  status: ReferralStatus;
  submittedAt: Date;
  contactedAt?: Date;
  hiredAt?: Date;
  rewardStatus: ReferralRewardStatus;
  rewardAmount?: number;
  rewardPaidAt?: Date;
  notes?: string;
}

/**
 * Campus recruitment event interface
 */
export interface CampusRecruitmentEvent {
  id: string;
  universityId: string;
  universityName: string;
  eventType: string;
  eventName: string;
  eventDate: Date;
  location?: string;
  stage: CampusRecruitmentStage;
  recruiters: string[];
  targetPositions: string[];
  budget?: number;
  attendees?: number;
  resumesCollected?: number;
  interviewsScheduled?: number;
  offersExtended?: number;
  hires?: number;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Recruiting agency interface
 */
export interface RecruitingAgency {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  status: AgencyStatus;
  specializations: string[];
  feeStructure?: string;
  feePercentage?: number;
  contractStartDate: Date;
  contractEndDate?: Date;
  performanceRating?: number;
  placements?: number;
  activePlacements?: number;
  metadata?: Record<string, any>;
}

/**
 * Agency submission interface
 */
export interface AgencySubmission {
  id: string;
  agencyId: string;
  requisitionId: string;
  candidateEmail: string;
  candidateName: string;
  candidateResume: string;
  submittedAt: Date;
  status: string;
  applicationId?: string;
  fee?: number;
  notes?: string;
}

/**
 * Diversity initiative interface
 */
export interface DiversityInitiative {
  id: string;
  name: string;
  description?: string;
  categories: DiversityCategory[];
  goals?: Record<string, any>;
  startDate: Date;
  endDate?: Date;
  ownerId: string;
  partnerOrganizations?: string[];
  budget?: number;
  requisitionIds?: string[];
  metrics?: Record<string, any>;
  isActive: boolean;
}

/**
 * EEO report interface
 */
export interface EEOReport {
  id: string;
  reportYear: number;
  reportType: string;
  facilityId?: string;
  totalEmployees: number;
  jobCategories: Record<EEOCategory, Record<string, number>>;
  newHires: Record<string, number>;
  promotions: Record<string, number>;
  terminations: Record<string, number>;
  generatedAt: Date;
  generatedBy: string;
  metadata?: Record<string, any>;
}

/**
 * Candidate engagement interface
 */
export interface CandidateEngagement {
  id: string;
  candidateId: string;
  engagementType: string;
  channel: string;
  subject?: string;
  content?: string;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  respondedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Sourcing channel interface
 */
export interface SourcingChannel {
  id: string;
  name: string;
  type: string;
  description?: string;
  cost?: number;
  costType?: 'fixed' | 'per_hire' | 'per_click' | 'per_application';
  applications: number;
  hires: number;
  qualityScore?: number;
  isActive: boolean;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Talent pool validation schema
 */
export const TalentPoolSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  type: z.nativeEnum(TalentPoolType),
  criteria: z.record(z.any()).optional(),
  ownerId: z.string().uuid(),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

/**
 * Job posting validation schema
 */
export const JobPostingSchema = z.object({
  requisitionId: z.string().uuid(),
  status: z.nativeEnum(JobPostingStatus),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  boards: z.array(z.nativeEnum(JobBoard)),
  publishedAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  views: z.number().int().min(0).default(0),
  applications: z.number().int().min(0).default(0),
  clicks: z.number().int().min(0).default(0),
  seoKeywords: z.array(z.string()).optional(),
});

/**
 * Career site page validation schema
 */
export const CareerSitePageSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

/**
 * Recruitment campaign validation schema
 */
export const RecruitmentCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  type: z.nativeEnum(CampaignType),
  status: z.nativeEnum(CampaignStatus),
  targetAudience: z.string().max(500).optional(),
  talentPoolIds: z.array(z.string().uuid()).optional(),
  requisitionIds: z.array(z.string().uuid()).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  budget: z.number().min(0).optional(),
  createdBy: z.string().uuid(),
});

/**
 * Employee referral validation schema
 */
export const EmployeeReferralSchema = z.object({
  referrerId: z.string().uuid(),
  candidateEmail: z.string().email(),
  candidateName: z.string().min(1).max(255),
  candidatePhone: z.string().max(20).optional(),
  candidateResume: z.string().url().optional(),
  requisitionId: z.string().uuid(),
  status: z.nativeEnum(ReferralStatus),
  rewardStatus: z.nativeEnum(ReferralRewardStatus).default(ReferralRewardStatus.PENDING),
  rewardAmount: z.number().min(0).optional(),
});

/**
 * Campus recruitment event validation schema
 */
export const CampusRecruitmentEventSchema = z.object({
  universityId: z.string().uuid(),
  universityName: z.string().min(1).max(255),
  eventType: z.string().min(1).max(100),
  eventName: z.string().min(1).max(255),
  eventDate: z.coerce.date(),
  location: z.string().max(500).optional(),
  stage: z.nativeEnum(CampusRecruitmentStage),
  recruiters: z.array(z.string().uuid()),
  targetPositions: z.array(z.string()),
  budget: z.number().min(0).optional(),
});

/**
 * Recruiting agency validation schema
 */
export const RecruitingAgencySchema = z.object({
  name: z.string().min(1).max(255),
  contactName: z.string().min(1).max(255),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(20).optional(),
  website: z.string().url().optional(),
  status: z.nativeEnum(AgencyStatus),
  specializations: z.array(z.string()),
  feeStructure: z.string().max(500).optional(),
  feePercentage: z.number().min(0).max(100).optional(),
  contractStartDate: z.coerce.date(),
  contractEndDate: z.coerce.date().optional(),
});

/**
 * Diversity initiative validation schema
 */
export const DiversityInitiativeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  categories: z.array(z.nativeEnum(DiversityCategory)),
  goals: z.record(z.any()).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  ownerId: z.string().uuid(),
  partnerOrganizations: z.array(z.string()).optional(),
  budget: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Talent Pool Model
 */
@Table({
  tableName: 'talent_pools',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['owner_id'] },
    { fields: ['is_active'] },
  ],
})
export class TalentPoolModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(TalentPoolType)),
    allowNull: false,
  })
  type: TalentPoolType;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  criteria: Record<string, any>;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id',
  })
  ownerId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  tags: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'member_count',
  })
  memberCount: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Job Posting Model
 */
@Table({
  tableName: 'job_postings',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['requisition_id'] },
    { fields: ['status'] },
    { fields: ['published_at'] },
    { fields: ['expires_at'] },
  ],
})
export class JobPostingModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @Column({
    type: DataType.ENUM(...Object.values(JobPostingStatus)),
    allowNull: false,
    defaultValue: JobPostingStatus.DRAFT,
  })
  status: JobPostingStatus;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'short_description',
  })
  shortDescription: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  boards: JobBoard[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'published_at',
  })
  publishedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expires_at',
  })
  expiresAt: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  views: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  applications: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  clicks: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'seo_keywords',
  })
  seoKeywords: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Career Site Page Model
 */
@Table({
  tableName: 'career_site_pages',
  timestamps: true,
  indexes: [
    { fields: ['slug'], unique: true },
    { fields: ['is_published'] },
    { fields: ['order'] },
  ],
})
export class CareerSitePageModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'meta_description',
  })
  metaDescription: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'meta_keywords',
  })
  metaKeywords: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_published',
  })
  isPublished: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'published_at',
  })
  publishedAt: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Recruitment Campaign Model
 */
@Table({
  tableName: 'recruitment_campaigns',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['start_date'] },
    { fields: ['created_by'] },
  ],
})
export class RecruitmentCampaignModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(CampaignType)),
    allowNull: false,
  })
  type: CampaignType;

  @Column({
    type: DataType.ENUM(...Object.values(CampaignStatus)),
    allowNull: false,
    defaultValue: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'target_audience',
  })
  targetAudience: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'talent_pool_ids',
  })
  talentPoolIds: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'requisition_ids',
  })
  requisitionIds: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  budget: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  spent: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  impressions: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  clicks: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  conversions: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  createdBy: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Employee Referral Model
 */
@Table({
  tableName: 'employee_referrals',
  timestamps: true,
  indexes: [
    { fields: ['referrer_id'] },
    { fields: ['requisition_id'] },
    { fields: ['status'] },
    { fields: ['reward_status'] },
  ],
})
export class EmployeeReferralModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'referrer_id',
  })
  referrerId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'candidate_email',
  })
  candidateEmail: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'candidate_name',
  })
  candidateName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'candidate_phone',
  })
  candidatePhone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'candidate_resume',
  })
  candidateResume: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReferralStatus)),
    allowNull: false,
    defaultValue: ReferralStatus.SUBMITTED,
  })
  status: ReferralStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'submitted_at',
  })
  submittedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'contacted_at',
  })
  contactedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'hired_at',
  })
  hiredAt: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ReferralRewardStatus)),
    allowNull: false,
    defaultValue: ReferralRewardStatus.PENDING,
    field: 'reward_status',
  })
  rewardStatus: ReferralRewardStatus;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    field: 'reward_amount',
  })
  rewardAmount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'reward_paid_at',
  })
  rewardPaidAt: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Campus Recruitment Event Model
 */
@Table({
  tableName: 'campus_recruitment_events',
  timestamps: true,
  indexes: [
    { fields: ['university_id'] },
    { fields: ['event_date'] },
    { fields: ['stage'] },
  ],
})
export class CampusRecruitmentEventModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'university_id',
  })
  universityId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'university_name',
  })
  universityName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'event_type',
  })
  eventType: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'event_name',
  })
  eventName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'event_date',
  })
  eventDate: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.ENUM(...Object.values(CampusRecruitmentStage)),
    allowNull: false,
    defaultValue: CampusRecruitmentStage.PLANNING,
  })
  stage: CampusRecruitmentStage;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  recruiters: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    field: 'target_positions',
  })
  targetPositions: string[];

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  budget: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attendees: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'resumes_collected',
  })
  resumesCollected: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'interviews_scheduled',
  })
  interviewsScheduled: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'offers_extended',
  })
  offersExtended: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  hires: number;

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Recruiting Agency Model
 */
@Table({
  tableName: 'recruiting_agencies',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['performance_rating'] },
  ],
})
export class RecruitingAgencyModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'contact_name',
  })
  contactName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'contact_email',
  })
  contactEmail: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'contact_phone',
  })
  contactPhone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  website: string;

  @Column({
    type: DataType.ENUM(...Object.values(AgencyStatus)),
    allowNull: false,
    defaultValue: AgencyStatus.ACTIVE,
  })
  status: AgencyStatus;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  specializations: string[];

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'fee_structure',
  })
  feeStructure: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    field: 'fee_percentage',
  })
  feePercentage: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'contract_start_date',
  })
  contractStartDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'contract_end_date',
  })
  contractEndDate: Date;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    field: 'performance_rating',
  })
  performanceRating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  placements: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'active_placements',
  })
  activePlacements: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @HasMany(() => AgencySubmissionModel)
  submissions: AgencySubmissionModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Agency Submission Model
 */
@Table({
  tableName: 'agency_submissions',
  timestamps: true,
  indexes: [
    { fields: ['agency_id'] },
    { fields: ['requisition_id'] },
    { fields: ['status'] },
  ],
})
export class AgencySubmissionModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => RecruitingAgencyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'agency_id',
  })
  agencyId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requisition_id',
  })
  requisitionId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'candidate_email',
  })
  candidateEmail: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'candidate_name',
  })
  candidateName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'candidate_resume',
  })
  candidateResume: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'submitted_at',
  })
  submittedAt: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'application_id',
  })
  applicationId: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  fee: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => RecruitingAgencyModel)
  agency: RecruitingAgencyModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Diversity Initiative Model
 */
@Table({
  tableName: 'diversity_initiatives',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['owner_id'] },
    { fields: ['is_active'] },
    { fields: ['start_date'] },
  ],
})
export class DiversityInitiativeModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  categories: DiversityCategory[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  goals: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id',
  })
  ownerId: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'partner_organizations',
  })
  partnerOrganizations: string[];

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  budget: number;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'requisition_ids',
  })
  requisitionIds: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metrics: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * EEO Report Model
 */
@Table({
  tableName: 'eeo_reports',
  timestamps: true,
  indexes: [
    { fields: ['report_year'] },
    { fields: ['report_type'] },
  ],
})
export class EEOReportModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'report_year',
  })
  reportYear: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'report_type',
  })
  reportType: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'facility_id',
  })
  facilityId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'total_employees',
  })
  totalEmployees: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'job_categories',
  })
  jobCategories: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'new_hires',
  })
  newHires: Record<string, number>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  promotions: Record<string, number>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  terminations: Record<string, number>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'generated_at',
  })
  generatedAt: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'generated_by',
  })
  generatedBy: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Candidate Engagement Model
 */
@Table({
  tableName: 'candidate_engagements',
  timestamps: true,
  indexes: [
    { fields: ['candidate_id'] },
    { fields: ['engagement_type'] },
    { fields: ['sent_at'] },
  ],
})
export class CandidateEngagementModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'candidate_id',
  })
  candidateId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'engagement_type',
  })
  engagementType: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  channel: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'sent_at',
  })
  sentAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'opened_at',
  })
  openedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'clicked_at',
  })
  clickedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'responded_at',
  })
  respondedAt: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Sourcing Channel Model
 */
@Table({
  tableName: 'sourcing_channels',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['is_active'] },
  ],
})
export class SourcingChannelModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  cost: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'cost_type',
  })
  costType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  applications: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  hires: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    field: 'quality_score',
  })
  qualityScore: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// TALENT POOL FUNCTIONS
// ============================================================================

/**
 * Create talent pool
 */
export async function createTalentPool(
  poolData: Partial<TalentPool>,
  transaction?: Transaction,
): Promise<TalentPoolModel> {
  const validated = TalentPoolSchema.parse(poolData);
  return TalentPoolModel.create(validated as any, { transaction });
}

/**
 * Update talent pool
 */
export async function updateTalentPool(
  poolId: string,
  updates: Partial<TalentPool>,
  transaction?: Transaction,
): Promise<TalentPoolModel> {
  const pool = await TalentPoolModel.findByPk(poolId, { transaction });
  if (!pool) {
    throw new NotFoundException(`Talent pool ${poolId} not found`);
  }
  await pool.update(updates, { transaction });
  return pool;
}

/**
 * Get talent pool by ID
 */
export async function getTalentPoolById(poolId: string): Promise<TalentPoolModel | null> {
  return TalentPoolModel.findByPk(poolId);
}

/**
 * Get all talent pools
 */
export async function getAllTalentPools(activeOnly: boolean = true): Promise<TalentPoolModel[]> {
  const where: WhereOptions = activeOnly ? { isActive: true } : {};
  return TalentPoolModel.findAll({ where, order: [['name', 'ASC']] });
}

/**
 * Delete talent pool
 */
export async function deleteTalentPool(
  poolId: string,
  transaction?: Transaction,
): Promise<void> {
  await TalentPoolModel.destroy({ where: { id: poolId }, transaction });
}

// ============================================================================
// JOB POSTING FUNCTIONS
// ============================================================================

/**
 * Create job posting
 */
export async function createJobPosting(
  postingData: Partial<JobPosting>,
  transaction?: Transaction,
): Promise<JobPostingModel> {
  const validated = JobPostingSchema.parse(postingData);
  return JobPostingModel.create(validated as any, { transaction });
}

/**
 * Publish job posting
 */
export async function publishJobPosting(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.update(
    { status: JobPostingStatus.ACTIVE, publishedAt: new Date() },
    { where: { id: postingId }, transaction },
  );
}

/**
 * Pause job posting
 */
export async function pauseJobPosting(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.update(
    { status: JobPostingStatus.PAUSED },
    { where: { id: postingId }, transaction },
  );
}

/**
 * Close job posting
 */
export async function closeJobPosting(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.update(
    { status: JobPostingStatus.CLOSED },
    { where: { id: postingId }, transaction },
  );
}

/**
 * Track job posting view
 */
export async function trackJobPostingView(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.increment('views', { where: { id: postingId }, transaction });
}

/**
 * Track job posting click
 */
export async function trackJobPostingClick(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.increment('clicks', { where: { id: postingId }, transaction });
}

/**
 * Track job posting application
 */
export async function trackJobPostingApplication(
  postingId: string,
  transaction?: Transaction,
): Promise<void> {
  await JobPostingModel.increment('applications', { where: { id: postingId }, transaction });
}

/**
 * Get active job postings
 */
export async function getActiveJobPostings(): Promise<JobPostingModel[]> {
  return JobPostingModel.findAll({
    where: { status: JobPostingStatus.ACTIVE },
    order: [['publishedAt', 'DESC']],
  });
}

// ============================================================================
// CAREER SITE FUNCTIONS
// ============================================================================

/**
 * Create career site page
 */
export async function createCareerSitePage(
  pageData: Partial<CareerSitePage>,
  transaction?: Transaction,
): Promise<CareerSitePageModel> {
  const validated = CareerSitePageSchema.parse(pageData);
  return CareerSitePageModel.create(validated as any, { transaction });
}

/**
 * Update career site page
 */
export async function updateCareerSitePage(
  pageId: string,
  updates: Partial<CareerSitePage>,
  transaction?: Transaction,
): Promise<CareerSitePageModel> {
  const page = await CareerSitePageModel.findByPk(pageId, { transaction });
  if (!page) {
    throw new NotFoundException(`Career site page ${pageId} not found`);
  }
  await page.update(updates, { transaction });
  return page;
}

/**
 * Publish career site page
 */
export async function publishCareerSitePage(
  pageId: string,
  transaction?: Transaction,
): Promise<void> {
  await CareerSitePageModel.update(
    { isPublished: true, publishedAt: new Date() },
    { where: { id: pageId }, transaction },
  );
}

/**
 * Get career site page by slug
 */
export async function getCareerSitePageBySlug(slug: string): Promise<CareerSitePageModel | null> {
  return CareerSitePageModel.findOne({ where: { slug, isPublished: true } });
}

/**
 * Get all published career site pages
 */
export async function getPublishedCareerSitePages(): Promise<CareerSitePageModel[]> {
  return CareerSitePageModel.findAll({
    where: { isPublished: true },
    order: [['order', 'ASC']],
  });
}

// ============================================================================
// RECRUITMENT CAMPAIGN FUNCTIONS
// ============================================================================

/**
 * Create recruitment campaign
 */
export async function createRecruitmentCampaign(
  campaignData: Partial<RecruitmentCampaign>,
  transaction?: Transaction,
): Promise<RecruitmentCampaignModel> {
  const validated = RecruitmentCampaignSchema.parse(campaignData);
  return RecruitmentCampaignModel.create(validated as any, { transaction });
}

/**
 * Launch campaign
 */
export async function launchCampaign(
  campaignId: string,
  transaction?: Transaction,
): Promise<void> {
  await RecruitmentCampaignModel.update(
    { status: CampaignStatus.ACTIVE },
    { where: { id: campaignId }, transaction },
  );
}

/**
 * Pause campaign
 */
export async function pauseCampaign(
  campaignId: string,
  transaction?: Transaction,
): Promise<void> {
  await RecruitmentCampaignModel.update(
    { status: CampaignStatus.PAUSED },
    { where: { id: campaignId }, transaction },
  );
}

/**
 * Track campaign metrics
 */
export async function trackCampaignMetrics(
  campaignId: string,
  metrics: { impressions?: number; clicks?: number; conversions?: number; spent?: number },
  transaction?: Transaction,
): Promise<void> {
  const updateData: any = {};
  if (metrics.impressions) updateData.impressions = metrics.impressions;
  if (metrics.clicks) updateData.clicks = metrics.clicks;
  if (metrics.conversions) updateData.conversions = metrics.conversions;
  if (metrics.spent) updateData.spent = metrics.spent;

  await RecruitmentCampaignModel.update(updateData, { where: { id: campaignId }, transaction });
}

/**
 * Get campaign ROI
 */
export async function getCampaignROI(campaignId: string): Promise<number | null> {
  const campaign = await RecruitmentCampaignModel.findByPk(campaignId);
  if (!campaign || !campaign.spent || campaign.spent === 0) {
    return null;
  }

  return campaign.conversions / campaign.spent;
}

// ============================================================================
// EMPLOYEE REFERRAL FUNCTIONS
// ============================================================================

/**
 * Submit employee referral
 */
export async function submitEmployeeReferral(
  referralData: Partial<EmployeeReferral>,
  transaction?: Transaction,
): Promise<EmployeeReferralModel> {
  const validated = EmployeeReferralSchema.parse(referralData);
  return EmployeeReferralModel.create(validated as any, { transaction });
}

/**
 * Update referral status
 */
export async function updateReferralStatus(
  referralId: string,
  newStatus: ReferralStatus,
  transaction?: Transaction,
): Promise<void> {
  const updateData: any = { status: newStatus };

  if (newStatus === ReferralStatus.CONTACTED) {
    updateData.contactedAt = new Date();
  } else if (newStatus === ReferralStatus.HIRED) {
    updateData.hiredAt = new Date();
    updateData.rewardStatus = ReferralRewardStatus.ELIGIBLE;
  }

  await EmployeeReferralModel.update(updateData, { where: { id: referralId }, transaction });
}

/**
 * Approve referral reward
 */
export async function approveReferralReward(
  referralId: string,
  rewardAmount: number,
  transaction?: Transaction,
): Promise<void> {
  await EmployeeReferralModel.update(
    { rewardStatus: ReferralRewardStatus.APPROVED, rewardAmount },
    { where: { id: referralId }, transaction },
  );
}

/**
 * Pay referral reward
 */
export async function payReferralReward(
  referralId: string,
  transaction?: Transaction,
): Promise<void> {
  await EmployeeReferralModel.update(
    { rewardStatus: ReferralRewardStatus.PAID, rewardPaidAt: new Date() },
    { where: { id: referralId }, transaction },
  );
}

/**
 * Get referrals by employee
 */
export async function getReferralsByEmployee(employeeId: string): Promise<EmployeeReferralModel[]> {
  return EmployeeReferralModel.findAll({
    where: { referrerId: employeeId },
    order: [['submittedAt', 'DESC']],
  });
}

/**
 * Calculate referral program metrics
 */
export async function calculateReferralProgramMetrics(
  startDate: Date,
  endDate: Date,
): Promise<{
  totalReferrals: number;
  hiredReferrals: number;
  totalRewardsPaid: number;
  conversionRate: number;
}> {
  const referrals = await EmployeeReferralModel.findAll({
    where: {
      submittedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const hiredReferrals = referrals.filter((r) => r.status === ReferralStatus.HIRED);
  const totalRewardsPaid = referrals
    .filter((r) => r.rewardStatus === ReferralRewardStatus.PAID)
    .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);

  return {
    totalReferrals: referrals.length,
    hiredReferrals: hiredReferrals.length,
    totalRewardsPaid,
    conversionRate: referrals.length > 0 ? (hiredReferrals.length / referrals.length) * 100 : 0,
  };
}

// ============================================================================
// CAMPUS RECRUITMENT FUNCTIONS
// ============================================================================

/**
 * Create campus recruitment event
 */
export async function createCampusRecruitmentEvent(
  eventData: Partial<CampusRecruitmentEvent>,
  transaction?: Transaction,
): Promise<CampusRecruitmentEventModel> {
  const validated = CampusRecruitmentEventSchema.parse(eventData);
  return CampusRecruitmentEventModel.create(validated as any, { transaction });
}

/**
 * Update event stage
 */
export async function updateCampusEventStage(
  eventId: string,
  newStage: CampusRecruitmentStage,
  transaction?: Transaction,
): Promise<void> {
  await CampusRecruitmentEventModel.update(
    { stage: newStage },
    { where: { id: eventId }, transaction },
  );
}

/**
 * Update event metrics
 */
export async function updateCampusEventMetrics(
  eventId: string,
  metrics: {
    attendees?: number;
    resumesCollected?: number;
    interviewsScheduled?: number;
    offersExtended?: number;
    hires?: number;
  },
  transaction?: Transaction,
): Promise<void> {
  await CampusRecruitmentEventModel.update(metrics, { where: { id: eventId }, transaction });
}

/**
 * Get upcoming campus events
 */
export async function getUpcomingCampusEvents(days: number = 30): Promise<CampusRecruitmentEventModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return CampusRecruitmentEventModel.findAll({
    where: {
      eventDate: { [Op.between]: [new Date(), futureDate] },
    },
    order: [['eventDate', 'ASC']],
  });
}

/**
 * Calculate campus recruitment ROI
 */
export async function calculateCampusRecruitmentROI(
  eventId: string,
): Promise<number | null> {
  const event = await CampusRecruitmentEventModel.findByPk(eventId);
  if (!event || !event.budget || event.budget === 0 || event.hires === 0) {
    return null;
  }

  return event.budget / event.hires; // Cost per hire
}

// ============================================================================
// AGENCY MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Add recruiting agency
 */
export async function addRecruitingAgency(
  agencyData: Partial<RecruitingAgency>,
  transaction?: Transaction,
): Promise<RecruitingAgencyModel> {
  const validated = RecruitingAgencySchema.parse(agencyData);
  return RecruitingAgencyModel.create(validated as any, { transaction });
}

/**
 * Update agency status
 */
export async function updateAgencyStatus(
  agencyId: string,
  newStatus: AgencyStatus,
  transaction?: Transaction,
): Promise<void> {
  await RecruitingAgencyModel.update({ status: newStatus }, { where: { id: agencyId }, transaction });
}

/**
 * Rate agency performance
 */
export async function rateAgencyPerformance(
  agencyId: string,
  rating: number,
  transaction?: Transaction,
): Promise<void> {
  if (rating < 0 || rating > 5) {
    throw new BadRequestException('Rating must be between 0 and 5');
  }
  await RecruitingAgencyModel.update({ performanceRating: rating }, { where: { id: agencyId }, transaction });
}

/**
 * Submit agency candidate
 */
export async function submitAgencyCandidate(
  submissionData: Partial<AgencySubmission>,
  transaction?: Transaction,
): Promise<AgencySubmissionModel> {
  return AgencySubmissionModel.create(submissionData as any, { transaction });
}

/**
 * Get agency submissions
 */
export async function getAgencySubmissions(
  agencyId: string,
  status?: string,
): Promise<AgencySubmissionModel[]> {
  const where: WhereOptions = { agencyId };
  if (status) {
    where.status = status;
  }

  return AgencySubmissionModel.findAll({
    where,
    order: [['submittedAt', 'DESC']],
  });
}

/**
 * Calculate agency performance metrics
 */
export async function calculateAgencyPerformanceMetrics(
  agencyId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  submissions: number;
  interviews: number;
  hires: number;
  conversionRate: number;
}> {
  const submissions = await AgencySubmissionModel.findAll({
    where: {
      agencyId,
      submittedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const interviews = submissions.filter((s) => s.status === 'interview' || s.status === 'hired').length;
  const hires = submissions.filter((s) => s.status === 'hired').length;

  return {
    submissions: submissions.length,
    interviews,
    hires,
    conversionRate: submissions.length > 0 ? (hires / submissions.length) * 100 : 0,
  };
}

// ============================================================================
// DIVERSITY RECRUITMENT FUNCTIONS
// ============================================================================

/**
 * Create diversity initiative
 */
export async function createDiversityInitiative(
  initiativeData: Partial<DiversityInitiative>,
  transaction?: Transaction,
): Promise<DiversityInitiativeModel> {
  const validated = DiversityInitiativeSchema.parse(initiativeData);
  return DiversityInitiativeModel.create(validated as any, { transaction });
}

/**
 * Update initiative metrics
 */
export async function updateDiversityInitiativeMetrics(
  initiativeId: string,
  metrics: Record<string, any>,
  transaction?: Transaction,
): Promise<void> {
  await DiversityInitiativeModel.update({ metrics }, { where: { id: initiativeId }, transaction });
}

/**
 * Get active diversity initiatives
 */
export async function getActiveDiversityInitiatives(): Promise<DiversityInitiativeModel[]> {
  return DiversityInitiativeModel.findAll({
    where: { isActive: true },
    order: [['startDate', 'DESC']],
  });
}

// ============================================================================
// COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Generate EEO report
 */
export async function generateEEOReport(
  reportData: Partial<EEOReport>,
  transaction?: Transaction,
): Promise<EEOReportModel> {
  return EEOReportModel.create(reportData as any, { transaction });
}

/**
 * Get EEO reports by year
 */
export async function getEEOReportsByYear(year: number): Promise<EEOReportModel[]> {
  return EEOReportModel.findAll({
    where: { reportYear: year },
    order: [['generatedAt', 'DESC']],
  });
}

// ============================================================================
// CANDIDATE ENGAGEMENT FUNCTIONS
// ============================================================================

/**
 * Track candidate engagement
 */
export async function trackCandidateEngagement(
  engagementData: Partial<CandidateEngagement>,
  transaction?: Transaction,
): Promise<CandidateEngagementModel> {
  return CandidateEngagementModel.create(engagementData as any, { transaction });
}

/**
 * Get candidate engagement history
 */
export async function getCandidateEngagementHistory(
  candidateId: string,
): Promise<CandidateEngagementModel[]> {
  return CandidateEngagementModel.findAll({
    where: { candidateId },
    order: [['sentAt', 'DESC']],
  });
}

/**
 * Calculate engagement rate
 */
export async function calculateEngagementRate(
  candidateId: string,
): Promise<{ openRate: number; clickRate: number; responseRate: number }> {
  const engagements = await getCandidateEngagementHistory(candidateId);

  const sent = engagements.filter((e) => e.sentAt).length;
  const opened = engagements.filter((e) => e.openedAt).length;
  const clicked = engagements.filter((e) => e.clickedAt).length;
  const responded = engagements.filter((e) => e.respondedAt).length;

  return {
    openRate: sent > 0 ? (opened / sent) * 100 : 0,
    clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
    responseRate: sent > 0 ? (responded / sent) * 100 : 0,
  };
}

// ============================================================================
// SOURCING CHANNEL FUNCTIONS
// ============================================================================

/**
 * Add sourcing channel
 */
export async function addSourcingChannel(
  channelData: Partial<SourcingChannel>,
  transaction?: Transaction,
): Promise<SourcingChannelModel> {
  return SourcingChannelModel.create(channelData as any, { transaction });
}

/**
 * Track sourcing channel performance
 */
export async function trackSourcingChannelPerformance(
  channelId: string,
  applications: number,
  hires: number,
  transaction?: Transaction,
): Promise<void> {
  await SourcingChannelModel.increment(
    { applications, hires },
    { where: { id: channelId }, transaction },
  );
}

/**
 * Calculate sourcing channel ROI
 */
export async function calculateSourcingChannelROI(
  channelId: string,
): Promise<number | null> {
  const channel = await SourcingChannelModel.findByPk(channelId);
  if (!channel || !channel.cost || channel.cost === 0 || channel.hires === 0) {
    return null;
  }

  return channel.cost / channel.hires; // Cost per hire
}

/**
 * Get top performing sourcing channels
 */
export async function getTopPerformingSourcingChannels(limit: number = 10): Promise<SourcingChannelModel[]> {
  return SourcingChannelModel.findAll({
    where: { isActive: true },
    order: [['hires', 'DESC']],
    limit,
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate cost per hire by source
 */
export function calculateCostPerHire(totalCost: number, totalHires: number): number {
  return totalHires > 0 ? totalCost / totalHires : 0;
}

/**
 * Calculate quality of hire
 */
export function calculateQualityOfHire(
  performanceRating: number,
  retentionRate: number,
  productivityScore: number,
): number {
  return (performanceRating * 0.4 + retentionRate * 0.3 + productivityScore * 0.3);
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class TalentAcquisitionService {
  async createTalentPool(data: Partial<TalentPool>): Promise<TalentPoolModel> {
    return createTalentPool(data);
  }

  async createJobPosting(data: Partial<JobPosting>): Promise<JobPostingModel> {
    return createJobPosting(data);
  }

  async submitReferral(data: Partial<EmployeeReferral>): Promise<EmployeeReferralModel> {
    return submitEmployeeReferral(data);
  }

  async createCampaign(data: Partial<RecruitmentCampaign>): Promise<RecruitmentCampaignModel> {
    return createRecruitmentCampaign(data);
  }

  async createCampusEvent(data: Partial<CampusRecruitmentEvent>): Promise<CampusRecruitmentEventModel> {
    return createCampusRecruitmentEvent(data);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Talent Acquisition')
@Controller('talent-acquisition')
@ApiBearerAuth()
export class TalentAcquisitionController {
  constructor(private readonly talentService: TalentAcquisitionService) {}

  @Post('talent-pools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create talent pool' })
  async createTalentPool(@Body() data: Partial<TalentPool>) {
    return this.talentService.createTalentPool(data);
  }

  @Post('job-postings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create job posting' })
  async createJobPosting(@Body() data: Partial<JobPosting>) {
    return this.talentService.createJobPosting(data);
  }

  @Post('referrals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit employee referral' })
  async submitReferral(@Body() data: Partial<EmployeeReferral>) {
    return this.talentService.submitReferral(data);
  }

  @Get('job-postings/active')
  @ApiOperation({ summary: 'Get active job postings' })
  async getActivePostings() {
    return getActiveJobPostings();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  TalentPoolModel,
  JobPostingModel,
  CareerSitePageModel,
  RecruitmentCampaignModel,
  EmployeeReferralModel,
  CampusRecruitmentEventModel,
  RecruitingAgencyModel,
  AgencySubmissionModel,
  DiversityInitiativeModel,
  EEOReportModel,
  CandidateEngagementModel,
  SourcingChannelModel,
  TalentAcquisitionService,
  TalentAcquisitionController,
};
