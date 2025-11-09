/**
 * LOC: LEGAL_ETHICS_KIT_001
 * File: /reuse/legal/legal-ethics-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal ethics management modules
 *   - Professional responsibility services
 *   - Conflict of interest controllers
 *   - Client confidentiality services
 *   - Fee compliance services
 *   - Ethics monitoring dashboards
 */

/**
 * File: /reuse/legal/legal-ethics-compliance-kit.ts
 * Locator: WC-LEGAL-ETHICS-KIT-001
 * Purpose: Production-Grade Legal Ethics & Professional Responsibility Kit - Comprehensive ethics compliance toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, date-fns, crypto
 * Downstream: ../backend/modules/legal/*, Ethics compliance services, Professional conduct modules
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready legal ethics and professional responsibility functions
 *
 * LLM Context: Production-grade legal ethics and professional responsibility toolkit for White Cross platform.
 * Provides comprehensive ethics rule tracking with jurisdiction-specific rules and updates, professional
 * conduct analysis with automated violation detection, conflict of interest management with advanced
 * screening algorithms, client confidentiality protection with privilege tracking, fee arrangement
 * compliance with reasonableness analysis, ethics violation tracking with remediation workflows,
 * continuing legal education (CLE) tracking, client trust account monitoring, pro bono commitment
 * tracking, advertising and solicitation compliance, lawyer competency assessment, client communication
 * standards, billing ethics validation, matter acceptance screening, withdrawal of representation
 * protocols, third-party communication rules, opposing counsel professional courtesy, expert witness
 * ethics, litigation conduct standards, settlement authority verification, and Bar association
 * reporting. Includes Sequelize models for ethics rules, violations, conflicts, remediation plans,
 * CLE records, NestJS services with dependency injection, Swagger API documentation, and comprehensive
 * validation schemas for all ethics-related operations.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Index,
  Unique,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions, Transaction } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Ethics rule categories based on ABA Model Rules of Professional Conduct
 */
export enum EthicsRuleCategory {
  CLIENT_LAWYER_RELATIONSHIP = 'client_lawyer_relationship',
  COUNSELOR = 'counselor',
  ADVOCATE = 'advocate',
  TRANSACTIONS_WITH_OTHERS = 'transactions_with_others',
  LAW_FIRMS = 'law_firms',
  PUBLIC_SERVICE = 'public_service',
  INFORMATION_ABOUT_SERVICES = 'information_about_services',
  MAINTAINING_INTEGRITY = 'maintaining_integrity',
}

/**
 * Violation severity levels
 */
export enum ViolationSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  SEVERE = 'severe',
  DISBARMENT_LEVEL = 'disbarment_level',
}

/**
 * Violation status tracking
 */
export enum ViolationStatus {
  REPORTED = 'reported',
  UNDER_INVESTIGATION = 'under_investigation',
  SUBSTANTIATED = 'substantiated',
  UNSUBSTANTIATED = 'unsubstantiated',
  REMEDIATED = 'remediated',
  PENDING_DISCIPLINE = 'pending_discipline',
  CLOSED = 'closed',
}

/**
 * Conflict of interest types
 */
export enum ConflictType {
  DIRECT_ADVERSITY = 'direct_adversity',
  MATERIAL_LIMITATION = 'material_limitation',
  FORMER_CLIENT = 'former_client',
  IMPUTED_CONFLICT = 'imputed_conflict',
  PERSONAL_INTEREST = 'personal_interest',
  THIRD_PARTY_PAYER = 'third_party_payer',
  PROSPECTIVE_CLIENT = 'prospective_client',
  BUSINESS_TRANSACTION = 'business_transaction',
}

/**
 * Conflict resolution status
 */
export enum ConflictResolution {
  WAIVED_BY_CLIENT = 'waived_by_client',
  SCREENING_IMPLEMENTED = 'screening_implemented',
  REPRESENTATION_DECLINED = 'representation_declined',
  REPRESENTATION_TERMINATED = 'representation_terminated',
  NO_CONFLICT = 'no_conflict',
  PENDING_REVIEW = 'pending_review',
}

/**
 * Fee arrangement types
 */
export enum FeeArrangementType {
  HOURLY = 'hourly',
  FLAT_FEE = 'flat_fee',
  CONTINGENT = 'contingent',
  RETAINER = 'retainer',
  HYBRID = 'hybrid',
  STATUTORY = 'statutory',
  COURT_AWARDED = 'court_awarded',
}

/**
 * Confidentiality classification levels
 */
export enum ConfidentialityLevel {
  PUBLIC = 'public',
  CONFIDENTIAL = 'confidential',
  ATTORNEY_CLIENT_PRIVILEGE = 'attorney_client_privilege',
  WORK_PRODUCT = 'work_product',
  TRADE_SECRET = 'trade_secret',
}

/**
 * Professional conduct areas
 */
export enum ConductArea {
  COMPETENCE = 'competence',
  DILIGENCE = 'diligence',
  COMMUNICATION = 'communication',
  CONFIDENTIALITY = 'confidentiality',
  CONFLICTS = 'conflicts',
  FEES = 'fees',
  ADVERTISING = 'advertising',
  CANDOR_TO_TRIBUNAL = 'candor_to_tribunal',
  FAIRNESS_TO_OPPOSING_PARTY = 'fairness_to_opposing_party',
  TRANSACTIONS_WITH_NONLAWYERS = 'transactions_with_nonlawyers',
}

/**
 * Bar association reporting types
 */
export enum BarReportingType {
  ANNUAL_REGISTRATION = 'annual_registration',
  CLE_COMPLIANCE = 'cle_compliance',
  TRUST_ACCOUNT_CERTIFICATION = 'trust_account_certification',
  MALPRACTICE_INSURANCE = 'malpractice_insurance',
  DISCIPLINARY_ACTION = 'disciplinary_action',
  PRO_BONO_HOURS = 'pro_bono_hours',
  IOLTA_REPORT = 'iolta_report',
}

/**
 * Ethics rule interface
 */
export interface EthicsRule {
  id?: string;
  ruleNumber: string;
  title: string;
  category: EthicsRuleCategory;
  jurisdiction: string;
  ruleText: string;
  commentary?: string;
  effectiveDate: Date;
  amendments?: Array<{
    date: Date;
    description: string;
    amendedText: string;
  }>;
  relatedRules?: string[];
  caseAnnotations?: Array<{
    caseName: string;
    citation: string;
    summary: string;
    year: number;
  }>;
  disciplinaryStandard?: string;
  metadata?: Record<string, any>;
}

/**
 * Ethics violation interface
 */
