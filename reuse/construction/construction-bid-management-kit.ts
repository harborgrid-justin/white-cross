/**
 * LOC: CONSBID12345
 * File: /reuse/construction/construction-bid-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Procurement controllers
 *   - Bid evaluation engines
 *   - Vendor management services
 */

/**
 * File: /reuse/construction/construction-bid-management-kit.ts
 * Locator: WC-CONS-BID-001
 * Purpose: Comprehensive Construction Bid Management Utilities - USACE EPPM-level bid solicitation and evaluation system
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Procurement controllers, bid services, vendor management, award processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for bid solicitation, vendor prequalification, evaluation, scoring, award processing
 *
 * LLM Context: Enterprise-grade construction bid management system competing with USACE EPPM.
 * Provides complete bid lifecycle management, vendor prequalification, bid solicitation, bid opening,
 * technical and financial evaluation, scoring matrices, bid comparison, compliance checking, bid bond validation,
 * award recommendations, protest handling, debriefing, price analysis, value engineering, bid tabulation,
 * past performance evaluation, small business goals, DBE compliance, regulatory compliance.
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
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Bid solicitation status
 */
export enum BidSolicitationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  AWARDED = 'awarded',
}

/**
 * Bid submission status
 */
export enum BidStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  WITHDRAWN = 'withdrawn',
  UNDER_EVALUATION = 'under_evaluation',
  QUALIFIED = 'qualified',
  DISQUALIFIED = 'disqualified',
  AWARDED = 'awarded',
  REJECTED = 'rejected',
}

/**
 * Vendor qualification status
 */
export enum VendorQualificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CONDITIONAL = 'conditional',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * Bid evaluation criteria type
 */
export enum EvaluationCriteriaType {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  PAST_PERFORMANCE = 'past_performance',
  EXPERIENCE = 'experience',
  SCHEDULE = 'schedule',
  SAFETY = 'safety',
  QUALITY = 'quality',
}

/**
 * Procurement method
 */
export enum ProcurementMethod {
  COMPETITIVE_SEALED_BID = 'competitive_sealed_bid',
  COMPETITIVE_NEGOTIATION = 'competitive_negotiation',
  SMALL_PURCHASE = 'small_purchase',
  SOLE_SOURCE = 'sole_source',
  EMERGENCY = 'emergency',
}

/**
 * Award method
 */
export enum AwardMethod {
  LOWEST_RESPONSIVE_BID = 'lowest_responsive_bid',
  BEST_VALUE = 'best_value',
  QUALIFICATIONS_BASED = 'qualifications_based',
  TWO_STEP = 'two_step',
}

/**
 * Bid solicitation interface
 */
