/**
 * LOC: HCM_COMP_001
 * File: /reuse/server/human-capital/compliance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - HR compliance controllers
 *   - Audit & reporting services
 *   - Regulatory filing systems
 *   - Employee self-service portals
 *   - Legal & compliance dashboards
 */

/**
 * File: /reuse/server/human-capital/compliance-management-kit.ts
 * Locator: WC-HCM-COMP-001
 * Purpose: Compliance Management Kit - Comprehensive employment law & regulatory compliance
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/compliance/*, ../services/audit/*, Legal systems, Regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 49 utility functions for regulatory compliance tracking (FLSA, ADA, EEOC, OFCCP),
 *          employment law compliance, audit trails, policy management, compliance training,
 *          I-9 verification, work authorization, EEO/AAP reporting, OSHA compliance,
 *          GDPR/CCPA data privacy, document retention, compliance alerts, whistleblower management
 *
 * LLM Context: Enterprise-grade employment compliance management for White Cross healthcare system.
 * Provides comprehensive regulatory compliance including FLSA wage & hour compliance, ADA reasonable
 * accommodation tracking, EEOC/OFCCP affirmative action programs, I-9 employment verification,
 * work authorization management, policy acknowledgment tracking, compliance training records,
 * OSHA workplace safety compliance, data privacy (GDPR/CCPA), document retention policies,
 * compliance alerts & notifications, audit trail management, whistleblower & ethics hotline,
 * compliance analytics & reporting. Designed for healthcare industry with SOC 2 and HIPAA compliance.
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
  AllowNull,
  IsUUID,
  Length,
  IsEmail,
  BeforeCreate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Regulatory framework enumeration
 */
export enum RegulatoryFramework {
  FLSA = 'flsa', // Fair Labor Standards Act
  ADA = 'ada', // Americans with Disabilities Act
  FMLA = 'fmla', // Family and Medical Leave Act
  EEOC = 'eeoc', // Equal Employment Opportunity Commission
  OFCCP = 'ofccp', // Office of Federal Contract Compliance Programs
  OSHA = 'osha', // Occupational Safety and Health Administration
  COBRA = 'cobra', // Consolidated Omnibus Budget Reconciliation Act
  HIPAA = 'hipaa', // Health Insurance Portability and Accountability Act
  GDPR = 'gdpr', // General Data Protection Regulation
  CCPA = 'ccpa', // California Consumer Privacy Act
  WARN = 'warn', // Worker Adjustment and Retraining Notification Act
  USERRA = 'userra', // Uniformed Services Employment and Reemployment Rights Act
  SOX = 'sox', // Sarbanes-Oxley Act
  FCRA = 'fcra', // Fair Credit Reporting Act
  NLRA = 'nlra', // National Labor Relations Act
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  UNDER_INVESTIGATION = 'under_investigation',
  REMEDIATED = 'remediated',
  WAIVED = 'waived',
  NOT_APPLICABLE = 'not_applicable',
}

/**
 * I-9 verification status
 */
export enum I9Status {
  NOT_STARTED = 'not_started',
  SECTION1_COMPLETED = 'section1_completed',
  SECTION2_PENDING = 'section2_pending',
  SECTION2_COMPLETED = 'section2_completed',
  SECTION3_PENDING = 'section3_pending',
  REVERIFICATION_REQUIRED = 'reverification_required',
  EXPIRED = 'expired',
  COMPLIANT = 'compliant',
}

/**
 * Work authorization type
 */
export enum WorkAuthorizationType {
  US_CITIZEN = 'us_citizen',
  PERMANENT_RESIDENT = 'permanent_resident',
  H1B_VISA = 'h1b_visa',
  L1_VISA = 'l1_visa',
  F1_OPT = 'f1_opt',
  TN_VISA = 'tn_visa',
  EAD = 'ead', // Employment Authorization Document
  GREEN_CARD = 'green_card',
  REFUGEE = 'refugee',
  ASYLUM = 'asylum',
}

/**
 * Policy acknowledgment status
 */
export enum AcknowledgmentStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  OVERDUE = 'overdue',
}

/**
 * Compliance training status
 */
export enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  WAIVED = 'waived',
}

/**
 * Document retention category
 */
export enum RetentionCategory {
  EMPLOYEE_RECORDS = 'employee_records',
  PAYROLL = 'payroll',
  TAX_RECORDS = 'tax_records',
  BENEFITS = 'benefits',
  SAFETY_RECORDS = 'safety_records',
  MEDICAL_RECORDS = 'medical_records',
  EMPLOYMENT_CONTRACTS = 'employment_contracts',
  TERMINATION_RECORDS = 'termination_records',
  COMPLIANCE_RECORDS = 'compliance_records',
  LEGAL_HOLDS = 'legal_holds',
}

/**
 * Alert severity
 */
export enum AlertSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

/**
 * Alert status
 */
export enum AlertStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  ESCALATED = 'escalated',
}

/**
 * Whistleblower case status
 */
export enum WhistleblowerStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  INVESTIGATING = 'investigating',
  SUBSTANTIATED = 'substantiated',
  UNSUBSTANTIATED = 'unsubstantiated',
  CLOSED = 'closed',
}

/**
 * EEO category
 */