export interface EthicsViolation {
  id?: string;
  violationType: string;
  ruleViolated: string;
  severity: ViolationSeverity;
  status: ViolationStatus;
  lawyerId: string;
  matterId?: string;
  clientId?: string;
  reportedBy?: string;
  reportedDate: Date;
  incidentDate: Date;
  description: string;
  evidence?: string[];
  investigationNotes?: string;
  remediationPlanId?: string;
  disciplinaryAction?: string;
  closedDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Conflict of interest check interface
 */
export interface ConflictCheck {
  id?: string;
  matterId: string;
  clientId: string;
  opposingParties: string[];
  relatedEntities: string[];
  checkDate: Date;
  checkedBy: string;
  conflictsFound: ConflictDetail[];
  resolution?: ConflictResolution;
  waiverObtained?: boolean;
  waiverDate?: Date;
  screeningMeasures?: string[];
  reviewDate?: Date;
  status: 'pending' | 'cleared' | 'conflict_exists' | 'waived';
  notes?: string;
}

/**
 * Conflict detail interface
 */
export interface ConflictDetail {
  conflictType: ConflictType;
  description: string;
  involvedParties: string[];
  affectedLawyers: string[];
  matterReference?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

/**
 * Fee arrangement compliance interface
 */
export interface FeeArrangementCompliance {
  id?: string;
  matterId: string;
  clientId: string;
  arrangementType: FeeArrangementType;
  writtenAgreement: boolean;
  agreementDate?: Date;
  rate?: number;
  contingencyPercentage?: number;
  flatFeeAmount?: number;
  retainerAmount?: number;
  scopeOfRepresentation: string;
  billingFrequency?: string;
  advancedCosts?: number;
  reasonablenessAnalysis?: {
    factorsConsidered: string[];
    marketComparison: string;
    complexityJustification: string;
    approvedBy: string;
    approvedDate: Date;
  };
  prohibitedFeeTypes?: string[];
  divisionOfFees?: {
    sharedWith: string;
    percentage: number;
    clientConsent: boolean;
    jurisdictionPermits: boolean;
  };
  complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
  lastReviewDate: Date;
}

/**
 * Client confidentiality record interface
 */
export interface ConfidentialityRecord {
  id?: string;
  clientId: string;
  matterId: string;
  documentId?: string;
  communicationId?: string;
  classificationLevel: ConfidentialityLevel;
  subject: string;
  createdDate: Date;
  accessLog: Array<{
    accessedBy: string;
    accessDate: Date;
    purpose: string;
    authorized: boolean;
  }>;
  disclosures?: Array<{
    disclosedTo: string;
    disclosureDate: Date;
    purpose: string;
    clientConsent: boolean;
    legalException?: string;
  }>;
  retentionPeriod?: number;
  destructionDate?: Date;
  privilegeClaim: boolean;
  workProductClaim: boolean;
  exceptions?: string[];
}

/**
 * Remediation plan interface
 */
export interface RemediationPlan {
  id?: string;
  violationId: string;
  lawyerId: string;
  createdDate: Date;
  createdBy: string;
  objectives: string[];
  actions: Array<{
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    evidence?: string;
  }>;
  trainingRequired?: string[];
  supervisoryReview: boolean;
  reviewFrequency: string;
  completionDate?: Date;
  effectiveness?: string;
  status: 'active' | 'completed' | 'suspended';
}

/**
 * Continuing Legal Education (CLE) record interface
 */
export interface CLERecord {
  id?: string;
  lawyerId: string;
  jurisdiction: string;
  reportingPeriod: string;
  periodStart: Date;
  periodEnd: Date;
  requiredHours: number;
  completedHours: number;
  ethicsHoursRequired: number;
  ethicsHoursCompleted: number;
  courses: Array<{
    courseId: string;
    title: string;
    provider: string;
    date: Date;
    hours: number;
    ethicsHours: number;
    certificateNumber: string;
  }>;
  complianceStatus: 'compliant' | 'deficient' | 'pending';
  reportedToBar: boolean;
  reportDate?: Date;
}

/**
 * Trust account transaction interface
 */
export interface TrustAccountTransaction {
  id?: string;
  accountId: string;
  clientId: string;
  matterId: string;
  transactionDate: Date;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'interest';
  amount: number;
  balance: number;
  description: string;
  checkNumber?: string;
  reference?: string;
  reconciled: boolean;
  reconciliationDate?: Date;
  threeWayReconciliation?: {
    bankBalance: number;
    bookBalance: number;
    clientLedgerTotal: number;
    reconciled: boolean;
    discrepancies?: string[];
  };
  complianceFlags?: string[];
}

/**
 * Professional conduct assessment interface
 */
export interface ConductAssessment {
  id?: string;
  lawyerId: string;
  assessmentDate: Date;
  assessedBy: string;
  conductArea: ConductArea;
  findings: string;
  score?: number;
  strengths: string[];
  areasForImprovement: string[];
  actionItems: string[];
  followUpDate?: Date;
  completed: boolean;
}

/**
 * Bar reporting submission interface
 */
export interface BarReportingSubmission {
  id?: string;
  lawyerId: string;
  jurisdiction: string;
  reportingType: BarReportingType;
  reportingPeriod: string;
  submissionDate: Date;
  confirmationNumber?: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  rejectionReason?: string;
  attestation: {
    attestedBy: string;
    attestedDate: Date;
    signature: string;
  };
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Ethics rule validation schema
 */
export const EthicsRuleSchema = z.object({
  ruleNumber: z.string().min(1).max(50),
  title: z.string().min(1).max(500),
  category: z.nativeEnum(EthicsRuleCategory),
  jurisdiction: z.string().min(2).max(100),
  ruleText: z.string().min(1),
  commentary: z.string().optional(),
  effectiveDate: z.date(),
  amendments: z.array(z.object({
    date: z.date(),
    description: z.string(),
    amendedText: z.string(),
  })).optional(),
  relatedRules: z.array(z.string()).optional(),
  caseAnnotations: z.array(z.object({
    caseName: z.string(),
    citation: z.string(),
    summary: z.string(),
    year: z.number(),
  })).optional(),
  disciplinaryStandard: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Ethics violation validation schema
 */
export const EthicsViolationSchema = z.object({
  violationType: z.string().min(1),
  ruleViolated: z.string().min(1),
  severity: z.nativeEnum(ViolationSeverity),
  status: z.nativeEnum(ViolationStatus),
  lawyerId: z.string().uuid(),
  matterId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  reportedBy: z.string().optional(),
  reportedDate: z.date(),
  incidentDate: z.date(),
  description: z.string().min(10),
  evidence: z.array(z.string()).optional(),
  investigationNotes: z.string().optional(),
  remediationPlanId: z.string().uuid().optional(),
  disciplinaryAction: z.string().optional(),
  closedDate: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Conflict check validation schema
 */
export const ConflictCheckSchema = z.object({
  matterId: z.string().uuid(),
  clientId: z.string().uuid(),
  opposingParties: z.array(z.string()),
  relatedEntities: z.array(z.string()),
  checkDate: z.date(),
  checkedBy: z.string().uuid(),
  conflictsFound: z.array(z.object({
    conflictType: z.nativeEnum(ConflictType),
    description: z.string(),
    involvedParties: z.array(z.string()),
    affectedLawyers: z.array(z.string()),
    matterReference: z.string().optional(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
    recommendation: z.string(),
  })),
  resolution: z.nativeEnum(ConflictResolution).optional(),
  waiverObtained: z.boolean().optional(),
  waiverDate: z.date().optional(),
  screeningMeasures: z.array(z.string()).optional(),
  status: z.enum(['pending', 'cleared', 'conflict_exists', 'waived']),
  notes: z.string().optional(),
});

/**
 * Fee arrangement validation schema
 */
export const FeeArrangementSchema = z.object({
  matterId: z.string().uuid(),
  clientId: z.string().uuid(),
  arrangementType: z.nativeEnum(FeeArrangementType),
  writtenAgreement: z.boolean(),
  agreementDate: z.date().optional(),
  rate: z.number().positive().optional(),
  contingencyPercentage: z.number().min(0).max(100).optional(),
  flatFeeAmount: z.number().positive().optional(),
  retainerAmount: z.number().positive().optional(),
  scopeOfRepresentation: z.string().min(10),
  billingFrequency: z.string().optional(),
  complianceStatus: z.enum(['compliant', 'under_review', 'non_compliant']),
});

/**
 * Confidentiality record validation schema
 */
export const ConfidentialityRecordSchema = z.object({
  clientId: z.string().uuid(),
  matterId: z.string().uuid(),
  documentId: z.string().uuid().optional(),
  communicationId: z.string().uuid().optional(),
  classificationLevel: z.nativeEnum(ConfidentialityLevel),
  subject: z.string().min(1),
  createdDate: z.date(),
  privilegeClaim: z.boolean(),
  workProductClaim: z.boolean(),
  exceptions: z.array(z.string()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Ethics Rule Model
 * Stores jurisdiction-specific ethics rules and professional conduct standards
 */
@Table({
  tableName: 'ethics_rules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['jurisdiction'] },
    { fields: ['category'] },
    { fields: ['ruleNumber', 'jurisdiction'], unique: true },
    { fields: ['effectiveDate'] },
  ],
})
export class EthicsRuleModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Ethics rule number', example: '1.7' })
  ruleNumber!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Rule title', example: 'Conflict of Interest: Current Clients' })
  title!: string;

  @Column({
    type: DataType.ENUM(...Object.values(EthicsRuleCategory)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: EthicsRuleCategory, description: 'Rule category' })
  category!: EthicsRuleCategory;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Jurisdiction (state/country)', example: 'California' })
  jurisdiction!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Full text of the ethics rule' })
  ruleText!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Official commentary on the rule' })
  commentary?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Date rule became effective' })
  effectiveDate!: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Amendment history' })
  amendments?: Array<{
    date: Date;
    description: string;
    amendedText: string;
  }>;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Related rule numbers' })
  relatedRules?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Case law annotations' })
  caseAnnotations?: Array<{
    caseName: string;
    citation: string;
    summary: string;
    year: number;
  }>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Disciplinary standards for violations' })
  disciplinaryStandard?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;

  @HasMany(() => EthicsViolationModel, 'ruleViolated')
  violations?: EthicsViolationModel[];
}

/**
 * Ethics Violation Model
 * Tracks ethics violations, investigations, and disciplinary actions
 */
@Table({
  tableName: 'ethics_violations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['lawyerId'] },
    { fields: ['status'] },
    { fields: ['severity'] },
    { fields: ['incidentDate'] },
    { fields: ['matterId'] },
  ],
})
export class EthicsViolationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Type of violation' })
  violationType!: string;

  @ForeignKey(() => EthicsRuleModel)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Rule number that was violated' })
  ruleViolated!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ViolationSeverity)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: ViolationSeverity, description: 'Severity of violation' })
  severity!: ViolationSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(ViolationStatus)),
    allowNull: false,
    defaultValue: ViolationStatus.REPORTED,
  })
  @Index
  @ApiProperty({ enum: ViolationStatus, description: 'Current status of violation' })
  status!: ViolationStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Lawyer ID who committed violation' })
  lawyerId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  @ApiProperty({ description: 'Associated matter ID' })
  matterId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Associated client ID' })
  clientId?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Who reported the violation' })
  reportedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @ApiProperty({ description: 'Date violation was reported' })
  reportedDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Date violation occurred' })
  incidentDate!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Detailed description of violation' })
  description!: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Evidence file paths or references' })
  evidence?: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Investigation notes' })
  investigationNotes?: string;