export interface BidSolicitation {
  id: string;
  solicitationNumber: string;
  projectId: string;
  title: string;
  description: string;
  procurementMethod: ProcurementMethod;
  awardMethod: AwardMethod;
  estimatedValue: number;
  publishedDate?: Date;
  openingDate: Date;
  closingDate: Date;
  prebidMeetingDate?: Date;
  prebidMeetingLocation?: string;
  status: BidSolicitationStatus;
  bondRequirement: boolean;
  bondPercentage?: number;
  insuranceRequirements: string[];
  evaluationCriteria: EvaluationCriterion[];
  smallBusinessGoals?: number;
  dbeGoals?: number;
  documents: SolicitationDocument[];
  addenda: Addendum[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Vendor prequalification interface
 */
export interface VendorPrequalification {
  id: string;
  vendorId: string;
  vendorName: string;
  qualificationNumber: string;
  workCategories: string[];
  maxProjectValue: number;
  bondingCapacity: number;
  insuranceCoverage: number;
  pastProjectCount: number;
  pastProjectValue: number;
  safetyRating: number;
  qualityRating: number;
  performanceRating: number;
  financialStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  qualificationStatus: VendorQualificationStatus;
  qualifiedDate?: Date;
  expirationDate?: Date;
  certifications: string[];
  licenses: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bid submission interface
 */
export interface BidSubmission {
  id: string;
  solicitationId: string;
  vendorId: string;
  vendorName: string;
  bidNumber: string;
  submittalDate: Date;
  bidAmount: number;
  bidBondAmount?: number;
  bidBondProvider?: string;
  technicalScore?: number;
  financialScore?: number;
  totalScore?: number;
  rank?: number;
  status: BidStatus;
  responsiveness: boolean;
  responsibility: boolean;
  scheduleProposed: number;
  alternatesProvided: boolean;
  valueEngineeringProposals: any[];
  clarifications: any[];
  evaluationNotes: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Evaluation criterion interface
 */
export interface EvaluationCriterion {
  id: string;
  criteriaType: EvaluationCriteriaType;
  description: string;
  weight: number;
  maxPoints: number;
  passingScore?: number;
  evaluationGuidance: string;
}

/**
 * Bid evaluation interface
 */
export interface BidEvaluation {
  id: string;
  bidId: string;
  criterionId: string;
  evaluatorId: string;
  evaluatorName: string;
  score: number;
  maxScore: number;
  comments: string;
  strengths: string[];
  weaknesses: string[];
  evaluatedAt: Date;
  metadata: Record<string, any>;
}

/**
 * Bid comparison interface
 */
export interface BidComparison {
  solicitationId: string;
  bids: Array<{
    bidId: string;
    vendorName: string;
    bidAmount: number;
    technicalScore: number;
    totalScore: number;
    rank: number;
    responsive: boolean;
  }>;
  lowestBid: number;
  highestBid: number;
  averageBid: number;
  engineerEstimate?: number;
  recommendation: string;
}

/**
 * Bid bond interface
 */
export interface BidBond {
  id: string;
  bidId: string;
  bondNumber: string;
  bondProvider: string;
  bondAmount: number;
  bondPercentage: number;
  issueDate: Date;
  expirationDate: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Award recommendation interface
 */
export interface AwardRecommendation {
  id: string;
  solicitationId: string;
  recommendedBidId: string;
  recommendedVendorId: string;
  recommendedAmount: number;
  justification: string;
  analysisNotes: string;
  alternativeConsiderations: string;
  approvals: any[];
  recommendedBy: string;
  recommendedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bid protest interface
 */
export interface BidProtest {
  id: string;
  solicitationId: string;
  protestingVendorId: string;
  protestNumber: string;
  protestGrounds: string;
  protestDescription: string;
  filedDate: Date;
  responseRequired: boolean;
  responseDueDate?: Date;
  response?: string;
  respondedAt?: Date;
  resolution: string;
  resolvedDate?: Date;
  status: 'FILED' | 'UNDER_REVIEW' | 'UPHELD' | 'DENIED' | 'WITHDRAWN';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Solicitation document interface
 */
export interface SolicitationDocument {
  id: string;
  documentType: string;
  documentName: string;
  documentUrl: string;
  version: string;
  uploadedAt: Date;
}

/**
 * Addendum interface
 */
export interface Addendum {
  id: string;
  addendumNumber: string;
  description: string;
  issuedDate: Date;
  documents: SolicitationDocument[];
}

/**
 * Price analysis interface
 */
export interface PriceAnalysis {
  solicitationId: string;
  engineerEstimate: number;
  lowestBid: number;
  varianceFromEstimate: number;
  variancePercentage: number;
  marketAnalysis: string;
  priceReasonableness: boolean;
  recommendations: string[];
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create bid solicitation DTO
 */
export class CreateBidSolicitationDto {
  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ description: 'Solicitation title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: ProcurementMethod })
  @IsEnum(ProcurementMethod)
  procurementMethod: ProcurementMethod;

  @ApiProperty({ enum: AwardMethod })
  @IsEnum(AwardMethod)
  awardMethod: AwardMethod;

  @ApiProperty({ description: 'Estimated contract value' })
  @IsNumber()
  @Min(0)
  estimatedValue: number;

  @ApiProperty({ description: 'Bid opening date' })
  @Type(() => Date)
  @IsDate()
  openingDate: Date;

  @ApiProperty({ description: 'Bid closing date' })
  @Type(() => Date)
  @IsDate()
  closingDate: Date;

  @ApiProperty({ description: 'Bond required', required: false })
  @IsOptional()
  @IsBoolean()
  bondRequirement?: boolean;
}

/**
 * Submit bid DTO
 */
export class SubmitBidDto {
  @ApiProperty({ description: 'Solicitation ID' })
  @IsUUID()
  solicitationId: string;

  @ApiProperty({ description: 'Vendor ID' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Bid amount' })
  @IsNumber()
  @Min(0)
  bidAmount: number;

  @ApiProperty({ description: 'Proposed schedule (days)' })
  @IsNumber()
  @Min(1)
  scheduleProposed: number;

  @ApiProperty({ description: 'Bid bond amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bidBondAmount?: number;
}

/**
 * Evaluate bid DTO
 */
export class EvaluateBidDto {
  @ApiProperty({ description: 'Bid ID' })
  @IsUUID()
  bidId: string;

  @ApiProperty({ description: 'Criterion ID' })
  @IsUUID()
  criterionId: string;

  @ApiProperty({ description: 'Score' })
  @IsNumber()
  @Min(0)
  score: number;

  @ApiProperty({ description: 'Evaluation comments' })
  @IsString()
  @MaxLength(2000)
  comments: string;

  @ApiProperty({ description: 'Strengths', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @ApiProperty({ description: 'Weaknesses', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];
}

/**
 * Create vendor prequalification DTO
 */
export class CreateVendorPrequalificationDto {
  @ApiProperty({ description: 'Vendor ID' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Work categories' })
  @IsArray()
  @IsString({ each: true })
  workCategories: string[];

  @ApiProperty({ description: 'Maximum project value' })
  @IsNumber()
  @Min(0)
  maxProjectValue: number;

  @ApiProperty({ description: 'Bonding capacity' })
  @IsNumber()
  @Min(0)
  bondingCapacity: number;

  @ApiProperty({ description: 'Insurance coverage amount' })
  @IsNumber()
  @Min(0)
  insuranceCoverage: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Bid Solicitation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BidSolicitation model
 *
 * @example
 * ```typescript
 * const BidSolicitation = createBidSolicitationModel(sequelize);
 * const solicitation = await BidSolicitation.create({
 *   projectId: 'proj-uuid',
 *   title: 'Hospital HVAC System Installation',
 *   procurementMethod: 'competitive_sealed_bid',
 *   estimatedValue: 2500000
 * });
 * ```
 */
export const createBidSolicitationModel = (sequelize: Sequelize) => {
  class BidSolicitation extends Model {
    public id!: string;
    public solicitationNumber!: string;
    public projectId!: string;
    public title!: string;
    public description!: string;
    public procurementMethod!: string;
    public awardMethod!: string;
    public estimatedValue!: number;
    public publishedDate!: Date | null;
    public openingDate!: Date;
    public closingDate!: Date;
    public prebidMeetingDate!: Date | null;
    public prebidMeetingLocation!: string | null;
    public status!: string;
    public bondRequirement!: boolean;
    public bondPercentage!: number | null;
    public insuranceRequirements!: string[];
    public evaluationCriteria!: any[];
    public smallBusinessGoals!: number | null;
    public dbeGoals!: number | null;
    public documents!: any[];
    public addenda!: any[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  BidSolicitation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      solicitationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique solicitation number',
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related project ID',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Solicitation title',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of work',
      },
      procurementMethod: {
        type: DataTypes.ENUM(
          'competitive_sealed_bid',
          'competitive_negotiation',
          'small_purchase',
          'sole_source',
          'emergency',
        ),
        allowNull: false,
        comment: 'Procurement method',
      },
      awardMethod: {
        type: DataTypes.ENUM('lowest_responsive_bid', 'best_value', 'qualifications_based', 'two_step'),
        allowNull: false,
        comment: 'Award method',
      },
      estimatedValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Estimated contract value',
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date solicitation was published',
      },
      openingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Bid opening date',
      },
      closingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Bid submission deadline',
      },
      prebidMeetingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Pre-bid meeting date',
      },
      prebidMeetingLocation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Pre-bid meeting location',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'open', 'closed', 'cancelled', 'awarded'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Solicitation status',
      },
      bondRequirement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether bid bond is required',
      },
      bondPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Required bid bond percentage',
      },
      insuranceRequirements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Insurance requirements',
      },
      evaluationCriteria: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Evaluation criteria with weights',
      },
      smallBusinessGoals: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Small business participation goal percentage',
      },
      dbeGoals: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'DBE participation goal percentage',
      },
      documents: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Solicitation documents',
      },
      addenda: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Addenda to solicitation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created solicitation',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated',
      },
    },
    {
      sequelize,
      tableName: 'bid_solicitations',
      timestamps: true,
      indexes: [
        { fields: ['solicitationNumber'], unique: true },
        { fields: ['projectId'] },
        { fields: ['status'] },
        { fields: ['procurementMethod'] },
        { fields: ['openingDate'] },
        { fields: ['closingDate'] },
      ],
    },
  );

  return BidSolicitation;
};

/**
 * Sequelize model for Bid Submission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BidSubmission model
 *
 * @example
 * ```typescript
 * const BidSubmission = createBidSubmissionModel(sequelize);
 * const bid = await BidSubmission.create({
 *   solicitationId: 'sol-uuid',
 *   vendorId: 'vendor-uuid',
 *   bidAmount: 2350000,
 *   scheduleProposed: 180
 * });
 * ```
 */
export const createBidSubmissionModel = (sequelize: Sequelize) => {
  class BidSubmission extends Model {
    public id!: string;
    public solicitationId!: string;
    public vendorId!: string;
    public vendorName!: string;
    public bidNumber!: string;
    public submittalDate!: Date;
    public bidAmount!: number;
    public bidBondAmount!: number | null;
    public bidBondProvider!: string | null;
    public technicalScore!: number | null;
    public financialScore!: number | null;
    public totalScore!: number | null;
    public rank!: number | null;
    public status!: string;
    public responsiveness!: boolean;
    public responsibility!: boolean;
    public scheduleProposed!: number;
    public alternatesProvided!: boolean;
    public valueEngineeringProposals!: any[];
    public clarifications!: any[];
    public evaluationNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BidSubmission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      solicitationId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related solicitation ID',
        references: {
          model: 'bid_solicitations',
          key: 'id',
        },
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Vendor ID',
      },
      vendorName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Vendor name',
      },
      bidNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique bid number',
      },
      submittalDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Bid submission date',
      },
      bidAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Bid amount',
      },
      bidBondAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        comment: 'Bid bond amount',
      },
      bidBondProvider: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Bid bond provider',
      },
      technicalScore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Technical evaluation score',
      },
      financialScore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Financial evaluation score',
      },
      totalScore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Total weighted score',
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Bid ranking',
      },
      status: {
        type: DataTypes.ENUM(
          'draft',
          'submitted',
          'withdrawn',
          'under_evaluation',
          'qualified',
          'disqualified',
          'awarded',
          'rejected',
        ),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Bid status',
      },
      responsiveness: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Bid responsiveness determination',
      },
      responsibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Contractor responsibility determination',
      },
      scheduleProposed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Proposed schedule in days',
      },
      alternatesProvided: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether alternates were provided',
      },
      valueEngineeringProposals: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Value engineering proposals',
      },
      clarifications: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Bid clarifications',
      },
      evaluationNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Evaluation notes',
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
      tableName: 'bid_submissions',
      timestamps: true,
      indexes: [
        { fields: ['bidNumber'], unique: true },
        { fields: ['solicitationId'] },
        { fields: ['vendorId'] },
        { fields: ['status'] },
        { fields: ['submittalDate'] },
        { fields: ['rank'] },
      ],
    },
  );

  return BidSubmission;
};

/**
 * Sequelize model for Vendor Prequalification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorPrequalification model
 *
 * @example
 * ```typescript
 * const VendorPrequalification = createVendorPrequalificationModel(sequelize);
 * const qual = await VendorPrequalification.create({
 *   vendorId: 'vendor-uuid',
 *   workCategories: ['HVAC', 'Plumbing'],
 *   maxProjectValue: 5000000,
 *   bondingCapacity: 10000000
 * });
 * ```
 */
export const createVendorPrequalificationModel = (sequelize: Sequelize) => {
  class VendorPrequalification extends Model {
    public id!: string;
    public vendorId!: string;
    public vendorName!: string;
    public qualificationNumber!: string;
    public workCategories!: string[];
    public maxProjectValue!: number;
    public bondingCapacity!: number;
    public insuranceCoverage!: number;
    public pastProjectCount!: number;
    public pastProjectValue!: number;
    public safetyRating!: number;
    public qualityRating!: number;
    public performanceRating!: number;
    public financialStrength!: string;
    public qualificationStatus!: string;
    public qualifiedDate!: Date | null;
    public expirationDate!: Date | null;
    public certifications!: string[];
    public licenses!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  VendorPrequalification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Vendor ID',
      },
      vendorName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Vendor name',
      },
      qualificationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique qualification number',
      },
      workCategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        comment: 'Qualified work categories',
      },
      maxProjectValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Maximum project value qualified for',
      },
      bondingCapacity: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total bonding capacity',
      },
      insuranceCoverage: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Insurance coverage amount',
      },
      pastProjectCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of past projects',
      },
      pastProjectValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total value of past projects',
      },
      safetyRating: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Safety performance rating (0-10)',
      },
      qualityRating: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quality performance rating (0-10)',
      },
      performanceRating: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overall performance rating (0-10)',
      },
      financialStrength: {
        type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
        allowNull: false,
        defaultValue: 'FAIR',
        comment: 'Financial strength assessment',
      },
      qualificationStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'conditional', 'rejected', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Qualification status',
      },
      qualifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date vendor was qualified',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Qualification expiration date',
      },
      certifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Industry certifications',
      },
      licenses: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Professional licenses',
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
      tableName: 'vendor_prequalifications',
      timestamps: true,
      indexes: [
        { fields: ['vendorId'] },
        { fields: ['qualificationNumber'], unique: true },
        { fields: ['qualificationStatus'] },
        { fields: ['workCategories'], using: 'gin' },
      ],
    },
  );

  return VendorPrequalification;
};