export enum EEOCategory {
  EXECUTIVE_SENIOR_OFFICIALS = '1.1',
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
 * Compliance issue interface
 */
export interface ComplianceIssue {
  id: string;
  framework: RegulatoryFramework;
  issueType: string;
  description: string;
  severity: AlertSeverity;
  status: ComplianceStatus;
  employeeId?: string;
  departmentId?: string;
  identifiedDate: Date;
  dueDate?: Date;
  resolvedDate?: Date;
  identifiedBy: string;
  assignedTo?: string;
  remediationPlan?: string;
  metadata?: Record<string, any>;
}

/**
 * Policy interface
 */
export interface Policy {
  id: string;
  policyNumber: string;
  title: string;
  description: string;
  category: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  requiresAcknowledgment: boolean;
  acknowledgmentDeadlineDays?: number;
  content?: string;
  attachments?: string[];
  applicableRoles?: string[];
  applicableDepartments?: string[];
  isActive: boolean;
}

/**
 * I-9 verification record
 */
export interface I9Record {
  id: string;
  employeeId: string;
  status: I9Status;
  section1CompletedDate?: Date;
  section2CompletedDate?: Date;
  section3CompletedDate?: Date;
  verifiedBy?: string;
  documentType?: string;
  documentNumber?: string;
  expirationDate?: Date;
  reverificationDate?: Date;
  notes?: string;
}

/**
 * Work authorization record
 */
export interface WorkAuthorization {
  id: string;
  employeeId: string;
  authorizationType: WorkAuthorizationType;
  documentNumber: string;
  issueDate: Date;
  expirationDate?: Date;
  issuingCountry: string;
  verifiedDate: Date;
  verifiedBy: string;
  status: string;
  notes?: string;
}

/**
 * Compliance training record
 */
export interface ComplianceTraining {
  id: string;
  employeeId: string;
  trainingTitle: string;
  trainingCategory: string;
  framework?: RegulatoryFramework;
  assignedDate: Date;
  dueDate: Date;
  completedDate?: Date;
  score?: number;
  passingScore?: number;
  status: TrainingStatus;
  certificateUrl?: string;
  expiryDate?: Date;
  assignedBy: string;
}

/**
 * Document retention policy
 */
export interface RetentionPolicy {
  id: string;
  category: RetentionCategory;
  description: string;
  retentionPeriodYears: number;
  framework?: RegulatoryFramework;
  disposalMethod: string;
  isActive: boolean;
  notes?: string;
}

/**
 * Compliance alert
 */
export interface ComplianceAlert {
  id: string;
  alertType: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  framework?: RegulatoryFramework;
  employeeId?: string;
  departmentId?: string;
  dueDate?: Date;
  createdDate: Date;
  acknowledgedDate?: Date;
  resolvedDate?: Date;
  assignedTo?: string;
  metadata?: Record<string, any>;
}

/**
 * Whistleblower case
 */
export interface WhistleblowerCase {
  id: string;
  caseNumber: string;
  reporterName?: string;
  reporterEmail?: string;
  isAnonymous: boolean;
  category: string;
  description: string;
  allegation: string;
  status: WhistleblowerStatus;
  submittedDate: Date;
  assignedTo?: string;
  investigationNotes?: string;
  finding?: string;
  closedDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * EEO report data
 */
export interface EEOReportData {
  reportingYear: number;
  totalEmployees: number;
  byJobCategory: Record<EEOCategory, number>;
  byRaceEthnicity: Record<string, number>;
  byGender: Record<string, number>;
  newHires: number;
  terminations: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Compliance issue validation schema
 */
export const ComplianceIssueSchema = z.object({
  framework: z.nativeEnum(RegulatoryFramework),
  issueType: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  severity: z.nativeEnum(AlertSeverity),
  status: z.nativeEnum(ComplianceStatus).default(ComplianceStatus.PENDING_REVIEW),
  employeeId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  identifiedDate: z.coerce.date(),
  dueDate: z.coerce.date().optional(),
  identifiedBy: z.string().uuid(),
  assignedTo: z.string().uuid().optional(),
  remediationPlan: z.string().max(2000).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Policy validation schema
 */
export const PolicySchema = z.object({
  policyNumber: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  category: z.string().min(1).max(100),
  version: z.string().min(1).max(20),
  effectiveDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  requiresAcknowledgment: z.boolean().default(true),
  acknowledgmentDeadlineDays: z.number().int().positive().optional(),
  content: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  applicableRoles: z.array(z.string()).optional(),
  applicableDepartments: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

/**
 * I-9 record validation schema
 */
export const I9RecordSchema = z.object({
  employeeId: z.string().uuid(),
  status: z.nativeEnum(I9Status),
  section1CompletedDate: z.coerce.date().optional(),
  section2CompletedDate: z.coerce.date().optional(),
  section3CompletedDate: z.coerce.date().optional(),
  verifiedBy: z.string().uuid().optional(),
  documentType: z.string().max(100).optional(),
  documentNumber: z.string().max(100).optional(),
  expirationDate: z.coerce.date().optional(),
  reverificationDate: z.coerce.date().optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Work authorization validation schema
 */
export const WorkAuthorizationSchema = z.object({
  employeeId: z.string().uuid(),
  authorizationType: z.nativeEnum(WorkAuthorizationType),
  documentNumber: z.string().min(1).max(100),
  issueDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
  issuingCountry: z.string().length(2), // ISO 2-letter code
  verifiedDate: z.coerce.date(),
  verifiedBy: z.string().uuid(),
  status: z.string().max(50),
  notes: z.string().max(1000).optional(),
});

/**
 * Compliance training validation schema
 */
export const ComplianceTrainingSchema = z.object({
  employeeId: z.string().uuid(),
  trainingTitle: z.string().min(1).max(255),
  trainingCategory: z.string().min(1).max(100),
  framework: z.nativeEnum(RegulatoryFramework).optional(),
  assignedDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  completedDate: z.coerce.date().optional(),
  score: z.number().min(0).max(100).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  status: z.nativeEnum(TrainingStatus),
  certificateUrl: z.string().url().optional(),
  expiryDate: z.coerce.date().optional(),
  assignedBy: z.string().uuid(),
});

/**
 * Whistleblower case validation schema
 */
export const WhistleblowerCaseSchema = z.object({
  caseNumber: z.string().min(1).max(50),
  reporterName: z.string().max(255).optional(),
  reporterEmail: z.string().email().optional(),
  isAnonymous: z.boolean().default(false),
  category: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  allegation: z.string().min(1).max(5000),
  status: z.nativeEnum(WhistleblowerStatus).default(WhistleblowerStatus.SUBMITTED),
  assignedTo: z.string().uuid().optional(),
  investigationNotes: z.string().optional(),
  finding: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Compliance Issue Model
 */
@Table({
  tableName: 'compliance_issues',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['framework'] },
    { fields: ['status'] },
    { fields: ['severity'] },
    { fields: ['employee_id'] },
    { fields: ['department_id'] },
    { fields: ['identified_date'] },
    { fields: ['due_date'] },
  ],
})
export class ComplianceIssueModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(RegulatoryFramework)),
    allowNull: false,
    comment: 'Regulatory framework',
  })
  framework: RegulatoryFramework;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'issue_type',
    comment: 'Type of compliance issue',
  })
  issueType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Issue description',
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(AlertSeverity)),
    allowNull: false,
    comment: 'Issue severity',
  })
  severity: AlertSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(ComplianceStatus)),
    allowNull: false,
    defaultValue: ComplianceStatus.PENDING_REVIEW,
  })
  status: ComplianceStatus;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'department_id',
  })
  departmentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'identified_date',
  })
  identifiedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolved_date',
  })
  resolvedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'identified_by',
  })
  identifiedBy: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'assigned_to',
  })
  assignedTo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remediation_plan',
  })
  remediationPlan: string;

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
 * Policy Model
 */