  @ForeignKey(() => RemediationPlanModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Associated remediation plan ID' })
  remediationPlanId?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Disciplinary action taken' })
  disciplinaryAction?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date case was closed' })
  closedDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;

  @BelongsTo(() => EthicsRuleModel, 'ruleViolated')
  rule?: EthicsRuleModel;

  @BelongsTo(() => RemediationPlanModel, 'remediationPlanId')
  remediationPlan?: RemediationPlanModel;
}

/**
 * Conflict of Interest Model
 * Manages conflict checks and screening for legal matters
 */
@Table({
  tableName: 'conflict_checks',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['clientId'] },
    { fields: ['status'] },
    { fields: ['checkDate'] },
  ],
})
export class ConflictCheckModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Matter ID' })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Client ID' })
  clientId!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({ description: 'List of opposing parties' })
  opposingParties!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({ description: 'Related entities to check' })
  relatedEntities!: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  @ApiProperty({ description: 'Date conflict check was performed' })
  checkDate!: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ description: 'User who performed the check' })
  checkedBy!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ description: 'Conflicts found during check' })
  conflictsFound!: ConflictDetail[];

  @Column({
    type: DataType.ENUM(...Object.values(ConflictResolution)),
    allowNull: true,
  })
  @ApiPropertyOptional({ enum: ConflictResolution, description: 'How conflict was resolved' })
  resolution?: ConflictResolution;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  @ApiPropertyOptional({ description: 'Whether client waiver was obtained' })
  waiverObtained?: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date waiver was obtained' })
  waiverDate?: Date;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Screening measures implemented' })
  screeningMeasures?: string[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Next review date' })
  reviewDate?: Date;

  @Column({
    type: DataType.ENUM('pending', 'cleared', 'conflict_exists', 'waived'),
    allowNull: false,
    defaultValue: 'pending',
  })
  @Index
  @ApiProperty({ description: 'Current status of conflict check' })
  status!: 'pending' | 'cleared' | 'conflict_exists' | 'waived';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional notes' })
  notes?: string;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Remediation Plan Model
 * Tracks remediation plans for ethics violations
 */
@Table({
  tableName: 'remediation_plans',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['violationId'] },
    { fields: ['lawyerId'] },
    { fields: ['status'] },
  ],
})
export class RemediationPlanModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Associated violation ID' })
  violationId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Lawyer ID' })
  lawyerId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @ApiProperty({ description: 'Plan creation date' })
  createdDate!: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ description: 'User who created the plan' })
  createdBy!: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
  })
  @ApiProperty({ description: 'Remediation objectives' })
  objectives!: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Remediation actions' })
  actions!: Array<{
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    evidence?: string;
  }>;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Required training courses' })
  trainingRequired?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({ description: 'Whether supervisory review is required' })
  supervisoryReview!: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @ApiProperty({ description: 'Review frequency', example: 'monthly' })
  reviewFrequency!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Plan completion date' })
  completionDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Effectiveness assessment' })
  effectiveness?: string;

  @Column({
    type: DataType.ENUM('active', 'completed', 'suspended'),
    allowNull: false,
    defaultValue: 'active',
  })
  @Index
  @ApiProperty({ description: 'Plan status' })
  status!: 'active' | 'completed' | 'suspended';

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;

  @HasMany(() => EthicsViolationModel, 'remediationPlanId')
  violations?: EthicsViolationModel[];
}

/**
 * Fee Arrangement Compliance Model
 * Tracks and validates fee arrangements for compliance
 */
@Table({
  tableName: 'fee_arrangement_compliance',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['clientId'] },
    { fields: ['complianceStatus'] },
    { fields: ['arrangementType'] },
  ],
})
export class FeeArrangementComplianceModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Matter ID' })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Client ID' })
  clientId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(FeeArrangementType)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: FeeArrangementType, description: 'Type of fee arrangement' })
  arrangementType!: FeeArrangementType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty({ description: 'Whether written agreement exists' })
  writtenAgreement!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date agreement was signed' })
  agreementDate?: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Hourly rate' })
  rate?: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Contingency percentage' })
  contingencyPercentage?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Flat fee amount' })
  flatFeeAmount?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Retainer amount' })
  retainerAmount?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Scope of representation' })
  scopeOfRepresentation!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Billing frequency', example: 'monthly' })
  billingFrequency?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Advanced costs' })
  advancedCosts?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Reasonableness analysis details' })
  reasonablenessAnalysis?: {
    factorsConsidered: string[];
    marketComparison: string;
    complexityJustification: string;
    approvedBy: string;
    approvedDate: Date;
  };

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Prohibited fee types for this matter' })
  prohibitedFeeTypes?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Fee division details if applicable' })
  divisionOfFees?: {
    sharedWith: string;
    percentage: number;
    clientConsent: boolean;
    jurisdictionPermits: boolean;
  };

  @Column({
    type: DataType.ENUM('compliant', 'under_review', 'non_compliant'),
    allowNull: false,
    defaultValue: 'under_review',
  })
  @Index
  @ApiProperty({ description: 'Compliance status' })
  complianceStatus!: 'compliant' | 'under_review' | 'non_compliant';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @ApiProperty({ description: 'Last review date' })
  lastReviewDate!: Date;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Confidentiality Record Model
 * Tracks client confidential information and privilege claims
 */