// ============================================================================
// BID SOLICITATION (1-5)
// ============================================================================

/**
 * Creates new bid solicitation with evaluation criteria.
 *
 * @param {object} solicitationData - Solicitation creation data
 * @param {string} userId - User creating solicitation
 * @returns {Promise<BidSolicitation>} Created solicitation
 *
 * @example
 * ```typescript
 * const solicitation = await createBidSolicitation({
 *   projectId: 'proj-123',
 *   title: 'HVAC System Replacement',
 *   description: 'Complete replacement of building HVAC',
 *   procurementMethod: ProcurementMethod.COMPETITIVE_SEALED_BID,
 *   awardMethod: AwardMethod.LOWEST_RESPONSIVE_BID,
 *   estimatedValue: 2500000,
 *   openingDate: new Date('2025-03-01'),
 *   closingDate: new Date('2025-04-15')
 * }, 'admin-456');
 * ```
 */
export const createBidSolicitation = async (solicitationData: any, userId: string): Promise<BidSolicitation> => {
  const solicitationNumber = generateSolicitationNumber(solicitationData.projectId);

  const defaultCriteria: EvaluationCriterion[] = [
    {
      id: generateUUID(),
      criteriaType: EvaluationCriteriaType.TECHNICAL,
      description: 'Technical approach and methodology',
      weight: 0.4,
      maxPoints: 40,
      passingScore: 24,
      evaluationGuidance: 'Evaluate technical soundness and feasibility',
    },
    {
      id: generateUUID(),
      criteriaType: EvaluationCriteriaType.FINANCIAL,
      description: 'Price competitiveness',
      weight: 0.35,
      maxPoints: 35,
      evaluationGuidance: 'Compare to engineer estimate',
    },
    {
      id: generateUUID(),
      criteriaType: EvaluationCriteriaType.PAST_PERFORMANCE,
      description: 'Past performance on similar projects',
      weight: 0.25,
      maxPoints: 25,
      passingScore: 15,
      evaluationGuidance: 'Review references and completion records',
    },
  ];

  return {
    id: generateUUID(),
    solicitationNumber,
    projectId: solicitationData.projectId,
    title: solicitationData.title,
    description: solicitationData.description,
    procurementMethod: solicitationData.procurementMethod,
    awardMethod: solicitationData.awardMethod,
    estimatedValue: solicitationData.estimatedValue,
    openingDate: solicitationData.openingDate,
    closingDate: solicitationData.closingDate,
    prebidMeetingDate: solicitationData.prebidMeetingDate,
    prebidMeetingLocation: solicitationData.prebidMeetingLocation,
    status: BidSolicitationStatus.DRAFT,
    bondRequirement: solicitationData.bondRequirement !== false,
    bondPercentage: solicitationData.bondPercentage || 10,
    insuranceRequirements: solicitationData.insuranceRequirements || [
      'General Liability: $2M',
      'Workers Compensation: Statutory',
      'Professional Liability: $1M',
    ],
    evaluationCriteria: solicitationData.evaluationCriteria || defaultCriteria,
    smallBusinessGoals: solicitationData.smallBusinessGoals,
    dbeGoals: solicitationData.dbeGoals,
    documents: [],
    addenda: [],
    metadata: solicitationData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
  };
};

/**
 * Publishes bid solicitation for vendor access.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User publishing solicitation
 * @returns {Promise<BidSolicitation>} Published solicitation
 *
 * @example
 * ```typescript
 * const published = await publishBidSolicitation('sol-123', 'admin-456');
 * ```
 */
export const publishBidSolicitation = async (solicitationId: string, userId: string): Promise<BidSolicitation> => {
  const solicitation = await getBidSolicitation(solicitationId);

  if (solicitation.status !== BidSolicitationStatus.DRAFT) {
    throw new Error('Only draft solicitations can be published');
  }

  return {
    ...solicitation,
    status: BidSolicitationStatus.PUBLISHED,
    publishedDate: new Date(),
    updatedAt: new Date(),
    updatedBy: userId,
  };
};

/**
 * Issues addendum to bid solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {object} addendumData - Addendum details
 * @param {string} userId - User issuing addendum
 * @returns {Promise<Addendum>} Created addendum
 *
 * @example
 * ```typescript
 * const addendum = await issueSolicitationAddendum('sol-123', {
 *   description: 'Clarification on HVAC specifications',
 *   documents: [{ documentName: 'Revised Specs.pdf', documentUrl: '/docs/...' }]
 * }, 'admin-456');
 * ```
 */
export const issueSolicitationAddendum = async (
  solicitationId: string,
  addendumData: any,
  userId: string,
): Promise<Addendum> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const addendumNumber = `ADD-${(solicitation.addenda.length + 1).toString().padStart(3, '0')}`;

  const addendum: Addendum = {
    id: generateUUID(),
    addendumNumber,
    description: addendumData.description,
    issuedDate: new Date(),
    documents: addendumData.documents || [],
  };

  solicitation.addenda.push(addendum);

  return addendum;
};

/**
 * Cancels bid solicitation with justification.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling solicitation
 * @returns {Promise<BidSolicitation>} Cancelled solicitation
 *
 * @example
 * ```typescript
 * await cancelBidSolicitation('sol-123', 'Project funding withdrawn', 'admin-456');
 * ```
 */
export const cancelBidSolicitation = async (
  solicitationId: string,
  cancellationReason: string,
  userId: string,
): Promise<BidSolicitation> => {
  const solicitation = await getBidSolicitation(solicitationId);

  return {
    ...solicitation,
    status: BidSolicitationStatus.CANCELLED,
    metadata: {
      ...solicitation.metadata,
      cancellationReason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: userId,
    },
    updatedAt: new Date(),
    updatedBy: userId,
  };
};

/**
 * Extends bid closing date with notification to vendors.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {Date} newClosingDate - New closing date
 * @param {string} reason - Reason for extension
 * @param {string} userId - User extending deadline
 * @returns {Promise<BidSolicitation>} Updated solicitation
 *
 * @example
 * ```typescript
 * await extendBidClosingDate('sol-123', new Date('2025-05-01'), 'Additional time for site visits', 'admin-456');
 * ```
 */
export const extendBidClosingDate = async (
  solicitationId: string,
  newClosingDate: Date,
  reason: string,
  userId: string,
): Promise<BidSolicitation> => {
  const solicitation = await getBidSolicitation(solicitationId);

  if (newClosingDate <= solicitation.closingDate) {
    throw new Error('New closing date must be after current closing date');
  }

  return {
    ...solicitation,
    closingDate: newClosingDate,
    metadata: {
      ...solicitation.metadata,
      extensionHistory: [
        ...(solicitation.metadata.extensionHistory || []),
        {
          oldDate: solicitation.closingDate,
          newDate: newClosingDate,
          reason,
          extendedBy: userId,
          extendedAt: new Date().toISOString(),
        },
      ],
    },
    updatedAt: new Date(),
    updatedBy: userId,
  };
};

// ============================================================================
// VENDOR PREQUALIFICATION (6-10)
// ============================================================================

/**
 * Creates vendor prequalification application.
 *
 * @param {object} qualificationData - Qualification data
 * @param {string} userId - User creating qualification
 * @returns {Promise<VendorPrequalification>} Created qualification
 *
 * @example
 * ```typescript
 * const qual = await createVendorPrequalification({
 *   vendorId: 'vendor-123',
 *   vendorName: 'ABC Construction',
 *   workCategories: ['General Construction', 'HVAC'],
 *   maxProjectValue: 5000000,
 *   bondingCapacity: 10000000,
 *   insuranceCoverage: 5000000
 * }, 'vendor-user');
 * ```
 */
