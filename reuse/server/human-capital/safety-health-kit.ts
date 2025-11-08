/**
 * LOC: HCM_SAFE_001
 * File: /reuse/server/human-capital/safety-health-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Safety & health controllers
 *   - OSHA reporting services
 *   - Workers' compensation systems
 *   - Incident management dashboards
 *   - Health monitoring services
 */

/**
 * File: /reuse/server/human-capital/safety-health-kit.ts
 * Locator: WC-HCM-SAFE-001
 * Purpose: Safety & Health Kit - Comprehensive workplace safety and occupational health management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/safety/*, ../services/osha/*, Workers' comp systems, Health monitoring
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 45 utility functions for workplace safety program management, incident & accident reporting,
 *          safety inspections & audits, hazard identification & mitigation, safety training & certification,
 *          PPE tracking, workers' compensation case management, return-to-work programs,
 *          occupational health monitoring, ergonomics assessment, safety analytics & metrics,
 *          safety committee management, emergency preparedness
 *
 * LLM Context: Enterprise-grade workplace safety and occupational health management for White Cross
 * healthcare system. Provides comprehensive OSHA compliance including incident/accident reporting,
 * safety inspection management, hazard identification and risk assessment, safety training certification,
 * PPE inventory and distribution, workers' compensation claims, return-to-work coordination,
 * occupational health surveillance, ergonomics programs, safety committee administration,
 * emergency response planning, safety metrics and KPIs, near-miss reporting, workplace violence
 * prevention, and OSHA recordkeeping (300, 300A, 301 forms). Healthcare-specific safety requirements.
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
  BeforeCreate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Incident severity enumeration
 */
export enum IncidentSeverity {
  FATAL = 'fatal',
  SERIOUS = 'serious',
  MODERATE = 'moderate',
  MINOR = 'minor',
  FIRST_AID = 'first_aid',
  NEAR_MISS = 'near_miss',
}

/**
 * Incident type enumeration
 */
export enum IncidentType {
  INJURY = 'injury',
  ILLNESS = 'illness',
  EXPOSURE = 'exposure',
  PROPERTY_DAMAGE = 'property_damage',
  ENVIRONMENTAL = 'environmental',
  VEHICLE_ACCIDENT = 'vehicle_accident',
  WORKPLACE_VIOLENCE = 'workplace_violence',
  NEAR_MISS = 'near_miss',
}

/**
 * Incident status enumeration
 */
export enum IncidentStatus {
  REPORTED = 'reported',
  UNDER_INVESTIGATION = 'under_investigation',
  INVESTIGATION_COMPLETE = 'investigation_complete',
  CORRECTIVE_ACTIONS_PENDING = 'corrective_actions_pending',
  CLOSED = 'closed',
}

/**
 * Inspection status enumeration
 */
export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PASSED = 'passed',
}

/**
 * Hazard severity enumeration
 */
export enum HazardSeverity {
  IMMINENT_DANGER = 'imminent_danger',
  SERIOUS = 'serious',
  MODERATE = 'moderate',
  LOW = 'low',
}

/**
 * Hazard status enumeration
 */
export enum HazardStatus {
  IDENTIFIED = 'identified',
  UNDER_EVALUATION = 'under_evaluation',
  MITIGATION_PLANNED = 'mitigation_planned',
  MITIGATION_IN_PROGRESS = 'mitigation_in_progress',
  MITIGATED = 'mitigated',
  ACCEPTED_RISK = 'accepted_risk',
}

/**
 * PPE type enumeration
 */
export enum PPEType {
  RESPIRATOR = 'respirator',
  SAFETY_GLASSES = 'safety_glasses',
  HARD_HAT = 'hard_hat',
  SAFETY_SHOES = 'safety_shoes',
  GLOVES = 'gloves',
  HEARING_PROTECTION = 'hearing_protection',
  FACE_SHIELD = 'face_shield',
  PROTECTIVE_CLOTHING = 'protective_clothing',
  FALL_PROTECTION = 'fall_protection',
  HIGH_VISIBILITY_VEST = 'high_visibility_vest',
}

/**
 * Workers' comp claim status
 */
export enum WorkersCompStatus {
  REPORTED = 'reported',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
  UNDER_REVIEW = 'under_review',
  MEDICAL_TREATMENT = 'medical_treatment',
  MODIFIED_DUTY = 'modified_duty',
  CLOSED = 'closed',
  APPEALED = 'appealed',
}

/**
 * Return to work status
 */
export enum ReturnToWorkStatus {
  NOT_STARTED = 'not_started',
  MEDICAL_EVALUATION = 'medical_evaluation',
  RESTRICTIONS_IDENTIFIED = 'restrictions_identified',
  MODIFIED_DUTY_ASSIGNED = 'modified_duty_assigned',
  FULL_DUTY_RETURNED = 'full_duty_returned',
  UNABLE_TO_RETURN = 'unable_to_return',
}

/**
 * Health surveillance type
 */
export enum HealthSurveillanceType {
  ANNUAL_PHYSICAL = 'annual_physical',
  RESPIRATORY_FIT_TEST = 'respiratory_fit_test',
  HEARING_CONSERVATION = 'hearing_conservation',
  BLOOD_BORNE_PATHOGEN = 'blood_borne_pathogen',
  HAZMAT_SCREENING = 'hazmat_screening',
  DRUG_ALCOHOL_TEST = 'drug_alcohol_test',
  VISION_SCREENING = 'vision_screening',
  ERGONOMIC_ASSESSMENT = 'ergonomic_assessment',
}

/**
 * Emergency type enumeration
 */
export enum EmergencyType {
  FIRE = 'fire',
  MEDICAL = 'medical',
  CHEMICAL_SPILL = 'chemical_spill',
  NATURAL_DISASTER = 'natural_disaster',
  ACTIVE_SHOOTER = 'active_shooter',
  BOMB_THREAT = 'bomb_threat',
  POWER_OUTAGE = 'power_outage',
  EVACUATION = 'evacuation',
}

