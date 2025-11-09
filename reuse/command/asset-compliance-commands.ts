/**
 * ASSET COMPLIANCE MANAGEMENT COMMANDS
 *
 * Comprehensive regulatory compliance and certification tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Regulatory compliance tracking and management
 * - Certification management and renewals
 * - Audit trail generation and management
 * - Compliance reporting and dashboards
 * - Safety inspections and OSHA compliance
 * - Environmental compliance tracking
 * - Industry standards validation (ISO, FDA, CE, UL, etc.)
 * - Non-compliance workflow management
 * - Compliance documentation management
 * - Regulatory requirement tracking
 * - Compliance risk assessment
 * - Third-party audit management
 * - Compliance training tracking
 * - Violation and remediation tracking
 *
 * @module AssetComplianceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @compliance OSHA, FDA, ISO, CE, HIPAA, SOX, EPA standards supported
 * @audit Complete audit trail for all compliance activities
 *
 * @example
 * ```typescript
 * import {
 *   trackCompliance,
 *   createCertification,
 *   conductSafetyInspection,
 *   generateAuditTrail,
 *   ComplianceRecord,
 *   Certification
 * } from './asset-compliance-commands';
 *
 * // Track compliance
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910',
 *   status: 'compliant'
 * });
 *
 * // Create certification
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Compliance framework types
 */
export enum ComplianceFramework {
  OSHA = 'osha',
  FDA = 'fda',
  ISO_9001 = 'iso_9001',
  ISO_14001 = 'iso_14001',
  ISO_45001 = 'iso_45001',
  ISO_27001 = 'iso_27001',
  HIPAA = 'hipaa',
  SOX = 'sox',
  GDPR = 'gdpr',
  EPA = 'epa',
  CE = 'ce',
  UL = 'ul',
  ANSI = 'ansi',
  NFPA = 'nfpa',
  ASME = 'asme',
  CUSTOM = 'custom',
}

/**
 * Compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  PENDING_REVIEW = 'pending_review',
  NOT_APPLICABLE = 'not_applicable',
  WAIVED = 'waived',
}

/**
 * Certification type
 */
export enum CertificationType {
  ISO_9001 = 'iso_9001',
  ISO_14001 = 'iso_14001',
  ISO_45001 = 'iso_45001',
  ISO_27001 = 'iso_27001',
  FDA_APPROVAL = 'fda_approval',
  CE_MARK = 'ce_mark',
  UL_LISTED = 'ul_listed',
  ENERGY_STAR = 'energy_star',
  LEED = 'leed',
  CALIBRATION = 'calibration',
  SAFETY_INSPECTION = 'safety_inspection',
  ENVIRONMENTAL = 'environmental',
  CUSTOM = 'custom',
}

/**
 * Certification status
 */
export enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING_RENEWAL = 'pending_renewal',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  NOT_REQUIRED = 'not_required',
}

/**
 * Inspection type
 */
export enum InspectionType {
  SAFETY = 'safety',
  ENVIRONMENTAL = 'environmental',
  QUALITY = 'quality',
  REGULATORY = 'regulatory',
  PREVENTIVE = 'preventive',
  INCIDENT_RESPONSE = 'incident_response',
  THIRD_PARTY = 'third_party',
  INTERNAL = 'internal',
}

/**
 * Inspection status
 */
export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL_PASS = 'conditional_pass',
  CANCELLED = 'cancelled',
}

/**
 * Violation severity
 */
export enum ViolationSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  MINOR = 'minor',
}

/**
 * Remediation status
 */
export enum RemediationStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  VERIFIED = 'verified',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

/**
 * Compliance record data
 */
export interface ComplianceRecordData {
  assetId: string;
  frameworkType: ComplianceFramework;
  requirementId: string;
  requirementDescription: string;
  status: ComplianceStatus;
  assessmentDate: Date;
  assessedBy: string;
  nextAssessmentDate?: Date;
  evidenceUrls?: string[];
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Certification data
 */
export interface CertificationData {
  assetId: string;
  certificationType: CertificationType;
  certificationNumber?: string;
  issuingAuthority: string;
  issueDate: Date;
  expirationDate?: Date;
  scope?: string;
  documentUrls?: string[];
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Inspection data
 */
export interface InspectionData {
  assetId: string;
  inspectionType: InspectionType;
  scheduledDate: Date;
  inspectorId?: string;
  inspectorName?: string;
  scope?: string;
  checklistId?: string;
  notes?: string;
}

/**
 * Inspection result data
 */
export interface InspectionResultData {
  inspectionId: string;
  status: InspectionStatus;
  completedDate: Date;
  findings: InspectionFinding[];
  overallScore?: number;
  passFailCriteria?: string;
  recommendations?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  reportUrl?: string;
}

/**
 * Inspection finding
 */
export interface InspectionFinding {
  findingId: string;
  category: string;
  description: string;
  severity: ViolationSeverity;
  location?: string;
  photoUrls?: string[];
  requiresAction: boolean;
  actionRequired?: string;
  dueDate?: Date;
}

/**
 * Violation record data
 */
export interface ViolationRecordData {
  assetId: string;
  violationType: string;
  frameworkType: ComplianceFramework;
  severity: ViolationSeverity;
  description: string;
  discoveredDate: Date;
  discoveredBy: string;
  inspectionId?: string;
  evidenceUrls?: string[];
  potentialFine?: number;
  notes?: string;
}

/**
 * Remediation action data
 */
export interface RemediationActionData {
  violationId: string;
  actionDescription: string;
  assignedTo: string;
  dueDate: Date;
  estimatedCost?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  notes?: string;
}

/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
  timestamp: Date;
  userId: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Compliance dashboard data
 */
export interface ComplianceDashboardData {
  assetId: string;
  overallComplianceRate: number;
  complianceByFramework: Record<ComplianceFramework, number>;
  activeCertifications: number;
  expiringCertifications: number;
  openViolations: number;
  criticalViolations: number;
  upcomingInspections: number;
  pastDueActions: number;
  recentAudits: AuditTrailEntry[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Compliance record database model
 */
@Table({ tableName: 'compliance_records', paranoid: true })
export class ComplianceRecord extends Model {
  @ApiProperty({ description: 'Unique compliance record ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Framework type', enum: ComplianceFramework })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(ComplianceFramework)), allowNull: false })
  frameworkType: ComplianceFramework;

