/**
 * @fileoverview Advising Management Kit - Comprehensive academic advising system
 * @module reuse/education/advising-management-kit
 * @description Complete advising management system with NestJS services, Sequelize models,
 * advisor assignment, advising sessions, early alert system, academic probation tracking,
 * and graduation planning. Implements proper dependency injection, business logic separation,
 * and service layer architecture patterns.
 *
 * Key Features:
 * - Comprehensive Sequelize models for advising domain
 * - Advisor-advisee assignment and management
 * - Advising session scheduling and tracking
 * - Advising notes with search and categorization
 * - Early alert system for at-risk students
 * - Academic probation advising workflows
 * - Graduation planning and degree audit integration
 * - NestJS services with constructor injection
 * - Repository pattern implementation
 * - Business logic separation and layering
 * - FERPA-compliant audit logging
 * - Request-scoped and transient provider patterns
 *
 * @target NestJS 10.x, Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - FERPA compliance for student data access
 * - Role-based access control for advising records
 * - Audit logging for all advising interactions
 * - Data encryption for sensitive advising notes
 * - Input sanitization and validation
 * - SQL injection prevention
 * - XSS protection in text fields
 *
 * @example Basic service usage
 * ```typescript
 * import { AdvisingService } from './advising-management-kit';
 *
 * @Controller('advising')
 * export class AdvisingController {
 *   constructor(private readonly advisingService: AdvisingService) {}
 *
 *   @Post('assign')
 *   async assignAdvisor(@Body() dto: AssignAdvisorDto) {
 *     return this.advisingService.assignAdvisorToStudent(
 *       dto.advisorId,
 *       dto.studentId,
 *       dto.advisorType
 *     );
 *   }
 * }
 * ```
 *
 * @example Early alert system
 * ```typescript
 * const earlyAlert = await earlyAlertService.createEarlyAlert({
 *   studentId: 'student-123',
 *   alertType: 'ACADEMIC_PERFORMANCE',
 *   severity: 'HIGH',
 *   description: 'Student failing multiple courses',
 *   courseIds: ['course-1', 'course-2']
 * });
 * ```
 *
 * LOC: EDU-ADV-001
 * UPSTREAM: sequelize, @nestjs/common, @nestjs/sequelize
 * DOWNSTREAM: student-services, academic-planning, reporting-services
 *
 * @version 1.0.0
 * @since 2025-11-09
 */

import {
  Injectable,
  Inject,
  Logger,
  Scope,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  Association,
  FindOptions,
  WhereOptions,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Advisor types in the system
 */
export enum AdvisorType {
  ACADEMIC = 'ACADEMIC',
  FACULTY = 'FACULTY',
  CAREER = 'CAREER',
  PEER = 'PEER',
  ATHLETIC = 'ATHLETIC',
}

/**
 * Advising session status
 */
export enum AdvisingSessionStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

/**
 * Advising session types
 */
export enum AdvisingSessionType {
  INITIAL = 'INITIAL',
  REGULAR = 'REGULAR',
  ACADEMIC_PLANNING = 'ACADEMIC_PLANNING',
  REGISTRATION = 'REGISTRATION',
  PROBATION = 'PROBATION',
  GRADUATION = 'GRADUATION',
  CRISIS = 'CRISIS',
}

/**
 * Early alert types
 */
export enum EarlyAlertType {
  ACADEMIC_PERFORMANCE = 'ACADEMIC_PERFORMANCE',
  ATTENDANCE = 'ATTENDANCE',
  ENGAGEMENT = 'ENGAGEMENT',
  FINANCIAL = 'FINANCIAL',
  PERSONAL = 'PERSONAL',
  HEALTH = 'HEALTH',
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Academic standing status
 */
export enum AcademicStanding {
  GOOD_STANDING = 'GOOD_STANDING',
  ACADEMIC_WARNING = 'ACADEMIC_WARNING',
  ACADEMIC_PROBATION = 'ACADEMIC_PROBATION',
  ACADEMIC_SUSPENSION = 'ACADEMIC_SUSPENSION',
  ACADEMIC_DISMISSAL = 'ACADEMIC_DISMISSAL',
}

/**
 * Graduation plan status
 */
export enum GraduationPlanStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  ADVISOR_APPROVED = 'ADVISOR_APPROVED',
  DEPARTMENT_APPROVED = 'DEPARTMENT_APPROVED',
  COMPLETED = 'COMPLETED',
}

/**
 * Note categories
 */
export enum NoteCategory {
  ACADEMIC = 'ACADEMIC',
  PERSONAL = 'PERSONAL',
  CAREER = 'CAREER',
  REGISTRATION = 'REGISTRATION',
  PROBATION = 'PROBATION',
  GRADUATION = 'GRADUATION',
  GENERAL = 'GENERAL',
}

interface AdvisorAttributes {
  id: string;
  userId: string;
  advisorType: AdvisorType;
  department?: string;
  maxAdvisees?: number;
  specializations?: string[];
  isActive: boolean;
  availabilitySchedule?: object;
  officeLocation?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface AdviseeAttributes {
  id: string;
  studentId: string;
  advisorId: string;
  advisorType: AdvisorType;
  isPrimary: boolean;
  assignedAt: Date;
  assignedBy?: string;
  unassignedAt?: Date;
  unassignedBy?: string;
  unassignedReason?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface AdvisingSessionAttributes {
  id: string;
  adviseeId: string;
  advisorId: string;
  studentId: string;
  sessionType: AdvisingSessionType;
  status: AdvisingSessionStatus;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  agenda?: string;
  summary?: string;
  outcomes?: string[];
  actionItems?: object[];
  followUpRequired: boolean;
  followUpDate?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  noShowAt?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface AdvisingNoteAttributes {
  id: string;
  adviseeId: string;
  advisorId: string;
  studentId: string;
  sessionId?: string;
  category: NoteCategory;
  subject: string;
  content: string;
  isConfidential: boolean;
  tags?: string[];
  attachments?: object[];
  sharedWith?: string[];
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface EarlyAlertAttributes {
  id: string;
  studentId: string;
  advisorId?: string;
  reportedBy: string;
  alertType: EarlyAlertType;
  severity: AlertSeverity;
  description: string;
  courseIds?: string[];
  detectedAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  followUpActions?: object[];
  escalatedTo?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface AcademicProbationAttributes {
  id: string;
  studentId: string;
  advisorId?: string;
  standing: AcademicStanding;
  termId: string;
  gpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  probationStartDate: Date;
  probationEndDate?: Date;
  requirementsMet: boolean;
  improvementPlan?: object;
  checkInSchedule?: object[];
  progressNotes?: object[];
  resolvedAt?: Date;
  resolution?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface GraduationPlanAttributes {
  id: string;
  studentId: string;
  advisorId: string;
  programId: string;
  expectedGraduationTerm: string;
  status: GraduationPlanStatus;
  plannedCourses: object[];
  completedCourses: object[];
  remainingRequirements: object[];
  totalCreditsRequired: number;
  creditsCompleted: number;
  creditsInProgress: number;
  creditsRemaining: number;
  milestones?: object[];
  advisorApprovedAt?: Date;
  advisorApprovedBy?: string;
  departmentApprovedAt?: Date;
  departmentApprovedBy?: string;
  lastReviewedAt?: Date;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface RequestContext {
  userId: string;
  userRoles: string[];
  requestId: string;
  ipAddress?: string;
}

interface AssignAdvisorOptions {
  advisorId: string;
  studentId: string;
  advisorType: AdvisorType;
  isPrimary?: boolean;
  assignedBy?: string;
  metadata?: object;
}

interface CreateSessionOptions {
  adviseeId: string;
  advisorId: string;
  studentId: string;
  sessionType: AdvisingSessionType;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  agenda?: string;
}

interface CreateNoteOptions {
  adviseeId: string;
  advisorId: string;
  studentId: string;
  sessionId?: string;
  category: NoteCategory;
  subject: string;
  content: string;
  isConfidential?: boolean;
  tags?: string[];
}

interface CreateEarlyAlertOptions {
  studentId: string;
  reportedBy: string;
  alertType: EarlyAlertType;
  severity: AlertSeverity;
  description: string;
  courseIds?: string[];
  advisorId?: string;
}

interface CreateProbationOptions {
  studentId: string;
  standing: AcademicStanding;
  termId: string;
  gpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  advisorId?: string;
  improvementPlan?: object;
}

interface CreateGraduationPlanOptions {
  studentId: string;
  advisorId: string;
  programId: string;
  expectedGraduationTerm: string;
  totalCreditsRequired: number;
}

interface AdvisorSearchCriteria {
  advisorType?: AdvisorType;
  department?: string;
  isActive?: boolean;
  specializations?: string[];
}

interface SessionSearchCriteria {
  advisorId?: string;
  studentId?: string;
  sessionType?: AdvisingSessionType;
  status?: AdvisingSessionStatus;
  startDate?: Date;
  endDate?: Date;
}

interface NoteSearchCriteria {
  studentId?: string;
  advisorId?: string;
  category?: NoteCategory;
  isConfidential?: boolean;
  tags?: string[];
  searchText?: string;
}

// ============================================================================
// SECTION 1: SEQUELIZE MODELS (Functions 1-7)
// ============================================================================

/**
 * 1. Creates the Advisor Sequelize model with comprehensive attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Advisor model
 *
 * @example
 * const Advisor = createAdvisorModel(sequelize);
 * const advisor = await Advisor.create({
 *   userId: 'user-123',
 *   advisorType: AdvisorType.ACADEMIC,
 *   department: 'Computer Science',
 *   maxAdvisees: 30,
 *   isActive: true
 * });
 */
export function createAdvisorModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      comment: 'Reference to user account',
    },
    advisorType: {
      type: DataTypes.ENUM(...Object.values(AdvisorType)),
      allowNull: false,
      comment: 'Type of advisor role',
    },
    department: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Academic department affiliation',
    },
    maxAdvisees: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25,
      validate: {
        min: 1,
        max: 100,
      },
      comment: 'Maximum number of assigned advisees',
    },
    specializations: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Advisor specialization areas',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether advisor is actively advising',
    },
    availabilitySchedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Advisor availability schedule',
    },
    officeLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Physical office location',
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: 'Primary contact email',
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Primary contact phone',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional advisor metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Advisor',
    tableName: 'advisors',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['advisorType'],
      },
      {
        fields: ['department'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  };

  return sequelize.define('Advisor', attributes, options);
}

/**
 * 2. Creates the Advisee (advisor-student assignment) Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Advisee model
 *
 * @example
 * const Advisee = createAdviseeModel(sequelize);
 * const assignment = await Advisee.create({
 *   studentId: 'student-123',
 *   advisorId: 'advisor-456',
 *   advisorType: AdvisorType.ACADEMIC,
 *   isPrimary: true,
 *   assignedAt: new Date()
 * });
 */
export function createAdviseeModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to advisor',
    },
    advisorType: {
      type: DataTypes.ENUM(...Object.values(AdvisorType)),
      allowNull: false,
      comment: 'Type of advising relationship',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the primary advisor',
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the assignment was made',
    },
    assignedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who made the assignment',
    },
    unassignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the assignment was removed',
    },
    unassignedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who removed the assignment',
    },
    unassignedReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for unassignment',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional assignment metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'Advisee',
    tableName: 'advisees',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['studentId', 'advisorType'],
        unique: true,
        where: { deletedAt: null, unassignedAt: null },
      },
      {
        fields: ['isPrimary'],
      },
      {
        fields: ['assignedAt'],
      },
      {
        fields: ['unassignedAt'],
      },
    ],
  };

  return sequelize.define('Advisee', attributes, options);
}