/**
 * Safety training certification status
 */
export enum CertificationStatus {
  VALID = 'valid',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING = 'pending',
}

/**
 * Incident report interface
 */
export interface IncidentReport {
  id: string;
  incidentNumber: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  incidentDate: Date;
  reportedDate: Date;
  reportedBy: string;
  employeeId?: string;
  location: string;
  description: string;
  immediateCause?: string;
  rootCause?: string;
  witnessNames?: string[];
  injuryDetails?: Record<string, any>;
  propertyDamage?: number;
  workDaysLost?: number;
  restrictedWorkDays?: number;
  oshaRecordable: boolean;
  investigationNotes?: string;
  correctiveActions?: string[];
  investigatedBy?: string;
  investigationCompletedDate?: Date;
  closedDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Safety inspection interface
 */
export interface SafetyInspection {
  id: string;
  inspectionNumber: string;
  inspectionType: string;
  scheduledDate: Date;
  completedDate?: Date;
  inspector: string;
  location: string;
  status: InspectionStatus;
  score?: number;
  findingsCount?: number;
  criticalFindings?: number;
  findings?: InspectionFinding[];
  notes?: string;
}

/**
 * Inspection finding interface
 */
export interface InspectionFinding {
  id?: string;
  category: string;
  description: string;
  severity: HazardSeverity;
  photoUrls?: string[];
  correctiveAction?: string;
  responsibleParty?: string;
  dueDate?: Date;
  completedDate?: Date;
}

/**
 * Hazard interface
 */
export interface Hazard {
  id: string;
  hazardNumber: string;
  hazardType: string;
  severity: HazardSeverity;
  status: HazardStatus;
  identifiedDate: Date;
  identifiedBy: string;
  location: string;
  description: string;
  riskAssessment?: string;
  mitigationPlan?: string;
  mitigationCost?: number;
  responsibleParty?: string;
  targetCompletionDate?: Date;
  completedDate?: Date;
  photoUrls?: string[];
  metadata?: Record<string, any>;
}

/**
 * PPE issuance record
 */
export interface PPEIssuance {
  id: string;
  employeeId: string;
  ppeType: PPEType;
  itemDescription: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  issuedDate: Date;
  issuedBy: string;
  expiryDate?: Date;
  returnedDate?: Date;
  size?: string;
  cost?: number;
  notes?: string;
}

/**
 * Workers' compensation claim
 */
export interface WorkersCompClaim {
  id: string;
  claimNumber: string;
  employeeId: string;
  incidentId?: string;
  injuryDate: Date;
  reportedDate: Date;
  injuryType: string;
  bodyPart: string;
  status: WorkersCompStatus;
  carrierClaimNumber?: string;
  estimatedCost?: number;
  actualCost?: number;
  medicalProvider?: string;
  lostWorkDays?: number;
  restrictedWorkDays?: number;
  settlementAmount?: number;
  closedDate?: Date;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Return to work plan
 */
export interface ReturnToWorkPlan {
  id: string;
  employeeId: string;
  claimId?: string;
  status: ReturnToWorkStatus;
  injuryDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  restrictions?: string[];
  modifiedDuties?: string[];
  accommodations?: string[];
  medicalClearance?: boolean;
  medicalProvider?: string;
  followUpDates?: Date[];
  progressNotes?: string;
  coordinator: string;
}

/**
 * Health surveillance record
 */
export interface HealthSurveillance {
  id: string;
  employeeId: string;
  surveillanceType: HealthSurveillanceType;
  scheduledDate: Date;
  completedDate?: Date;
  provider?: string;
  result?: string;
  restrictions?: string[];
  recommendations?: string[];
  nextDueDate?: Date;
  certificateUrl?: string;
  notes?: string;
}

/**
 * Safety training certification
 */
export interface SafetyCertification {
  id: string;
  employeeId: string;
  certificationName: string;
  certificationBody: string;
  issueDate: Date;
  expiryDate?: Date;
  status: CertificationStatus;
  certificateNumber?: string;
  certificateUrl?: string;
  instructor?: string;
  score?: number;
  renewalRequired: boolean;
}

/**
 * Emergency drill record
 */
export interface EmergencyDrill {
  id: string;
  drillType: EmergencyType;
  scheduledDate: Date;
  completedDate?: Date;
  location: string;
  participantCount?: number;
  durationMinutes?: number;
  successful: boolean;
  findings?: string[];
  improvements?: string[];
  conductedBy: string;
  notes?: string;
}

/**
 * Safety committee meeting
 */
export interface SafetyCommitteeMeeting {
  id: string;
  meetingDate: Date;
  location: string;
  attendees: string[];
  agenda: string[];
  minutes?: string;
  actionItems?: ActionItem[];
  nextMeetingDate?: Date;
  chairperson: string;
}

/**
 * Action item interface
 */
export interface ActionItem {
  id?: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Incident report validation schema
 */
export const IncidentReportSchema = z.object({
  incidentNumber: z.string().min(1).max(50),
  incidentType: z.nativeEnum(IncidentType),
  severity: z.nativeEnum(IncidentSeverity),
  status: z.nativeEnum(IncidentStatus).default(IncidentStatus.REPORTED),
  incidentDate: z.coerce.date(),
  reportedDate: z.coerce.date(),
  reportedBy: z.string().uuid(),
  employeeId: z.string().uuid().optional(),
  location: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  immediateCause: z.string().max(2000).optional(),
  rootCause: z.string().max(2000).optional(),
  witnessNames: z.array(z.string()).optional(),
  injuryDetails: z.record(z.any()).optional(),
  propertyDamage: z.number().min(0).optional(),
  workDaysLost: z.number().int().min(0).optional(),
  restrictedWorkDays: z.number().int().min(0).optional(),
  oshaRecordable: z.boolean().default(false),
  investigationNotes: z.string().optional(),
  correctiveActions: z.array(z.string()).optional(),
  investigatedBy: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Safety inspection validation schema
 */
export const SafetyInspectionSchema = z.object({
  inspectionNumber: z.string().min(1).max(50),
  inspectionType: z.string().min(1).max(100),
  scheduledDate: z.coerce.date(),
  completedDate: z.coerce.date().optional(),
  inspector: z.string().uuid(),
  location: z.string().min(1).max(255),
  status: z.nativeEnum(InspectionStatus).default(InspectionStatus.SCHEDULED),
  score: z.number().min(0).max(100).optional(),
  findingsCount: z.number().int().min(0).optional(),
  criticalFindings: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

/**
 * Hazard validation schema
 */
export const HazardSchema = z.object({
  hazardNumber: z.string().min(1).max(50),
  hazardType: z.string().min(1).max(100),
  severity: z.nativeEnum(HazardSeverity),
  status: z.nativeEnum(HazardStatus).default(HazardStatus.IDENTIFIED),
  identifiedDate: z.coerce.date(),
  identifiedBy: z.string().uuid(),
  location: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  riskAssessment: z.string().max(2000).optional(),
  mitigationPlan: z.string().max(2000).optional(),
  mitigationCost: z.number().min(0).optional(),
  responsibleParty: z.string().uuid().optional(),
  targetCompletionDate: z.coerce.date().optional(),
  photoUrls: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * PPE issuance validation schema
 */
export const PPEIssuanceSchema = z.object({
  employeeId: z.string().uuid(),
  ppeType: z.nativeEnum(PPEType),
  itemDescription: z.string().min(1).max(255),
  manufacturer: z.string().max(100).optional(),
  modelNumber: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  issuedDate: z.coerce.date(),
  issuedBy: z.string().uuid(),
  expiryDate: z.coerce.date().optional(),
  size: z.string().max(20).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Workers' comp claim validation schema
 */
export const WorkersCompClaimSchema = z.object({
  claimNumber: z.string().min(1).max(50),
  employeeId: z.string().uuid(),
  incidentId: z.string().uuid().optional(),
  injuryDate: z.coerce.date(),
  reportedDate: z.coerce.date(),
  injuryType: z.string().min(1).max(100),
  bodyPart: z.string().min(1).max(100),
  status: z.nativeEnum(WorkersCompStatus).default(WorkersCompStatus.REPORTED),
  carrierClaimNumber: z.string().max(100).optional(),
  estimatedCost: z.number().min(0).optional(),
  medicalProvider: z.string().max(255).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Return to work plan validation schema
 */
export const ReturnToWorkPlanSchema = z.object({
  employeeId: z.string().uuid(),
  claimId: z.string().uuid().optional(),
  status: z.nativeEnum(ReturnToWorkStatus).default(ReturnToWorkStatus.NOT_STARTED),
  injuryDate: z.coerce.date(),
  expectedReturnDate: z.coerce.date().optional(),
  restrictions: z.array(z.string()).optional(),
  modifiedDuties: z.array(z.string()).optional(),
  accommodations: z.array(z.string()).optional(),
  medicalClearance: z.boolean().optional(),
  medicalProvider: z.string().max(255).optional(),
  coordinator: z.string().uuid(),
});

/**
 * Health surveillance validation schema
 */
export const HealthSurveillanceSchema = z.object({
  employeeId: z.string().uuid(),
  surveillanceType: z.nativeEnum(HealthSurveillanceType),
  scheduledDate: z.coerce.date(),
  completedDate: z.coerce.date().optional(),
  provider: z.string().max(255).optional(),
  result: z.string().max(500).optional(),
  restrictions: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  nextDueDate: z.coerce.date().optional(),
  certificateUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

/**
 * Safety certification validation schema
 */
export const SafetyCertificationSchema = z.object({
  employeeId: z.string().uuid(),
  certificationName: z.string().min(1).max(255),
  certificationBody: z.string().min(1).max(255),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  status: z.nativeEnum(CertificationStatus).default(CertificationStatus.VALID),
  certificateNumber: z.string().max(100).optional(),
  certificateUrl: z.string().url().optional(),
  instructor: z.string().max(255).optional(),
  score: z.number().min(0).max(100).optional(),
  renewalRequired: z.boolean().default(true),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Incident Report Model
 */
@Table({
  tableName: 'incident_reports',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['incident_number'], unique: true },
    { fields: ['incident_type'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['employee_id'] },
    { fields: ['incident_date'] },
    { fields: ['osha_recordable'] },
  ],
})
export class IncidentReportModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'incident_number',
  })
  incidentNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentType)),
    allowNull: false,
    field: 'incident_type',
  })
  incidentType: IncidentType;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentSeverity)),
    allowNull: false,
  })
  severity: IncidentSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentStatus)),
    allowNull: false,
    defaultValue: IncidentStatus.REPORTED,
  })
  status: IncidentStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'incident_date',
  })
  incidentDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'reported_date',
  })
  reportedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'reported_by',
  })
  reportedBy: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'immediate_cause',
  })
  immediateCause: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'root_cause',
  })
  rootCause: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'witness_names',
  })
  witnessNames: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'injury_details',
  })
  injuryDetails: Record<string, any>;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'property_damage',
  })
  propertyDamage: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'work_days_lost',
  })
  workDaysLost: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'restricted_work_days',
  })
  restrictedWorkDays: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'osha_recordable',
  })
  oshaRecordable: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'investigation_notes',
  })
  investigationNotes: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'corrective_actions',
  })
  correctiveActions: string[];

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'investigated_by',
  })
  investigatedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'investigation_completed_date',
  })
  investigationCompletedDate: Date;

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
 * Safety Inspection Model
 */