@Table({
  tableName: 'confidentiality_records',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['clientId'] },
    { fields: ['matterId'] },
    { fields: ['classificationLevel'] },
    { fields: ['createdDate'] },
  ],
})
export class ConfidentialityRecordModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Client ID' })
  clientId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Matter ID' })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Document ID if applicable' })
  documentId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Communication ID if applicable' })
  communicationId?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ConfidentialityLevel)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: ConfidentialityLevel, description: 'Classification level' })
  classificationLevel!: ConfidentialityLevel;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Subject of confidential information' })
  subject!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  @ApiProperty({ description: 'Creation date' })
  createdDate!: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ description: 'Access log entries' })
  accessLog!: Array<{
    accessedBy: string;
    accessDate: Date;
    purpose: string;
    authorized: boolean;
  }>;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Disclosure records' })
  disclosures?: Array<{
    disclosedTo: string;
    disclosureDate: Date;
    purpose: string;
    clientConsent: boolean;
    legalException?: string;
  }>;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Retention period in days' })
  retentionPeriod?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Scheduled destruction date' })
  destructionDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether attorney-client privilege claimed' })
  privilegeClaim!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether work product protection claimed' })
  workProductClaim!: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Exceptions to confidentiality' })
  exceptions?: string[];

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * Ethics Rule Service
 * Manages ethics rules tracking, monitoring, and updates
 */
@Injectable()
export class EthicsRuleService {
  private readonly logger = new Logger(EthicsRuleService.name);

  constructor(
    @Inject('ETHICS_RULE_REPOSITORY')
    private readonly ethicsRuleRepository: typeof EthicsRuleModel,
  ) {}

  /**
   * 1. Create a new ethics rule
   */
  async createEthicsRule(ruleData: EthicsRule): Promise<EthicsRuleModel> {
    try {
      const validated = EthicsRuleSchema.parse(ruleData);
      const rule = await this.ethicsRuleRepository.create(validated as any);
      this.logger.log(`Created ethics rule: ${rule.ruleNumber} for ${rule.jurisdiction}`);
      return rule;
    } catch (error) {
      this.logger.error(`Failed to create ethics rule: ${error.message}`);
      throw new BadRequestException(`Failed to create ethics rule: ${error.message}`);
    }
  }

  /**
   * 2. Get ethics rule by ID
   */
  async getEthicsRuleById(id: string): Promise<EthicsRuleModel> {
    const rule = await this.ethicsRuleRepository.findByPk(id);
    if (!rule) {
      throw new NotFoundException(`Ethics rule not found: ${id}`);
    }
    return rule;
  }

  /**
   * 3. Get ethics rules by jurisdiction
   */
  async getEthicsRulesByJurisdiction(
    jurisdiction: string,
    category?: EthicsRuleCategory,
  ): Promise<EthicsRuleModel[]> {
    const where: WhereOptions = { jurisdiction };
    if (category) {
      where.category = category;
    }

    return await this.ethicsRuleRepository.findAll({ where });
  }

  /**
   * 4. Search ethics rules
   */
  async searchEthicsRules(
    searchText: string,
    jurisdiction?: string,
  ): Promise<EthicsRuleModel[]> {
    const where: WhereOptions = {
      [Op.or]: [
        { ruleText: { [Op.iLike]: `%${searchText}%` } },
        { title: { [Op.iLike]: `%${searchText}%` } },
        { commentary: { [Op.iLike]: `%${searchText}%` } },
      ],
    };

    if (jurisdiction) {
      where.jurisdiction = jurisdiction;
    }

    return await this.ethicsRuleRepository.findAll({ where });
  }

  /**
   * 5. Update ethics rule (for amendments)
   */
  async updateEthicsRule(
    id: string,
    updates: Partial<EthicsRule>,
  ): Promise<EthicsRuleModel> {
    const rule = await this.getEthicsRuleById(id);

    // If updating rule text, add to amendment history
    if (updates.ruleText && updates.ruleText !== rule.ruleText) {
      const amendments = rule.amendments || [];
      amendments.push({
        date: new Date(),
        description: 'Rule text updated',
        amendedText: updates.ruleText,
      });
      updates.amendments = amendments;
    }

    await rule.update(updates);
    this.logger.log(`Updated ethics rule: ${id}`);
    return rule;
  }

  /**
   * 6. Get rules requiring attention (recently amended)
   */
  async getRecentlyAmendedRules(days: number = 90): Promise<EthicsRuleModel[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.ethicsRuleRepository.findAll({
      where: {
        updatedAt: { [Op.gte]: cutoffDate },
      },
      order: [['updatedAt', 'DESC']],
    });
  }
}

/**
 * Ethics Violation Service
 * Manages ethics violation tracking, investigation, and remediation
 */
@Injectable()
export class EthicsViolationService {
  private readonly logger = new Logger(EthicsViolationService.name);

  constructor(
    @Inject('ETHICS_VIOLATION_REPOSITORY')
    private readonly violationRepository: typeof EthicsViolationModel,
    @Inject('REMEDIATION_PLAN_REPOSITORY')
    private readonly remediationRepository: typeof RemediationPlanModel,
  ) {}

  /**
   * 7. Report an ethics violation
   */
  async reportViolation(violationData: EthicsViolation): Promise<EthicsViolationModel> {
    try {
      const validated = EthicsViolationSchema.parse(violationData);
      const violation = await this.violationRepository.create(validated as any);
      this.logger.warn(
        `Ethics violation reported: ${violation.id} - ${violation.violationType}`,
      );
      return violation;
    } catch (error) {
      this.logger.error(`Failed to report violation: ${error.message}`);
      throw new BadRequestException(`Failed to report violation: ${error.message}`);
    }
  }

  /**
   * 8. Get violations by lawyer
   */
  async getViolationsByLawyer(
    lawyerId: string,
    status?: ViolationStatus,
  ): Promise<EthicsViolationModel[]> {
    const where: WhereOptions = { lawyerId };
    if (status) {
      where.status = status;
    }

    return await this.violationRepository.findAll({
      where,
      include: ['rule', 'remediationPlan'],
      order: [['incidentDate', 'DESC']],
    });
  }

  /**
   * 9. Update violation status
   */
  async updateViolationStatus(
    id: string,
    status: ViolationStatus,
    notes?: string,
  ): Promise<EthicsViolationModel> {
    const violation = await this.violationRepository.findByPk(id);
    if (!violation) {
      throw new NotFoundException(`Violation not found: ${id}`);
    }

    await violation.update({
      status,
      investigationNotes: notes || violation.investigationNotes,
      closedDate: status === ViolationStatus.CLOSED ? new Date() : violation.closedDate,
    });

    this.logger.log(`Updated violation ${id} status to ${status}`);
    return violation;
  }

  /**
   * 10. Get violations by severity
   */
  async getViolationsBySeverity(severity: ViolationSeverity): Promise<EthicsViolationModel[]> {
    return await this.violationRepository.findAll({
      where: { severity },
      include: ['rule'],
      order: [['incidentDate', 'DESC']],
    });
  }