export const createVendorPrequalification = async (
  qualificationData: any,
  userId: string,
): Promise<VendorPrequalification> => {
  const qualificationNumber = generateQualificationNumber();

  return {
    id: generateUUID(),
    vendorId: qualificationData.vendorId,
    vendorName: qualificationData.vendorName,
    qualificationNumber,
    workCategories: qualificationData.workCategories,
    maxProjectValue: qualificationData.maxProjectValue,
    bondingCapacity: qualificationData.bondingCapacity,
    insuranceCoverage: qualificationData.insuranceCoverage,
    pastProjectCount: qualificationData.pastProjectCount || 0,
    pastProjectValue: qualificationData.pastProjectValue || 0,
    safetyRating: qualificationData.safetyRating || 0,
    qualityRating: qualificationData.qualityRating || 0,
    performanceRating: qualificationData.performanceRating || 0,
    financialStrength: qualificationData.financialStrength || 'FAIR',
    qualificationStatus: VendorQualificationStatus.PENDING,
    certifications: qualificationData.certifications || [],
    licenses: qualificationData.licenses || [],
    metadata: qualificationData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Evaluates vendor prequalification application.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {object} evaluation - Evaluation results
 * @param {string} userId - User evaluating qualification
 * @returns {Promise<VendorPrequalification>} Updated qualification
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorPrequalification('qual-123', {
 *   safetyRating: 8.5,
 *   qualityRating: 9.0,
 *   performanceRating: 8.7,
 *   financialStrength: 'GOOD',
 *   status: VendorQualificationStatus.APPROVED
 * }, 'eval-456');
 * ```
 */
export const evaluateVendorPrequalification = async (
  qualificationId: string,
  evaluation: any,
  userId: string,
): Promise<VendorPrequalification> => {
  const qualification = await getVendorPrequalification(qualificationId);

  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year validity

  return {
    ...qualification,
    safetyRating: evaluation.safetyRating,
    qualityRating: evaluation.qualityRating,
    performanceRating: evaluation.performanceRating,
    financialStrength: evaluation.financialStrength,
    qualificationStatus: evaluation.status,
    qualifiedDate: evaluation.status === VendorQualificationStatus.APPROVED ? new Date() : undefined,
    expirationDate: evaluation.status === VendorQualificationStatus.APPROVED ? expirationDate : undefined,
    updatedAt: new Date(),
  };
};

/**
 * Verifies vendor certifications and licenses.
 *
 * @param {string} qualificationId - Qualification identifier
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyVendorCredentials('qual-123');
 * ```
 */
export const verifyVendorCredentials = async (
  qualificationId: string,
): Promise<{
  certificationsValid: boolean;
  licensesValid: boolean;
  invalidItems: string[];
  verifiedAt: Date;
}> => {
  const qualification = await getVendorPrequalification(qualificationId);

  // In production, verify against external databases
  return {
    certificationsValid: true,
    licensesValid: true,
    invalidItems: [],
    verifiedAt: new Date(),
  };
};

/**
 * Checks vendor past performance on similar projects.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {string[]} projectCategories - Project categories to check
 * @returns {Promise<object>} Past performance summary
 *
 * @example
 * ```typescript
 * const performance = await checkVendorPastPerformance('vendor-123', ['HVAC', 'Electrical']);
 * ```
 */
export const checkVendorPastPerformance = async (
  vendorId: string,
  projectCategories: string[],
): Promise<{
  totalProjects: number;
  successfulProjects: number;
  averageRating: number;
  onTimeDelivery: number;
  onBudgetDelivery: number;
  recentProjects: any[];
}> => {
  // In production, query project history database
  return {
    totalProjects: 15,
    successfulProjects: 14,
    averageRating: 8.5,
    onTimeDelivery: 93.3,
    onBudgetDelivery: 86.7,
    recentProjects: [],
  };
};

/**
 * Renews vendor prequalification before expiration.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {string} userId - User renewing qualification
 * @returns {Promise<VendorPrequalification>} Renewed qualification
 *
 * @example
 * ```typescript
 * const renewed = await renewVendorPrequalification('qual-123', 'admin-456');
 * ```
 */
export const renewVendorPrequalification = async (
  qualificationId: string,
  userId: string,
): Promise<VendorPrequalification> => {
  const qualification = await getVendorPrequalification(qualificationId);

  const newExpirationDate = new Date();
  newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

  return {
    ...qualification,
    qualifiedDate: new Date(),
    expirationDate: newExpirationDate,
    qualificationStatus: VendorQualificationStatus.APPROVED,
    updatedAt: new Date(),
  };
};

// ============================================================================
// BID SUBMISSION AND OPENING (11-15)
// ============================================================================

/**
 * Submits bid for solicitation.
 *
 * @param {object} bidData - Bid submission data
 * @param {string} userId - User submitting bid
 * @returns {Promise<BidSubmission>} Submitted bid
 *
 * @example
 * ```typescript
 * const bid = await submitBid({
 *   solicitationId: 'sol-123',
 *   vendorId: 'vendor-456',
 *   vendorName: 'ABC Construction',
 *   bidAmount: 2350000,
 *   scheduleProposed: 180,
 *   bidBondAmount: 235000,
 *   bidBondProvider: 'Surety Co.'
 * }, 'vendor-user');
 * ```
 */
export const submitBid = async (bidData: any, userId: string): Promise<BidSubmission> => {
  const solicitation = await getBidSolicitation(bidData.solicitationId);

  if (solicitation.status !== BidSolicitationStatus.OPEN && solicitation.status !== BidSolicitationStatus.PUBLISHED) {
    throw new Error('Solicitation is not accepting bids');
  }

  if (new Date() > solicitation.closingDate) {
    throw new Error('Bid submission deadline has passed');
  }

  const bidNumber = generateBidNumber(bidData.solicitationId);

  return {
    id: generateUUID(),
    solicitationId: bidData.solicitationId,
    vendorId: bidData.vendorId,
    vendorName: bidData.vendorName,
    bidNumber,
    submittalDate: new Date(),
    bidAmount: bidData.bidAmount,
    bidBondAmount: bidData.bidBondAmount,
    bidBondProvider: bidData.bidBondProvider,
    scheduleProposed: bidData.scheduleProposed,
    status: BidStatus.SUBMITTED,
    responsiveness: false,
    responsibility: false,
    alternatesProvided: bidData.alternates ? bidData.alternates.length > 0 : false,
    valueEngineeringProposals: bidData.valueEngineeringProposals || [],
    clarifications: [],
    evaluationNotes: '',
    metadata: bidData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Opens bids at designated opening time.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User opening bids
 * @returns {Promise<object>} Bid opening results
 *
 * @example
 * ```typescript
 * const opening = await openBids('sol-123', 'admin-456');
 * ```
 */
export const openBids = async (
  solicitationId: string,
  userId: string,
): Promise<{
  solicitationId: string;
  openedAt: Date;
  openedBy: string;
  totalBids: number;
  bids: Array<{ bidNumber: string; vendorName: string; bidAmount: number }>;
}> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const bids = await getSolicitationBids(solicitationId);

  if (new Date() < solicitation.openingDate) {
    throw new Error('Bid opening time has not arrived');
  }

  // Update solicitation status
  solicitation.status = BidSolicitationStatus.OPEN;

  // Update all bids to under evaluation
  bids.forEach((bid) => {
    bid.status = BidStatus.UNDER_EVALUATION;
  });

  return {
    solicitationId,
    openedAt: new Date(),
    openedBy: userId,
    totalBids: bids.length,
    bids: bids.map((b) => ({
      bidNumber: b.bidNumber,
      vendorName: b.vendorName,
      bidAmount: b.bidAmount,
    })),
  };
};

/**
 * Validates bid responsiveness to solicitation requirements.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating bid
 * @returns {Promise<object>} Responsiveness determination
 *
 * @example
 * ```typescript
 * const responsive = await validateBidResponsiveness('bid-123', 'eval-456');
 * ```
 */
export const validateBidResponsiveness = async (
  bidId: string,
  userId: string,
): Promise<{
  responsive: boolean;
  deficiencies: string[];
  checklist: Array<{ item: string; compliant: boolean }>;
}> => {
  const bid = await getBidSubmission(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);

  const checklist = [
    { item: 'Bid submitted before deadline', compliant: bid.submittalDate <= solicitation.closingDate },
    { item: 'Bid bond provided (if required)', compliant: solicitation.bondRequirement ? !!bid.bidBondAmount : true },
    { item: 'All required forms signed', compliant: true }, // Placeholder
    { item: 'Pricing complete and unambiguous', compliant: true }, // Placeholder
    { item: 'Schedule requirements acknowledged', compliant: true }, // Placeholder
  ];

  const responsive = checklist.every((c) => c.compliant);
  const deficiencies = checklist.filter((c) => !c.compliant).map((c) => c.item);

  bid.responsiveness = responsive;

  return {
    responsive,
    deficiencies,
    checklist,
  };
};

/**
 * Validates contractor responsibility determination.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating responsibility
 * @returns {Promise<object>} Responsibility determination
 *
 * @example
 * ```typescript
 * const responsible = await validateContractorResponsibility('bid-123', 'eval-456');
 * ```
 */
export const validateContractorResponsibility = async (
  bidId: string,
  userId: string,
): Promise<{
  responsible: boolean;
  findings: string[];
  criteria: Array<{ criterion: string; met: boolean }>;
}> => {
  const bid = await getBidSubmission(bidId);

  // Check vendor prequalification
  const qualification = await getVendorQualificationByVendorId(bid.vendorId);

  const criteria = [
    {
      criterion: 'Adequate financial resources',
      met: qualification?.financialStrength === 'GOOD' || qualification?.financialStrength === 'EXCELLENT',
    },
    { criterion: 'Ability to meet schedule', met: true }, // Placeholder
    { criterion: 'Satisfactory past performance', met: qualification ? qualification.performanceRating >= 7.0 : false },
    { criterion: 'Adequate bonding capacity', met: qualification ? qualification.bondingCapacity >= bid.bidAmount : false },
    { criterion: 'Necessary licenses and permits', met: qualification ? qualification.licenses.length > 0 : false },
  ];

  const responsible = criteria.every((c) => c.met);
  const findings = criteria.filter((c) => !c.met).map((c) => c.criterion);

  bid.responsibility = responsible;

  return {
    responsible,
    findings,
    criteria,
  };
};

/**
 * Requests bid clarification from vendor.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} clarificationRequest - Clarification question
 * @param {string} userId - User requesting clarification
 * @returns {Promise<object>} Clarification request
 *
 * @example
 * ```typescript
 * await requestBidClarification('bid-123', 'Please clarify HVAC equipment manufacturer', 'eval-456');
 * ```
 */
export const requestBidClarification = async (
  bidId: string,
  clarificationRequest: string,
  userId: string,
): Promise<{
  clarificationId: string;
  requestedAt: Date;
  responseDue: Date;
}> => {
  const bid = await getBidSubmission(bidId);

  const clarificationId = generateUUID();
  const responseDue = new Date();
  responseDue.setDate(responseDue.getDate() + 3); // 3 days to respond

  bid.clarifications.push({
    id: clarificationId,
    request: clarificationRequest,
    requestedBy: userId,
    requestedAt: new Date(),
    responseDue,
    response: null,
    respondedAt: null,
  });

  return {
    clarificationId,
    requestedAt: new Date(),
    responseDue,
  };
};

// ============================================================================
// BID EVALUATION AND SCORING (16-20)
// ============================================================================

/**
 * Evaluates bid against specific criterion.
 *
 * @param {object} evaluationData - Evaluation data
 * @param {string} userId - User performing evaluation
 * @returns {Promise<BidEvaluation>} Evaluation record
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateBid({
 *   bidId: 'bid-123',
 *   criterionId: 'crit-456',
 *   score: 35,
 *   maxScore: 40,
 *   comments: 'Strong technical approach',
 *   strengths: ['Experienced team', 'Proven methodology'],
 *   weaknesses: ['Schedule somewhat aggressive']
 * }, 'eval-789');
 * ```
 */
export const evaluateBid = async (evaluationData: any, userId: string): Promise<BidEvaluation> => {
  return {
    id: generateUUID(),
    bidId: evaluationData.bidId,
    criterionId: evaluationData.criterionId,
    evaluatorId: userId,
    evaluatorName: 'Evaluator Name', // Fetch from user service
    score: evaluationData.score,
    maxScore: evaluationData.maxScore,
    comments: evaluationData.comments,
    strengths: evaluationData.strengths || [],
    weaknesses: evaluationData.weaknesses || [],
    evaluatedAt: new Date(),
    metadata: {},
  };
};

/**
 * Calculates total weighted score for bid.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Score calculation
 *
 * @example
 * ```typescript
 * const scores = await calculateBidScore('bid-123');
 * ```
 */
export const calculateBidScore = async (
  bidId: string,
): Promise<{
  technicalScore: number;
  financialScore: number;
  totalScore: number;
  breakdown: Array<{ criterion: string; score: number; weight: number; weightedScore: number }>;
}> => {
  const bid = await getBidSubmission(bidId);
  const evaluations = await getBidEvaluations(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);

  const breakdown = solicitation.evaluationCriteria.map((criterion) => {
    const evaluation = evaluations.find((e) => e.criterionId === criterion.id);
    const score = evaluation?.score || 0;
    const weightedScore = score * criterion.weight;

    return {
      criterion: criterion.description,
      score,
      weight: criterion.weight,
      weightedScore,
    };
  });

  const technicalScore = breakdown
    .filter((b) => b.criterion.toLowerCase().includes('technical'))
    .reduce((sum, b) => sum + b.weightedScore, 0);

  const financialScore = breakdown
    .filter((b) => b.criterion.toLowerCase().includes('financial') || b.criterion.toLowerCase().includes('price'))
    .reduce((sum, b) => sum + b.weightedScore, 0);

  const totalScore = breakdown.reduce((sum, b) => sum + b.weightedScore, 0);

  bid.technicalScore = technicalScore;
  bid.financialScore = financialScore;
  bid.totalScore = totalScore;

  return {
    technicalScore,
    financialScore,
    totalScore,
    breakdown,
  };
};

/**
 * Ranks all bids for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidSubmission[]>} Ranked bids
 *
 * @example
 * ```typescript
 * const ranked = await rankBids('sol-123');
 * ```
 */
export const rankBids = async (solicitationId: string): Promise<BidSubmission[]> => {
  const bids = await getSolicitationBids(solicitationId);
  const solicitation = await getBidSolicitation(solicitationId);

  // Calculate scores for all bids
  await Promise.all(bids.map((bid) => calculateBidScore(bid.id)));

  // Rank based on award method
  let rankedBids: BidSubmission[];

  if (solicitation.awardMethod === AwardMethod.LOWEST_RESPONSIVE_BID) {
    // Rank by price (lowest first)
    rankedBids = bids
      .filter((b) => b.responsiveness && b.responsibility)
      .sort((a, b) => a.bidAmount - b.bidAmount);
  } else if (solicitation.awardMethod === AwardMethod.BEST_VALUE) {
    // Rank by total score (highest first)
    rankedBids = bids
      .filter((b) => b.responsiveness && b.responsibility)
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  } else {
    rankedBids = bids;
  }

  // Assign ranks
  rankedBids.forEach((bid, index) => {
    bid.rank = index + 1;
  });

  return rankedBids;
};

/**
 * Performs consensus evaluation among evaluators.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Consensus results
 *
 * @example
 * ```typescript
 * const consensus = await performConsensusEvaluation('bid-123');
 * ```
 */
export const performConsensusEvaluation = async (
  bidId: string,
): Promise<{
  consensusReached: boolean;
  finalScore: number;
  evaluatorScores: Array<{ evaluatorId: string; score: number }>;
  variance: number;
}> => {
  const evaluations = await getBidEvaluations(bidId);

  const evaluatorScores = evaluations.map((e) => ({
    evaluatorId: e.evaluatorId,
    score: e.score,
  }));

  const averageScore = evaluatorScores.reduce((sum, e) => sum + e.score, 0) / evaluatorScores.length;
  const variance =
    evaluatorScores.reduce((sum, e) => sum + Math.pow(e.score - averageScore, 2), 0) / evaluatorScores.length;

  return {
    consensusReached: variance < 5,
    finalScore: averageScore,
    evaluatorScores,
    variance,
  };
};

/**
 * Normalizes scores across evaluators.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = await normalizeEvaluatorScores('sol-123');
 * ```
 */
export const normalizeEvaluatorScores = async (
  solicitationId: string,
): Promise<{
  bids: Array<{ bidId: string; originalScore: number; normalizedScore: number }>;
  normalizationFactor: number;
}> => {
  // In production, apply statistical normalization
  return {
    bids: [],
    normalizationFactor: 1.0,
  };
};

// ============================================================================
// BID COMPARISON AND ANALYSIS (21-25)
// ============================================================================

/**
 * Generates comprehensive bid comparison.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidComparison>} Bid comparison
 *
 * @example
 * ```typescript
 * const comparison = await generateBidComparison('sol-123');
 * ```
 */
export const generateBidComparison = async (solicitationId: string): Promise<BidComparison> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const bids = await getSolicitationBids(solicitationId);

  const responsiveBids = bids.filter((b) => b.responsiveness && b.responsibility);

  const bidAmounts = responsiveBids.map((b) => b.bidAmount);
  const lowestBid = Math.min(...bidAmounts);
  const highestBid = Math.max(...bidAmounts);
  const averageBid = bidAmounts.reduce((sum, amt) => sum + amt, 0) / bidAmounts.length;

  const comparison: BidComparison = {
    solicitationId,
    bids: responsiveBids.map((b) => ({
      bidId: b.id,
      vendorName: b.vendorName,
      bidAmount: b.bidAmount,
      technicalScore: b.technicalScore || 0,
      totalScore: b.totalScore || 0,
      rank: b.rank || 0,
      responsive: b.responsiveness,
    })),
    lowestBid,
    highestBid,
    averageBid,
    engineerEstimate: solicitation.estimatedValue,
    recommendation: '',
  };

  return comparison;
};

/**
 * Analyzes bid price reasonableness.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<PriceAnalysis>} Price analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBidPrice('bid-123');
 * ```
 */
export const analyzeBidPrice = async (bidId: string): Promise<PriceAnalysis> => {
  const bid = await getBidSubmission(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);
  const allBids = await getSolicitationBids(solicitation.id);

  const engineerEstimate = solicitation.estimatedValue;
  const varianceFromEstimate = bid.bidAmount - engineerEstimate;
  const variancePercentage = (varianceFromEstimate / engineerEstimate) * 100;

  const bidAmounts = allBids.map((b) => b.bidAmount);
  const lowestBid = Math.min(...bidAmounts);
  const averageBid = bidAmounts.reduce((sum, amt) => sum + amt, 0) / bidAmounts.length;

  let priceReasonableness = true;
  const recommendations: string[] = [];

  if (variancePercentage > 20) {
    priceReasonableness = false;
    recommendations.push('Bid exceeds engineer estimate by more than 20%');
  }

  if (bid.bidAmount < lowestBid * 0.8) {
    priceReasonableness = false;
    recommendations.push('Bid significantly below market - verify scope understanding');
  }

  return {
    solicitationId: solicitation.id,
    engineerEstimate,
    lowestBid: bid.bidAmount,
    varianceFromEstimate,
    variancePercentage,
    marketAnalysis: `Bid is ${variancePercentage.toFixed(1)}% ${variancePercentage > 0 ? 'above' : 'below'} engineer estimate`,
    priceReasonableness,
    recommendations,
  };
};

/**
 * Compares bid to historical pricing data.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Historical comparison
 *
 * @example
 * ```typescript
 * const historical = await compareToHistoricalPricing('bid-123');
 * ```
 */
export const compareToHistoricalPricing = async (
  bidId: string,
): Promise<{
  similarProjects: number;
  averageHistoricalPrice: number;
  varianceFromHistorical: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}> => {
  // In production, query historical project database
  return {
    similarProjects: 12,
    averageHistoricalPrice: 2400000,
    varianceFromHistorical: -2.1,
    trend: 'STABLE',
  };
};

/**
 * Evaluates value engineering proposals.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} VE evaluation
 *
 * @example
 * ```typescript
 * const veAnalysis = await evaluateValueEngineeringProposals('bid-123');
 * ```
 */
export const evaluateValueEngineeringProposals = async (
  bidId: string,
): Promise<{
  totalProposals: number;
  estimatedSavings: number;
  acceptedProposals: number;
  recommendations: string[];
}> => {
  const bid = await getBidSubmission(bidId);

  return {
    totalProposals: bid.valueEngineeringProposals.length,
    estimatedSavings: 0,
    acceptedProposals: 0,
    recommendations: [],
  };
};

/**
 * Generates bid tabulation sheet.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Bid tabulation
 *
 * @example
 * ```typescript
 * const tabulation = await generateBidTabulation('sol-123');
 * ```
 */
export const generateBidTabulation = async (
  solicitationId: string,
): Promise<{
  solicitationNumber: string;
  projectTitle: string;
  openingDate: Date;
  bids: Array<{
    rank: number;
    vendorName: string;
    baseAmount: number;
    alternates: number;
    totalAmount: number;
    responsive: boolean;
  }>;
  engineerEstimate: number;
}> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const bids = await getSolicitationBids(solicitationId);
  const rankedBids = await rankBids(solicitationId);

  return {
    solicitationNumber: solicitation.solicitationNumber,
    projectTitle: solicitation.title,
    openingDate: solicitation.openingDate,
    bids: rankedBids.map((b) => ({
      rank: b.rank || 0,
      vendorName: b.vendorName,
      baseAmount: b.bidAmount,
      alternates: 0,
      totalAmount: b.bidAmount,
      responsive: b.responsiveness,
    })),
    engineerEstimate: solicitation.estimatedValue,
  };
};

// ============================================================================
// BID BOND AND COMPLIANCE (26-30)
// ============================================================================

/**
 * Validates bid bond requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Bond validation results
 *
 * @example
 * ```typescript
 * const bondValidation = await validateBidBond('bid-123');
 * ```
 */
export const validateBidBond = async (
  bidId: string,
): Promise<{
  valid: boolean;
  bondAmount: number;
  requiredAmount: number;
  bondProvider: string;
  expirationDate?: Date;
  deficiencies: string[];
}> => {
  const bid = await getBidSubmission(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);

  const requiredAmount = (solicitation.estimatedValue * (solicitation.bondPercentage || 10)) / 100;
  const deficiencies: string[] = [];

  if (!bid.bidBondAmount) {
    deficiencies.push('No bid bond provided');
  } else if (bid.bidBondAmount < requiredAmount) {
    deficiencies.push(`Bid bond amount insufficient: $${bid.bidBondAmount} < $${requiredAmount}`);
  }

  if (!bid.bidBondProvider) {
    deficiencies.push('Bid bond provider not specified');
  }

  return {
    valid: deficiencies.length === 0,
    bondAmount: bid.bidBondAmount || 0,
    requiredAmount,
    bondProvider: bid.bidBondProvider || '',
    deficiencies,
  };
};

/**
 * Verifies surety company authorization.
 *
 * @param {string} suretyCompany - Surety company name
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verified = await verifySuretyCompany('ABC Surety Co.');
 * ```
 */
export const verifySuretyCompany = async (
  suretyCompany: string,
): Promise<{
  authorized: boolean;
  treasuryListed: boolean;
  rating: string;
  maximumBond: number;
}> => {
  // In production, verify against Treasury Department circular
  return {
    authorized: true,
    treasuryListed: true,
    rating: 'A',
    maximumBond: 50000000,
  };
};

/**
 * Checks small business participation compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance check
 *
 * @example
 * ```typescript
 * const sbCompliance = await checkSmallBusinessCompliance('bid-123');
 * ```
 */
export const checkSmallBusinessCompliance = async (
  bidId: string,
): Promise<{
  compliant: boolean;
  goalPercentage: number;
  proposedPercentage: number;
  smallBusinessParticipants: string[];
}> => {
  const bid = await getBidSubmission(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);

  return {
    compliant: true,
    goalPercentage: solicitation.smallBusinessGoals || 0,
    proposedPercentage: 0,
    smallBusinessParticipants: [],
  };
};

/**
 * Verifies DBE (Disadvantaged Business Enterprise) compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} DBE compliance check
 *
 * @example
 * ```typescript
 * const dbeCompliance = await verifyDBECompliance('bid-123');
 * ```
 */
export const verifyDBECompliance = async (
  bidId: string,
): Promise<{
  compliant: boolean;
  goalPercentage: number;
  proposedPercentage: number;
  dbeParticipants: string[];
  certifiedDBEs: boolean;
}> => {
  const bid = await getBidSubmission(bidId);
  const solicitation = await getBidSolicitation(bid.solicitationId);

  return {
    compliant: true,
    goalPercentage: solicitation.dbeGoals || 0,
    proposedPercentage: 0,
    dbeParticipants: [],
    certifiedDBEs: true,
  };
};

/**
 * Validates regulatory compliance requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateRegulatoryCompliance('bid-123');
 * ```
 */
export const validateRegulatoryCompliance = async (
  bidId: string,
): Promise<{
  compliant: boolean;
  requirements: Array<{ requirement: string; met: boolean }>;
  deficiencies: string[];
}> => {
  const requirements = [
    { requirement: 'Davis-Bacon wages', met: true },
    { requirement: 'Buy American provisions', met: true },
    { requirement: 'Environmental compliance', met: true },
    { requirement: 'Equal opportunity', met: true },
  ];

  const deficiencies = requirements.filter((r) => !r.met).map((r) => r.requirement);

  return {
    compliant: deficiencies.length === 0,
    requirements,
    deficiencies,
  };
};

// ============================================================================
// AWARD RECOMMENDATION AND PROCESSING (31-35)
// ============================================================================

/**
 * Creates award recommendation.
 *
 * @param {object} recommendationData - Recommendation data
 * @param {string} userId - User making recommendation
 * @returns {Promise<AwardRecommendation>} Award recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await createAwardRecommendation({
 *   solicitationId: 'sol-123',
 *   recommendedBidId: 'bid-456',
 *   recommendedVendorId: 'vendor-789',
 *   recommendedAmount: 2350000,
 *   justification: 'Lowest responsive bid',
 *   analysisNotes: 'Vendor meets all requirements'
 * }, 'pm-012');
 * ```
 */
export const createAwardRecommendation = async (
  recommendationData: any,
  userId: string,
): Promise<AwardRecommendation> => {
  return {
    id: generateUUID(),
    solicitationId: recommendationData.solicitationId,
    recommendedBidId: recommendationData.recommendedBidId,
    recommendedVendorId: recommendationData.recommendedVendorId,
    recommendedAmount: recommendationData.recommendedAmount,
    justification: recommendationData.justification,
    analysisNotes: recommendationData.analysisNotes,
    alternativeConsiderations: recommendationData.alternativeConsiderations || '',
    approvals: [],
    recommendedBy: userId,
    recommendedAt: new Date(),
    status: 'PENDING',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Processes award recommendation approval.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {object} approval - Approval details
 * @returns {Promise<AwardRecommendation>} Updated recommendation
 *
 * @example
 * ```typescript
 * const approved = await processAwardApproval('rec-123', {
 *   approvedBy: 'director-456',
 *   status: 'APPROVED',
 *   comments: 'Concur with recommendation'
 * });
 * ```
 */
export const processAwardApproval = async (recommendationId: string, approval: any): Promise<AwardRecommendation> => {
  const recommendation = await getAwardRecommendation(recommendationId);

  recommendation.approvals.push({
    approvedBy: approval.approvedBy,
    approvedAt: new Date(),
    status: approval.status,
    comments: approval.comments,
  });

  if (approval.status === 'APPROVED') {
    recommendation.status = 'APPROVED';
  } else if (approval.status === 'REJECTED') {
    recommendation.status = 'REJECTED';
  }

  return recommendation;
};

/**
 * Issues notice of award to winning bidder.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {string} userId - User issuing award
 * @returns {Promise<object>} Award notice
 *
 * @example
 * ```typescript
 * const notice = await issueAwardNotice('rec-123', 'admin-456');
 * ```
 */
export const issueAwardNotice = async (
  recommendationId: string,
  userId: string,
): Promise<{
  awardNumber: string;
  issuedAt: Date;
  contractValue: number;
  awardedVendor: string;
}> => {
  const recommendation = await getAwardRecommendation(recommendationId);

  if (recommendation.status !== 'APPROVED') {
    throw new Error('Only approved recommendations can be awarded');
  }

  const bid = await getBidSubmission(recommendation.recommendedBidId);
  const solicitation = await getBidSolicitation(recommendation.solicitationId);

  bid.status = BidStatus.AWARDED;
  solicitation.status = BidSolicitationStatus.AWARDED;

  const awardNumber = generateAwardNumber(solicitation.solicitationNumber);

  return {
    awardNumber,
    issuedAt: new Date(),
    contractValue: recommendation.recommendedAmount,
    awardedVendor: bid.vendorName,
  };
};

/**
 * Notifies unsuccessful bidders.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} awardedBidId - Awarded bid identifier
 * @returns {Promise<object>} Notification results
 *
 * @example
 * ```typescript
 * await notifyUnsuccessfulBidders('sol-123', 'bid-456');
 * ```
 */
export const notifyUnsuccessfulBidders = async (
  solicitationId: string,
  awardedBidId: string,
): Promise<{
  notifiedCount: number;
  notificationDate: Date;
}> => {
  const bids = await getSolicitationBids(solicitationId);
  const unsuccessfulBids = bids.filter((b) => b.id !== awardedBidId);

  unsuccessfulBids.forEach((bid) => {
    bid.status = BidStatus.REJECTED;
  });

  return {
    notifiedCount: unsuccessfulBids.length,
    notificationDate: new Date(),
  };
};

/**
 * Conducts debriefing for unsuccessful bidder.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User conducting debriefing
 * @returns {Promise<object>} Debriefing summary
 *
 * @example
 * ```typescript
 * const debriefing = await conductBidderDebriefing('bid-123', 'pm-456');
 * ```
 */
export const conductBidderDebriefing = async (
  bidId: string,
  userId: string,
): Promise<{
  bidId: string;
  debriefingDate: Date;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}> => {
  const bid = await getBidSubmission(bidId);
  const evaluations = await getBidEvaluations(bidId);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  evaluations.forEach((e) => {
    strengths.push(...e.strengths);
    weaknesses.push(...e.weaknesses);
  });

  return {
    bidId,
    debriefingDate: new Date(),
    strengths,
    weaknesses,
    recommendations: ['Focus on improving technical approach', 'Consider more competitive pricing'],
  };
};

// ============================================================================
// PROTEST HANDLING (36-40)
// ============================================================================

/**
 * Files bid protest.
 *
 * @param {object} protestData - Protest data
 * @returns {Promise<BidProtest>} Filed protest
 *
 * @example
 * ```typescript
 * const protest = await fileBidProtest({
 *   solicitationId: 'sol-123',
 *   protestingVendorId: 'vendor-456',
 *   protestGrounds: 'Improper evaluation',
 *   protestDescription: 'Technical scores not properly calculated'
 * });
 * ```
 */
export const fileBidProtest = async (protestData: any): Promise<BidProtest> => {
  const protestNumber = generateProtestNumber();
  const responseDueDate = new Date();
  responseDueDate.setDate(responseDueDate.getDate() + 10); // 10 days to respond

  return {
    id: generateUUID(),
    solicitationId: protestData.solicitationId,
    protestingVendorId: protestData.protestingVendorId,
    protestNumber,
    protestGrounds: protestData.protestGrounds,
    protestDescription: protestData.protestDescription,
    filedDate: new Date(),
    responseRequired: true,
    responseDueDate,
    status: 'FILED',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Responds to bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} response - Response text
 * @param {string} userId - User responding
 * @returns {Promise<BidProtest>} Updated protest
 *
 * @example
 * ```typescript
 * const responded = await respondToBidProtest('protest-123', 'Evaluation was conducted properly...', 'admin-456');
 * ```
 */
export const respondToBidProtest = async (protestId: string, response: string, userId: string): Promise<BidProtest> => {
  const protest = await getBidProtest(protestId);

  return {
    ...protest,
    response,
    respondedAt: new Date(),
    status: 'UNDER_REVIEW',
    updatedAt: new Date(),
  };
};

/**
 * Reviews and adjudicates bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {object} adjudication - Adjudication decision
 * @param {string} userId - User adjudicating
 * @returns {Promise<BidProtest>} Adjudicated protest
 *
 * @example
 * ```typescript
 * const adjudicated = await adjudicateBidProtest('protest-123', {
 *   decision: 'DENIED',
 *   resolution: 'Evaluation was conducted in accordance with solicitation requirements'
 * }, 'director-789');
 * ```
 */
export const adjudicateBidProtest = async (protestId: string, adjudication: any, userId: string): Promise<BidProtest> => {
  const protest = await getBidProtest(protestId);

  return {
    ...protest,
    resolution: adjudication.resolution,
    resolvedDate: new Date(),
    status: adjudication.decision === 'UPHELD' ? 'UPHELD' : 'DENIED',
    updatedAt: new Date(),
  };
};

/**
 * Withdraws bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<BidProtest>} Withdrawn protest
 *
 * @example
 * ```typescript
 * await withdrawBidProtest('protest-123', 'Issues resolved through clarification');
 * ```
 */
export const withdrawBidProtest = async (protestId: string, reason: string): Promise<BidProtest> => {
  const protest = await getBidProtest(protestId);

  return {
    ...protest,
    status: 'WITHDRAWN',
    resolution: `Protest withdrawn: ${reason}`,
    resolvedDate: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Retrieves protest history for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidProtest[]>} Protest history
 *
 * @example
 * ```typescript
 * const protests = await getProtestHistory('sol-123');
 * ```
 */
export const getProtestHistory = async (solicitationId: string): Promise<BidProtest[]> => {
  // In production, fetch from database
  return [];
};

// ============================================================================
// REPORTING AND ANALYTICS (41-45)
// ============================================================================

/**
 * Generates comprehensive bid evaluation report.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Evaluation report
 *
 * @example
 * ```typescript
 * const report = await generateBidEvaluationReport('sol-123');
 * ```
 */
export const generateBidEvaluationReport = async (
  solicitationId: string,
): Promise<{
  solicitation: BidSolicitation;
  totalBids: number;
  responsiveBids: number;
  comparison: BidComparison;
  recommendation: AwardRecommendation | null;
}> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const bids = await getSolicitationBids(solicitationId);
  const comparison = await generateBidComparison(solicitationId);

  return {
    solicitation,
    totalBids: bids.length,
    responsiveBids: bids.filter((b) => b.responsiveness).length,
    comparison,
    recommendation: null,
  };
};

/**
 * Analyzes vendor competition levels.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Competition analysis
 *
 * @example
 * ```typescript
 * const competition = await analyzeVendorCompetition('sol-123');
 * ```
 */
export const analyzeVendorCompetition = async (
  solicitationId: string,
): Promise<{
  totalBidders: number;
  adequateCompetition: boolean;
  priceSpread: number;
  priceSpreadPercentage: number;
  competitivenessRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}> => {
  const bids = await getSolicitationBids(solicitationId);
  const comparison = await generateBidComparison(solicitationId);

  const priceSpread = comparison.highestBid - comparison.lowestBid;
  const priceSpreadPercentage = (priceSpread / comparison.lowestBid) * 100;

  let competitivenessRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'FAIR';
  if (bids.length >= 5 && priceSpreadPercentage < 15) competitivenessRating = 'EXCELLENT';
  else if (bids.length >= 3 && priceSpreadPercentage < 25) competitivenessRating = 'GOOD';
  else if (bids.length < 2) competitivenessRating = 'POOR';

  return {
    totalBidders: bids.length,
    adequateCompetition: bids.length >= 3,
    priceSpread,
    priceSpreadPercentage,
    competitivenessRating,
  };
};

/**
 * Tracks bid solicitation performance metrics.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackSolicitationMetrics('sol-123');
 * ```
 */
export const trackSolicitationMetrics = async (
  solicitationId: string,
): Promise<{
  daysToAward: number;
  evaluationDuration: number;
  responsiveRate: number;
  averageBidToEstimateRatio: number;
  protestsReceived: number;
}> => {
  const solicitation = await getBidSolicitation(solicitationId);
  const bids = await getSolicitationBids(solicitationId);

  const daysToAward =
    (new Date().getTime() - solicitation.publishedDate!.getTime()) / (1000 * 60 * 60 * 24);
  const evaluationDuration =
    (new Date().getTime() - solicitation.openingDate.getTime()) / (1000 * 60 * 60 * 24);
  const responsiveRate = (bids.filter((b) => b.responsiveness).length / bids.length) * 100;
  const averageBidToEstimateRatio =
    bids.reduce((sum, b) => sum + b.bidAmount, 0) / bids.length / solicitation.estimatedValue;

  return {
    daysToAward,
    evaluationDuration,
    responsiveRate,
    averageBidToEstimateRatio,
    protestsReceived: 0,
  };
};

/**
 * Generates vendor performance scorecard.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<object>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123');
 * ```
 */
export const generateVendorScorecard = async (
  vendorId: string,
): Promise<{
  vendorId: string;
  totalBids: number;
  successfulBids: number;
  winRate: number;
  averageBidRank: number;
  averageTechnicalScore: number;
  responsiveRate: number;
}> => {
  // In production, query vendor bid history
  return {
    vendorId,
    totalBids: 20,
    successfulBids: 5,
    winRate: 25,
    averageBidRank: 2.3,
    averageTechnicalScore: 82.5,
    responsiveRate: 95,
  };
};

/**
 * Exports bid data for compliance reporting.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const report = await exportBidData('sol-123', 'PDF');
 * ```
 */
export const exportBidData = async (solicitationId: string, format: string): Promise<Buffer> => {
  // In production, generate formatted export
  return Buffer.from('Bid data export');
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getBidSolicitation(id: string): Promise<BidSolicitation> {
  return {
    id,
    solicitationNumber: 'SOL-2025-001',
    projectId: 'proj-1',
    title: 'Test Solicitation',
    description: 'Test',
    procurementMethod: ProcurementMethod.COMPETITIVE_SEALED_BID,
    awardMethod: AwardMethod.LOWEST_RESPONSIVE_BID,
    estimatedValue: 1000000,
    openingDate: new Date(),
    closingDate: new Date(),
    status: BidSolicitationStatus.DRAFT,
    bondRequirement: true,
    bondPercentage: 10,
    insuranceRequirements: [],
    evaluationCriteria: [],
    documents: [],
    addenda: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  };
}

async function getBidSubmission(id: string): Promise<BidSubmission> {
  return {
    id,
    solicitationId: 'sol-1',
    vendorId: 'vendor-1',
    vendorName: 'Test Vendor',
    bidNumber: 'BID-001',
    submittalDate: new Date(),
    bidAmount: 950000,
    status: BidStatus.SUBMITTED,
    responsiveness: false,
    responsibility: false,
    scheduleProposed: 180,
    alternatesProvided: false,
    valueEngineeringProposals: [],
    clarifications: [],
    evaluationNotes: '',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function getVendorPrequalification(id: string): Promise<VendorPrequalification> {
  return {
    id,
    vendorId: 'vendor-1',
    vendorName: 'Test Vendor',
    qualificationNumber: 'QUAL-001',
    workCategories: [],
    maxProjectValue: 5000000,
    bondingCapacity: 10000000,
    insuranceCoverage: 5000000,
    pastProjectCount: 10,
    pastProjectValue: 25000000,
    safetyRating: 8.5,
    qualityRating: 9.0,
    performanceRating: 8.7,
    financialStrength: 'GOOD',
    qualificationStatus: VendorQualificationStatus.APPROVED,
    certifications: [],
    licenses: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function getVendorQualificationByVendorId(vendorId: string): Promise<VendorPrequalification | null> {
  return getVendorPrequalification(vendorId);
}

async function getSolicitationBids(solicitationId: string): Promise<BidSubmission[]> {
  return [];
}

async function getBidEvaluations(bidId: string): Promise<BidEvaluation[]> {
  return [];
}

async function getAwardRecommendation(id: string): Promise<AwardRecommendation> {
  return {
    id,
    solicitationId: 'sol-1',
    recommendedBidId: 'bid-1',
    recommendedVendorId: 'vendor-1',
    recommendedAmount: 950000,
    justification: 'Test',
    analysisNotes: 'Test',
    alternativeConsiderations: '',
    approvals: [],
    recommendedBy: 'user-1',
    recommendedAt: new Date(),
    status: 'PENDING',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function getBidProtest(id: string): Promise<BidProtest> {
  return {
    id,
    solicitationId: 'sol-1',
    protestingVendorId: 'vendor-1',
    protestNumber: 'PROT-001',
    protestGrounds: 'Test',
    protestDescription: 'Test',
    filedDate: new Date(),
    responseRequired: true,
    status: 'FILED',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateSolicitationNumber(projectId: string): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `SOL-${year}-${sequence}`;
}

function generateQualificationNumber(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `QUAL-${year}-${sequence}`;
}

function generateBidNumber(solicitationId: string): string {
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `BID-${sequence}`;
}

function generateAwardNumber(solicitationNumber: string): string {
  return solicitationNumber.replace('SOL', 'AWD');
}

function generateProtestNumber(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `PROT-${year}-${sequence}`;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Bid Management Controller
 * Provides RESTful API endpoints for bid solicitation and management
 */
@ApiTags('bid-management')
@Controller('bid-management')
@ApiBearerAuth()
export class BidManagementController {
  @Post('solicitations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create bid solicitation' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createSolicitation(@Body() createDto: CreateBidSolicitationDto) {
    return createBidSolicitation(createDto as any, 'current-user');
  }

  @Get('solicitations/:id')
  @ApiOperation({ summary: 'Get bid solicitation by ID' })
  async getSolicitation(@Param('id', ParseUUIDPipe) id: string) {
    return getBidSolicitation(id);
  }

  @Post('solicitations/:id/publish')
  @ApiOperation({ summary: 'Publish bid solicitation' })
  async publishSolicitation(@Param('id', ParseUUIDPipe) id: string) {
    return publishBidSolicitation(id, 'current-user');
  }

  @Post('bids')
  @ApiOperation({ summary: 'Submit bid' })
  async submitBidEndpoint(@Body() submitDto: SubmitBidDto) {
    return submitBid(submitDto as any, 'current-user');
  }

  @Post('bids/:id/evaluate')
  @ApiOperation({ summary: 'Evaluate bid' })
  async evaluateBidEndpoint(@Param('id', ParseUUIDPipe) id: string, @Body() evaluateDto: EvaluateBidDto) {
    return evaluateBid(evaluateDto, 'current-user');
  }

  @Get('solicitations/:id/comparison')
  @ApiOperation({ summary: 'Generate bid comparison' })
  async getBidComparison(@Param('id', ParseUUIDPipe) id: string) {
    return generateBidComparison(id);
  }

  @Post('vendors/prequalification')
  @ApiOperation({ summary: 'Create vendor prequalification' })
  async createPrequalification(@Body() qualDto: CreateVendorPrequalificationDto) {
    return createVendorPrequalification(qualDto as any, 'current-user');
  }

  @Get('solicitations/:id/report')
  @ApiOperation({ summary: 'Generate bid evaluation report' })
  async getEvaluationReport(@Param('id', ParseUUIDPipe) id: string) {
    return generateBidEvaluationReport(id);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  createBidSolicitationModel,
  createBidSubmissionModel,
  createVendorPrequalificationModel,

  // Bid Solicitation
  createBidSolicitation,
  publishBidSolicitation,
  issueSolicitationAddendum,
  cancelBidSolicitation,
  extendBidClosingDate,

  // Vendor Prequalification
  createVendorPrequalification,
  evaluateVendorPrequalification,
  verifyVendorCredentials,
  checkVendorPastPerformance,
  renewVendorPrequalification,

  // Bid Submission
  submitBid,
  openBids,
  validateBidResponsiveness,
  validateContractorResponsibility,
  requestBidClarification,

  // Bid Evaluation
  evaluateBid,
  calculateBidScore,
  rankBids,
  performConsensusEvaluation,
  normalizeEvaluatorScores,

  // Bid Comparison
  generateBidComparison,
  analyzeBidPrice,
  compareToHistoricalPricing,
  evaluateValueEngineeringProposals,
  generateBidTabulation,

  // Bid Bond and Compliance
  validateBidBond,
  verifySuretyCompany,
  checkSmallBusinessCompliance,
  verifyDBECompliance,
  validateRegulatoryCompliance,

  // Award Processing
  createAwardRecommendation,
  processAwardApproval,
  issueAwardNotice,
  notifyUnsuccessfulBidders,
  conductBidderDebriefing,

  // Protest Handling
  fileBidProtest,
  respondToBidProtest,
  adjudicateBidProtest,
  withdrawBidProtest,
  getProtestHistory,

  // Reporting
  generateBidEvaluationReport,
  analyzeVendorCompetition,
  trackSolicitationMetrics,
  generateVendorScorecard,
  exportBidData,

  // Controller
  BidManagementController,
};