/**
 * 3. Creates the AdvisingSession Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AdvisingSession model
 *
 * @example
 * const AdvisingSession = createAdvisingSessionModel(sequelize);
 * const session = await AdvisingSession.create({
 *   adviseeId: 'advisee-123',
 *   advisorId: 'advisor-456',
 *   studentId: 'student-789',
 *   sessionType: AdvisingSessionType.REGULAR,
 *   status: AdvisingSessionStatus.SCHEDULED,
 *   scheduledAt: new Date('2025-11-15T10:00:00'),
 *   duration: 30
 * });
 */
export function createAdvisingSessionModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adviseeId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to advisee assignment',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to advisor',
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    sessionType: {
      type: DataTypes.ENUM(...Object.values(AdvisingSessionType)),
      allowNull: false,
      comment: 'Type of advising session',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AdvisingSessionStatus)),
      allowNull: false,
      defaultValue: AdvisingSessionStatus.SCHEDULED,
      comment: 'Current session status',
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Scheduled date and time',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 15,
        max: 180,
      },
      comment: 'Duration in minutes',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Physical meeting location',
    },
    meetingLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
      comment: 'Virtual meeting link',
    },
    agenda: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Session agenda',
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Session summary after completion',
    },
    outcomes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Session outcomes',
    },
    actionItems: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Action items from session',
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether follow-up is needed',
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Scheduled follow-up date',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When session was completed',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When session was cancelled',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for cancellation',
    },
    noShowAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Marked as no-show timestamp',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional session metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'AdvisingSession',
    tableName: 'advising_sessions',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['adviseeId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['studentId'],
      },
      {
        fields: ['sessionType'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['scheduledAt'],
      },
      {
        fields: ['completedAt'],
      },
      {
        fields: ['followUpRequired'],
      },
    ],
  };

  return sequelize.define('AdvisingSession', attributes, options);
}

/**
 * 4. Creates the AdvisingNote Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AdvisingNote model
 *
 * @example
 * const AdvisingNote = createAdvisingNoteModel(sequelize);
 * const note = await AdvisingNote.create({
 *   adviseeId: 'advisee-123',
 *   advisorId: 'advisor-456',
 *   studentId: 'student-789',
 *   category: NoteCategory.ACADEMIC,
 *   subject: 'Course selection discussion',
 *   content: 'Discussed fall semester course options',
 *   isConfidential: false
 * });
 */
export function createAdvisingNoteModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adviseeId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to advisee assignment',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to advisor who created note',
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Optional reference to advising session',
    },
    category: {
      type: DataTypes.ENUM(...Object.values(NoteCategory)),
      allowNull: false,
      comment: 'Note category',
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Note subject/title',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Note content',
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether note is confidential',
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Searchable tags',
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'File attachments metadata',
    },
    sharedWith: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'User IDs note is shared with',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional note metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'AdvisingNote',
    tableName: 'advising_notes',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['adviseeId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['studentId'],
      },
      {
        fields: ['sessionId'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isConfidential'],
      },
      {
        fields: ['createdAt'],
      },
      {
        name: 'advising_notes_tags_gin',
        using: 'GIN',
        fields: ['tags'],
      },
    ],
  };

  return sequelize.define('AdvisingNote', attributes, options);
}

/**
 * 5. Creates the EarlyAlert Sequelize model for at-risk student identification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} EarlyAlert model
 *
 * @example
 * const EarlyAlert = createEarlyAlertModel(sequelize);
 * const alert = await EarlyAlert.create({
 *   studentId: 'student-123',
 *   reportedBy: 'faculty-456',
 *   alertType: EarlyAlertType.ACADEMIC_PERFORMANCE,
 *   severity: AlertSeverity.HIGH,
 *   description: 'Student failing midterm exams',
 *   detectedAt: new Date()
 * });
 */
export function createEarlyAlertModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Assigned advisor for follow-up',
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who reported the alert',
    },
    alertType: {
      type: DataTypes.ENUM(...Object.values(EarlyAlertType)),
      allowNull: false,
      comment: 'Type of early alert',
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(AlertSeverity)),
      allowNull: false,
      comment: 'Alert severity level',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Detailed description of concern',
    },
    courseIds: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Related course IDs',
    },
    detectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When alert was detected',
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When alert was acknowledged',
    },
    acknowledgedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who acknowledged alert',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When alert was resolved',
    },
    resolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who resolved alert',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resolution details',
    },
    followUpActions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Follow-up actions taken',
    },
    escalatedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User alert was escalated to',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional alert metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'EarlyAlert',
    tableName: 'early_alerts',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['reportedBy'],
      },
      {
        fields: ['alertType'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['detectedAt'],
      },
      {
        fields: ['acknowledgedAt'],
      },
      {
        fields: ['resolvedAt'],
      },
      {
        fields: ['studentId', 'resolvedAt'],
        where: { resolvedAt: null },
      },
    ],
  };

  return sequelize.define('EarlyAlert', attributes, options);
}