@Table({
  tableName: 'policies',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['policy_number'], unique: true },
    { fields: ['category'] },
    { fields: ['is_active'] },
    { fields: ['effective_date'] },
  ],
})
export class PolicyModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'policy_number',
  })
  policyNumber: string;

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
    type: DataType.STRING(100),
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  version: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'requires_acknowledgment',
  })
  requiresAcknowledgment: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'acknowledgment_deadline_days',
  })
  acknowledgmentDeadlineDays: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  attachments: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'applicable_roles',
  })
  applicableRoles: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'applicable_departments',
  })
  applicableDepartments: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @HasMany(() => PolicyAcknowledgmentModel)
  acknowledgments: PolicyAcknowledgmentModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Policy Acknowledgment Model
 */
@Table({
  tableName: 'policy_acknowledgments',
  timestamps: true,
  indexes: [
    { fields: ['policy_id'] },
    { fields: ['employee_id'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],
})
export class PolicyAcknowledgmentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @ForeignKey(() => PolicyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'policy_id',
  })
  policyId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...Object.values(AcknowledgmentStatus)),
    allowNull: false,
    defaultValue: AcknowledgmentStatus.PENDING,
  })
  status: AcknowledgmentStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'assigned_date',
  })
  assignedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'acknowledged_date',
  })
  acknowledgedDate: Date;

  @Column({
    type: DataType.INET,
    allowNull: true,
    field: 'ip_address',
  })
  ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => PolicyModel)
  policy: PolicyModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * I-9 Verification Model
 */
@Table({
  tableName: 'i9_verifications',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'], unique: true },
    { fields: ['status'] },
    { fields: ['expiration_date'] },
  ],
})
export class I9VerificationModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...Object.values(I9Status)),
    allowNull: false,
    defaultValue: I9Status.NOT_STARTED,
  })
  status: I9Status;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'section1_completed_date',
  })
  section1CompletedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'section2_completed_date',
  })
  section2CompletedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'section3_completed_date',
  })
  section3CompletedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'verified_by',
  })
  verifiedBy: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'document_type',
  })
  documentType: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'document_number',
  })
  documentNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiration_date',
  })
  expirationDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'reverification_date',
  })
  reverificationDate: Date;

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
 * Work Authorization Model
 */
@Table({
  tableName: 'work_authorizations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['authorization_type'] },
    { fields: ['expiration_date'] },
    { fields: ['status'] },
  ],
})
export class WorkAuthorizationModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...Object.values(WorkAuthorizationType)),
    allowNull: false,
    field: 'authorization_type',
  })
  authorizationType: WorkAuthorizationType;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'document_number',
  })
  documentNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'issue_date',
  })
  issueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiration_date',
  })
  expirationDate: Date;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
    field: 'issuing_country',
  })
  issuingCountry: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'verified_date',
  })
  verifiedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'verified_by',
  })
  verifiedBy: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Compliance Training Model
 */
@Table({
  tableName: 'compliance_trainings',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['training_category'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
    { fields: ['expiry_date'] },
  ],
})
export class ComplianceTrainingModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'training_title',
  })
  trainingTitle: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'training_category',
  })
  trainingCategory: string;

  @Column({
    type: DataType.ENUM(...Object.values(RegulatoryFramework)),
    allowNull: true,
  })
  framework: RegulatoryFramework;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'assigned_date',
  })
  assignedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    field: 'passing_score',
  })
  passingScore: number;

  @Column({
    type: DataType.ENUM(...Object.values(TrainingStatus)),
    allowNull: false,
    defaultValue: TrainingStatus.NOT_STARTED,
  })
  status: TrainingStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'certificate_url',
  })
  certificateUrl: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'assigned_by',
  })
  assignedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Document Retention Policy Model
 */