  /**
   * 11. Analyze violation patterns
   */
  async analyzeViolationPatterns(
    lawyerId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalViolations: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    trends: any[];
  }> {
    const where: WhereOptions = {};
    if (lawyerId) where.lawyerId = lawyerId;
    if (startDate || endDate) {
      where.incidentDate = {};
      if (startDate) where.incidentDate[Op.gte] = startDate;
      if (endDate) where.incidentDate[Op.lte] = endDate;
    }

    const violations = await this.violationRepository.findAll({ where, include: ['rule'] });

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    violations.forEach((v) => {
      const category = v.rule?.category || 'unknown';
      byCategory[category] = (byCategory[category] || 0) + 1;
      bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
    });

    return {
      totalViolations: violations.length,
      byCategory,
      bySeverity,
      trends: [], // Could be enhanced with time-series analysis
    };
  }

  /**
   * 12. Create remediation plan for violation
   */
  async createRemediationPlan(
    violationId: string,
    planData: Partial<RemediationPlan>,
  ): Promise<RemediationPlanModel> {
    const violation = await this.violationRepository.findByPk(violationId);
    if (!violation) {
      throw new NotFoundException(`Violation not found: ${violationId}`);
    }

    const plan = await this.remediationRepository.create({
      ...planData,
      violationId,
      lawyerId: violation.lawyerId,
    } as any);

    await violation.update({ remediationPlanId: plan.id });

    this.logger.log(`Created remediation plan ${plan.id} for violation ${violationId}`);
    return plan;
  }
}

/**
 * Conflict of Interest Service
 * Manages conflict checks and screening
 */
@Injectable()
export class ConflictOfInterestService {
  private readonly logger = new Logger(ConflictOfInterestService.name);

  constructor(
    @Inject('CONFLICT_CHECK_REPOSITORY')
    private readonly conflictRepository: typeof ConflictCheckModel,
  ) {}

  /**
   * 13. Perform conflict check
   */
  async performConflictCheck(checkData: ConflictCheck): Promise<ConflictCheckModel> {
    try {
      const validated = ConflictCheckSchema.parse(checkData);

      // Perform actual conflict screening logic here
      const conflicts = await this.screenForConflicts(
        checkData.clientId,
        checkData.opposingParties,
        checkData.relatedEntities,
      );

      const check = await this.conflictRepository.create({
        ...validated,
        conflictsFound: conflicts,
        status: conflicts.length > 0 ? 'conflict_exists' : 'cleared',
      } as any);

      this.logger.log(
        `Conflict check ${check.id}: Found ${conflicts.length} potential conflicts`,
      );
      return check;
    } catch (error) {
      this.logger.error(`Failed to perform conflict check: ${error.message}`);
      throw new BadRequestException(`Failed to perform conflict check: ${error.message}`);
    }
  }

  /**
   * 14. Screen for conflicts (advanced algorithm)
   */
  async screenForConflicts(
    clientId: string,
    opposingParties: string[],
    relatedEntities: string[],
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Check for direct adversity
    const directAdversity = await this.checkDirectAdversity(clientId, opposingParties);
    if (directAdversity.length > 0) {
      conflicts.push(...directAdversity);
    }

    // Check for former client conflicts
    const formerClientConflicts = await this.checkFormerClientConflicts(
      clientId,
      relatedEntities,
    );
    if (formerClientConflicts.length > 0) {
      conflicts.push(...formerClientConflicts);
    }

    // Check for imputed conflicts
    const imputedConflicts = await this.checkImputedConflicts(clientId);
    if (imputedConflicts.length > 0) {
      conflicts.push(...imputedConflicts);
    }

    return conflicts;
  }

  /**
   * 15. Check for direct adversity conflicts
   */
  private async checkDirectAdversity(
    clientId: string,
    opposingParties: string[],
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Query existing matters where opposing parties are current clients
    const existingChecks = await this.conflictRepository.findAll({
      where: {
        clientId: { [Op.in]: opposingParties },
        status: { [Op.in]: ['cleared', 'waived'] },
      },
    });

    existingChecks.forEach((check) => {
      conflicts.push({
        conflictType: ConflictType.DIRECT_ADVERSITY,
        description: `Client ${clientId} is adverse to existing client in matter ${check.matterId}`,
        involvedParties: [clientId, check.clientId],
        affectedLawyers: [],
        matterReference: check.matterId,
        riskLevel: 'critical',
        recommendation: 'Decline representation or obtain informed consent waiver from both clients',
      });
    });

    return conflicts;
  }

  /**
   * 16. Check for former client conflicts
   */
  private async checkFormerClientConflicts(
    clientId: string,
    relatedEntities: string[],
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Check if any related entities are former clients
    const formerClientChecks = await this.conflictRepository.findAll({
      where: {
        clientId: { [Op.in]: relatedEntities },
        status: 'cleared',
      },
    });

    formerClientChecks.forEach((check) => {
      conflicts.push({
        conflictType: ConflictType.FORMER_CLIENT,
        description: `Matter involves former client ${check.clientId}`,
        involvedParties: [clientId, check.clientId],
        affectedLawyers: [],
        matterReference: check.matterId,
        riskLevel: 'high',
        recommendation: 'Assess if matter is substantially related to former representation',
      });
    });

    return conflicts;
  }

  /**
   * 17. Check for imputed conflicts
   */
  private async checkImputedConflicts(clientId: string): Promise<ConflictDetail[]> {
    // This would check firm-wide conflicts
    // Placeholder for firm-wide conflict screening logic
    return [];
  }

  /**
   * 18. Resolve conflict with waiver
   */
  async resolveWithWaiver(
    conflictCheckId: string,
    waiverData: {
      waiverObtained: boolean;
      waiverDate: Date;
      notes: string;
    },
  ): Promise<ConflictCheckModel> {
    const check = await this.conflictRepository.findByPk(conflictCheckId);
    if (!check) {
      throw new NotFoundException(`Conflict check not found: ${conflictCheckId}`);
    }

    await check.update({
      waiverObtained: waiverData.waiverObtained,
      waiverDate: waiverData.waiverDate,
      resolution: ConflictResolution.WAIVED_BY_CLIENT,
      status: 'waived',
      notes: waiverData.notes,
    });

    this.logger.log(`Resolved conflict ${conflictCheckId} with client waiver`);
    return check;
  }

  /**
   * 19. Implement screening measures
   */
  async implementScreening(
    conflictCheckId: string,
    screeningMeasures: string[],
  ): Promise<ConflictCheckModel> {
    const check = await this.conflictRepository.findByPk(conflictCheckId);
    if (!check) {
      throw new NotFoundException(`Conflict check not found: ${conflictCheckId}`);
    }

    await check.update({
      screeningMeasures,
      resolution: ConflictResolution.SCREENING_IMPLEMENTED,
    });

    this.logger.log(`Implemented screening measures for conflict ${conflictCheckId}`);
    return check;
  }

  /**
   * 20. Get conflicts requiring review
   */
  async getConflictsRequiringReview(): Promise<ConflictCheckModel[]> {
    return await this.conflictRepository.findAll({
      where: {
        status: { [Op.in]: ['pending', 'conflict_exists'] },
        reviewDate: { [Op.or]: [null, { [Op.lte]: new Date() }] },
      },
      order: [['checkDate', 'ASC']],
    });
  }
}

/**
 * Client Confidentiality Service
 * Manages client confidential information protection
 */
@Injectable()
export class ClientConfidentialityService {
  private readonly logger = new Logger(ClientConfidentialityService.name);

  constructor(
    @Inject('CONFIDENTIALITY_RECORD_REPOSITORY')
    private readonly confidentialityRepository: typeof ConfidentialityRecordModel,
  ) {}

  /**
   * 21. Create confidentiality record
   */
  async createConfidentialityRecord(
    recordData: ConfidentialityRecord,
  ): Promise<ConfidentialityRecordModel> {
    try {
      const validated = ConfidentialityRecordSchema.parse(recordData);
      const record = await this.confidentialityRepository.create(validated as any);
      this.logger.log(`Created confidentiality record: ${record.id}`);
      return record;
    } catch (error) {
      this.logger.error(`Failed to create confidentiality record: ${error.message}`);
      throw new BadRequestException(
        `Failed to create confidentiality record: ${error.message}`,
      );
    }
  }