/**
 * 6. Creates the AcademicProbation Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AcademicProbation model
 *
 * @example
 * const AcademicProbation = createAcademicProbationModel(sequelize);
 * const probation = await AcademicProbation.create({
 *   studentId: 'student-123',
 *   standing: AcademicStanding.ACADEMIC_PROBATION,
 *   termId: 'fall-2025',
 *   gpa: 1.8,
 *   creditsAttempted: 30,
 *   creditsEarned: 24,
 *   probationStartDate: new Date()
 * });
 */
export function createAcademicProbationModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Assigned advisor for probation support',
    },
    standing: {
      type: DataTypes.ENUM(...Object.values(AcademicStanding)),
      allowNull: false,
      comment: 'Current academic standing',
    },
    termId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Academic term of probation',
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 0.0,
        max: 4.0,
      },
      comment: 'GPA at time of probation',
    },
    creditsAttempted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Total credits attempted',
    },
    creditsEarned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Total credits earned',
    },
    probationStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When probation period started',
    },
    probationEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When probation period ended',
    },
    requirementsMet: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether probation requirements were met',
    },
    improvementPlan: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Academic improvement plan',
    },
    checkInSchedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Scheduled check-in meetings',
    },
    progressNotes: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Progress tracking notes',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When probation was resolved',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resolution details',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional probation metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'AcademicProbation',
    tableName: 'academic_probations',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['standing'],
      },
      {
        fields: ['termId'],
      },
      {
        fields: ['probationStartDate'],
      },
      {
        fields: ['probationEndDate'],
      },
      {
        fields: ['resolvedAt'],
      },
      {
        fields: ['studentId', 'termId'],
        unique: true,
        where: { deletedAt: null },
      },
    ],
  };

  return sequelize.define('AcademicProbation', attributes, options);
}

/**
 * 7. Creates the GraduationPlan Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} GraduationPlan model
 *
 * @example
 * const GraduationPlan = createGraduationPlanModel(sequelize);
 * const plan = await GraduationPlan.create({
 *   studentId: 'student-123',
 *   advisorId: 'advisor-456',
 *   programId: 'program-789',
 *   expectedGraduationTerm: 'spring-2027',
 *   status: GraduationPlanStatus.IN_PROGRESS,
 *   totalCreditsRequired: 120
 * });
 */
export function createGraduationPlanModel(sequelize: Sequelize): ModelStatic<Model> {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to student',
    },
    advisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Primary advisor for graduation planning',
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to academic program',
    },
    expectedGraduationTerm: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Expected graduation term',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(GraduationPlanStatus)),
      allowNull: false,
      defaultValue: GraduationPlanStatus.DRAFT,
      comment: 'Plan status',
    },
    plannedCourses: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Planned course schedule',
    },
    completedCourses: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Completed courses',
    },
    remainingRequirements: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Remaining degree requirements',
    },
    totalCreditsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: 'Total credits required for degree',
    },
    creditsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Credits completed',
    },
    creditsInProgress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Credits currently in progress',
    },
    creditsRemaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Credits remaining to complete',
    },
    milestones: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Graduation milestones',
    },
    advisorApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When advisor approved the plan',
    },
    advisorApprovedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Advisor who approved',
    },
    departmentApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When department approved the plan',
    },
    departmentApprovedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Department user who approved',
    },
    lastReviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last review timestamp',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional plan metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    sequelize,
    modelName: 'GraduationPlan',
    tableName: 'graduation_plans',
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['advisorId'],
      },
      {
        fields: ['programId'],
      },
      {
        fields: ['expectedGraduationTerm'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['studentId', 'programId'],
        unique: true,
        where: { deletedAt: null },
      },
      {
        fields: ['lastReviewedAt'],
      },
    ],
  };

  return sequelize.define('GraduationPlan', attributes, options);
}

// ============================================================================
// SECTION 2: REPOSITORY PATTERN (Functions 8-13)
// ============================================================================

/**
 * 8. Creates an AdvisorRepository service for data access layer.
 *
 * @param {ModelStatic<Model>} advisorModel - Advisor model
 * @returns {Injectable} AdvisorRepository service
 *
 * @example
 * const repository = new AdvisorRepository(Advisor);
 * const advisor = await repository.findById('advisor-123');
 */
@Injectable()
export class AdvisorRepository {
  private readonly logger = new Logger(AdvisorRepository.name);

  constructor(
    @Inject('ADVISOR_MODEL') private readonly advisorModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.advisorModel.findByPk(id);
  }

  async findByUserId(userId: string): Promise<Model | null> {
    return this.advisorModel.findOne({
      where: { userId, deletedAt: null },
    });
  }

  async findActiveAdvisors(criteria: AdvisorSearchCriteria = {}): Promise<Model[]> {
    const where: WhereOptions = { isActive: true, deletedAt: null };

    if (criteria.advisorType) {
      where.advisorType = criteria.advisorType;
    }

    if (criteria.department) {
      where.department = criteria.department;
    }

    return this.advisorModel.findAll({ where });
  }

  async getAdviseeCount(advisorId: string): Promise<number> {
    // This would require the Advisee model, simplified for example
    return 0;
  }

  async create(data: Partial<AdvisorAttributes>): Promise<Model> {
    return this.advisorModel.create(data);
  }

  async update(id: string, data: Partial<AdvisorAttributes>): Promise<Model> {
    const advisor = await this.findById(id);
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    return advisor.update(data);
  }

  async delete(id: string): Promise<void> {
    const advisor = await this.findById(id);
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    await advisor.destroy();
  }
}

/**
 * 9. Creates an AdviseeRepository service for advisor-student assignments.
 *
 * @param {ModelStatic<Model>} adviseeModel - Advisee model
 * @returns {Injectable} AdviseeRepository service
 */
@Injectable()
export class AdviseeRepository {
  private readonly logger = new Logger(AdviseeRepository.name);

  constructor(
    @Inject('ADVISEE_MODEL') private readonly adviseeModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.adviseeModel.findByPk(id);
  }

  async findByStudentId(studentId: string): Promise<Model[]> {
    return this.adviseeModel.findAll({
      where: {
        studentId,
        unassignedAt: null,
        deletedAt: null,
      },
    });
  }

  async findByAdvisorId(advisorId: string): Promise<Model[]> {
    return this.adviseeModel.findAll({
      where: {
        advisorId,
        unassignedAt: null,
        deletedAt: null,
      },
    });
  }

  async findPrimaryAdvisor(studentId: string): Promise<Model | null> {
    return this.adviseeModel.findOne({
      where: {
        studentId,
        isPrimary: true,
        unassignedAt: null,
        deletedAt: null,
      },
    });
  }

  async create(data: Partial<AdviseeAttributes>): Promise<Model> {
    return this.adviseeModel.create(data);
  }

  async unassign(id: string, unassignedBy: string, reason?: string): Promise<Model> {
    const advisee = await this.findById(id);
    if (!advisee) {
      throw new NotFoundException(`Advisee assignment with ID ${id} not found`);
    }

    return advisee.update({
      unassignedAt: new Date(),
      unassignedBy,
      unassignedReason: reason,
    });
  }
}

/**
 * 10. Creates an AdvisingSessionRepository service.
 *
 * @param {ModelStatic<Model>} sessionModel - AdvisingSession model
 * @returns {Injectable} AdvisingSessionRepository service
 */
@Injectable()
export class AdvisingSessionRepository {
  private readonly logger = new Logger(AdvisingSessionRepository.name);

  constructor(
    @Inject('ADVISING_SESSION_MODEL')
    private readonly sessionModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.sessionModel.findByPk(id);
  }

  async findByStudent(studentId: string, options: SessionSearchCriteria = {}): Promise<Model[]> {
    const where: WhereOptions = { studentId, deletedAt: null };

    if (options.status) {
      where.status = options.status;
    }

    if (options.sessionType) {
      where.sessionType = options.sessionType;
    }

    if (options.startDate && options.endDate) {
      where.scheduledAt = {
        [Op.between]: [options.startDate, options.endDate],
      };
    }

    return this.sessionModel.findAll({
      where,
      order: [['scheduledAt', 'DESC']],
    });
  }