@Table({
  tableName: 'safety_inspections',
  timestamps: true,
  indexes: [
    { fields: ['inspection_number'], unique: true },
    { fields: ['inspection_type'] },
    { fields: ['status'] },
    { fields: ['scheduled_date'] },
    { fields: ['inspector'] },
  ],
})
export class SafetyInspectionModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'inspection_number',
  })
  inspectionNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'inspection_type',
  })
  inspectionType: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_date',
  })
  scheduledDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inspector: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
    allowNull: false,
    defaultValue: InspectionStatus.SCHEDULED,
  })
  status: InspectionStatus;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  score: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'findings_count',
  })
  findingsCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'critical_findings',
  })
  criticalFindings: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @HasMany(() => InspectionFindingModel)
  findings: InspectionFindingModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Inspection Finding Model
 */
@Table({
  tableName: 'inspection_findings',
  timestamps: true,
  indexes: [
    { fields: ['inspection_id'] },
    { fields: ['severity'] },
    { fields: ['due_date'] },
  ],
})
export class InspectionFindingModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @ForeignKey(() => SafetyInspectionModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'inspection_id',
  })
  inspectionId: string;

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
    type: DataType.ENUM(...Object.values(HazardSeverity)),
    allowNull: false,
  })
  severity: HazardSeverity;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'photo_urls',
  })
  photoUrls: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'corrective_action',
  })
  correctiveAction: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'responsible_party',
  })
  responsibleParty: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @BelongsTo(() => SafetyInspectionModel)
  inspection: SafetyInspectionModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Hazard Model
 */