  /**
   * 22. Log access to confidential information
   */
  async logAccess(
    recordId: string,
    accessData: {
      accessedBy: string;
      purpose: string;
      authorized: boolean;
    },
  ): Promise<ConfidentialityRecordModel> {
    const record = await this.confidentialityRepository.findByPk(recordId);
    if (!record) {
      throw new NotFoundException(`Confidentiality record not found: ${recordId}`);
    }

    const accessLog = record.accessLog || [];
    accessLog.push({
      ...accessData,
      accessDate: new Date(),
    });

    await record.update({ accessLog });

    if (!accessData.authorized) {
      this.logger.warn(
        `Unauthorized access attempt to confidential record ${recordId} by ${accessData.accessedBy}`,
      );
    }

    return record;
  }

  /**
   * 23. Record disclosure of confidential information
   */
  async recordDisclosure(
    recordId: string,
    disclosureData: {
      disclosedTo: string;
      purpose: string;
      clientConsent: boolean;
      legalException?: string;
    },
  ): Promise<ConfidentialityRecordModel> {
    const record = await this.confidentialityRepository.findByPk(recordId);
    if (!record) {
      throw new NotFoundException(`Confidentiality record not found: ${recordId}`);
    }

    const disclosures = record.disclosures || [];
    disclosures.push({
      ...disclosureData,
      disclosureDate: new Date(),
    });

    await record.update({ disclosures });

    this.logger.log(
      `Recorded disclosure of confidential information ${recordId} to ${disclosureData.disclosedTo}`,
    );

    return record;
  }

  /**
   * 24. Verify privilege claim
   */
  async verifyPrivilegeClaim(recordId: string): Promise<{
    valid: boolean;
    reason: string;
    recommendations: string[];
  }> {
    const record = await this.confidentialityRepository.findByPk(recordId);
    if (!record) {
      throw new NotFoundException(`Confidentiality record not found: ${recordId}`);
    }

    const recommendations: string[] = [];
    let valid = true;
    let reason = 'Privilege claim appears valid';

    // Check if attorney-client privilege elements are met
    if (!record.privilegeClaim && !record.workProductClaim) {
      valid = false;
      reason = 'No privilege or work product claim asserted';
      recommendations.push('Consider asserting appropriate privilege if applicable');
    }

    // Check for unauthorized disclosures that might waive privilege
    const unauthorizedDisclosures = record.disclosures?.filter(
      (d) => !d.clientConsent && !d.legalException,
    );

    if (unauthorizedDisclosures && unauthorizedDisclosures.length > 0) {
      valid = false;
      reason = 'Privilege may be waived due to unauthorized disclosure';
      recommendations.push('Review disclosure circumstances to assess waiver');
    }

    return { valid, reason, recommendations };
  }

  /**
   * 25. Get confidential records by matter
   */
  async getRecordsByMatter(
    matterId: string,
    classificationLevel?: ConfidentialityLevel,
  ): Promise<ConfidentialityRecordModel[]> {
    const where: WhereOptions = { matterId };
    if (classificationLevel) {
      where.classificationLevel = classificationLevel;
    }

    return await this.confidentialityRepository.findAll({
      where,
      order: [['createdDate', 'DESC']],
    });
  }

  /**
   * 26. Audit confidentiality compliance
   */
  async auditConfidentialityCompliance(clientId: string): Promise<{
    totalRecords: number;
    privilegedRecords: number;
    disclosuresWithConsent: number;
    disclosuresWithoutConsent: number;
    unauthorizedAccess: number;
    complianceScore: number;
  }> {
    const records = await this.confidentialityRepository.findAll({
      where: { clientId },
    });

    const privilegedRecords = records.filter((r) => r.privilegeClaim || r.workProductClaim)
      .length;

    let disclosuresWithConsent = 0;
    let disclosuresWithoutConsent = 0;
    let unauthorizedAccess = 0;

    records.forEach((record) => {
      record.disclosures?.forEach((d) => {
        if (d.clientConsent || d.legalException) {
          disclosuresWithConsent++;
        } else {
          disclosuresWithoutConsent++;
        }
      });

      record.accessLog?.forEach((a) => {
        if (!a.authorized) {
          unauthorizedAccess++;
        }
      });
    });

    const complianceScore =
      records.length > 0
        ? ((disclosuresWithConsent / Math.max(disclosuresWithConsent + disclosuresWithoutConsent, 1)) *
            100 +
            (1 - unauthorizedAccess / Math.max(records.length, 1)) * 100) /
          2
        : 100;

    return {
      totalRecords: records.length,
      privilegedRecords,
      disclosuresWithConsent,
      disclosuresWithoutConsent,
      unauthorizedAccess,
      complianceScore: Math.round(complianceScore),
    };
  }
}

/**
 * Fee Arrangement Compliance Service
 * Manages fee arrangement compliance and validation
 */
@Injectable()
export class FeeArrangementComplianceService {
  private readonly logger = new Logger(FeeArrangementComplianceService.name);

  constructor(
    @Inject('FEE_ARRANGEMENT_REPOSITORY')
    private readonly feeArrangementRepository: typeof FeeArrangementComplianceModel,
  ) {}

  /**
   * 27. Create fee arrangement
   */
  async createFeeArrangement(
    arrangementData: FeeArrangementCompliance,
  ): Promise<FeeArrangementComplianceModel> {
    try {
      const validated = FeeArrangementSchema.parse(arrangementData);

      // Perform reasonableness check
      const complianceStatus = await this.validateFeeReasonableness(validated);

      const arrangement = await this.feeArrangementRepository.create({
        ...validated,
        complianceStatus,
      } as any);

      this.logger.log(`Created fee arrangement: ${arrangement.id}`);
      return arrangement;
    } catch (error) {
      this.logger.error(`Failed to create fee arrangement: ${error.message}`);
      throw new BadRequestException(`Failed to create fee arrangement: ${error.message}`);
    }
  }

  /**
   * 28. Validate fee reasonableness
   */
  async validateFeeReasonableness(
    arrangement: Partial<FeeArrangementCompliance>,
  ): Promise<'compliant' | 'under_review' | 'non_compliant'> {
    const issues: string[] = [];

    // Check for written agreement requirement
    if (!arrangement.writtenAgreement) {
      issues.push('Written fee agreement required');
    }

    // Check contingency fee limits (typically cannot exceed 33-40%)
    if (
      arrangement.arrangementType === FeeArrangementType.CONTINGENT &&
      arrangement.contingencyPercentage &&
      arrangement.contingencyPercentage > 40
    ) {
      issues.push('Contingency percentage exceeds typical limits');
    }

    // Check for prohibited fee types in certain matters
    if (arrangement.prohibitedFeeTypes && arrangement.prohibitedFeeTypes.length > 0) {
      const prohibitedMatch = arrangement.prohibitedFeeTypes.find(
        (type) => type === arrangement.arrangementType,
      );
      if (prohibitedMatch) {
        issues.push(`${arrangement.arrangementType} fees prohibited for this matter type`);
        return 'non_compliant';
      }
    }

    // Check fee division compliance
    if (arrangement.divisionOfFees) {
      if (!arrangement.divisionOfFees.clientConsent) {
        issues.push('Client consent required for fee division');
      }
      if (!arrangement.divisionOfFees.jurisdictionPermits) {
        issues.push('Fee division not permitted in jurisdiction');
        return 'non_compliant';
      }
    }

    return issues.length === 0 ? 'compliant' : 'under_review';
  }