  async findUpcoming(advisorId: string, days: number = 7): Promise<Model[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.sessionModel.findAll({
      where: {
        advisorId,
        scheduledAt: {
          [Op.between]: [now, futureDate],
        },
        status: {
          [Op.in]: [AdvisingSessionStatus.SCHEDULED, AdvisingSessionStatus.CONFIRMED],
        },
        deletedAt: null,
      },
      order: [['scheduledAt', 'ASC']],
    });
  }

  async create(data: Partial<AdvisingSessionAttributes>): Promise<Model> {
    return this.sessionModel.create(data);
  }

  async update(id: string, data: Partial<AdvisingSessionAttributes>): Promise<Model> {
    const session = await this.findById(id);
    if (!session) {
      throw new NotFoundException(`Advising session with ID ${id} not found`);
    }
    return session.update(data);
  }

  async complete(id: string, summary: string, outcomes: string[]): Promise<Model> {
    return this.update(id, {
      status: AdvisingSessionStatus.COMPLETED,
      summary,
      outcomes,
      completedAt: new Date(),
    });
  }

  async cancel(id: string, reason: string): Promise<Model> {
    return this.update(id, {
      status: AdvisingSessionStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
    });
  }
}

/**
 * 11. Creates an AdvisingNoteRepository service.
 *
 * @param {ModelStatic<Model>} noteModel - AdvisingNote model
 * @returns {Injectable} AdvisingNoteRepository service
 */
@Injectable()
export class AdvisingNoteRepository {
  private readonly logger = new Logger(AdvisingNoteRepository.name);

  constructor(
    @Inject('ADVISING_NOTE_MODEL') private readonly noteModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.noteModel.findByPk(id);
  }

  async findByStudent(studentId: string, criteria: NoteSearchCriteria = {}): Promise<Model[]> {
    const where: WhereOptions = { studentId, deletedAt: null };

    if (criteria.category) {
      where.category = criteria.category;
    }

    if (criteria.isConfidential !== undefined) {
      where.isConfidential = criteria.isConfidential;
    }

    if (criteria.searchText) {
      where[Op.or] = [
        { subject: { [Op.iLike]: `%${criteria.searchText}%` } },
        { content: { [Op.iLike]: `%${criteria.searchText}%` } },
      ];
    }

    return this.noteModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async create(data: Partial<AdvisingNoteAttributes>): Promise<Model> {
    return this.noteModel.create(data);
  }

  async update(id: string, data: Partial<AdvisingNoteAttributes>): Promise<Model> {
    const note = await this.findById(id);
    if (!note) {
      throw new NotFoundException(`Advising note with ID ${id} not found`);
    }
    return note.update(data);
  }
}

/**
 * 12. Creates an EarlyAlertRepository service.
 *
 * @param {ModelStatic<Model>} alertModel - EarlyAlert model
 * @returns {Injectable} EarlyAlertRepository service
 */
@Injectable()
export class EarlyAlertRepository {
  private readonly logger = new Logger(EarlyAlertRepository.name);

  constructor(
    @Inject('EARLY_ALERT_MODEL') private readonly alertModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.alertModel.findByPk(id);
  }

  async findActiveAlerts(studentId: string): Promise<Model[]> {
    return this.alertModel.findAll({
      where: {
        studentId,
        resolvedAt: null,
        deletedAt: null,
      },
      order: [['severity', 'DESC'], ['detectedAt', 'DESC']],
    });
  }

  async findUnacknowledgedAlerts(): Promise<Model[]> {
    return this.alertModel.findAll({
      where: {
        acknowledgedAt: null,
        resolvedAt: null,
        deletedAt: null,
      },
      order: [['severity', 'DESC'], ['detectedAt', 'ASC']],
    });
  }

  async create(data: Partial<EarlyAlertAttributes>): Promise<Model> {
    return this.alertModel.create(data);
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<Model> {
    const alert = await this.findById(id);
    if (!alert) {
      throw new NotFoundException(`Early alert with ID ${id} not found`);
    }

    return alert.update({
      acknowledgedAt: new Date(),
      acknowledgedBy,
    });
  }

  async resolve(id: string, resolvedBy: string, resolution: string): Promise<Model> {
    const alert = await this.findById(id);
    if (!alert) {
      throw new NotFoundException(`Early alert with ID ${id} not found`);
    }

    return alert.update({
      resolvedAt: new Date(),
      resolvedBy,
      resolution,
    });
  }
}

/**
 * 13. Creates a GraduationPlanRepository service.
 *
 * @param {ModelStatic<Model>} planModel - GraduationPlan model
 * @returns {Injectable} GraduationPlanRepository service
 */
@Injectable()
export class GraduationPlanRepository {
  private readonly logger = new Logger(GraduationPlanRepository.name);

  constructor(
    @Inject('GRADUATION_PLAN_MODEL') private readonly planModel: ModelStatic<Model>
  ) {}

  async findById(id: string): Promise<Model | null> {
    return this.planModel.findByPk(id);
  }

  async findByStudent(studentId: string): Promise<Model | null> {
    return this.planModel.findOne({
      where: { studentId, deletedAt: null },
    });
  }

  async create(data: Partial<GraduationPlanAttributes>): Promise<Model> {
    return this.planModel.create(data);
  }

  async update(id: string, data: Partial<GraduationPlanAttributes>): Promise<Model> {
    const plan = await this.findById(id);
    if (!plan) {
      throw new NotFoundException(`Graduation plan with ID ${id} not found`);
    }
    return plan.update(data);
  }

  async advisorApprove(id: string, approvedBy: string): Promise<Model> {
    return this.update(id, {
      status: GraduationPlanStatus.ADVISOR_APPROVED,
      advisorApprovedAt: new Date(),
      advisorApprovedBy: approvedBy,
    });
  }

  async departmentApprove(id: string, approvedBy: string): Promise<Model> {
    return this.update(id, {
      status: GraduationPlanStatus.DEPARTMENT_APPROVED,
      departmentApprovedAt: new Date(),
      departmentApprovedBy: approvedBy,
    });
  }
}

// ============================================================================
// SECTION 3: CORE ADVISING SERVICES (Functions 14-20)
// ============================================================================

/**
 * 14. Creates an AdvisingService with comprehensive business logic.
 *
 * @returns {Injectable} AdvisingService
 *
 * @example
 * const advisingService = new AdvisingService(...);
 * await advisingService.assignAdvisorToStudent({
 *   advisorId: 'advisor-123',
 *   studentId: 'student-456',
 *   advisorType: AdvisorType.ACADEMIC,
 *   isPrimary: true
 * });
 */
@Injectable()
export class AdvisingService {
  private readonly logger = new Logger(AdvisingService.name);

  constructor(
    private readonly advisorRepository: AdvisorRepository,
    private readonly adviseeRepository: AdviseeRepository,
    private readonly sessionRepository: AdvisingSessionRepository,
  ) {}