@Table({
  tableName: 'hazards',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['hazard_number'], unique: true },
    { fields: ['hazard_type'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['identified_date'] },
  ],
})
export class HazardModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'hazard_number',
  })
  hazardNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'hazard_type',
  })
  hazardType: string;

  @Column({
    type: DataType.ENUM(...Object.values(HazardSeverity)),
    allowNull: false,
  })
  severity: HazardSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(HazardStatus)),
    allowNull: false,
    defaultValue: HazardStatus.IDENTIFIED,
  })
  status: HazardStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'identified_date',
  })
  identifiedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'identified_by',
  })
  identifiedBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'risk_assessment',
  })
  riskAssessment: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'mitigation_plan',
  })
  mitigationPlan: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'mitigation_cost',
  })
  mitigationCost: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'responsible_party',
  })
  responsibleParty: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'target_completion_date',
  })
  targetCompletionDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'photo_urls',
  })
  photoUrls: string[];

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
 * PPE Issuance Model
 */
@Table({
  tableName: 'ppe_issuances',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['ppe_type'] },
    { fields: ['issued_date'] },
    { fields: ['expiry_date'] },
  ],
})
export class PPEIssuanceModel extends Model {
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
    type: DataType.ENUM(...Object.values(PPEType)),
    allowNull: false,
    field: 'ppe_type',
  })
  ppeType: PPEType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'item_description',
  })
  itemDescription: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  manufacturer: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'model_number',
  })
  modelNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'serial_number',
  })
  serialNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'issued_date',
  })
  issuedDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'issued_by',
  })
  issuedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'returned_date',
  })
  returnedDate: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  size: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  cost: number;

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
 * Workers' Compensation Claim Model
 */
@Table({
  tableName: 'workers_comp_claims',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['claim_number'], unique: true },
    { fields: ['employee_id'] },
    { fields: ['status'] },
    { fields: ['injury_date'] },
  ],
})
export class WorkersCompClaimModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'claim_number',
  })
  claimNumber: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'incident_id',
  })
  incidentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'injury_date',
  })
  injuryDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'reported_date',
  })
  reportedDate: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'injury_type',
  })
  injuryType: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'body_part',
  })
  bodyPart: string;

  @Column({
    type: DataType.ENUM(...Object.values(WorkersCompStatus)),
    allowNull: false,
    defaultValue: WorkersCompStatus.REPORTED,
  })
  status: WorkersCompStatus;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'carrier_claim_number',
  })
  carrierClaimNumber: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'estimated_cost',
  })
  estimatedCost: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'actual_cost',
  })
  actualCost: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'medical_provider',
  })
  medicalProvider: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'lost_work_days',
  })
  lostWorkDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'restricted_work_days',
  })
  restrictedWorkDays: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'settlement_amount',
  })
  settlementAmount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'closed_date',
  })
  closedDate: Date;

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

  @DeletedAt
  deletedAt: Date;
}

/**
 * Return to Work Plan Model
 */
@Table({
  tableName: 'return_to_work_plans',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['claim_id'] },
    { fields: ['status'] },
  ],
})
export class ReturnToWorkPlanModel extends Model {
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
    type: DataType.UUID,
    allowNull: true,
    field: 'claim_id',
  })
  claimId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReturnToWorkStatus)),
    allowNull: false,
    defaultValue: ReturnToWorkStatus.NOT_STARTED,
  })
  status: ReturnToWorkStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'injury_date',
  })
  injuryDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expected_return_date',
  })
  expectedReturnDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'actual_return_date',
  })
  actualReturnDate: Date;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  restrictions: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    field: 'modified_duties',
  })
  modifiedDuties: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  accommodations: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'medical_clearance',
  })
  medicalClearance: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'medical_provider',
  })
  medicalProvider: string;

  @Column({
    type: DataType.ARRAY(DataType.DATE),
    allowNull: true,
    field: 'follow_up_dates',
  })
  followUpDates: Date[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'progress_notes',
  })
  progressNotes: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  coordinator: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Health Surveillance Model
 */
@Table({
  tableName: 'health_surveillance',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['surveillance_type'] },
    { fields: ['scheduled_date'] },
    { fields: ['next_due_date'] },
  ],
})
export class HealthSurveillanceModel extends Model {
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
    type: DataType.ENUM(...Object.values(HealthSurveillanceType)),
    allowNull: false,
    field: 'surveillance_type',
  })
  surveillanceType: HealthSurveillanceType;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_date',
  })
  scheduledDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  provider: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  result: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  restrictions: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  recommendations: string[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'next_due_date',
  })
  nextDueDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'certificate_url',
  })
  certificateUrl: string;

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
 * Safety Certification Model
 */