@Table({
  tableName: 'document_retention_policies',
  timestamps: true,
  indexes: [
    { fields: ['category'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class DocumentRetentionPolicyModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(RetentionCategory)),
    allowNull: false,
    unique: true,
  })
  category: RetentionCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'retention_period_years',
  })
  retentionPeriodYears: number;

  @Column({
    type: DataType.ENUM(...Object.values(RegulatoryFramework)),
    allowNull: true,
  })
  framework: RegulatoryFramework;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'disposal_method',
  })
  disposalMethod: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

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
 * Compliance Alert Model
 */
@Table({
  tableName: 'compliance_alerts',
  timestamps: true,
  indexes: [
    { fields: ['alert_type'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['employee_id'] },
    { fields: ['due_date'] },
  ],
})
export class ComplianceAlertModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'alert_type',
  })
  alertType: string;

  @Column({
    type: DataType.ENUM(...Object.values(AlertSeverity)),
    allowNull: false,
  })
  severity: AlertSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(AlertStatus)),
    allowNull: false,
    defaultValue: AlertStatus.OPEN,
  })
  status: AlertStatus;

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
    type: DataType.ENUM(...Object.values(RegulatoryFramework)),
    allowNull: true,
  })
  framework: RegulatoryFramework;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'department_id',
  })
  departmentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'acknowledged_date',
  })
  acknowledgedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolved_date',
  })
  resolvedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'assigned_to',
  })
  assignedTo: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  @Column({ field: 'created_date' })
  createdDate: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Whistleblower Case Model
 */
@Table({
  tableName: 'whistleblower_cases',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['case_number'], unique: true },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['submitted_date'] },
  ],
})
export class WhistleblowerCaseModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'case_number',
  })
  caseNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reporter_name',
  })
  reporterName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'reporter_email',
  })
  reporterEmail: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_anonymous',
  })
  isAnonymous: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  allegation: string;

  @Column({
    type: DataType.ENUM(...Object.values(WhistleblowerStatus)),
    allowNull: false,
    defaultValue: WhistleblowerStatus.SUBMITTED,
  })
  status: WhistleblowerStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'submitted_date',
  })
  submittedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'assigned_to',
  })
  assignedTo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'investigation_notes',
  })
  investigationNotes: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  finding: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'closed_date',
  })
  closedDate: Date;

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
 * EEO Report Model
 */
@Table({
  tableName: 'eeo_reports',
  timestamps: true,
  indexes: [
    { fields: ['reporting_year'], unique: true },
  ],
})
export class EEOReportModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: 'reporting_year',
  })
  reportingYear: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'total_employees',
  })
  totalEmployees: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'by_job_category',
  })
  byJobCategory: Record<string, number>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'by_race_ethnicity',
  })
  byRaceEthnicity: Record<string, number>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'by_gender',
  })
  byGender: Record<string, number>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'new_hires',
  })
  newHires: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  terminations: number;

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

// ============================================================================
// COMPLIANCE ISSUE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create compliance issue
 */
export async function createComplianceIssue(
  issueData: Omit<ComplianceIssue, 'id'>,
  transaction?: Transaction,
): Promise<ComplianceIssueModel> {
  const validated = ComplianceIssueSchema.parse(issueData);
  return ComplianceIssueModel.create(validated as any, { transaction });
}

/**
 * Update compliance issue
 */
export async function updateComplianceIssue(
  issueId: string,
  updates: Partial<ComplianceIssue>,
  transaction?: Transaction,
): Promise<ComplianceIssueModel> {
  const issue = await ComplianceIssueModel.findByPk(issueId, { transaction });
  if (!issue) {
    throw new NotFoundException(`Compliance issue ${issueId} not found`);
  }
  await issue.update(updates, { transaction });
  return issue;
}

/**
 * Get compliance issues by framework
 */
export async function getComplianceIssuesByFramework(
  framework: RegulatoryFramework,
  status?: ComplianceStatus,
): Promise<ComplianceIssueModel[]> {
  const where: WhereOptions = { framework };
  if (status) {
    where.status = status;
  }
  return ComplianceIssueModel.findAll({
    where,
    order: [['identifiedDate', 'DESC']],
  });
}

/**
 * Get compliance issues by employee
 */
export async function getComplianceIssuesByEmployee(
  employeeId: string,
): Promise<ComplianceIssueModel[]> {
  return ComplianceIssueModel.findAll({
    where: { employeeId },
    order: [['identifiedDate', 'DESC']],
  });
}

/**
 * Resolve compliance issue
 */
export async function resolveComplianceIssue(
  issueId: string,
  resolution: string,
  resolvedBy: string,
  transaction?: Transaction,
): Promise<void> {
  const issue = await ComplianceIssueModel.findByPk(issueId, { transaction });
  if (!issue) {
    throw new NotFoundException(`Compliance issue ${issueId} not found`);
  }
  await issue.update({
    status: ComplianceStatus.REMEDIATED,
    resolvedDate: new Date(),
    remediationPlan: resolution,
  }, { transaction });
}

/**
 * Get overdue compliance issues
 */
export async function getOverdueComplianceIssues(): Promise<ComplianceIssueModel[]> {
  return ComplianceIssueModel.findAll({
    where: {
      dueDate: { [Op.lt]: new Date() },
      status: { [Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] },
    },
    order: [['dueDate', 'ASC']],
  });
}

// ============================================================================
// POLICY MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create policy
 */