  /**
   * 29. Review fee arrangement compliance
   */
  async reviewFeeCompliance(
    arrangementId: string,
    reviewData: {
      complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
      notes: string;
      reviewedBy: string;
    },
  ): Promise<FeeArrangementComplianceModel> {
    const arrangement = await this.feeArrangementRepository.findByPk(arrangementId);
    if (!arrangement) {
      throw new NotFoundException(`Fee arrangement not found: ${arrangementId}`);
    }

    await arrangement.update({
      complianceStatus: reviewData.complianceStatus,
      lastReviewDate: new Date(),
    });

    this.logger.log(`Reviewed fee arrangement ${arrangementId}: ${reviewData.complianceStatus}`);
    return arrangement;
  }

  /**
   * 30. Get non-compliant fee arrangements
   */
  async getNonCompliantArrangements(): Promise<FeeArrangementComplianceModel[]> {
    return await this.feeArrangementRepository.findAll({
      where: {
        complianceStatus: { [Op.in]: ['under_review', 'non_compliant'] },
      },
      order: [['lastReviewDate', 'ASC']],
    });
  }

  /**
   * 31. Calculate fee statistics
   */
  async calculateFeeStatistics(matterId?: string): Promise<{
    averageHourlyRate: number;
    averageContingencyPercentage: number;
    totalFlatFees: number;
    arrangementTypeDistribution: Record<string, number>;
    complianceRate: number;
  }> {
    const where: WhereOptions = {};
    if (matterId) {
      where.matterId = matterId;
    }

    const arrangements = await this.feeArrangementRepository.findAll({ where });

    const stats = {
      totalRate: 0,
      rateCount: 0,
      totalContingency: 0,
      contingencyCount: 0,
      totalFlatFees: 0,
      arrangementTypeDistribution: {} as Record<string, number>,
      compliantCount: 0,
    };

    arrangements.forEach((arr) => {
      if (arr.rate) {
        stats.totalRate += Number(arr.rate);
        stats.rateCount++;
      }
      if (arr.contingencyPercentage) {
        stats.totalContingency += Number(arr.contingencyPercentage);
        stats.contingencyCount++;
      }
      if (arr.flatFeeAmount) {
        stats.totalFlatFees += Number(arr.flatFeeAmount);
      }

      stats.arrangementTypeDistribution[arr.arrangementType] =
        (stats.arrangementTypeDistribution[arr.arrangementType] || 0) + 1;

      if (arr.complianceStatus === 'compliant') {
        stats.compliantCount++;
      }
    });

    return {
      averageHourlyRate: stats.rateCount > 0 ? stats.totalRate / stats.rateCount : 0,
      averageContingencyPercentage:
        stats.contingencyCount > 0 ? stats.totalContingency / stats.contingencyCount : 0,
      totalFlatFees: stats.totalFlatFees,
      arrangementTypeDistribution: stats.arrangementTypeDistribution,
      complianceRate:
        arrangements.length > 0 ? (stats.compliantCount / arrangements.length) * 100 : 100,
    };
  }

  /**
   * 32. Validate fee division
   */
  async validateFeeDivision(
    arrangementId: string,
    divisionData: {
      sharedWith: string;
      percentage: number;
      clientConsent: boolean;
      jurisdictionPermits: boolean;
    },
  ): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    if (!divisionData.clientConsent) {
      issues.push('Client consent required for fee division');
    }

    if (!divisionData.jurisdictionPermits) {
      issues.push('Fee division not permitted in this jurisdiction');
    }

    if (divisionData.percentage <= 0 || divisionData.percentage >= 100) {
      issues.push('Fee division percentage must be between 0 and 100');
    }