@Table({
  tableName: 'safety_certifications',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['certification_name'] },
    { fields: ['status'] },
    { fields: ['expiry_date'] },
  ],
})
export class SafetyCertificationModel extends Model {
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
    field: 'certification_name',
  })
  certificationName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'certification_body',
  })
  certificationBody: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'issue_date',
  })
  issueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiry_date',
  })
  expiryDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CertificationStatus)),
    allowNull: false,
    defaultValue: CertificationStatus.VALID,
  })
  status: CertificationStatus;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'certificate_number',
  })
  certificateNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'certificate_url',
  })
  certificateUrl: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  instructor: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  score: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'renewal_required',
  })
  renewalRequired: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Emergency Drill Model
 */
@Table({
  tableName: 'emergency_drills',
  timestamps: true,
  indexes: [
    { fields: ['drill_type'] },
    { fields: ['scheduled_date'] },
    { fields: ['location'] },
  ],
})
export class EmergencyDrillModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(EmergencyType)),
    allowNull: false,
    field: 'drill_type',
  })
  drillType: EmergencyType;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_date',
  })
  scheduledDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'participant_count',
  })
  participantCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'duration_minutes',
  })
  durationMinutes: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  successful: boolean;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  findings: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  improvements: string[];

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'conducted_by',
  })
  conductedBy: string;

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
 * Safety Committee Meeting Model
 */
@Table({
  tableName: 'safety_committee_meetings',
  timestamps: true,
  indexes: [
    { fields: ['meeting_date'] },
    { fields: ['chairperson'] },
  ],
})
export class SafetyCommitteeMeetingModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'meeting_date',
  })
  meetingDate: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  attendees: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
  })
  agenda: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  minutes: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'action_items',
  })
  actionItems: ActionItem[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'next_meeting_date',
  })
  nextMeetingDate: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  chairperson: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// INCIDENT REPORTING FUNCTIONS
// ============================================================================

/**
 * Create incident report
 */
export async function createIncidentReport(
  reportData: Omit<IncidentReport, 'id'>,
  transaction?: Transaction,
): Promise<IncidentReportModel> {
  const validated = IncidentReportSchema.parse(reportData);
  const existing = await IncidentReportModel.findOne({
    where: { incidentNumber: validated.incidentNumber },
    transaction,
  });
  if (existing) {
    throw new ConflictException(`Incident ${validated.incidentNumber} already exists`);
  }
  return IncidentReportModel.create(validated as any, { transaction });
}

/**
 * Update incident report
 */
export async function updateIncidentReport(
  incidentId: string,
  updates: Partial<IncidentReport>,
  transaction?: Transaction,
): Promise<IncidentReportModel> {
  const incident = await IncidentReportModel.findByPk(incidentId, { transaction });
  if (!incident) {
    throw new NotFoundException(`Incident ${incidentId} not found`);
  }
  await incident.update(updates, { transaction });
  return incident;
}

/**
 * Get OSHA recordable incidents
 */
export async function getOSHARecordableIncidents(
  startDate?: Date,
  endDate?: Date,
): Promise<IncidentReportModel[]> {
  const where: WhereOptions = { oshaRecordable: true };
  if (startDate && endDate) {
    where.incidentDate = { [Op.between]: [startDate, endDate] };
  }
  return IncidentReportModel.findAll({
    where,
    order: [['incidentDate', 'DESC']],
  });
}

/**
 * Get near-miss incidents
 */
export async function getNearMissIncidents(limit?: number): Promise<IncidentReportModel[]> {
  return IncidentReportModel.findAll({
    where: { severity: IncidentSeverity.NEAR_MISS },
    limit,
    order: [['incidentDate', 'DESC']],
  });
}

/**
 * Close incident
 */
export async function closeIncident(
  incidentId: string,
  transaction?: Transaction,
): Promise<void> {
  await updateIncidentReport(incidentId, {
    status: IncidentStatus.CLOSED,
    closedDate: new Date(),
  }, transaction);
}

// ============================================================================
// SAFETY INSPECTION FUNCTIONS
// ============================================================================

/**
 * Create safety inspection
 */
export async function createSafetyInspection(
  inspectionData: Omit<SafetyInspection, 'id'>,
  transaction?: Transaction,
): Promise<SafetyInspectionModel> {
  const validated = SafetyInspectionSchema.parse(inspectionData);
  return SafetyInspectionModel.create(validated as any, { transaction });
}

/**
 * Complete safety inspection
 */
export async function completeSafetyInspection(
  inspectionId: string,
  score: number,
  findings: InspectionFinding[],
  transaction?: Transaction,
): Promise<void> {
  const inspection = await SafetyInspectionModel.findByPk(inspectionId, { transaction });
  if (!inspection) {
    throw new NotFoundException(`Inspection ${inspectionId} not found`);
  }

  const criticalCount = findings.filter(f => f.severity === HazardSeverity.IMMINENT_DANGER).length;
  const passed = score >= 70 && criticalCount === 0;

  await inspection.update({
    completedDate: new Date(),
    status: passed ? InspectionStatus.PASSED : InspectionStatus.FAILED,
    score,
    findingsCount: findings.length,
    criticalFindings: criticalCount,
  }, { transaction });

  // Create findings
  for (const finding of findings) {
    await InspectionFindingModel.create({
      inspectionId,
      ...finding,
    } as any, { transaction });
  }
}

/**
 * Get upcoming inspections
 */
export async function getUpcomingInspections(daysAhead: number = 30): Promise<SafetyInspectionModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return SafetyInspectionModel.findAll({
    where: {
      scheduledDate: { [Op.between]: [new Date(), futureDate] },
      status: InspectionStatus.SCHEDULED,
    },
    order: [['scheduledDate', 'ASC']],
  });
}