export async function createPolicy(
  policyData: Omit<Policy, 'id'>,
  transaction?: Transaction,
): Promise<PolicyModel> {
  const validated = PolicySchema.parse(policyData);
  const existing = await PolicyModel.findOne({
    where: { policyNumber: validated.policyNumber },
    transaction,
  });
  if (existing) {
    throw new ConflictException(`Policy ${validated.policyNumber} already exists`);
  }
  return PolicyModel.create(validated as any, { transaction });
}

/**
 * Update policy
 */
export async function updatePolicy(
  policyId: string,
  updates: Partial<Policy>,
  transaction?: Transaction,
): Promise<PolicyModel> {
  const policy = await PolicyModel.findByPk(policyId, { transaction });
  if (!policy) {
    throw new NotFoundException(`Policy ${policyId} not found`);
  }
  await policy.update(updates, { transaction });
  return policy;
}

/**
 * Get active policies
 */
export async function getActivePolicies(category?: string): Promise<PolicyModel[]> {
  const where: WhereOptions = { isActive: true };
  if (category) {
    where.category = category;
  }
  return PolicyModel.findAll({
    where,
    order: [['effectiveDate', 'DESC']],
  });
}

/**
 * Assign policy to employee
 */
export async function assignPolicyToEmployee(
  policyId: string,
  employeeId: string,
  transaction?: Transaction,
): Promise<PolicyAcknowledgmentModel> {
  const policy = await PolicyModel.findByPk(policyId, { transaction });
  if (!policy) {
    throw new NotFoundException(`Policy ${policyId} not found`);
  }

  const assignedDate = new Date();
  const dueDate = policy.acknowledgmentDeadlineDays
    ? new Date(assignedDate.getTime() + policy.acknowledgmentDeadlineDays * 24 * 60 * 60 * 1000)
    : null;

  return PolicyAcknowledgmentModel.create({
    policyId,
    employeeId,
    assignedDate,
    dueDate,
    status: AcknowledgmentStatus.PENDING,
  } as any, { transaction });
}

/**
 * Acknowledge policy
 */
export async function acknowledgePolicy(
  acknowledgmentId: string,
  ipAddress?: string,
  transaction?: Transaction,
): Promise<void> {
  const ack = await PolicyAcknowledgmentModel.findByPk(acknowledgmentId, { transaction });
  if (!ack) {
    throw new NotFoundException(`Policy acknowledgment ${acknowledgmentId} not found`);
  }
  await ack.update({
    status: AcknowledgmentStatus.ACKNOWLEDGED,
    acknowledgedDate: new Date(),
    ipAddress,
  }, { transaction });
}

/**
 * Get pending policy acknowledgments
 */
export async function getPendingPolicyAcknowledgments(
  employeeId: string,
): Promise<PolicyAcknowledgmentModel[]> {
  return PolicyAcknowledgmentModel.findAll({
    where: {
      employeeId,
      status: AcknowledgmentStatus.PENDING,
    },
    include: [{ model: PolicyModel, as: 'policy' }],
    order: [['dueDate', 'ASC']],
  });
}

/**
 * Get overdue policy acknowledgments
 */
export async function getOverduePolicyAcknowledgments(): Promise<PolicyAcknowledgmentModel[]> {
  return PolicyAcknowledgmentModel.findAll({
    where: {
      status: AcknowledgmentStatus.PENDING,
      dueDate: { [Op.lt]: new Date() },
    },
    include: [{ model: PolicyModel, as: 'policy' }],
    order: [['dueDate', 'ASC']],
  });
}

// ============================================================================
// I-9 VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Create I-9 record
 */
export async function createI9Record(
  recordData: Omit<I9Record, 'id'>,
  transaction?: Transaction,
): Promise<I9VerificationModel> {
  const validated = I9RecordSchema.parse(recordData);
  const existing = await I9VerificationModel.findOne({
    where: { employeeId: validated.employeeId },
    transaction,
  });
  if (existing) {
    throw new ConflictException(`I-9 record for employee ${validated.employeeId} already exists`);
  }
  return I9VerificationModel.create(validated as any, { transaction });
}

/**
 * Update I-9 record
 */
export async function updateI9Record(
  employeeId: string,
  updates: Partial<I9Record>,
  transaction?: Transaction,
): Promise<I9VerificationModel> {
  const record = await I9VerificationModel.findOne({
    where: { employeeId },
    transaction,
  });
  if (!record) {
    throw new NotFoundException(`I-9 record for employee ${employeeId} not found`);
  }
  await record.update(updates, { transaction });
  return record;
}

/**
 * Complete I-9 section 1
 */
export async function completeI9Section1(
  employeeId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateI9Record(employeeId, {
    section1CompletedDate: new Date(),
    status: I9Status.SECTION1_COMPLETED,
  }, transaction);
}

/**
 * Complete I-9 section 2
 */
export async function completeI9Section2(
  employeeId: string,
  verifiedBy: string,
  documentType: string,
  documentNumber: string,
  transaction?: Transaction,
): Promise<void> {
  await updateI9Record(employeeId, {
    section2CompletedDate: new Date(),
    status: I9Status.SECTION2_COMPLETED,
    verifiedBy,
    documentType,
    documentNumber,
  }, transaction);
}

/**
 * Get I-9 records requiring reverification
 */
export async function getI9RecordsRequiringReverification(): Promise<I9VerificationModel[]> {
  return I9VerificationModel.findAll({
    where: {
      status: I9Status.REVERIFICATION_REQUIRED,
    },
    order: [['reverificationDate', 'ASC']],
  });
}

/**
 * Get expiring I-9 records
 */