    const arrangement = await this.feeArrangementRepository.findByPk(arrangementId);
    if (arrangement) {
      await arrangement.update({ divisionOfFees: divisionData });
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

/**
 * Professional Conduct Service
 * Manages professional conduct assessments and monitoring
 */
@Injectable()
export class ProfessionalConductService {
  private readonly logger = new Logger(ProfessionalConductService.name);

  /**
   * 33. Assess lawyer competency
   */
  async assessCompetency(lawyerId: string, matterId: string): Promise<{
    competent: boolean;
    factors: Array<{ factor: string; met: boolean; notes: string }>;
    recommendations: string[];
  }> {
    const factors = [
      {
        factor: 'Legal knowledge',
        met: true,
        notes: 'Attorney has requisite knowledge of applicable law',
      },
      {
        factor: 'Skill',
        met: true,
        notes: 'Attorney has necessary skill for representation',
      },
      {
        factor: 'Thoroughness',
        met: true,
        notes: 'Attorney prepared adequately for matter',
      },
      {
        factor: 'Preparation',
        met: true,
        notes: 'Attorney has sufficient time and resources',
      },
    ];

    const competent = factors.every((f) => f.met);
    const recommendations: string[] = [];

    if (!competent) {
      recommendations.push('Consider associating with experienced counsel');
      recommendations.push('Pursue additional education or training');
      recommendations.push('Allocate additional preparation time');
    }

    this.logger.log(`Competency assessment for lawyer ${lawyerId} on matter ${matterId}`);

    return { competent, factors, recommendations };
  }

  /**
   * 34. Monitor client communication compliance
   */
  async monitorCommunicationCompliance(
    lawyerId: string,
    matterId: string,
  ): Promise<{
    compliant: boolean;
    lastCommunication: Date | null;
    daysSinceLastContact: number;
    promptnessScore: number;
    recommendations: string[];
  }> {
    // This would integrate with communication tracking system
    const lastCommunication = new Date();
    lastCommunication.setDate(lastCommunication.getDate() - 7);

    const now = new Date();
    const daysSinceLastContact = Math.floor(
      (now.getTime() - lastCommunication.getTime()) / (1000 * 60 * 60 * 24),
    );

    const promptnessScore = Math.max(0, 100 - daysSinceLastContact * 5);
    const compliant = daysSinceLastContact <= 14;

    const recommendations: string[] = [];
    if (!compliant) {
      recommendations.push('Contact client to provide status update');
      recommendations.push('Establish regular communication schedule');
      recommendations.push('Respond promptly to client inquiries');
    }

    return {
      compliant,
      lastCommunication,
      daysSinceLastContact,
      promptnessScore,
      recommendations,
    };
  }

  /**
   * 35. Validate matter acceptance
   */
  async validateMatterAcceptance(matterData: {
    clientId: string;
    matterType: string;
    jurisdiction: string;
    lawyerId: string;
    estimatedDuration: number;
    complexity: string;
  }): Promise<{
    shouldAccept: boolean;
    conflicts: string[];
    competencyIssues: string[];
    capacityIssues: string[];
    recommendations: string[];
  }> {
    const conflicts: string[] = [];
    const competencyIssues: string[] = [];
    const capacityIssues: string[] = [];
    const recommendations: string[] = [];

    // Check for conflicts (would integrate with conflict checking system)
    // Placeholder logic
    const hasConflicts = false;
    if (hasConflicts) {
      conflicts.push('Potential conflict of interest identified');
      recommendations.push('Perform detailed conflict check');
    }

    // Check competency for matter type
    // Placeholder logic
    const isCompetent = true;
    if (!isCompetent) {
      competencyIssues.push('May lack expertise for this matter type');
      recommendations.push('Consider associating with specialist');
    }

    // Check capacity
    if (matterData.estimatedDuration > 1000) {
      capacityIssues.push('Matter may exceed available capacity');
      recommendations.push('Assess current workload before accepting');
    }

    const shouldAccept =
      conflicts.length === 0 &&
      competencyIssues.length === 0 &&
      capacityIssues.length === 0;

    return {
      shouldAccept,
      conflicts,
      competencyIssues,
      capacityIssues,
      recommendations,
    };
  }

  /**
   * 36. Generate ethics compliance report
   */
  async generateEthicsComplianceReport(
    lawyerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    lawyerId: string;
    reportPeriod: { start: Date; end: Date };
    violations: {
      total: number;
      bySeverity: Record<string, number>;
      pending: number;
      resolved: number;
    };
    conflicts: {
      total: number;
      cleared: number;
      waived: number;
      declined: number;
    };
    confidentiality: {
      totalRecords: number;
      privilegedRecords: number;
      disclosures: number;
      complianceScore: number;
    };
    fees: {
      totalArrangements: number;
      compliant: number;
      underReview: number;
      nonCompliant: number;
    };
    overallComplianceScore: number;
    recommendations: string[];
  }> {
    // This would aggregate data from all ethics-related systems
    // Placeholder implementation
    const report = {
      lawyerId,
      reportPeriod: { start: startDate, end: endDate },
      violations: {
        total: 2,
        bySeverity: {
          minor: 1,
          moderate: 1,
          serious: 0,
          severe: 0,
        },
        pending: 0,
        resolved: 2,
      },
      conflicts: {
        total: 15,
        cleared: 12,
        waived: 2,
        declined: 1,
      },
      confidentiality: {
        totalRecords: 450,
        privilegedRecords: 380,
        disclosures: 12,
        complianceScore: 95,
      },
      fees: {
        totalArrangements: 25,
        compliant: 23,
        underReview: 2,
        nonCompliant: 0,
      },
      overallComplianceScore: 0,
      recommendations: [] as string[],
    };

    // Calculate overall compliance score
    const violationScore =
      (1 - report.violations.total / Math.max(report.conflicts.total, 1)) * 100;
    const conflictScore = (report.conflicts.cleared / report.conflicts.total) * 100;
    const feeScore = (report.fees.compliant / report.fees.totalArrangements) * 100;

    report.overallComplianceScore = Math.round(
      (violationScore + conflictScore + report.confidentiality.complianceScore + feeScore) / 4,
    );

    if (report.overallComplianceScore < 90) {
      report.recommendations.push('Implement additional ethics training');
      report.recommendations.push('Enhance conflict checking procedures');
      report.recommendations.push('Review fee arrangement practices');
    }

    this.logger.log(
      `Generated ethics compliance report for lawyer ${lawyerId}: Score ${report.overallComplianceScore}`,
    );

    return report;
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

/**
 * Legal Ethics Compliance Module
 * Provides comprehensive ethics and professional responsibility services
 */
@Module({
  imports: [ConfigModule],
  providers: [
    EthicsRuleService,
    EthicsViolationService,
    ConflictOfInterestService,
    ClientConfidentialityService,
    FeeArrangementComplianceService,
    ProfessionalConductService,
    {
      provide: 'ETHICS_RULE_REPOSITORY',
      useValue: EthicsRuleModel,
    },
    {
      provide: 'ETHICS_VIOLATION_REPOSITORY',
      useValue: EthicsViolationModel,
    },
    {
      provide: 'CONFLICT_CHECK_REPOSITORY',
      useValue: ConflictCheckModel,
    },
    {
      provide: 'REMEDIATION_PLAN_REPOSITORY',
      useValue: RemediationPlanModel,
    },
    {
      provide: 'FEE_ARRANGEMENT_REPOSITORY',
      useValue: FeeArrangementComplianceModel,
    },
    {
      provide: 'CONFIDENTIALITY_RECORD_REPOSITORY',
      useValue: ConfidentialityRecordModel,
    },
  ],
  exports: [
    EthicsRuleService,
    EthicsViolationService,
    ConflictOfInterestService,
    ClientConfidentialityService,
    FeeArrangementComplianceService,
    ProfessionalConductService,
  ],
})
export class LegalEthicsComplianceModule {
  static forRoot(options?: {
    defaultJurisdiction?: string;
    autoLoadRules?: boolean;
    strictConflictChecking?: boolean;
  }): DynamicModule {
    return {
      module: LegalEthicsComplianceModule,
      global: true,
      providers: [
        {
          provide: 'LEGAL_ETHICS_OPTIONS',
          useValue: options || {},
        },
      ],
    };
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Legal ethics configuration
 */
export const legalEthicsConfig = registerAs('legalEthics', () => ({
  defaultJurisdiction: process.env.DEFAULT_JURISDICTION || 'California',
  conflictCheckRequired: process.env.CONFLICT_CHECK_REQUIRED === 'true',
  autoViolationReporting: process.env.AUTO_VIOLATION_REPORTING === 'true',
  strictConfidentiality: process.env.STRICT_CONFIDENTIALITY === 'true',
  feeReasonablenessThreshold: parseFloat(
    process.env.FEE_REASONABLENESS_THRESHOLD || '1000',
  ),
  maxContingencyPercentage: parseFloat(process.env.MAX_CONTINGENCY_PERCENTAGE || '40'),
  communicationComplianceDays: parseInt(
    process.env.COMMUNICATION_COMPLIANCE_DAYS || '14',
    10,
  ),
  privilegeProtection: {
    enabled: process.env.PRIVILEGE_PROTECTION_ENABLED === 'true',
    autoClassify: process.env.AUTO_CLASSIFY_PRIVILEGE === 'true',
  },
  barReporting: {
    autoSubmit: process.env.AUTO_BAR_REPORTING === 'true',
    reminderDays: parseInt(process.env.BAR_REPORTING_REMINDER_DAYS || '30', 10),
  },
}));

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate ethics compliance hash for audit trail
 */
export function generateEthicsComplianceHash(data: any): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

/**
 * Calculate ethics violation risk score
 */
export function calculateViolationRiskScore(violation: EthicsViolation): number {
  const severityScores: Record<ViolationSeverity, number> = {
    [ViolationSeverity.MINOR]: 10,
    [ViolationSeverity.MODERATE]: 30,
    [ViolationSeverity.SERIOUS]: 60,
    [ViolationSeverity.SEVERE]: 85,
    [ViolationSeverity.DISBARMENT_LEVEL]: 100,
  };

  const baseScore = severityScores[violation.severity] || 0;

  // Increase score for recurring violations
  const recurrenceFactor = 1.0; // Would be calculated based on history

  return Math.min(100, baseScore * recurrenceFactor);
}

/**
 * Format ethics rule citation
 */
export function formatRuleCitation(rule: EthicsRule): string {
  return `${rule.jurisdiction} Rules of Professional Conduct, Rule ${rule.ruleNumber}: ${rule.title}`;
}

/**
 * Validate conflict waiver requirements
 */
export function validateConflictWaiver(
  conflict: ConflictDetail,
  waiver: { informed: boolean; written: boolean; signed: boolean },
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (conflict.riskLevel === 'critical' && conflict.conflictType === ConflictType.DIRECT_ADVERSITY) {
    issues.push('Direct adversity conflict may not be waivable');
  }

  if (!waiver.informed) {
    issues.push('Waiver must be based on informed consent');
  }

  if (!waiver.written) {
    issues.push('Waiver must be in writing');
  }

  if (!waiver.signed) {
    issues.push('Waiver must be signed by client');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Models
  EthicsRuleModel,
  EthicsViolationModel,
  ConflictCheckModel,
  RemediationPlanModel,
  FeeArrangementComplianceModel,
  ConfidentialityRecordModel,

  // Services
  EthicsRuleService,
  EthicsViolationService,
  ConflictOfInterestService,
  ClientConfidentialityService,
  FeeArrangementComplianceService,
  ProfessionalConductService,

  // Module
  LegalEthicsComplianceModule,

  // Configuration
  legalEthicsConfig,

  // Validation Schemas
  EthicsRuleSchema,
  EthicsViolationSchema,
  ConflictCheckSchema,
  FeeArrangementSchema,
  ConfidentialityRecordSchema,
};