  async assignAdvisorToStudent(options: AssignAdvisorOptions): Promise<Model> {
    this.logger.log(`Assigning advisor ${options.advisorId} to student ${options.studentId}`);

    // Verify advisor exists and is active
    const advisor = await this.advisorRepository.findById(options.advisorId);
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${options.advisorId} not found`);
    }

    if (!advisor.get('isActive')) {
      throw new BadRequestException('Advisor is not active');
    }

    // Check if advisor has reached max advisees
    const currentAdviseeCount = await this.advisorRepository.getAdviseeCount(options.advisorId);
    const maxAdvisees = advisor.get('maxAdvisees') as number;
    if (maxAdvisees && currentAdviseeCount >= maxAdvisees) {
      throw new ConflictException('Advisor has reached maximum advisee limit');
    }

    // If assigning as primary, unset any existing primary advisor
    if (options.isPrimary) {
      const existingPrimary = await this.adviseeRepository.findPrimaryAdvisor(options.studentId);
      if (existingPrimary) {
        await existingPrimary.update({ isPrimary: false });
      }
    }

    // Create the advisee assignment
    const advisee = await this.adviseeRepository.create({
      studentId: options.studentId,
      advisorId: options.advisorId,
      advisorType: options.advisorType,
      isPrimary: options.isPrimary ?? false,
      assignedAt: new Date(),
      assignedBy: options.assignedBy,
      metadata: options.metadata,
    });

    this.logger.log(`Successfully assigned advisor ${options.advisorId} to student ${options.studentId}`);
    return advisee;
  }

  async unassignAdvisor(
    adviseeId: string,
    unassignedBy: string,
    reason?: string
  ): Promise<Model> {
    return this.adviseeRepository.unassign(adviseeId, unassignedBy, reason);
  }

  async getStudentAdvisors(studentId: string): Promise<Model[]> {
    return this.adviseeRepository.findByStudentId(studentId);
  }

  async getAdvisorAdvisees(advisorId: string): Promise<Model[]> {
    return this.adviseeRepository.findByAdvisorId(advisorId);
  }

  async reassignAdvisor(
    oldAdviseeId: string,
    newAdvisorId: string,
    reassignedBy: string,
    reason: string
  ): Promise<Model> {
    const oldAdvisee = await this.adviseeRepository.findById(oldAdviseeId);
    if (!oldAdvisee) {
      throw new NotFoundException(`Advisee assignment with ID ${oldAdviseeId} not found`);
    }

    // Unassign old advisor
    await this.unassignAdvisor(oldAdviseeId, reassignedBy, reason);

    // Assign new advisor
    return this.assignAdvisorToStudent({
      advisorId: newAdvisorId,
      studentId: oldAdvisee.get('studentId') as string,
      advisorType: oldAdvisee.get('advisorType') as AdvisorType,
      isPrimary: oldAdvisee.get('isPrimary') as boolean,
      assignedBy: reassignedBy,
    });
  }
}

/**
 * 15. Creates an AdvisingSessionService for session management.
 *
 * @returns {Injectable} AdvisingSessionService
 */
@Injectable()
export class AdvisingSessionService {
  private readonly logger = new Logger(AdvisingSessionService.name);

  constructor(
    private readonly sessionRepository: AdvisingSessionRepository,
    private readonly adviseeRepository: AdviseeRepository,
  ) {}

  async scheduleSession(options: CreateSessionOptions): Promise<Model> {
    // Verify advisee relationship exists
    const advisees = await this.adviseeRepository.findByStudentId(options.studentId);
    const advisee = advisees.find(
      (a) => a.get('advisorId') === options.advisorId
    );

    if (!advisee) {
      throw new BadRequestException('No active advisor-student relationship found');
    }

    // Create session
    const session = await this.sessionRepository.create({
      ...options,
      adviseeId: advisee.get('id') as string,
      status: AdvisingSessionStatus.SCHEDULED,
      followUpRequired: false,
    });

    this.logger.log(`Scheduled advising session ${session.get('id')}`);
    return session;
  }

  async confirmSession(sessionId: string): Promise<Model> {
    return this.sessionRepository.update(sessionId, {
      status: AdvisingSessionStatus.CONFIRMED,
    });
  }

  async completeSession(
    sessionId: string,
    summary: string,
    outcomes: string[],
    actionItems?: object[]
  ): Promise<Model> {
    const session = await this.sessionRepository.complete(sessionId, summary, outcomes);

    if (actionItems && actionItems.length > 0) {
      await session.update({ actionItems });
    }

    return session;
  }

  async cancelSession(sessionId: string, reason: string): Promise<Model> {
    return this.sessionRepository.cancel(sessionId, reason);
  }

  async markNoShow(sessionId: string): Promise<Model> {
    return this.sessionRepository.update(sessionId, {
      status: AdvisingSessionStatus.NO_SHOW,
      noShowAt: new Date(),
    });
  }

  async rescheduleSession(
    sessionId: string,
    newScheduledAt: Date,
    duration?: number
  ): Promise<Model> {
    const updateData: any = {
      status: AdvisingSessionStatus.RESCHEDULED,
      scheduledAt: newScheduledAt,
    };

    if (duration) {
      updateData.duration = duration;
    }

    return this.sessionRepository.update(sessionId, updateData);
  }

  async getUpcomingSessions(advisorId: string, days: number = 7): Promise<Model[]> {
    return this.sessionRepository.findUpcoming(advisorId, days);
  }

  async getStudentSessions(studentId: string, criteria: SessionSearchCriteria = {}): Promise<Model[]> {
    return this.sessionRepository.findByStudent(studentId, criteria);
  }
}

/**
 * 16. Creates an AdvisingNoteService for note management.
 *
 * @returns {Injectable} AdvisingNoteService
 */
@Injectable()
export class AdvisingNoteService {
  private readonly logger = new Logger(AdvisingNoteService.name);

  constructor(
    private readonly noteRepository: AdvisingNoteRepository,
    private readonly adviseeRepository: AdviseeRepository,
  ) {}

  async createNote(options: CreateNoteOptions): Promise<Model> {
    // Verify advisee relationship
    const advisees = await this.adviseeRepository.findByStudentId(options.studentId);
    const advisee = advisees.find(
      (a) => a.get('advisorId') === options.advisorId
    );

    if (!advisee) {
      throw new BadRequestException('No active advisor-student relationship found');
    }

    const note = await this.noteRepository.create({
      ...options,
      adviseeId: advisee.get('id') as string,
      isConfidential: options.isConfidential ?? false,
    });

    this.logger.log(`Created advising note ${note.get('id')}`);
    return note;
  }

  async updateNote(
    noteId: string,
    updates: Partial<AdvisingNoteAttributes>
  ): Promise<Model> {
    return this.noteRepository.update(noteId, updates);
  }

  async getNoteById(noteId: string): Promise<Model> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new NotFoundException(`Advising note with ID ${noteId} not found`);
    }
    return note;
  }

  async searchNotes(studentId: string, criteria: NoteSearchCriteria): Promise<Model[]> {
    return this.noteRepository.findByStudent(studentId, criteria);
  }

  async shareNote(noteId: string, userIds: string[]): Promise<Model> {
    const note = await this.getNoteById(noteId);
    const currentSharedWith = (note.get('sharedWith') as string[]) || [];
    const updatedSharedWith = [...new Set([...currentSharedWith, ...userIds])];

    return this.noteRepository.update(noteId, {
      sharedWith: updatedSharedWith,
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    const note = await this.getNoteById(noteId);
    await note.destroy();
  }
}

/**
 * 17. Creates an EarlyAlertService for at-risk student intervention.
 *
 * @returns {Injectable} EarlyAlertService
 */
@Injectable()
export class EarlyAlertService {
  private readonly logger = new Logger(EarlyAlertService.name);

  constructor(
    private readonly alertRepository: EarlyAlertRepository,
    private readonly adviseeRepository: AdviseeRepository,
  ) {}

  async createEarlyAlert(options: CreateEarlyAlertOptions): Promise<Model> {
    // Auto-assign to primary advisor if not specified
    let advisorId = options.advisorId;
    if (!advisorId) {
      const primaryAdvisor = await this.adviseeRepository.findPrimaryAdvisor(options.studentId);
      if (primaryAdvisor) {
        advisorId = primaryAdvisor.get('advisorId') as string;
      }
    }

    const alert = await this.alertRepository.create({
      ...options,
      advisorId,
      detectedAt: new Date(),
    });

    this.logger.warn(`Early alert created for student ${options.studentId}: ${options.alertType}`);
    return alert;
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<Model> {
    return this.alertRepository.acknowledge(alertId, acknowledgedBy);
  }

  async resolveAlert(alertId: string, resolvedBy: string, resolution: string): Promise<Model> {
    return this.alertRepository.resolve(alertId, resolvedBy, resolution);
  }

  async getActiveAlerts(studentId: string): Promise<Model[]> {
    return this.alertRepository.findActiveAlerts(studentId);
  }

  async getUnacknowledgedAlerts(): Promise<Model[]> {
    return this.alertRepository.findUnacknowledgedAlerts();
  }

  async escalateAlert(alertId: string, escalatedTo: string): Promise<Model> {
    const alert = await this.alertRepository.findById(alertId);
    if (!alert) {
      throw new NotFoundException(`Early alert with ID ${alertId} not found`);
    }

    await alert.update({ escalatedTo });
    this.logger.log(`Alert ${alertId} escalated to ${escalatedTo}`);
    return alert;
  }

  async addFollowUpAction(
    alertId: string,
    action: { description: string; completedBy?: string; completedAt?: Date }
  ): Promise<Model> {
    const alert = await this.alertRepository.findById(alertId);
    if (!alert) {
      throw new NotFoundException(`Early alert with ID ${alertId} not found`);
    }

    const currentActions = (alert.get('followUpActions') as object[]) || [];
    const updatedActions = [...currentActions, { ...action, createdAt: new Date() }];

    return alert.update({ followUpActions: updatedActions });
  }
}

/**
 * 18. Creates an AcademicProbationService.
 *
 * @returns {Injectable} AcademicProbationService
 */
@Injectable()
export class AcademicProbationService {
  private readonly logger = new Logger(AcademicProbationService.name);

  constructor(
    @Inject('ACADEMIC_PROBATION_MODEL')
    private readonly probationModel: ModelStatic<Model>,
    private readonly adviseeRepository: AdviseeRepository,
  ) {}

  async createProbation(options: CreateProbationOptions): Promise<Model> {
    // Auto-assign to primary advisor if not specified
    let advisorId = options.advisorId;
    if (!advisorId) {
      const primaryAdvisor = await this.adviseeRepository.findPrimaryAdvisor(options.studentId);
      if (primaryAdvisor) {
        advisorId = primaryAdvisor.get('advisorId') as string;
      }
    }

    const probation = await this.probationModel.create({
      ...options,
      advisorId,
      probationStartDate: new Date(),
      requirementsMet: false,
    });

    this.logger.warn(
      `Student ${options.studentId} placed on ${options.standing} for term ${options.termId}`
    );
    return probation;
  }

  async updateImprovementPlan(probationId: string, plan: object): Promise<Model> {
    const probation = await this.probationModel.findByPk(probationId);
    if (!probation) {
      throw new NotFoundException(`Academic probation record with ID ${probationId} not found`);
    }

    return probation.update({ improvementPlan: plan });
  }

  async addProgressNote(
    probationId: string,
    note: { date: Date; note: string; addedBy: string }
  ): Promise<Model> {
    const probation = await this.probationModel.findByPk(probationId);
    if (!probation) {
      throw new NotFoundException(`Academic probation record with ID ${probationId} not found`);
    }

    const currentNotes = (probation.get('progressNotes') as object[]) || [];
    const updatedNotes = [...currentNotes, note];

    return probation.update({ progressNotes: updatedNotes });
  }

  async resolveProbation(
    probationId: string,
    requirementsMet: boolean,
    resolution: string
  ): Promise<Model> {
    const probation = await this.probationModel.findByPk(probationId);
    if (!probation) {
      throw new NotFoundException(`Academic probation record with ID ${probationId} not found`);
    }

    return probation.update({
      requirementsMet,
      resolution,
      resolvedAt: new Date(),
      probationEndDate: new Date(),
    });
  }
}

/**
 * 19. Creates a GraduationPlanningService.
 *
 * @returns {Injectable} GraduationPlanningService
 */
@Injectable()
export class GraduationPlanningService {
  private readonly logger = new Logger(GraduationPlanningService.name);

  constructor(
    private readonly planRepository: GraduationPlanRepository,
  ) {}

  async createGraduationPlan(options: CreateGraduationPlanOptions): Promise<Model> {
    const plan = await this.planRepository.create({
      ...options,
      status: GraduationPlanStatus.DRAFT,
      plannedCourses: [],
      completedCourses: [],
      remainingRequirements: [],
      creditsCompleted: 0,
      creditsInProgress: 0,
      creditsRemaining: options.totalCreditsRequired,
    });

    this.logger.log(`Created graduation plan ${plan.get('id')} for student ${options.studentId}`);
    return plan;
  }

  async updatePlannedCourses(planId: string, courses: object[]): Promise<Model> {
    return this.planRepository.update(planId, {
      plannedCourses: courses,
      lastReviewedAt: new Date(),
    });
  }

  async updateCredits(
    planId: string,
    credits: { completed: number; inProgress: number; remaining: number }
  ): Promise<Model> {
    return this.planRepository.update(planId, {
      creditsCompleted: credits.completed,
      creditsInProgress: credits.inProgress,
      creditsRemaining: credits.remaining,
      lastReviewedAt: new Date(),
    });
  }

  async advisorApprove(planId: string, approvedBy: string): Promise<Model> {
    return this.planRepository.advisorApprove(planId, approvedBy);
  }

  async departmentApprove(planId: string, approvedBy: string): Promise<Model> {
    return this.planRepository.departmentApprove(planId, approvedBy);
  }

  async addMilestone(
    planId: string,
    milestone: { name: string; targetDate: Date; description?: string }
  ): Promise<Model> {
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException(`Graduation plan with ID ${planId} not found`);
    }

    const currentMilestones = (plan.get('milestones') as object[]) || [];
    const updatedMilestones = [...currentMilestones, { ...milestone, id: Date.now().toString() }];

    return plan.update({ milestones: updatedMilestones });
  }
}

/**
 * 20. Creates a RequestContextService for request-scoped user context.
 *
 * @returns {Injectable} RequestContextService with request scope
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private _userId?: string;
  private _userRoles: string[] = [];
  private _requestId: string;
  private _ipAddress?: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this._requestId = this.generateRequestId();
    this._ipAddress = request.ip;

    // Extract user context from request (assumes authentication middleware)
    const user = (request as any).user;
    if (user) {
      this._userId = user.id;
      this._userRoles = user.roles || [];
    }
  }

  get userId(): string | undefined {
    return this._userId;
  }

  get userRoles(): string[] {
    return this._userRoles;
  }

  get requestId(): string {
    return this._requestId;
  }

  get ipAddress(): string | undefined {
    return this._ipAddress;
  }

  hasRole(role: string): boolean {
    return this._userRoles.includes(role);
  }

  isAuthorized(): boolean {
    return !!this._userId;
  }

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// SECTION 4: UTILITY FUNCTIONS (Functions 21-27)
// ============================================================================

/**
 * 21. Validates advisor workload capacity.
 *
 * @param {number} currentAdvisees - Current advisee count
 * @param {number} maxAdvisees - Maximum allowed advisees
 * @returns {boolean} Whether advisor has capacity
 */
export function validateAdvisorCapacity(currentAdvisees: number, maxAdvisees: number): boolean {
  return currentAdvisees < maxAdvisees;
}

/**
 * 22. Calculates advisor utilization percentage.
 *
 * @param {number} currentAdvisees - Current advisee count
 * @param {number} maxAdvisees - Maximum allowed advisees
 * @returns {number} Utilization percentage
 */
export function calculateAdvisorUtilization(currentAdvisees: number, maxAdvisees: number): number {
  if (maxAdvisees === 0) return 0;
  return Math.round((currentAdvisees / maxAdvisees) * 100);
}

/**
 * 23. Determines alert priority based on severity and type.
 *
 * @param {AlertSeverity} severity - Alert severity
 * @param {EarlyAlertType} alertType - Alert type
 * @returns {number} Priority score (higher = more urgent)
 */
export function calculateAlertPriority(severity: AlertSeverity, alertType: EarlyAlertType): number {
  const severityScores: Record<AlertSeverity, number> = {
    [AlertSeverity.CRITICAL]: 100,
    [AlertSeverity.HIGH]: 75,
    [AlertSeverity.MEDIUM]: 50,
    [AlertSeverity.LOW]: 25,
  };

  const typeScores: Record<EarlyAlertType, number> = {
    [EarlyAlertType.ACADEMIC_PERFORMANCE]: 20,
    [EarlyAlertType.ATTENDANCE]: 15,
    [EarlyAlertType.ENGAGEMENT]: 10,
    [EarlyAlertType.FINANCIAL]: 15,
    [EarlyAlertType.PERSONAL]: 12,
    [EarlyAlertType.HEALTH]: 18,
  };

  return severityScores[severity] + typeScores[alertType];
}

/**
 * 24. Formats advising session duration for display.
 *
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export function formatSessionDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}

/**
 * 25. Checks if a session is upcoming (within next 24 hours).
 *
 * @param {Date} scheduledAt - Session scheduled time
 * @returns {boolean} Whether session is upcoming
 */
export function isSessionUpcoming(scheduledAt: Date): boolean {
  const now = new Date();
  const sessionTime = new Date(scheduledAt);
  const hoursDifference = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursDifference > 0 && hoursDifference <= 24;
}

/**
 * 26. Sanitizes advising note content to prevent XSS.
 *
 * @param {string} content - Raw note content
 * @returns {string} Sanitized content
 */
export function sanitizeNoteContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * 27. Generates a default improvement plan template for academic probation.
 *
 * @param {AcademicStanding} standing - Academic standing level
 * @returns {object} Improvement plan template
 */
export function generateImprovementPlanTemplate(standing: AcademicStanding): object {
  const baseTemplate = {
    goals: [],
    strategies: [],
    resources: [],
    checkInFrequency: 'biweekly',
    reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };

  switch (standing) {
    case AcademicStanding.ACADEMIC_WARNING:
      return {
        ...baseTemplate,
        goals: [
          'Achieve minimum 2.0 GPA in current term',
          'Meet with advisor biweekly',
          'Attend tutoring sessions for struggling courses',
        ],
        strategies: [
          'Create structured study schedule',
          'Utilize campus tutoring center',
          'Reduce work hours if applicable',
        ],
      };

    case AcademicStanding.ACADEMIC_PROBATION:
      return {
        ...baseTemplate,
        checkInFrequency: 'weekly',
        goals: [
          'Achieve minimum 2.5 GPA in current term',
          'Meet with advisor weekly',
          'Complete academic success workshop',
          'Maintain regular class attendance',
        ],
        strategies: [
          'Enroll in academic success program',
          'Work with peer mentor',
          'Limit course load to manageable level',
          'Seek counseling support if needed',
        ],
      };

    default:
      return baseTemplate;
  }
}

// ============================================================================
// SECTION 5: AUDIT AND COMPLIANCE (Functions 28-34)
// ============================================================================

/**
 * 28. Creates an AuditService for FERPA-compliant logging.
 *
 * @returns {Injectable} AuditService
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @Inject('AUDIT_LOG_MODEL') private readonly auditLogModel: ModelStatic<Model>,
    private readonly requestContext: RequestContextService,
  ) {}

  async logAccess(resource: string, resourceId: string, action: string): Promise<void> {
    await this.auditLogModel.create({
      userId: this.requestContext.userId,
      requestId: this.requestContext.requestId,
      ipAddress: this.requestContext.ipAddress,
      resource,
      resourceId,
      action,
      timestamp: new Date(),
    });
  }

  async logAdvisorAssignment(studentId: string, advisorId: string): Promise<void> {
    await this.logAccess('advisee_assignment', studentId, 'ASSIGN_ADVISOR');
  }

  async logSessionAccess(sessionId: string): Promise<void> {
    await this.logAccess('advising_session', sessionId, 'VIEW_SESSION');
  }

  async logNoteCreation(noteId: string, isConfidential: boolean): Promise<void> {
    const action = isConfidential ? 'CREATE_CONFIDENTIAL_NOTE' : 'CREATE_NOTE';
    await this.logAccess('advising_note', noteId, action);
  }

  async logEarlyAlert(alertId: string, severity: AlertSeverity): Promise<void> {
    await this.logAccess('early_alert', alertId, `CREATE_ALERT_${severity}`);
  }
}

/**
 * 29. Validates FERPA compliance for data access.
 *
 * @param {string[]} userRoles - User roles
 * @param {string} resourceType - Type of resource being accessed
 * @param {boolean} isConfidential - Whether resource is confidential
 * @returns {boolean} Whether access is allowed
 */
export function validateFERPAAccess(
  userRoles: string[],
  resourceType: string,
  isConfidential: boolean = false
): boolean {
  // Advisors can access non-confidential student records
  if (userRoles.includes('advisor') && !isConfidential) {
    return true;
  }

  // Senior advisors and administrators can access confidential records
  if (
    isConfidential &&
    (userRoles.includes('senior_advisor') || userRoles.includes('administrator'))
  ) {
    return true;
  }

  // Students can access their own records
  if (userRoles.includes('student') && resourceType === 'own_records') {
    return true;
  }

  return false;
}

/**
 * 30. Redacts sensitive information from advising notes based on user role.
 *
 * @param {string} content - Original note content
 * @param {string[]} userRoles - User roles
 * @returns {string} Redacted content
 */
export function redactSensitiveContent(content: string, userRoles: string[]): string {
  // Only redact for non-authorized roles
  if (
    userRoles.includes('senior_advisor') ||
    userRoles.includes('administrator') ||
    userRoles.includes('counselor')
  ) {
    return content;
  }

  // Redact SSN patterns
  let redacted = content.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****');

  // Redact phone numbers
  redacted = redacted.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '***-***-****');

  // Redact email addresses in certain contexts
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');

  return redacted;
}

/**
 * 31. Generates FERPA disclosure consent record.
 *
 * @param {string} studentId - Student ID
 * @param {string[]} authorizedUsers - User IDs authorized to access
 * @param {Date} expirationDate - When consent expires
 * @returns {object} Consent record
 */
export function generateFERPAConsent(
  studentId: string,
  authorizedUsers: string[],
  expirationDate: Date
): object {
  return {
    studentId,
    authorizedUsers,
    consentGivenAt: new Date(),
    expirationDate,
    scope: ['advising_records', 'academic_progress'],
    revokedAt: null,
  };
}

/**
 * 32. Validates data retention compliance for advising records.
 *
 * @param {Date} recordCreatedAt - When record was created
 * @param {number} retentionYears - Required retention period in years
 * @returns {boolean} Whether record is within retention period
 */
export function validateDataRetention(recordCreatedAt: Date, retentionYears: number = 7): boolean {
  const now = new Date();
  const retentionPeriod = retentionYears * 365 * 24 * 60 * 60 * 1000;
  const recordAge = now.getTime() - recordCreatedAt.getTime();

  return recordAge <= retentionPeriod;
}

/**
 * 33. Encrypts confidential advising note content.
 *
 * @param {string} content - Plain text content
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Encrypted content (placeholder - use actual crypto in production)
 */
export function encryptConfidentialContent(content: string, encryptionKey: string): string {
  // In production, use proper encryption library (e.g., crypto-js, node:crypto)
  // This is a placeholder for demonstration
  const base64 = Buffer.from(content).toString('base64');
  return `ENCRYPTED:${base64}`;
}

/**
 * 34. Decrypts confidential advising note content.
 *
 * @param {string} encryptedContent - Encrypted content
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Decrypted content (placeholder - use actual crypto in production)
 */
export function decryptConfidentialContent(encryptedContent: string, encryptionKey: string): string {
  // In production, use proper decryption library
  // This is a placeholder for demonstration
  if (!encryptedContent.startsWith('ENCRYPTED:')) {
    return encryptedContent;
  }

  const base64 = encryptedContent.replace('ENCRYPTED:', '');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// ============================================================================
// SECTION 6: REPORTING AND ANALYTICS (Functions 35-41)
// ============================================================================

/**
 * 35. Generates advisor workload report.
 *
 * @param {string} advisorId - Advisor ID
 * @param {Model[]} advisees - Advisee assignments
 * @param {Model[]} sessions - Recent sessions
 * @returns {object} Workload report
 */
export function generateAdvisorWorkloadReport(
  advisorId: string,
  advisees: Model[],
  sessions: Model[]
): object {
  const totalAdvisees = advisees.length;
  const sessionsByType = sessions.reduce((acc, session) => {
    const type = session.get('sessionType') as string;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedSessions = sessions.filter(
    (s) => s.get('status') === AdvisingSessionStatus.COMPLETED
  ).length;

  const cancelledSessions = sessions.filter(
    (s) => s.get('status') === AdvisingSessionStatus.CANCELLED
  ).length;

  const noShowSessions = sessions.filter(
    (s) => s.get('status') === AdvisingSessionStatus.NO_SHOW
  ).length;

  return {
    advisorId,
    totalAdvisees,
    sessionsByType,
    completedSessions,
    cancelledSessions,
    noShowSessions,
    completionRate:
      sessions.length > 0
        ? Math.round((completedSessions / sessions.length) * 100)
        : 0,
  };
}

/**
 * 36. Generates early alert summary for a time period.
 *
 * @param {Model[]} alerts - Early alerts
 * @returns {object} Alert summary
 */
export function generateEarlyAlertSummary(alerts: Model[]): object {
  const totalAlerts = alerts.length;
  const alertsBySeverity = alerts.reduce((acc, alert) => {
    const severity = alert.get('severity') as string;
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const alertsByType = alerts.reduce((acc, alert) => {
    const type = alert.get('alertType') as string;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const acknowledgedAlerts = alerts.filter((a) => a.get('acknowledgedAt')).length;
  const resolvedAlerts = alerts.filter((a) => a.get('resolvedAt')).length;
  const activeAlerts = totalAlerts - resolvedAlerts;

  const avgResolutionTime = calculateAverageResolutionTime(alerts);

  return {
    totalAlerts,
    alertsBySeverity,
    alertsByType,
    acknowledgedAlerts,
    resolvedAlerts,
    activeAlerts,
    acknowledgementRate:
      totalAlerts > 0 ? Math.round((acknowledgedAlerts / totalAlerts) * 100) : 0,
    resolutionRate:
      totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0,
    avgResolutionTimeHours: avgResolutionTime,
  };
}

/**
 * 37. Calculates average alert resolution time in hours.
 *
 * @param {Model[]} alerts - Early alerts
 * @returns {number} Average resolution time in hours
 */
export function calculateAverageResolutionTime(alerts: Model[]): number {
  const resolvedAlerts = alerts.filter((a) => a.get('resolvedAt'));

  if (resolvedAlerts.length === 0) return 0;

  const totalHours = resolvedAlerts.reduce((sum, alert) => {
    const detected = new Date(alert.get('detectedAt') as Date);
    const resolved = new Date(alert.get('resolvedAt') as Date);
    const hours = (resolved.getTime() - detected.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  return Math.round(totalHours / resolvedAlerts.length);
}

/**
 * 38. Generates student advising engagement report.
 *
 * @param {string} studentId - Student ID
 * @param {Model[]} sessions - Advising sessions
 * @param {Model[]} notes - Advising notes
 * @returns {object} Engagement report
 */
export function generateStudentEngagementReport(
  studentId: string,
  sessions: Model[],
  notes: Model[]
): object {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.get('status') === AdvisingSessionStatus.COMPLETED
  ).length;
  const noShowSessions = sessions.filter(
    (s) => s.get('status') === AdvisingSessionStatus.NO_SHOW
  ).length;

  const lastSessionDate = sessions.length > 0
    ? new Date(Math.max(...sessions.map(s => new Date(s.get('scheduledAt') as Date).getTime())))
    : null;

  return {
    studentId,
    totalSessions,
    completedSessions,
    noShowSessions,
    attendanceRate:
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0,
    totalNotes: notes.length,
    lastSessionDate,
    daysSinceLastSession: lastSessionDate
      ? Math.floor((Date.now() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24))
      : null,
  };
}

/**
 * 39. Identifies students needing advising intervention.
 *
 * @param {Model[]} students - Students with session data
 * @param {number} daysSinceLastSession - Threshold days
 * @returns {object[]} Students needing intervention
 */
export function identifyInterventionNeeded(
  students: Array<{ id: string; lastSessionDate?: Date; activeAlerts: number }>,
  daysSinceLastSession: number = 45
): object[] {
  return students
    .filter((student) => {
      if (!student.lastSessionDate) return true;

      const daysSince = Math.floor(
        (Date.now() - student.lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return daysSince >= daysSinceLastSession || student.activeAlerts > 0;
    })
    .map((student) => ({
      studentId: student.id,
      reason: !student.lastSessionDate
        ? 'No advising sessions recorded'
        : student.activeAlerts > 0
        ? `Has ${student.activeAlerts} active alert(s)`
        : 'Overdue for advising session',
      priority: student.activeAlerts > 0 ? 'HIGH' : 'MEDIUM',
    }));
}

/**
 * 40. Generates graduation plan progress report.
 *
 * @param {Model} plan - Graduation plan
 * @returns {object} Progress report
 */
export function generateGraduationProgressReport(plan: Model): object {
  const totalCredits = plan.get('totalCreditsRequired') as number;
  const completed = plan.get('creditsCompleted') as number;
  const inProgress = plan.get('creditsInProgress') as number;
  const remaining = plan.get('creditsRemaining') as number;

  const progressPercentage = Math.round((completed / totalCredits) * 100);
  const onTrack = remaining <= 0 || progressPercentage >= 50;

  return {
    planId: plan.get('id'),
    studentId: plan.get('studentId'),
    programId: plan.get('programId'),
    expectedGraduationTerm: plan.get('expectedGraduationTerm'),
    totalCreditsRequired: totalCredits,
    creditsCompleted: completed,
    creditsInProgress: inProgress,
    creditsRemaining: remaining,
    progressPercentage,
    onTrack,
    status: plan.get('status'),
    lastReviewedAt: plan.get('lastReviewedAt'),
  };
}

/**
 * 41. Calculates advisor performance metrics.
 *
 * @param {string} advisorId - Advisor ID
 * @param {object} workloadData - Workload statistics
 * @returns {object} Performance metrics
 */
export function calculateAdvisorPerformanceMetrics(
  advisorId: string,
  workloadData: {
    totalAdvisees: number;
    maxAdvisees: number;
    completedSessions: number;
    totalSessions: number;
    avgSessionDuration: number;
    studentSuccessRate: number;
  }
): object {
  const utilization = calculateAdvisorUtilization(
    workloadData.totalAdvisees,
    workloadData.maxAdvisees
  );

  const sessionCompletionRate =
    workloadData.totalSessions > 0
      ? Math.round((workloadData.completedSessions / workloadData.totalSessions) * 100)
      : 0;

  return {
    advisorId,
    utilization,
    sessionCompletionRate,
    avgSessionDuration: workloadData.avgSessionDuration,
    studentSuccessRate: workloadData.studentSuccessRate,
    overallScore: Math.round(
      (sessionCompletionRate * 0.4 + workloadData.studentSuccessRate * 0.6)
    ),
  };
}

// ============================================================================
// SECTION 7: PROVIDER FACTORIES AND MODULE CONFIGURATION (Functions 42-45)
// ============================================================================

/**
 * 42. Creates a provider factory for Advisor model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider} Model provider
 */
export function createAdvisorModelProvider(sequelize: Sequelize): Provider {
  return {
    provide: 'ADVISOR_MODEL',
    useFactory: () => createAdvisorModel(sequelize),
  };
}

/**
 * 43. Creates a provider factory for all advising models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider[]} Array of model providers
 */
export function createAdvisingModelProviders(sequelize: Sequelize): Provider[] {
  return [
    {
      provide: 'ADVISOR_MODEL',
      useFactory: () => createAdvisorModel(sequelize),
    },
    {
      provide: 'ADVISEE_MODEL',
      useFactory: () => createAdviseeModel(sequelize),
    },
    {
      provide: 'ADVISING_SESSION_MODEL',
      useFactory: () => createAdvisingSessionModel(sequelize),
    },
    {
      provide: 'ADVISING_NOTE_MODEL',
      useFactory: () => createAdvisingNoteModel(sequelize),
    },
    {
      provide: 'EARLY_ALERT_MODEL',
      useFactory: () => createEarlyAlertModel(sequelize),
    },
    {
      provide: 'ACADEMIC_PROBATION_MODEL',
      useFactory: () => createAcademicProbationModel(sequelize),
    },
    {
      provide: 'GRADUATION_PLAN_MODEL',
      useFactory: () => createGraduationPlanModel(sequelize),
    },
  ];
}

/**
 * 44. Creates advising module configuration with all providers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Module configuration
 */
export function createAdvisingModuleConfig(sequelize: Sequelize): {
  providers: Provider[];
  exports: any[];
} {
  const modelProviders = createAdvisingModelProviders(sequelize);

  const serviceProviders: Provider[] = [
    AdvisorRepository,
    AdviseeRepository,
    AdvisingSessionRepository,
    AdvisingNoteRepository,
    EarlyAlertRepository,
    GraduationPlanRepository,
    AdvisingService,
    AdvisingSessionService,
    AdvisingNoteService,
    EarlyAlertService,
    AcademicProbationService,
    GraduationPlanningService,
    RequestContextService,
    AuditService,
  ];

  return {
    providers: [...modelProviders, ...serviceProviders],
    exports: serviceProviders,
  };
}

/**
 * 45. Creates a complete advising management dynamic module.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Module options
 * @returns {DynamicModule} NestJS dynamic module
 */
export function createAdvisingManagementModule(
  sequelize: Sequelize,
  options: { isGlobal?: boolean } = {}
): any {
  const config = createAdvisingModuleConfig(sequelize);

  return {
    module: class AdvisingManagementModule {},
    global: options.isGlobal ?? false,
    providers: config.providers,
    exports: config.exports,
  };
}