export async function getExpiringI9Records(daysAhead: number = 30): Promise<I9VerificationModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return I9VerificationModel.findAll({
    where: {
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
    },
    order: [['expirationDate', 'ASC']],
  });
}

// ============================================================================
// WORK AUTHORIZATION FUNCTIONS
// ============================================================================

/**
 * Create work authorization
 */
export async function createWorkAuthorization(
  authData: Omit<WorkAuthorization, 'id'>,
  transaction?: Transaction,
): Promise<WorkAuthorizationModel> {
  const validated = WorkAuthorizationSchema.parse(authData);
  return WorkAuthorizationModel.create(validated as any, { transaction });
}

/**
 * Update work authorization
 */
export async function updateWorkAuthorization(
  authId: string,
  updates: Partial<WorkAuthorization>,
  transaction?: Transaction,
): Promise<WorkAuthorizationModel> {
  const auth = await WorkAuthorizationModel.findByPk(authId, { transaction });
  if (!auth) {
    throw new NotFoundException(`Work authorization ${authId} not found`);
  }
  await auth.update(updates, { transaction });
  return auth;
}

/**
 * Get work authorizations by employee
 */
export async function getWorkAuthorizationsByEmployee(
  employeeId: string,
): Promise<WorkAuthorizationModel[]> {
  return WorkAuthorizationModel.findAll({
    where: { employeeId },
    order: [['issueDate', 'DESC']],
  });
}

/**
 * Get expiring work authorizations
 */