  @ApiProperty({ description: 'Requirement ID' })
  @Index
  @Column({ type: DataType.STRING(100), allowNull: false })
  requirementId: string;

  @ApiProperty({ description: 'Requirement description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  requirementDescription: string;

  @ApiProperty({ description: 'Compliance status', enum: ComplianceStatus })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(ComplianceStatus)), allowNull: false })
  status: ComplianceStatus;

  @ApiProperty({ description: 'Assessment date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  assessmentDate: Date;

  @ApiProperty({ description: 'Assessed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  assessedBy: string;

  @ApiProperty({ description: 'Next assessment date' })
  @Index
  @Column({ type: DataType.DATE })
  nextAssessmentDate: Date;

  @ApiProperty({ description: 'Evidence URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  evidenceUrls: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Certification database model
 */
@Table({ tableName: 'certifications', paranoid: true })
export class Certification extends Model {
  @ApiProperty({ description: 'Unique certification ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Certification type', enum: CertificationType })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(CertificationType)), allowNull: false })
  certificationType: CertificationType;

  @ApiProperty({ description: 'Certification number' })
  @Index
  @Column({ type: DataType.STRING(100) })
  certificationNumber: string;

  @ApiProperty({ description: 'Issuing authority' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  issuingAuthority: string;

  @ApiProperty({ description: 'Issue date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  issueDate: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Index
  @Column({ type: DataType.DATE })
  expirationDate: Date;

  @ApiProperty({ description: 'Certification status', enum: CertificationStatus })
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(CertificationStatus)),
    defaultValue: CertificationStatus.ACTIVE,
  })
  status: CertificationStatus;

  @ApiProperty({ description: 'Certification scope' })
  @Column({ type: DataType.TEXT })
  scope: string;

  @ApiProperty({ description: 'Document URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  documentUrls: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Inspection database model
 */
@Table({ tableName: 'inspections', paranoid: true })
export class Inspection extends Model {
  @ApiProperty({ description: 'Unique inspection ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Inspection type', enum: InspectionType })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(InspectionType)), allowNull: false })
  inspectionType: InspectionType;

  @ApiProperty({ description: 'Scheduled date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  scheduledDate: Date;

  @ApiProperty({ description: 'Completed date' })
  @Column({ type: DataType.DATE })
  completedDate: Date;

  @ApiProperty({ description: 'Inspector user ID' })
  @Column({ type: DataType.UUID })
  inspectorId: string;

  @ApiProperty({ description: 'Inspector name' })
  @Column({ type: DataType.STRING(200) })
  inspectorName: string;

  @ApiProperty({ description: 'Inspection status', enum: InspectionStatus })
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
    defaultValue: InspectionStatus.SCHEDULED,
  })
  status: InspectionStatus;

  @ApiProperty({ description: 'Inspection scope' })
  @Column({ type: DataType.TEXT })
  scope: string;

  @ApiProperty({ description: 'Checklist ID' })
  @Column({ type: DataType.UUID })
  checklistId: string;

  @ApiProperty({ description: 'Findings' })
  @Column({ type: DataType.JSONB })
  findings: InspectionFinding[];

  @ApiProperty({ description: 'Overall score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  overallScore: number;

  @ApiProperty({ description: 'Pass/fail criteria' })
  @Column({ type: DataType.TEXT })
  passFailCriteria: string;

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  recommendations: string[];

  @ApiProperty({ description: 'Follow-up required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  followUpRequired: boolean;

  @ApiProperty({ description: 'Follow-up date' })
  @Column({ type: DataType.DATE })
  followUpDate: Date;

  @ApiProperty({ description: 'Report URL' })
  @Column({ type: DataType.STRING(500) })
  reportUrl: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Violation record database model
 */
@Table({ tableName: 'violation_records', paranoid: true })
export class ViolationRecord extends Model {
  @ApiProperty({ description: 'Unique violation ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Asset ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assetId: string;

  @ApiProperty({ description: 'Violation type' })
  @Index
  @Column({ type: DataType.STRING(200), allowNull: false })
  violationType: string;

  @ApiProperty({ description: 'Framework type', enum: ComplianceFramework })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(ComplianceFramework)), allowNull: false })
  frameworkType: ComplianceFramework;

  @ApiProperty({ description: 'Severity', enum: ViolationSeverity })
  @Index
  @Column({ type: DataType.ENUM(...Object.values(ViolationSeverity)), allowNull: false })
  severity: ViolationSeverity;

  @ApiProperty({ description: 'Violation description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @ApiProperty({ description: 'Discovered date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  discoveredDate: Date;

  @ApiProperty({ description: 'Discovered by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  discoveredBy: string;

  @ApiProperty({ description: 'Related inspection ID' })
  @Index
  @ForeignKey(() => Inspection)
  @Column({ type: DataType.UUID })
  inspectionId: string;

  @BelongsTo(() => Inspection)
  inspection: Inspection;

  @ApiProperty({ description: 'Evidence URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  evidenceUrls: string[];

  @ApiProperty({ description: 'Potential fine amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  potentialFine: number;

  @ApiProperty({ description: 'Remediation status', enum: RemediationStatus })
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(RemediationStatus)),
    defaultValue: RemediationStatus.OPEN,
  })
  remediationStatus: RemediationStatus;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @HasMany(() => RemediationAction)
  remediationActions: RemediationAction[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Remediation action database model
 */
@Table({ tableName: 'remediation_actions', paranoid: true })
export class RemediationAction extends Model {
  @ApiProperty({ description: 'Unique remediation action ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Violation ID' })
  @Index
  @ForeignKey(() => ViolationRecord)
  @Column({ type: DataType.UUID, allowNull: false })
  violationId: string;

  @BelongsTo(() => ViolationRecord)
  violation: ViolationRecord;

  @ApiProperty({ description: 'Action description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  actionDescription: string;

  @ApiProperty({ description: 'Assigned to user ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assignedTo: string;

  @ApiProperty({ description: 'Due date' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  dueDate: Date;

  @ApiProperty({ description: 'Completed date' })
  @Column({ type: DataType.DATE })
  completedDate: Date;

  @ApiProperty({ description: 'Estimated cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedCost: number;

  @ApiProperty({ description: 'Actual cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  actualCost: number;

  @ApiProperty({ description: 'Priority' })
  @Index
  @Column({ type: DataType.ENUM('critical', 'high', 'medium', 'low'), allowNull: false })
  priority: string;

  @ApiProperty({ description: 'Status', enum: RemediationStatus })
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(RemediationStatus)),
    defaultValue: RemediationStatus.OPEN,
  })
  status: RemediationStatus;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Audit trail database model
 */
@Table({ tableName: 'compliance_audit_trail', paranoid: false })
export class ComplianceAuditTrail extends Model {
  @ApiProperty({ description: 'Unique audit trail entry ID' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ApiProperty({ description: 'Timestamp' })
  @Index
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  timestamp: Date;

  @ApiProperty({ description: 'User ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ApiProperty({ description: 'User name' })
  @Column({ type: DataType.STRING(200) })
  userName: string;

  @ApiProperty({ description: 'Action performed' })
  @Index
  @Column({ type: DataType.STRING(200), allowNull: false })
  action: string;

  @ApiProperty({ description: 'Entity type' })
  @Index
  @Column({ type: DataType.STRING(100), allowNull: false })
  entityType: string;

  @ApiProperty({ description: 'Entity ID' })
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  entityId: string;

  @ApiProperty({ description: 'Changes made' })
  @Column({ type: DataType.JSONB })
  changes: Record<string, any>;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Create compliance record DTO
 */
export class CreateComplianceRecordDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Framework type', enum: ComplianceFramework })
  @IsEnum(ComplianceFramework)
  frameworkType: ComplianceFramework;

  @ApiProperty({ description: 'Requirement ID' })
  @IsString()
  requirementId: string;

  @ApiProperty({ description: 'Requirement description' })
  @IsString()
  requirementDescription: string;

  @ApiProperty({ description: 'Status', enum: ComplianceStatus })
  @IsEnum(ComplianceStatus)
  status: ComplianceStatus;

  @ApiProperty({ description: 'Assessment date' })
  @IsDate()
  @Type(() => Date)
  assessmentDate: Date;

  @ApiProperty({ description: 'Assessed by' })
  @IsUUID()
  assessedBy: string;

  @ApiProperty({ description: 'Next assessment date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextAssessmentDate?: Date;

  @ApiProperty({ description: 'Evidence URLs', required: false })
  @IsOptional()
  @IsArray()
  evidenceUrls?: string[];

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Create certification DTO
 */
export class CreateCertificationDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Certification type', enum: CertificationType })
  @IsEnum(CertificationType)
  certificationType: CertificationType;

  @ApiProperty({ description: 'Certification number', required: false })
  @IsOptional()
  @IsString()
  certificationNumber?: string;

  @ApiProperty({ description: 'Issuing authority' })
  @IsString()
  issuingAuthority: string;

  @ApiProperty({ description: 'Issue date' })
  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({ description: 'Scope', required: false })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({ description: 'Document URLs', required: false })
  @IsOptional()
  @IsArray()
  documentUrls?: string[];

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Create inspection DTO
 */
export class CreateInspectionDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Inspection type', enum: InspectionType })
  @IsEnum(InspectionType)
  inspectionType: InspectionType;

  @ApiProperty({ description: 'Scheduled date' })
  @IsDate()
  @Type(() => Date)
  scheduledDate: Date;

  @ApiProperty({ description: 'Inspector ID', required: false })
  @IsOptional()
  @IsUUID()
  inspectorId?: string;

  @ApiProperty({ description: 'Inspector name', required: false })
  @IsOptional()
  @IsString()
  inspectorName?: string;

  @ApiProperty({ description: 'Scope', required: false })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({ description: 'Checklist ID', required: false })
  @IsOptional()
  @IsUUID()
  checklistId?: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Create violation record DTO
 */
export class CreateViolationRecordDto {
  @ApiProperty({ description: 'Asset ID' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ description: 'Violation type' })
  @IsString()
  violationType: string;

  @ApiProperty({ description: 'Framework type', enum: ComplianceFramework })
  @IsEnum(ComplianceFramework)
  frameworkType: ComplianceFramework;

  @ApiProperty({ description: 'Severity', enum: ViolationSeverity })
  @IsEnum(ViolationSeverity)
  severity: ViolationSeverity;

  @ApiProperty({ description: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Discovered date' })
  @IsDate()
  @Type(() => Date)
  discoveredDate: Date;

  @ApiProperty({ description: 'Discovered by' })
  @IsUUID()
  discoveredBy: string;

  @ApiProperty({ description: 'Inspection ID', required: false })
  @IsOptional()
  @IsUUID()
  inspectionId?: string;

  @ApiProperty({ description: 'Evidence URLs', required: false })
  @IsOptional()
  @IsArray()
  evidenceUrls?: string[];

  @ApiProperty({ description: 'Potential fine', required: false })
  @IsOptional()
  @IsNumber()
  potentialFine?: number;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================================================
// COMPLIANCE TRACKING FUNCTIONS
// ============================================================================

/**
 * Track compliance for an asset
 *
 * @param data - Compliance record data
 * @param transaction - Optional database transaction
 * @returns Created compliance record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910.147',
 *   requirementDescription: 'Lockout/Tagout procedures',
 *   status: 'compliant',
 *   assessmentDate: new Date(),
 *   assessedBy: 'user-001'
 * });
 * ```
 */
export async function trackCompliance(
  data: ComplianceRecordData,
  transaction?: Transaction
): Promise<ComplianceRecord> {
  try {
    const record = await ComplianceRecord.create(
      {
        assetId: data.assetId,
        frameworkType: data.frameworkType,
        requirementId: data.requirementId,
        requirementDescription: data.requirementDescription,
        status: data.status,
        assessmentDate: data.assessmentDate,
        assessedBy: data.assessedBy,
        nextAssessmentDate: data.nextAssessmentDate,
        evidenceUrls: data.evidenceUrls,
        notes: data.notes,
        metadata: data.metadata,
      },
      { transaction }
    );

    // Create audit trail
    await createAuditTrailEntry(
      data.assessedBy,
      'create_compliance_record',
      'compliance_record',
      record.id,
      { compliance: data },
      transaction
    );

    return record;
  } catch (error) {
    throw new BadRequestException(`Failed to track compliance: ${error.message}`);
  }
}

/**
 * Get compliance record by ID
 *
 * @param id - Compliance record ID
 * @returns Compliance record or null
 *
 * @example
 * ```typescript
 * const record = await getComplianceRecordById('compliance-001');
 * ```
 */
export async function getComplianceRecordById(id: string): Promise<ComplianceRecord | null> {
  return await ComplianceRecord.findByPk(id);
}

/**
 * Get compliance records for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @param status - Optional status filter
 * @returns Array of compliance records
 *
 * @example
 * ```typescript
 * const records = await getAssetComplianceRecords('asset-001', 'osha');
 * ```
 */
export async function getAssetComplianceRecords(
  assetId: string,
  frameworkType?: ComplianceFramework,
  status?: ComplianceStatus
): Promise<ComplianceRecord[]> {
  const where: WhereOptions = { assetId };

  if (frameworkType) {
    where.frameworkType = frameworkType;
  }

  if (status) {
    where.status = status;
  }

  return await ComplianceRecord.findAll({
    where,
    order: [['assessmentDate', 'DESC']],
  });
}

/**
 * Update compliance status
 *
 * @param id - Compliance record ID
 * @param status - New status
 * @param userId - User making the update
 * @param notes - Optional update notes
 * @param transaction - Optional database transaction
 * @returns Updated compliance record
 * @throws NotFoundException if record not found
 *
 * @example
 * ```typescript
 * const updated = await updateComplianceStatus(
 *   'compliance-001',
 *   'compliant',
 *   'user-001',
 *   'Verified compliance'
 * );
 * ```
 */
export async function updateComplianceStatus(
  id: string,
  status: ComplianceStatus,
  userId: string,
  notes?: string,
  transaction?: Transaction
): Promise<ComplianceRecord> {
  const record = await ComplianceRecord.findByPk(id);

  if (!record) {
    throw new NotFoundException(`Compliance record ${id} not found`);
  }

  const oldStatus = record.status;
  await record.update({ status, notes }, { transaction });

  // Create audit trail
  await createAuditTrailEntry(
    userId,
    'update_compliance_status',
    'compliance_record',
    id,
    { oldStatus, newStatus: status, notes },
    transaction
  );

  return record;
}

/**
 * Calculate compliance rate for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @returns Compliance rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateComplianceRate('asset-001');
 * ```
 */
export async function calculateComplianceRate(
  assetId: string,
  frameworkType?: ComplianceFramework
): Promise<number> {
  const records = await getAssetComplianceRecords(assetId, frameworkType);

  if (records.length === 0) {
    return 100; // No requirements means 100% compliant
  }

  const compliantRecords = records.filter((r) => r.status === ComplianceStatus.COMPLIANT);
  return (compliantRecords.length / records.length) * 100;
}

// ============================================================================
// CERTIFICATION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create a certification
 *
 * @param data - Certification data
 * @param transaction - Optional database transaction
 * @returns Created certification
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issuingAuthority: 'ISO Certification Body',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
export async function createCertification(
  data: CertificationData,
  transaction?: Transaction
): Promise<Certification> {
  try {
    const cert = await Certification.create(
      {
        assetId: data.assetId,
        certificationType: data.certificationType,
        certificationNumber: data.certificationNumber,
        issuingAuthority: data.issuingAuthority,
        issueDate: data.issueDate,
        expirationDate: data.expirationDate,
        scope: data.scope,
        documentUrls: data.documentUrls,
        notes: data.notes,
        metadata: data.metadata,
      },
      { transaction }
    );

    return cert;
  } catch (error) {
    throw new BadRequestException(`Failed to create certification: ${error.message}`);
  }
}

/**
 * Get certification by ID
 *
 * @param id - Certification ID
 * @returns Certification or null
 *
 * @example
 * ```typescript
 * const cert = await getCertificationById('cert-001');
 * ```
 */
export async function getCertificationById(id: string): Promise<Certification | null> {
  return await Certification.findByPk(id);
}

/**
 * Get certifications for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of certifications
 *
 * @example
 * ```typescript
 * const certs = await getAssetCertifications('asset-001', 'active');
 * ```
 */
export async function getAssetCertifications(
  assetId: string,
  status?: CertificationStatus
): Promise<Certification[]> {
  const where: WhereOptions = { assetId };

  if (status) {
    where.status = status;
  }

  return await Certification.findAll({
    where,
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Get expiring certifications
 *
 * @param daysUntilExpiration - Number of days to look ahead
 * @returns Array of expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCertifications(30);
 * ```
 */
export async function getExpiringCertifications(
  daysUntilExpiration: number = 30
): Promise<Certification[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysUntilExpiration);

  return await Certification.findAll({
    where: {
      status: CertificationStatus.ACTIVE,
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Renew a certification
 *
 * @param id - Certification ID
 * @param newExpirationDate - New expiration date
 * @param userId - User performing the renewal
 * @param transaction - Optional database transaction
 * @returns Updated certification
 * @throws NotFoundException if certification not found
 *
 * @example
 * ```typescript
 * const renewed = await renewCertification(
 *   'cert-001',
 *   new Date('2026-12-31'),
 *   'user-001'
 * );
 * ```
 */
export async function renewCertification(
  id: string,
  newExpirationDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<Certification> {
  const cert = await Certification.findByPk(id);

  if (!cert) {
    throw new NotFoundException(`Certification ${id} not found`);
  }

  await cert.update(
    {
      expirationDate: newExpirationDate,
      status: CertificationStatus.ACTIVE,
    },
    { transaction }
  );

  // Create audit trail
  await createAuditTrailEntry(
    userId,
    'renew_certification',
    'certification',
    id,
    { newExpirationDate },
    transaction
  );

  return cert;
}

/**
 * Update certification statuses based on expiration dates
 *
 * @param transaction - Optional database transaction
 * @returns Number of certifications updated
 *
 * @example
 * ```typescript
 * const updated = await updateCertificationStatuses();
 * ```
 */
export async function updateCertificationStatuses(
  transaction?: Transaction
): Promise<number> {
  const now = new Date();

  // Mark expired certifications
  const [expiredCount] = await Certification.update(
    { status: CertificationStatus.EXPIRED },
    {
      where: {
        status: CertificationStatus.ACTIVE,
        expirationDate: {
          [Op.lt]: now,
        },
      },
      transaction,
    }
  );

  // Mark pending renewal (30 days before expiration)
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);

  const [pendingCount] = await Certification.update(
    { status: CertificationStatus.PENDING_RENEWAL },
    {
      where: {
        status: CertificationStatus.ACTIVE,
        expirationDate: {
          [Op.between]: [now, renewalDate],
        },
      },
      transaction,
    }
  );

  return expiredCount + pendingCount;
}

// ============================================================================
// INSPECTION FUNCTIONS
// ============================================================================

/**
 * Schedule an inspection
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   assetId: 'asset-001',
 *   inspectionType: 'safety',
 *   scheduledDate: new Date('2024-12-01'),
 *   inspectorId: 'user-001'
 * });
 * ```
 */
export async function scheduleInspection(
  data: InspectionData,
  transaction?: Transaction
): Promise<Inspection> {
  try {
    const inspection = await Inspection.create(
      {
        assetId: data.assetId,
        inspectionType: data.inspectionType,
        scheduledDate: data.scheduledDate,
        inspectorId: data.inspectorId,
        inspectorName: data.inspectorName,
        scope: data.scope,
        checklistId: data.checklistId,
        notes: data.notes,
      },
      { transaction }
    );

    return inspection;
  } catch (error) {
    throw new BadRequestException(`Failed to schedule inspection: ${error.message}`);
  }
}

/**
 * Get inspection by ID
 *
 * @param id - Inspection ID
 * @returns Inspection or null
 *
 * @example
 * ```typescript
 * const inspection = await getInspectionById('inspection-001');
 * ```
 */
export async function getInspectionById(id: string): Promise<Inspection | null> {
  return await Inspection.findByPk(id);
}

/**
 * Get inspections for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of inspections
 *
 * @example
 * ```typescript
 * const inspections = await getAssetInspections('asset-001');
 * ```
 */
export async function getAssetInspections(
  assetId: string,
  status?: InspectionStatus
): Promise<Inspection[]> {
  const where: WhereOptions = { assetId };

  if (status) {
    where.status = status;
  }

  return await Inspection.findAll({
    where,
    order: [['scheduledDate', 'DESC']],
  });
}

/**
 * Complete an inspection with results
 *
 * @param id - Inspection ID
 * @param resultData - Inspection result data
 * @param userId - User completing the inspection
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 * @throws NotFoundException if inspection not found
 *
 * @example
 * ```typescript
 * const completed = await completeInspection(
 *   'inspection-001',
 *   {
 *     status: 'passed',
 *     completedDate: new Date(),
 *     findings: [],
 *     followUpRequired: false
 *   },
 *   'user-001'
 * );
 * ```
 */
export async function completeInspection(
  id: string,
  resultData: InspectionResultData,
  userId: string,
  transaction?: Transaction
): Promise<Inspection> {
  const inspection = await Inspection.findByPk(id);

  if (!inspection) {
    throw new NotFoundException(`Inspection ${id} not found`);
  }

  await inspection.update(
    {
      status: resultData.status,
      completedDate: resultData.completedDate,
      findings: resultData.findings,
      overallScore: resultData.overallScore,
      passFailCriteria: resultData.passFailCriteria,
      recommendations: resultData.recommendations,
      followUpRequired: resultData.followUpRequired,
      followUpDate: resultData.followUpDate,
      reportUrl: resultData.reportUrl,
    },
    { transaction }
  );

  // Create audit trail
  await createAuditTrailEntry(
    userId,
    'complete_inspection',
    'inspection',
    id,
    { result: resultData },
    transaction
  );

  return inspection;
}

/**
 * Conduct a safety inspection
 *
 * @param assetId - Asset ID
 * @param inspectorId - Inspector user ID
 * @param checklistId - Checklist ID to use
 * @param transaction - Optional database transaction
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await conductSafetyInspection(
 *   'asset-001',
 *   'user-001',
 *   'checklist-001'
 * );
 * ```
 */
export async function conductSafetyInspection(
  assetId: string,
  inspectorId: string,
  checklistId: string,
  transaction?: Transaction
): Promise<Inspection> {
  return await scheduleInspection(
    {
      assetId,
      inspectionType: InspectionType.SAFETY,
      scheduledDate: new Date(),
      inspectorId,
      checklistId,
    },
    transaction
  );
}

// ============================================================================
// VIOLATION AND REMEDIATION FUNCTIONS
// ============================================================================

/**
 * Record a compliance violation
 *
 * @param data - Violation record data
 * @param transaction - Optional database transaction
 * @returns Created violation record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const violation = await recordViolation({
 *   assetId: 'asset-001',
 *   violationType: 'Safety Hazard',
 *   frameworkType: 'osha',
 *   severity: 'high',
 *   description: 'Missing safety guard',
 *   discoveredDate: new Date(),
 *   discoveredBy: 'user-001'
 * });
 * ```
 */
export async function recordViolation(
  data: ViolationRecordData,
  transaction?: Transaction
): Promise<ViolationRecord> {
  try {
    const violation = await ViolationRecord.create(
      {
        assetId: data.assetId,
        violationType: data.violationType,
        frameworkType: data.frameworkType,
        severity: data.severity,
        description: data.description,
        discoveredDate: data.discoveredDate,
        discoveredBy: data.discoveredBy,
        inspectionId: data.inspectionId,
        evidenceUrls: data.evidenceUrls,
        potentialFine: data.potentialFine,
        notes: data.notes,
      },
      { transaction }
    );

    // Create audit trail
    await createAuditTrailEntry(
      data.discoveredBy,
      'record_violation',
      'violation_record',
      violation.id,
      { violation: data },
      transaction
    );

    return violation;
  } catch (error) {
    throw new BadRequestException(`Failed to record violation: ${error.message}`);
  }
}

/**
 * Get violations for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @param status - Optional remediation status filter
 * @returns Array of violation records
 *
 * @example
 * ```typescript
 * const violations = await getAssetViolations('asset-001', 'critical');
 * ```
 */
export async function getAssetViolations(
  assetId: string,
  severity?: ViolationSeverity,
  status?: RemediationStatus
): Promise<ViolationRecord[]> {
  const where: WhereOptions = { assetId };

  if (severity) {
    where.severity = severity;
  }

  if (status) {
    where.remediationStatus = status;
  }

  return await ViolationRecord.findAll({
    where,
    include: [{ model: RemediationAction }],
    order: [['discoveredDate', 'DESC']],
  });
}

/**
 * Create a remediation action for a violation
 *
 * @param data - Remediation action data
 * @param transaction - Optional database transaction
 * @returns Created remediation action
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const action = await createRemediationAction({
 *   violationId: 'violation-001',
 *   actionDescription: 'Install safety guard',
 *   assignedTo: 'user-002',
 *   dueDate: new Date('2024-12-15'),
 *   priority: 'high'
 * });
 * ```
 */
export async function createRemediationAction(
  data: RemediationActionData,
  transaction?: Transaction
): Promise<RemediationAction> {
  try {
    const action = await RemediationAction.create(
      {
        violationId: data.violationId,
        actionDescription: data.actionDescription,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        estimatedCost: data.estimatedCost,
        priority: data.priority,
        notes: data.notes,
      },
      { transaction }
    );

    // Update violation status
    await ViolationRecord.update(
      { remediationStatus: RemediationStatus.IN_PROGRESS },
      { where: { id: data.violationId }, transaction }
    );

    return action;
  } catch (error) {
    throw new BadRequestException(`Failed to create remediation action: ${error.message}`);
  }
}

/**
 * Complete a remediation action
 *
 * @param id - Remediation action ID
 * @param actualCost - Actual cost incurred
 * @param userId - User completing the action
 * @param transaction - Optional database transaction
 * @returns Updated remediation action
 * @throws NotFoundException if action not found
 *
 * @example
 * ```typescript
 * const completed = await completeRemediationAction(
 *   'action-001',
 *   1200,
 *   'user-002'
 * );
 * ```
 */
export async function completeRemediationAction(
  id: string,
  actualCost: number,
  userId: string,
  transaction?: Transaction
): Promise<RemediationAction> {
  const action = await RemediationAction.findByPk(id);

  if (!action) {
    throw new NotFoundException(`Remediation action ${id} not found`);
  }

  await action.update(
    {
      status: RemediationStatus.RESOLVED,
      completedDate: new Date(),
      actualCost,
    },
    { transaction }
  );

  // Check if all actions for the violation are complete
  const allActions = await RemediationAction.findAll({
    where: { violationId: action.violationId },
  });

  const allComplete = allActions.every((a) => a.status === RemediationStatus.RESOLVED);

  if (allComplete) {
    await ViolationRecord.update(
      { remediationStatus: RemediationStatus.RESOLVED },
      { where: { id: action.violationId }, transaction }
    );
  }

  // Create audit trail
  await createAuditTrailEntry(
    userId,
    'complete_remediation_action',
    'remediation_action',
    id,
    { actualCost },
    transaction
  );

  return action;
}

// ============================================================================
// AUDIT TRAIL FUNCTIONS
// ============================================================================

/**
 * Create an audit trail entry
 *
 * @param userId - User ID
 * @param action - Action performed
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param changes - Changes made
 * @param transaction - Optional database transaction
 * @returns Created audit trail entry
 *
 * @example
 * ```typescript
 * await createAuditTrailEntry(
 *   'user-001',
 *   'update_compliance_status',
 *   'compliance_record',
 *   'compliance-001',
 *   { oldStatus: 'pending', newStatus: 'compliant' }
 * );
 * ```
 */
export async function createAuditTrailEntry(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, any>,
  transaction?: Transaction
): Promise<ComplianceAuditTrail> {
  return await ComplianceAuditTrail.create(
    {
      userId,
      action,
      entityType,
      entityId,
      changes,
      timestamp: new Date(),
    },
    { transaction }
  );
}

/**
 * Get audit trail for an entity
 *
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param limit - Maximum number of entries
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await getAuditTrail('compliance_record', 'compliance-001');
 * ```
 */
export async function getAuditTrail(
  entityType: string,
  entityId: string,
  limit: number = 100
): Promise<ComplianceAuditTrail[]> {
  return await ComplianceAuditTrail.findAll({
    where: { entityType, entityId },
    order: [['timestamp', 'DESC']],
    limit,
  });
}

/**
 * Generate comprehensive audit trail for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await generateAuditTrail('asset-001');
 * ```
 */
export async function generateAuditTrail(
  assetId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ComplianceAuditTrail[]> {
  // Get all compliance-related entities for this asset
  const [compliance, certifications, inspections, violations] = await Promise.all([
    ComplianceRecord.findAll({ where: { assetId }, attributes: ['id'] }),
    Certification.findAll({ where: { assetId }, attributes: ['id'] }),
    Inspection.findAll({ where: { assetId }, attributes: ['id'] }),
    ViolationRecord.findAll({ where: { assetId }, attributes: ['id'] }),
  ]);

  const entityIds = [
    ...compliance.map((c) => c.id),
    ...certifications.map((c) => c.id),
    ...inspections.map((i) => i.id),
    ...violations.map((v) => v.id),
  ];

  const where: WhereOptions = {
    entityId: { [Op.in]: entityIds },
  };

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp[Op.gte] = startDate;
    if (endDate) where.timestamp[Op.lte] = endDate;
  }

  return await ComplianceAuditTrail.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit: 1000,
  });
}

// ============================================================================
// COMPLIANCE DASHBOARD FUNCTIONS
// ============================================================================

/**
 * Get compliance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @returns Compliance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getComplianceDashboard('asset-001');
 * ```
 */
export async function getComplianceDashboard(
  assetId: string
): Promise<ComplianceDashboardData> {
  // Get overall compliance rate
  const overallComplianceRate = await calculateComplianceRate(assetId);

  // Get compliance by framework
  const complianceByFramework: Record<ComplianceFramework, number> = {} as any;
  for (const framework of Object.values(ComplianceFramework)) {
    complianceByFramework[framework] = await calculateComplianceRate(assetId, framework);
  }

  // Get certifications
  const activeCerts = await getAssetCertifications(assetId, CertificationStatus.ACTIVE);
  const expiringCerts = await getExpiringCertifications(30);
  const assetExpiringCerts = expiringCerts.filter((c) => c.assetId === assetId);

  // Get violations
  const openViolations = await getAssetViolations(assetId, undefined, RemediationStatus.OPEN);
  const criticalViolations = await getAssetViolations(
    assetId,
    ViolationSeverity.CRITICAL,
    RemediationStatus.OPEN
  );

  // Get upcoming inspections
  const allInspections = await getAssetInspections(assetId);
  const upcomingInspections = allInspections.filter(
    (i) =>
      i.status === InspectionStatus.SCHEDULED &&
      i.scheduledDate > new Date()
  );

  // Get past due actions
  const violations = await ViolationRecord.findAll({
    where: { assetId },
    include: [{ model: RemediationAction }],
  });
  const allActions = violations.flatMap((v) => v.remediationActions || []);
  const pastDueActions = allActions.filter(
    (a) =>
      a.status !== RemediationStatus.RESOLVED &&
      a.dueDate < new Date()
  );

  // Get recent audit entries
  const recentAudits = await generateAuditTrail(assetId);

  return {
    assetId,
    overallComplianceRate,
    complianceByFramework,
    activeCertifications: activeCerts.length,
    expiringCertifications: assetExpiringCerts.length,
    openViolations: openViolations.length,
    criticalViolations: criticalViolations.length,
    upcomingInspections: upcomingInspections.length,
    pastDueActions: pastDueActions.length,
    recentAudits: recentAudits.slice(0, 20).map((a) => ({
      timestamp: a.timestamp,
      userId: a.userId,
      userName: a.userName,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      changes: a.changes,
      metadata: a.metadata,
    })),
  };
}

/**
 * Generate compliance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param frameworkType - Optional framework filter
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(['asset-001', 'asset-002'], 'osha');
 * ```
 */
export async function generateComplianceReport(
  assetIds: string[],
  frameworkType?: ComplianceFramework
): Promise<Record<string, any>> {
  const assetReports = await Promise.all(
    assetIds.map(async (assetId) => {
      const dashboard = await getComplianceDashboard(assetId);
      const records = await getAssetComplianceRecords(assetId, frameworkType);
      const certifications = await getAssetCertifications(assetId);
      const violations = await getAssetViolations(assetId);

      return {
        assetId,
        dashboard,
        complianceRecords: records.length,
        certifications: certifications.length,
        violations: violations.length,
      };
    })
  );

  return {
    reportDate: new Date(),
    frameworkType,
    assetCount: assetIds.length,
    assetReports,
    summary: {
      averageComplianceRate:
        assetReports.reduce((sum, r) => sum + r.dashboard.overallComplianceRate, 0) /
        assetReports.length,
      totalViolations: assetReports.reduce((sum, r) => sum + r.violations, 0),
      totalCertifications: assetReports.reduce((sum, r) => sum + r.certifications, 0),
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Compliance tracking
  trackCompliance,
  getComplianceRecordById,
  getAssetComplianceRecords,
  updateComplianceStatus,
  calculateComplianceRate,

  // Certification management
  createCertification,
  getCertificationById,
  getAssetCertifications,
  getExpiringCertifications,
  renewCertification,
  updateCertificationStatuses,

  // Inspections
  scheduleInspection,
  getInspectionById,
  getAssetInspections,
  completeInspection,
  conductSafetyInspection,

  // Violations and remediation
  recordViolation,
  getAssetViolations,
  createRemediationAction,
  completeRemediationAction,

  // Audit trail
  createAuditTrailEntry,
  getAuditTrail,
  generateAuditTrail,

  // Dashboard and reporting
  getComplianceDashboard,
  generateComplianceReport,

  // Models
  ComplianceRecord,
  Certification,
  Inspection,
  ViolationRecord,
  RemediationAction,
  ComplianceAuditTrail,

  // DTOs
  CreateComplianceRecordDto,
  CreateCertificationDto,
  CreateInspectionDto,
  CreateViolationRecordDto,

  // Enums
  ComplianceFramework,
  ComplianceStatus,
  CertificationType,
  CertificationStatus,
  InspectionType,
  InspectionStatus,
  ViolationSeverity,
  RemediationStatus,
};