/**
 * Get failed inspections
 */
export async function getFailedInspections(): Promise<SafetyInspectionModel[]> {
  return SafetyInspectionModel.findAll({
    where: { status: InspectionStatus.FAILED },
    order: [['completedDate', 'DESC']],
  });
}

// ============================================================================
// HAZARD MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create hazard
 */
export async function createHazard(
  hazardData: Omit<Hazard, 'id'>,
  transaction?: Transaction,
): Promise<HazardModel> {
  const validated = HazardSchema.parse(hazardData);
  return HazardModel.create(validated as any, { transaction });
}

/**
 * Update hazard status
 */
export async function updateHazardStatus(
  hazardId: string,
  status: HazardStatus,
  transaction?: Transaction,
): Promise<void> {
  const hazard = await HazardModel.findByPk(hazardId, { transaction });
  if (!hazard) {
    throw new NotFoundException(`Hazard ${hazardId} not found`);
  }

  const updates: any = { status };
  if (status === HazardStatus.MITIGATED) {
    updates.completedDate = new Date();
  }

  await hazard.update(updates, { transaction });
}

/**
 * Get open hazards
 */
export async function getOpenHazards(severity?: HazardSeverity): Promise<HazardModel[]> {
  const where: WhereOptions = {
    status: { [Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
  };
  if (severity) {
    where.severity = severity;
  }
  return HazardModel.findAll({
    where,
    order: [['severity', 'DESC'], ['identifiedDate', 'DESC']],
  });
}

/**
 * Get imminent danger hazards
 */
export async function getImminentDangerHazards(): Promise<HazardModel[]> {
  return HazardModel.findAll({
    where: {
      severity: HazardSeverity.IMMINENT_DANGER,
      status: { [Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
    },
    order: [['identifiedDate', 'DESC']],
  });
}

// ============================================================================
// PPE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Issue PPE to employee
 */
export async function issuePPE(
  ppeData: Omit<PPEIssuance, 'id'>,
  transaction?: Transaction,
): Promise<PPEIssuanceModel> {
  const validated = PPEIssuanceSchema.parse(ppeData);
  return PPEIssuanceModel.create(validated as any, { transaction });
}

/**
 * Return PPE
 */
export async function returnPPE(
  ppeId: string,
  transaction?: Transaction,
): Promise<void> {
  const ppe = await PPEIssuanceModel.findByPk(ppeId, { transaction });
  if (!ppe) {
    throw new NotFoundException(`PPE issuance ${ppeId} not found`);
  }
  await ppe.update({ returnedDate: new Date() }, { transaction });
}

/**
 * Get employee PPE
 */
export async function getEmployeePPE(employeeId: string): Promise<PPEIssuanceModel[]> {
  return PPEIssuanceModel.findAll({
    where: {
      employeeId,
      returnedDate: null,
    },
    order: [['issuedDate', 'DESC']],
  });
}

/**
 * Get expiring PPE
 */
export async function getExpiringPPE(daysAhead: number = 30): Promise<PPEIssuanceModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return PPEIssuanceModel.findAll({
    where: {
      expiryDate: { [Op.between]: [new Date(), futureDate] },
      returnedDate: null,
    },
    order: [['expiryDate', 'ASC']],
  });
}

// ============================================================================
// WORKERS' COMPENSATION FUNCTIONS
// ============================================================================

/**
 * Create workers' comp claim
 */
export async function createWorkersCompClaim(
  claimData: Omit<WorkersCompClaim, 'id'>,
  transaction?: Transaction,
): Promise<WorkersCompClaimModel> {
  const validated = WorkersCompClaimSchema.parse(claimData);
  return WorkersCompClaimModel.create(validated as any, { transaction });
}

/**
 * Update claim status
 */
export async function updateClaimStatus(
  claimId: string,
  status: WorkersCompStatus,
  transaction?: Transaction,
): Promise<void> {
  const claim = await WorkersCompClaimModel.findByPk(claimId, { transaction });
  if (!claim) {
    throw new NotFoundException(`Claim ${claimId} not found`);
  }

  const updates: any = { status };
  if (status === WorkersCompStatus.CLOSED) {
    updates.closedDate = new Date();
  }

  await claim.update(updates, { transaction });
}

/**
 * Get open claims
 */
export async function getOpenClaims(): Promise<WorkersCompClaimModel[]> {
  return WorkersCompClaimModel.findAll({
    where: { status: { [Op.ne]: WorkersCompStatus.CLOSED } },
    order: [['injuryDate', 'DESC']],
  });
}

/**
 * Calculate total claim costs
 */
export async function calculateTotalClaimCosts(
  startDate?: Date,
  endDate?: Date,
): Promise<number> {
  const where: WhereOptions = {};
  if (startDate && endDate) {
    where.injuryDate = { [Op.between]: [startDate, endDate] };
  }

  const claims = await WorkersCompClaimModel.findAll({ where });
  return claims.reduce((sum, claim) => sum + (claim.actualCost || claim.estimatedCost || 0), 0);
}

// ============================================================================
// RETURN TO WORK FUNCTIONS
// ============================================================================

/**
 * Create return to work plan
 */
export async function createReturnToWorkPlan(
  planData: Omit<ReturnToWorkPlan, 'id'>,
  transaction?: Transaction,
): Promise<ReturnToWorkPlanModel> {
  const validated = ReturnToWorkPlanSchema.parse(planData);
  return ReturnToWorkPlanModel.create(validated as any, { transaction });
}

/**
 * Update RTW plan status
 */
export async function updateRTWPlanStatus(
  planId: string,
  status: ReturnToWorkStatus,
  transaction?: Transaction,
): Promise<void> {
  const plan = await ReturnToWorkPlanModel.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`RTW plan ${planId} not found`);
  }

  const updates: any = { status };
  if (status === ReturnToWorkStatus.FULL_DUTY_RETURNED) {
    updates.actualReturnDate = new Date();
  }

  await plan.update(updates, { transaction });
}

/**
 * Get active RTW plans
 */
export async function getActiveRTWPlans(): Promise<ReturnToWorkPlanModel[]> {
  return ReturnToWorkPlanModel.findAll({
    where: {
      status: {
        [Op.notIn]: [ReturnToWorkStatus.FULL_DUTY_RETURNED, ReturnToWorkStatus.UNABLE_TO_RETURN],
      },
    },
    order: [['expectedReturnDate', 'ASC']],
  });
}

// ============================================================================
// HEALTH SURVEILLANCE FUNCTIONS
// ============================================================================

/**
 * Schedule health surveillance
 */
export async function scheduleHealthSurveillance(
  surveillanceData: Omit<HealthSurveillance, 'id'>,
  transaction?: Transaction,
): Promise<HealthSurveillanceModel> {
  const validated = HealthSurveillanceSchema.parse(surveillanceData);
  return HealthSurveillanceModel.create(validated as any, { transaction });
}

/**
 * Complete health surveillance
 */
export async function completeHealthSurveillance(
  surveillanceId: string,
  result: string,
  nextDueDate?: Date,
  transaction?: Transaction,
): Promise<void> {
  const surveillance = await HealthSurveillanceModel.findByPk(surveillanceId, { transaction });
  if (!surveillance) {
    throw new NotFoundException(`Surveillance ${surveillanceId} not found`);
  }
  await surveillance.update({
    completedDate: new Date(),
    result,
    nextDueDate,
  }, { transaction });
}

/**
 * Get due health surveillance
 */
export async function getDueHealthSurveillance(): Promise<HealthSurveillanceModel[]> {
  return HealthSurveillanceModel.findAll({
    where: {
      scheduledDate: { [Op.lte]: new Date() },
      completedDate: null,
    },
    order: [['scheduledDate', 'ASC']],
  });
}

// ============================================================================
// SAFETY CERTIFICATION FUNCTIONS
// ============================================================================

/**
 * Record safety certification
 */
export async function recordSafetyCertification(
  certData: Omit<SafetyCertification, 'id'>,
  transaction?: Transaction,
): Promise<SafetyCertificationModel> {
  const validated = SafetyCertificationSchema.parse(certData);
  return SafetyCertificationModel.create(validated as any, { transaction });
}

/**
 * Get expiring certifications
 */
export async function getExpiringCertifications(daysAhead: number = 60): Promise<SafetyCertificationModel[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return SafetyCertificationModel.findAll({
    where: {
      expiryDate: { [Op.between]: [new Date(), futureDate] },
      status: CertificationStatus.VALID,
    },
    order: [['expiryDate', 'ASC']],
  });
}

/**
 * Get employee certifications
 */
export async function getEmployeeCertifications(
  employeeId: string,
): Promise<SafetyCertificationModel[]> {
  return SafetyCertificationModel.findAll({
    where: { employeeId },
    order: [['issueDate', 'DESC']],
  });
}

// ============================================================================
// EMERGENCY PREPAREDNESS FUNCTIONS
// ============================================================================

/**
 * Schedule emergency drill
 */
export async function scheduleEmergencyDrill(
  drillData: Omit<EmergencyDrill, 'id'>,
  transaction?: Transaction,
): Promise<EmergencyDrillModel> {
  return EmergencyDrillModel.create(drillData as any, { transaction });
}

/**
 * Complete emergency drill
 */
export async function completeEmergencyDrill(
  drillId: string,
  participantCount: number,
  durationMinutes: number,
  successful: boolean,
  findings?: string[],
  transaction?: Transaction,
): Promise<void> {
  const drill = await EmergencyDrillModel.findByPk(drillId, { transaction });
  if (!drill) {
    throw new NotFoundException(`Drill ${drillId} not found`);
  }
  await drill.update({
    completedDate: new Date(),
    participantCount,
    durationMinutes,
    successful,
    findings,
  }, { transaction });
}

/**
 * Get upcoming drills
 */
export async function getUpcomingDrills(): Promise<EmergencyDrillModel[]> {
  return EmergencyDrillModel.findAll({
    where: {
      scheduledDate: { [Op.gte]: new Date() },
      completedDate: null,
    },
    order: [['scheduledDate', 'ASC']],
  });
}

// ============================================================================
// SAFETY COMMITTEE FUNCTIONS
// ============================================================================

/**
 * Create safety committee meeting
 */
export async function createSafetyCommitteeMeeting(
  meetingData: Omit<SafetyCommitteeMeeting, 'id'>,
  transaction?: Transaction,
): Promise<SafetyCommitteeMeetingModel> {
  return SafetyCommitteeMeetingModel.create(meetingData as any, { transaction });
}

/**
 * Get recent committee meetings
 */
export async function getRecentCommitteeMeetings(limit: number = 10): Promise<SafetyCommitteeMeetingModel[]> {
  return SafetyCommitteeMeetingModel.findAll({
    limit,
    order: [['meetingDate', 'DESC']],
  });
}

// ============================================================================
// SAFETY ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Calculate incident rate
 */
export function calculateIncidentRate(
  incidents: number,
  hoursWorked: number,
): number {
  return (incidents * 200000) / hoursWorked;
}

/**
 * Calculate DART rate (Days Away, Restricted, or Transferred)
 */
export function calculateDARTRate(
  dartCases: number,
  hoursWorked: number,
): number {
  return (dartCases * 200000) / hoursWorked;
}

/**
 * Get safety dashboard metrics
 */
export async function getSafetyDashboardMetrics(): Promise<{
  openIncidents: number;
  oshaRecordable: number;
  openHazards: number;
  imminentDangers: number;
  openClaims: number;
  activeRTWPlans: number;
  upcomingInspections: number;
  expiringCertifications: number;
}> {
  const [
    openIncidents,
    oshaRecordable,
    openHazards,
    imminentDangers,
    openClaims,
    activeRTWPlans,
    upcomingInspections,
    expiringCertifications,
  ] = await Promise.all([
    IncidentReportModel.count({ where: { status: { [Op.ne]: IncidentStatus.CLOSED } } }),
    IncidentReportModel.count({ where: { oshaRecordable: true } }),
    HazardModel.count({
      where: { status: { [Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] } },
    }),
    HazardModel.count({
      where: {
        severity: HazardSeverity.IMMINENT_DANGER,
        status: { [Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
      },
    }),
    WorkersCompClaimModel.count({ where: { status: { [Op.ne]: WorkersCompStatus.CLOSED } } }),
    ReturnToWorkPlanModel.count({
      where: {
        status: {
          [Op.notIn]: [ReturnToWorkStatus.FULL_DUTY_RETURNED, ReturnToWorkStatus.UNABLE_TO_RETURN],
        },
      },
    }),
    SafetyInspectionModel.count({
      where: {
        scheduledDate: { [Op.gte]: new Date() },
        status: InspectionStatus.SCHEDULED,
      },
    }),
    SafetyCertificationModel.count({
      where: {
        expiryDate: { [Op.lte]: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
        status: CertificationStatus.VALID,
      },
    }),
  ]);

  return {
    openIncidents,
    oshaRecordable,
    openHazards,
    imminentDangers,
    openClaims,
    activeRTWPlans,
    upcomingInspections,
    expiringCertifications,
  };
}

/**
 * Get incident by number
 */
export async function getIncidentByNumber(incidentNumber: string): Promise<IncidentReportModel | null> {
  return IncidentReportModel.findOne({
    where: { incidentNumber },
  });
}

/**
 * Get claim by number
 */
export async function getClaimByNumber(claimNumber: string): Promise<WorkersCompClaimModel | null> {
  return WorkersCompClaimModel.findOne({
    where: { claimNumber },
  });
}

/**
 * Get hazard by number
 */
export async function getHazardByNumber(hazardNumber: string): Promise<HazardModel | null> {
  return HazardModel.findOne({
    where: { hazardNumber },
  });
}

/**
 * Get inspection by number
 */
export async function getInspectionByNumber(inspectionNumber: string): Promise<SafetyInspectionModel | null> {
  return SafetyInspectionModel.findOne({
    where: { inspectionNumber },
    include: [{ model: InspectionFindingModel, as: 'findings' }],
  });
}

/**
 * Get employee incident history
 */
export async function getEmployeeIncidentHistory(employeeId: string): Promise<IncidentReportModel[]> {
  return IncidentReportModel.findAll({
    where: { employeeId },
    order: [['incidentDate', 'DESC']],
  });
}

/**
 * Get employee claims
 */
export async function getEmployeeClaims(employeeId: string): Promise<WorkersCompClaimModel[]> {
  return WorkersCompClaimModel.findAll({
    where: { employeeId },
    order: [['injuryDate', 'DESC']],
  });
}

/**
 * Generate OSHA 300 log data for reporting year
 */
export async function generateOSHA300Log(year: number): Promise<{
  year: number;
  incidents: IncidentReportModel[];
  totalRecordable: number;
  daysAwayFromWork: number;
  daysOfRestrictedWork: number;
  totalDeaths: number;
}> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const incidents = await IncidentReportModel.findAll({
    where: {
      oshaRecordable: true,
      incidentDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['incidentDate', 'ASC']],
  });

  const totalDeaths = incidents.filter(i => i.severity === IncidentSeverity.FATAL).length;
  const daysAwayFromWork = incidents.reduce((sum, i) => sum + (i.workDaysLost || 0), 0);
  const daysOfRestrictedWork = incidents.reduce((sum, i) => sum + (i.restrictedWorkDays || 0), 0);

  return {
    year,
    incidents,
    totalRecordable: incidents.length,
    daysAwayFromWork,
    daysOfRestrictedWork,
    totalDeaths,
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class SafetyHealthService {
  async createIncident(data: Omit<IncidentReport, 'id'>): Promise<IncidentReportModel> {
    return createIncidentReport(data);
  }

  async createInspection(data: Omit<SafetyInspection, 'id'>): Promise<SafetyInspectionModel> {
    return createSafetyInspection(data);
  }

  async createHazard(data: Omit<Hazard, 'id'>): Promise<HazardModel> {
    return createHazard(data);
  }

  async issuePPE(data: Omit<PPEIssuance, 'id'>): Promise<PPEIssuanceModel> {
    return issuePPE(data);
  }

  async createClaim(data: Omit<WorkersCompClaim, 'id'>): Promise<WorkersCompClaimModel> {
    return createWorkersCompClaim(data);
  }

  async getDashboard() {
    return getSafetyDashboardMetrics();
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Safety & Health')
@Controller('safety-health')
@ApiBearerAuth()
export class SafetyHealthController {
  constructor(private readonly safetyService: SafetyHealthService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get safety dashboard metrics' })
  async getDashboard() {
    return this.safetyService.getDashboard();
  }

  @Post('incidents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create incident report' })
  async createIncident(@Body() data: Omit<IncidentReport, 'id'>) {
    return this.safetyService.createIncident(data);
  }

  @Post('hazards')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create hazard report' })
  async createHazard(@Body() data: Omit<Hazard, 'id'>) {
    return this.safetyService.createHazard(data);
  }

  @Post('claims')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create workers comp claim' })
  async createClaim(@Body() data: Omit<WorkersCompClaim, 'id'>) {
    return this.safetyService.createClaim(data);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  IncidentReportModel,
  SafetyInspectionModel,
  InspectionFindingModel,
  HazardModel,
  PPEIssuanceModel,
  WorkersCompClaimModel,
  ReturnToWorkPlanModel,
  HealthSurveillanceModel,
  SafetyCertificationModel,
  EmergencyDrillModel,
  SafetyCommitteeMeetingModel,
  SafetyHealthService,
  SafetyHealthController,
};