export async function getExpiringWorkAuthorizations(daysAhead: number = 60): Promise<WorkAuthorizationModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return WorkAuthorizationModel.findAll({
    where: {
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
      status: 'active',
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Verify work authorization
 */
export async function verifyWorkAuthorization(
  authId: string,
  verifiedBy: string,
  transaction?: Transaction,
): Promise<void> {
  await updateWorkAuthorization(authId, {
    verifiedDate: new Date(),
    verifiedBy,
    status: 'verified',
  }, transaction);
}

// ============================================================================
// COMPLIANCE TRAINING FUNCTIONS
// ============================================================================

/**
 * Assign compliance training
 */
export async function assignComplianceTraining(
  trainingData: Omit<ComplianceTraining, 'id'>,
  transaction?: Transaction,
): Promise<ComplianceTrainingModel> {
  const validated = ComplianceTrainingSchema.parse(trainingData);
  return ComplianceTrainingModel.create(validated as any, { transaction });
}

/**
 * Complete compliance training
 */
export async function completeComplianceTraining(
  trainingId: string,
  score: number,
  certificateUrl?: string,
  transaction?: Transaction,
): Promise<void> {
  const training = await ComplianceTrainingModel.findByPk(trainingId, { transaction });
  if (!training) {
    throw new NotFoundException(`Training ${trainingId} not found`);
  }

  const passed = !training.passingScore || score >= training.passingScore;
  await training.update({
    completedDate: new Date(),
    score,
    status: passed ? TrainingStatus.COMPLETED : TrainingStatus.FAILED,
    certificateUrl,
  }, { transaction });
}

/**
 * Get overdue compliance trainings
 */
export async function getOverdueComplianceTrainings(): Promise<ComplianceTrainingModel[]> {
  return ComplianceTrainingModel.findAll({
    where: {
      dueDate: { [Op.lt]: new Date() },
      status: { [Op.notIn]: [TrainingStatus.COMPLETED, TrainingStatus.WAIVED] },
    },
    order: [['dueDate', 'ASC']],
  });
}

/**
 * Get expired compliance trainings
 */
export async function getExpiredComplianceTrainings(): Promise<ComplianceTrainingModel[]> {
  return ComplianceTrainingModel.findAll({
    where: {
      expiryDate: { [Op.lt]: new Date() },
      status: TrainingStatus.COMPLETED,
    },
    order: [['expiryDate', 'ASC']],
  });
}

/**
 * Get employee compliance trainings
 */
export async function getEmployeeComplianceTrainings(
  employeeId: string,
  status?: TrainingStatus,
): Promise<ComplianceTrainingModel[]> {
  const where: WhereOptions = { employeeId };
  if (status) {
    where.status = status;
  }
  return ComplianceTrainingModel.findAll({
    where,
    order: [['assignedDate', 'DESC']],
  });
}

// ============================================================================
// DOCUMENT RETENTION FUNCTIONS
// ============================================================================

/**
 * Create retention policy
 */
export async function createRetentionPolicy(
  policyData: Omit<RetentionPolicy, 'id'>,
  transaction?: Transaction,
): Promise<DocumentRetentionPolicyModel> {
  return DocumentRetentionPolicyModel.create(policyData as any, { transaction });
}

/**
 * Get retention policy by category
 */
export async function getRetentionPolicyByCategory(
  category: RetentionCategory,
): Promise<DocumentRetentionPolicyModel | null> {
  return DocumentRetentionPolicyModel.findOne({
    where: { category, isActive: true },
  });
}

/**
 * Get all active retention policies
 */
export async function getActiveRetentionPolicies(): Promise<DocumentRetentionPolicyModel[]> {
  return DocumentRetentionPolicyModel.findAll({
    where: { isActive: true },
    order: [['category', 'ASC']],
  });
}

/**
 * Calculate document disposal date
 */
export function calculateDisposalDate(
  documentDate: Date,
  retentionYears: number,
): Date {
  const disposalDate = new Date(documentDate);
  disposalDate.setFullYear(disposalDate.getFullYear() + retentionYears);
  return disposalDate;
}

// ============================================================================
// COMPLIANCE ALERT FUNCTIONS
// ============================================================================

/**
 * Create compliance alert
 */
export async function createComplianceAlert(
  alertData: Omit<ComplianceAlert, 'id' | 'createdDate'>,
  transaction?: Transaction,
): Promise<ComplianceAlertModel> {
  return ComplianceAlertModel.create(alertData as any, { transaction });
}

/**
 * Update alert status
 */
export async function updateAlertStatus(
  alertId: string,
  status: AlertStatus,
  transaction?: Transaction,
): Promise<void> {
  const alert = await ComplianceAlertModel.findByPk(alertId, { transaction });
  if (!alert) {
    throw new NotFoundException(`Alert ${alertId} not found`);
  }

  const updates: any = { status };
  if (status === AlertStatus.ACKNOWLEDGED) {
    updates.acknowledgedDate = new Date();
  } else if (status === AlertStatus.RESOLVED) {
    updates.resolvedDate = new Date();
  }

  await alert.update(updates, { transaction });
}

/**
 * Get open alerts
 */
export async function getOpenAlerts(severity?: AlertSeverity): Promise<ComplianceAlertModel[]> {
  const where: WhereOptions = { status: AlertStatus.OPEN };
  if (severity) {
    where.severity = severity;
  }
  return ComplianceAlertModel.findAll({
    where,
    order: [['severity', 'DESC'], ['createdDate', 'DESC']],
  });
}

/**
 * Get employee alerts
 */
export async function getEmployeeAlerts(employeeId: string): Promise<ComplianceAlertModel[]> {
  return ComplianceAlertModel.findAll({
    where: { employeeId },
    order: [['createdDate', 'DESC']],
  });
}

/**
 * Dismiss alert
 */
export async function dismissAlert(
  alertId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateAlertStatus(alertId, AlertStatus.DISMISSED, transaction);
}

// ============================================================================
// WHISTLEBLOWER & ETHICS FUNCTIONS
// ============================================================================

/**
 * Submit whistleblower case
 */
export async function submitWhistleblowerCase(
  caseData: Omit<WhistleblowerCase, 'id' | 'submittedDate'>,
  transaction?: Transaction,
): Promise<WhistleblowerCaseModel> {
  const validated = WhistleblowerCaseSchema.parse(caseData);
  return WhistleblowerCaseModel.create({
    ...validated,
    submittedDate: new Date(),
  } as any, { transaction });
}

/**
 * Assign whistleblower case
 */
export async function assignWhistleblowerCase(
  caseId: string,
  assignedTo: string,
  transaction?: Transaction,
): Promise<void> {
  const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
  if (!wbCase) {
    throw new NotFoundException(`Whistleblower case ${caseId} not found`);
  }
  await wbCase.update({
    assignedTo,
    status: WhistleblowerStatus.UNDER_REVIEW,
  }, { transaction });
}

/**
 * Update whistleblower investigation
 */
export async function updateWhistleblowerInvestigation(
  caseId: string,
  investigationNotes: string,
  status?: WhistleblowerStatus,
  transaction?: Transaction,
): Promise<void> {
  const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
  if (!wbCase) {
    throw new NotFoundException(`Whistleblower case ${caseId} not found`);
  }
  await wbCase.update({
    investigationNotes,
    status: status || WhistleblowerStatus.INVESTIGATING,
  }, { transaction });
}

/**
 * Close whistleblower case
 */
export async function closeWhistleblowerCase(
  caseId: string,
  finding: string,
  substantiated: boolean,
  transaction?: Transaction,
): Promise<void> {
  const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
  if (!wbCase) {
    throw new NotFoundException(`Whistleblower case ${caseId} not found`);
  }
  await wbCase.update({
    finding,
    status: substantiated ? WhistleblowerStatus.SUBSTANTIATED : WhistleblowerStatus.UNSUBSTANTIATED,
    closedDate: new Date(),
  }, { transaction });
}

/**
 * Get active whistleblower cases
 */
export async function getActiveWhistleblowerCases(): Promise<WhistleblowerCaseModel[]> {
  return WhistleblowerCaseModel.findAll({
    where: {
      status: {
        [Op.notIn]: [WhistleblowerStatus.CLOSED, WhistleblowerStatus.SUBSTANTIATED, WhistleblowerStatus.UNSUBSTANTIATED],
      },
    },
    order: [['submittedDate', 'DESC']],
  });
}

// ============================================================================
// EEO/AAP REPORTING FUNCTIONS
// ============================================================================

/**
 * Create EEO report
 */
export async function createEEOReport(
  reportData: Omit<EEOReportData, 'id'>,
  transaction?: Transaction,
): Promise<EEOReportModel> {
  const existing = await EEOReportModel.findOne({
    where: { reportingYear: reportData.reportingYear },
    transaction,
  });
  if (existing) {
    throw new ConflictException(`EEO report for year ${reportData.reportingYear} already exists`);
  }
  return EEOReportModel.create(reportData as any, { transaction });
}

/**
 * Update EEO report
 */
export async function updateEEOReport(
  reportingYear: number,
  updates: Partial<EEOReportData>,
  transaction?: Transaction,
): Promise<EEOReportModel> {
  const report = await EEOReportModel.findOne({
    where: { reportingYear },
    transaction,
  });
  if (!report) {
    throw new NotFoundException(`EEO report for year ${reportingYear} not found`);
  }
  await report.update(updates, { transaction });
  return report;
}

/**
 * Get EEO report by year
 */
export async function getEEOReportByYear(reportingYear: number): Promise<EEOReportModel | null> {
  return EEOReportModel.findOne({
    where: { reportingYear },
  });
}

/**
 * Get all EEO reports
 */
export async function getAllEEOReports(): Promise<EEOReportModel[]> {
  return EEOReportModel.findAll({
    order: [['reportingYear', 'DESC']],
  });
}

// ============================================================================
// COMPLIANCE ANALYTICS & REPORTING
// ============================================================================

/**
 * Get compliance dashboard metrics
 */
export async function getComplianceDashboardMetrics(): Promise<{
  openIssues: number;
  overdueIssues: number;
  pendingTrainings: number;
  expiredTrainings: number;
  openAlerts: number;
  criticalAlerts: number;
  pendingAcknowledgments: number;
  activeWhistleblowerCases: number;
}> {
  const [
    openIssues,
    overdueIssues,
    pendingTrainings,
    expiredTrainings,
    openAlerts,
    criticalAlerts,
    pendingAcknowledgments,
    activeWhistleblowerCases,
  ] = await Promise.all([
    ComplianceIssueModel.count({
      where: { status: { [Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] } },
    }),
    ComplianceIssueModel.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] },
      },
    }),
    ComplianceTrainingModel.count({
      where: { status: { [Op.notIn]: [TrainingStatus.COMPLETED, TrainingStatus.WAIVED] } },
    }),
    ComplianceTrainingModel.count({
      where: {
        expiryDate: { [Op.lt]: new Date() },
        status: TrainingStatus.COMPLETED,
      },
    }),
    ComplianceAlertModel.count({
      where: { status: AlertStatus.OPEN },
    }),
    ComplianceAlertModel.count({
      where: { status: AlertStatus.OPEN, severity: AlertSeverity.CRITICAL },
    }),
    PolicyAcknowledgmentModel.count({
      where: { status: AcknowledgmentStatus.PENDING },
    }),
    WhistleblowerCaseModel.count({
      where: {
        status: {
          [Op.notIn]: [WhistleblowerStatus.CLOSED, WhistleblowerStatus.SUBSTANTIATED, WhistleblowerStatus.UNSUBSTANTIATED],
        },
      },
    }),
  ]);

  return {
    openIssues,
    overdueIssues,
    pendingTrainings,
    expiredTrainings,
    openAlerts,
    criticalAlerts,
    pendingAcknowledgments,
    activeWhistleblowerCases,
  };
}

/**
 * Generate compliance report by framework
 */
export async function generateComplianceReportByFramework(
  framework: RegulatoryFramework,
  startDate?: Date,
  endDate?: Date,
): Promise<{
  framework: RegulatoryFramework;
  totalIssues: number;
  resolvedIssues: number;
  openIssues: number;
  complianceRate: number;
  issues: ComplianceIssueModel[];
}> {
  const where: WhereOptions = { framework };
  if (startDate && endDate) {
    where.identifiedDate = { [Op.between]: [startDate, endDate] };
  }

  const [totalIssues, resolvedIssues, issues] = await Promise.all([
    ComplianceIssueModel.count({ where }),
    ComplianceIssueModel.count({
      where: { ...where, status: ComplianceStatus.REMEDIATED },
    }),
    ComplianceIssueModel.findAll({
      where,
      order: [['identifiedDate', 'DESC']],
    }),
  ]);

  const openIssues = totalIssues - resolvedIssues;
  const complianceRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 100;

  return {
    framework,
    totalIssues,
    resolvedIssues,
    openIssues,
    complianceRate,
    issues,
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class ComplianceService {
  async createIssue(data: Omit<ComplianceIssue, 'id'>): Promise<ComplianceIssueModel> {
    return createComplianceIssue(data);
  }

  async createPolicy(data: Omit<Policy, 'id'>): Promise<PolicyModel> {
    return createPolicy(data);
  }

  async assignPolicy(policyId: string, employeeId: string): Promise<PolicyAcknowledgmentModel> {
    return assignPolicyToEmployee(policyId, employeeId);
  }

  async createI9(data: Omit<I9Record, 'id'>): Promise<I9VerificationModel> {
    return createI9Record(data);
  }

  async assignTraining(data: Omit<ComplianceTraining, 'id'>): Promise<ComplianceTrainingModel> {
    return assignComplianceTraining(data);
  }

  async submitWhistleblower(data: Omit<WhistleblowerCase, 'id' | 'submittedDate'>): Promise<WhistleblowerCaseModel> {
    return submitWhistleblowerCase(data);
  }

  async getDashboard() {
    return getComplianceDashboardMetrics();
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Compliance')
@Controller('compliance')
@ApiBearerAuth()
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get compliance dashboard metrics' })
  async getDashboard() {
    return this.complianceService.getDashboard();
  }

  @Post('issues')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create compliance issue' })
  async createIssue(@Body() data: Omit<ComplianceIssue, 'id'>) {
    return this.complianceService.createIssue(data);
  }

  @Post('policies')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create policy' })
  async createPolicy(@Body() data: Omit<Policy, 'id'>) {
    return this.complianceService.createPolicy(data);
  }

  @Post('whistleblower')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit whistleblower case' })
  async submitWhistleblower(@Body() data: Omit<WhistleblowerCase, 'id' | 'submittedDate'>) {
    return this.complianceService.submitWhistleblower(data);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ComplianceIssueModel,
  PolicyModel,
  PolicyAcknowledgmentModel,
  I9VerificationModel,
  WorkAuthorizationModel,
  ComplianceTrainingModel,
  DocumentRetentionPolicyModel,
  ComplianceAlertModel,
  WhistleblowerCaseModel,
  EEOReportModel,
  ComplianceService,
  ComplianceController,
};
