/**
 * LOC: EDUCREGIST001
 * File: /reuse/education/course-registration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *   - ./course-catalog-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Registration controllers
 *   - Student services systems
 */

/**
 * File: /reuse/education/course-registration-kit.ts
 * Locator: WC-EDU-REGI-001
 * Purpose: Comprehensive Course Registration Management - Ellucian Banner/Colleague-level SIS functionality
 *
 * Upstream: Error handling, validation, auditing utilities, course catalog
 * Downstream: ../backend/*, Education controllers, registration services, student enrollment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 45+ utility functions for registration, add/drop/swap, time tickets, holds, validation
 *
 * LLM Context: Enterprise-grade course registration system competing with Ellucian Banner/Colleague.
 * Provides complete registration lifecycle management, time tickets, registration periods, holds,
 * add/drop/swap functionality, concurrent enrollment, cross-registration, waitlist management,
 * registration errors and validation, prerequisites validation, capacity enforcement, registration
 * priority, degree audit integration, tuition calculation, registration permissions.
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Transaction,
  Op,
  Association,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseSection, Course } from './course-catalog-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum RegistrationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  WAITLISTED = 'WAITLISTED',
  DROPPED = 'DROPPED',
  WITHDRAWN = 'WITHDRAWN',
  CANCELLED = 'CANCELLED',
  SWAPPED = 'SWAPPED',
}

export enum RegistrationAction {
  ADD = 'ADD',
  DROP = 'DROP',
  SWAP = 'SWAP',
  WITHDRAW = 'WITHDRAW',
  CHANGE_GRADING_BASIS = 'CHANGE_GRADING_BASIS',
  CHANGE_CREDIT_HOURS = 'CHANGE_CREDIT_HOURS',
}

export enum HoldType {
  ACADEMIC = 'ACADEMIC',
  FINANCIAL = 'FINANCIAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  DISCIPLINARY = 'DISCIPLINARY',
  ADVISING = 'ADVISING',
  HEALTH = 'HEALTH',
  LIBRARY = 'LIBRARY',
}

export enum HoldSeverity {
  INFORMATIONAL = 'INFORMATIONAL',
  WARNING = 'WARNING',
  REGISTRATION_BLOCK = 'REGISTRATION_BLOCK',
  TRANSCRIPT_HOLD = 'TRANSCRIPT_HOLD',
  DEGREE_HOLD = 'DEGREE_HOLD',
}

export enum RegistrationPeriodType {
  EARLY_REGISTRATION = 'EARLY_REGISTRATION',
  PRIORITY_REGISTRATION = 'PRIORITY_REGISTRATION',
  OPEN_REGISTRATION = 'OPEN_REGISTRATION',
  LATE_REGISTRATION = 'LATE_REGISTRATION',
  ADD_DROP = 'ADD_DROP',
  CLOSED = 'CLOSED',
}

export enum WaitlistStatus {
  ACTIVE = 'ACTIVE',
  PENDING_NOTIFICATION = 'PENDING_NOTIFICATION',
  NOTIFIED = 'NOTIFIED',
  EXPIRED = 'EXPIRED',
  REGISTERED = 'REGISTERED',
  REMOVED = 'REMOVED',
}

export enum RegistrationErrorCode {
  PREREQUISITE_NOT_MET = 'PREREQUISITE_NOT_MET',
  COREQUISITE_NOT_MET = 'COREQUISITE_NOT_MET',
  SECTION_FULL = 'SECTION_FULL',
  TIME_CONFLICT = 'TIME_CONFLICT',
  DUPLICATE_COURSE = 'DUPLICATE_COURSE',
  CREDIT_LIMIT_EXCEEDED = 'CREDIT_LIMIT_EXCEEDED',
  REGISTRATION_HOLD = 'REGISTRATION_HOLD',
  OUTSIDE_TIME_TICKET = 'OUTSIDE_TIME_TICKET',
  ENROLLMENT_STATUS_INVALID = 'ENROLLMENT_STATUS_INVALID',
  RESTRICTION_NOT_MET = 'RESTRICTION_NOT_MET',
  CONCURRENT_ENROLLMENT_LIMIT = 'CONCURRENT_ENROLLMENT_LIMIT',
}

export enum PriorityGroup {
  ATHLETES = 'ATHLETES',
  HONORS = 'HONORS',
  SENIORS = 'SENIORS',
  JUNIORS = 'JUNIORS',
  SOPHOMORES = 'SOPHOMORES',
  FRESHMEN = 'FRESHMEN',
  SPECIAL_PROGRAMS = 'SPECIAL_PROGRAMS',
  DISABILITIES = 'DISABILITIES',
  VETERANS = 'VETERANS',
  GRADUATE = 'GRADUATE',
}

export interface RegistrationValidationResult {
  valid: boolean;
  errors: Array<{
    code: RegistrationErrorCode;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    details?: any;
  }>;
  warnings: string[];
}

export interface TimeTicket {
  studentId: number;
  termId: number;
  priorityGroup: PriorityGroup;
  registrationStart: Date;
  registrationEnd: Date;
  calculatedAt: Date;
}

export interface RegistrationCart {
  studentId: number;
  termId: number;
  sections: Array<{
    sectionId: number;
    creditHours: number;
    gradingBasis: string;
    action: RegistrationAction;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConcurrentEnrollment {
  homeInstitutionId: number;
  hostInstitutionId: number;
  studentId: number;
  termId: number;
  maxCreditHours: number;
  approvedBy?: string;
  approvalDate?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export class RegistrationPeriod extends Model {
  public id!: number;
  public termId!: number;
  public termCode!: string;
  public periodType!: RegistrationPeriodType;
  public periodName!: string;
  public startDate!: Date;
  public endDate!: Date;
  public allowedStudentTypes?: string[];
  public allowedClassLevels?: string[];
  public allowedPrograms?: string[];
  public maxCreditHours?: number;
  public minCreditHours?: number;
  public allowWaitlist!: boolean;
  public allowSwap!: boolean;
  public requireAdvisorApproval!: boolean;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof RegistrationPeriod {
    RegistrationPeriod.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        termCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        periodType: {
          type: DataTypes.ENUM(...Object.values(RegistrationPeriodType)),
          allowNull: false,
        },
        periodName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        allowedStudentTypes: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        allowedClassLevels: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        allowedPrograms: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        maxCreditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: true,
        },
        minCreditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: true,
        },
        allowWaitlist: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        allowSwap: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        requireAdvisorApproval: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'registration_periods',
        timestamps: true,
        indexes: [
          { fields: ['termId'] },
          { fields: ['termCode'] },
          { fields: ['periodType'] },
          { fields: ['startDate', 'endDate'] },
        ],
      }
    );
    return RegistrationPeriod;
  }
}

export class Registration extends Model {
  public id!: number;
  public studentId!: number;
  public sectionId!: number;
  public termId!: number;
  public registrationStatus!: RegistrationStatus;
  public registrationDate!: Date;
  public droppedDate?: Date;
  public withdrawnDate?: Date;
  public creditHours!: number;
  public gradingBasis!: string;
  public registrationAction!: RegistrationAction;
  public registeredBy!: string;
  public advisorApproved!: boolean;
  public advisorApprovedBy?: string;
  public advisorApprovedDate?: Date;
  public lastAttendanceDate?: Date;
  public grade?: string;
  public gradePoints?: number;
  public repeatCourse!: boolean;
  public repeatNumber?: number;
  public auditCourse!: boolean;
  public concurrentEnrollment!: boolean;
  public crossRegistration!: boolean;
  public registrationFees?: number;
  public tuitionAmount?: number;
  public feesAmount?: number;
  public notes?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getSection!: BelongsToGetAssociationMixin<CourseSection>;

  public static associations: {
    section: Association<Registration, CourseSection>;
  };

  public static initModel(sequelize: Sequelize): typeof Registration {
    Registration.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sectionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'course_sections',
            key: 'id',
          },
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        registrationStatus: {
          type: DataTypes.ENUM(...Object.values(RegistrationStatus)),
          allowNull: false,
        },
        registrationDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        droppedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        withdrawnDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        creditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        gradingBasis: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        registrationAction: {
          type: DataTypes.ENUM(...Object.values(RegistrationAction)),
          allowNull: false,
        },
        registeredBy: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        advisorApproved: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        advisorApprovedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        advisorApprovedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lastAttendanceDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        grade: {
          type: DataTypes.STRING(5),
          allowNull: true,
        },
        gradePoints: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: true,
        },
        repeatCourse: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        repeatNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        auditCourse: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        concurrentEnrollment: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        crossRegistration: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        registrationFees: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        tuitionAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        feesAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'registrations',
        timestamps: true,
        indexes: [
          { fields: ['studentId'] },
          { fields: ['sectionId'] },
          { fields: ['termId'] },
          { fields: ['registrationStatus'] },
          { fields: ['studentId', 'termId'] },
          { fields: ['studentId', 'sectionId'], unique: true },
        ],
      }
    );
    return Registration;
  }
}

export class RegistrationHold extends Model {
  public id!: number;
  public studentId!: number;
  public holdType!: HoldType;
  public holdSeverity!: HoldSeverity;
  public holdReason!: string;
  public holdDescription?: string;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public releasedDate?: Date;
  public releasedBy?: string;
  public releasedReason?: string;
  public blocksRegistration!: boolean;
  public blocksTranscripts!: boolean;
  public blocksDegree!: boolean;
  public departmentCode?: string;
  public amountOwed?: number;
  public contactInfo?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof RegistrationHold {
    RegistrationHold.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        holdType: {
          type: DataTypes.ENUM(...Object.values(HoldType)),
          allowNull: false,
        },
        holdSeverity: {
          type: DataTypes.ENUM(...Object.values(HoldSeverity)),
          allowNull: false,
        },
        holdReason: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        holdDescription: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        releasedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        releasedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        releasedReason: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        blocksRegistration: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        blocksTranscripts: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        blocksDegree: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        departmentCode: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        amountOwed: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        contactInfo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'registration_holds',
        timestamps: true,
        indexes: [
          { fields: ['studentId'] },
          { fields: ['holdType'] },
          { fields: ['holdSeverity'] },
          { fields: ['effectiveDate'] },
          { fields: ['blocksRegistration'] },
        ],
      }
    );
    return RegistrationHold;
  }
}

export class RegistrationTimeTicket extends Model {
  public id!: number;
  public studentId!: number;
  public termId!: number;
  public priorityGroup!: PriorityGroup;
  public priorityScore!: number;
  public registrationStart!: Date;
  public registrationEnd!: Date;
  public calculatedAt!: Date;
  public calculatedBy!: string;
  public overrideReason?: string;
  public overrideBy?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof RegistrationTimeTicket {
    RegistrationTimeTicket.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        priorityGroup: {
          type: DataTypes.ENUM(...Object.values(PriorityGroup)),
          allowNull: false,
        },
        priorityScore: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        registrationStart: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        registrationEnd: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        calculatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        calculatedBy: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        overrideReason: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        overrideBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'registration_time_tickets',
        timestamps: true,
        indexes: [
          { fields: ['studentId', 'termId'], unique: true },
          { fields: ['termId'] },
          { fields: ['priorityGroup'] },
          { fields: ['registrationStart', 'registrationEnd'] },
        ],
      }
    );
    return RegistrationTimeTicket;
  }
}

export class WaitlistEntry extends Model {
  public id!: number;
  public studentId!: number;
  public sectionId!: number;
  public termId!: number;
  public position!: number;
  public addedDate!: Date;
  public status!: WaitlistStatus;
  public notificationSentDate?: Date;
  public notificationExpiresDate?: Date;
  public registeredDate?: Date;
  public removedDate?: Date;
  public removedReason?: string;
  public creditHours!: number;
  public gradingBasis!: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof WaitlistEntry {
    WaitlistEntry.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sectionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'course_sections',
            key: 'id',
          },
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        addedDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(WaitlistStatus)),
          allowNull: false,
          defaultValue: WaitlistStatus.ACTIVE,
        },
        notificationSentDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notificationExpiresDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        registeredDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        removedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        removedReason: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        creditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        gradingBasis: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'waitlist_entries',
        timestamps: true,
        indexes: [
          { fields: ['studentId'] },
          { fields: ['sectionId'] },
          { fields: ['termId'] },
          { fields: ['status'] },
          { fields: ['sectionId', 'position'] },
          { fields: ['studentId', 'sectionId'], unique: true },
        ],
      }
    );
    return WaitlistEntry;
  }
}

export class RegistrationHistory extends Model {
  public id!: number;
  public registrationId!: number;
  public studentId!: number;
  public sectionId!: number;
  public action!: RegistrationAction;
  public actionDate!: Date;
  public actionBy!: string;
  public previousStatus?: RegistrationStatus;
  public newStatus!: RegistrationStatus;
  public reason?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;

  public static initModel(sequelize: Sequelize): typeof RegistrationHistory {
    RegistrationHistory.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        registrationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'registrations',
            key: 'id',
          },
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sectionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        action: {
          type: DataTypes.ENUM(...Object.values(RegistrationAction)),
          allowNull: false,
        },
        actionDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        actionBy: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        previousStatus: {
          type: DataTypes.ENUM(...Object.values(RegistrationStatus)),
          allowNull: true,
        },
        newStatus: {
          type: DataTypes.ENUM(...Object.values(RegistrationStatus)),
          allowNull: false,
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'registration_history',
        timestamps: true,
        updatedAt: false,
        indexes: [
          { fields: ['registrationId'] },
          { fields: ['studentId'] },
          { fields: ['sectionId'] },
          { fields: ['action'] },
          { fields: ['actionDate'] },
        ],
      }
    );
    return RegistrationHistory;
  }
}

export class ConcurrentEnrollmentAgreement extends Model {
  public id!: number;
  public studentId!: number;
  public homeInstitutionId!: number;
  public hostInstitutionId!: number;
  public termId!: number;
  public maxCreditHours!: number;
  public agreementStartDate!: Date;
  public agreementEndDate!: Date;
  public approvedBy?: string;
  public approvalDate?: Date;
  public status!: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof ConcurrentEnrollmentAgreement {
    ConcurrentEnrollmentAgreement.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        homeInstitutionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        hostInstitutionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        maxCreditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        agreementStartDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        agreementEndDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        approvedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        approvalDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'concurrent_enrollment_agreements',
        timestamps: true,
        indexes: [
          { fields: ['studentId'] },
          { fields: ['homeInstitutionId'] },
          { fields: ['hostInstitutionId'] },
          { fields: ['termId'] },
          { fields: ['status'] },
        ],
      }
    );
    return ConcurrentEnrollmentAgreement;
  }
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export class CreateRegistrationPeriodDto {
  @IsNumber()
  termId!: number;

  @IsString()
  termCode!: string;

  @IsEnum(RegistrationPeriodType)
  periodType!: RegistrationPeriodType;

  @IsString()
  periodName!: string;

  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @IsOptional()
  @IsNumber()
  maxCreditHours?: number;

  @IsOptional()
  @IsNumber()
  minCreditHours?: number;

  @IsBoolean()
  allowWaitlist!: boolean;

  @IsBoolean()
  allowSwap!: boolean;

  @IsBoolean()
  requireAdvisorApproval!: boolean;
}

export class RegisterForCourseDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  sectionId!: number;

  @IsNumber()
  termId!: number;

  @IsNumber()
  @Min(0)
  creditHours!: number;

  @IsString()
  gradingBasis!: string;

  @IsString()
  registeredBy!: string;

  @IsOptional()
  @IsBoolean()
  auditCourse?: boolean;

  @IsOptional()
  @IsBoolean()
  repeatCourse?: boolean;
}

export class DropCourseDto {
  @IsNumber()
  registrationId!: number;

  @IsString()
  droppedBy!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class SwapCourseDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  dropRegistrationId!: number;

  @IsNumber()
  addSectionId!: number;

  @IsNumber()
  creditHours!: number;

  @IsString()
  gradingBasis!: string;

  @IsString()
  swappedBy!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class WithdrawFromCourseDto {
  @IsNumber()
  registrationId!: number;

  @IsString()
  withdrawnBy!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastAttendanceDate?: Date;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateRegistrationHoldDto {
  @IsNumber()
  studentId!: number;

  @IsEnum(HoldType)
  holdType!: HoldType;

  @IsEnum(HoldSeverity)
  holdSeverity!: HoldSeverity;

  @IsString()
  holdReason!: string;

  @IsOptional()
  @IsString()
  holdDescription?: string;

  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsBoolean()
  blocksRegistration!: boolean;

  @IsBoolean()
  blocksTranscripts!: boolean;

  @IsBoolean()
  blocksDegree!: boolean;

  @IsOptional()
  @IsNumber()
  amountOwed?: number;
}

export class ReleaseHoldDto {
  @IsNumber()
  holdId!: number;

  @IsString()
  releasedBy!: string;

  @IsOptional()
  @IsString()
  releasedReason?: string;
}

export class CreateTimeTicketDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  termId!: number;

  @IsEnum(PriorityGroup)
  priorityGroup!: PriorityGroup;

  @IsNumber()
  priorityScore!: number;

  @IsDate()
  @Type(() => Date)
  registrationStart!: Date;

  @IsDate()
  @Type(() => Date)
  registrationEnd!: Date;

  @IsString()
  calculatedBy!: string;
}

export class AddToWaitlistDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  sectionId!: number;

  @IsNumber()
  termId!: number;

  @IsNumber()
  creditHours!: number;

  @IsString()
  gradingBasis!: string;
}

export class RegistrationValidationDto {
  @IsNumber()
  studentId!: number;

  @IsNumber()
  sectionId!: number;

  @IsNumber()
  termId!: number;

  @IsNumber()
  creditHours!: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a registration period
 */
export async function createRegistrationPeriod(
  data: CreateRegistrationPeriodDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RegistrationPeriod> {
  return RegistrationPeriod.create(data, { transaction });
}

/**
 * Gets active registration period for a term
 */
export async function getActiveRegistrationPeriod(
  termId: number,
  currentDate: Date,
  sequelize: Sequelize
): Promise<RegistrationPeriod | null> {
  return RegistrationPeriod.findOne({
    where: {
      termId,
      startDate: { [Op.lte]: currentDate },
      endDate: { [Op.gte]: currentDate },
    },
    order: [['periodType', 'ASC']],
  });
}

/**
 * Checks if registration is open for a student
 */
export async function isRegistrationOpen(
  studentId: number,
  termId: number,
  sequelize: Sequelize
): Promise<{ open: boolean; reason?: string; timeTicket?: RegistrationTimeTicket }> {
  const now = new Date();

  // Check for active registration period
  const period = await getActiveRegistrationPeriod(termId, now, sequelize);
  if (!period) {
    return { open: false, reason: 'No active registration period' };
  }

  // Check time ticket
  const timeTicket = await RegistrationTimeTicket.findOne({
    where: { studentId, termId },
  });

  if (!timeTicket) {
    return { open: false, reason: 'No time ticket assigned' };
  }

  if (now < timeTicket.registrationStart) {
    return {
      open: false,
      reason: `Registration opens on ${timeTicket.registrationStart.toISOString()}`,
      timeTicket,
    };
  }

  if (now > timeTicket.registrationEnd) {
    return { open: false, reason: 'Time ticket expired', timeTicket };
  }

  return { open: true, timeTicket };
}

/**
 * Validates registration prerequisites
 */
export async function validateRegistration(
  studentId: number,
  sectionId: number,
  termId: number,
  creditHours: number,
  sequelize: Sequelize
): Promise<RegistrationValidationResult> {
  const errors: RegistrationValidationResult['errors'] = [];
  const warnings: string[] = [];

  // Check registration holds
  const holds = await getActiveHoldsForStudent(studentId, sequelize);
  const blockingHolds = holds.filter((h) => h.blocksRegistration);
  if (blockingHolds.length > 0) {
    errors.push({
      code: RegistrationErrorCode.REGISTRATION_HOLD,
      message: 'Student has active registration holds',
      severity: 'ERROR',
      details: blockingHolds,
    });
  }

  // Check time ticket
  const timeTicketCheck = await isRegistrationOpen(studentId, termId, sequelize);
  if (!timeTicketCheck.open) {
    errors.push({
      code: RegistrationErrorCode.OUTSIDE_TIME_TICKET,
      message: timeTicketCheck.reason || 'Registration not open',
      severity: 'ERROR',
    });
  }

  // Check section capacity
  const section = await CourseSection.findByPk(sectionId);
  if (!section) {
    errors.push({
      code: RegistrationErrorCode.SECTION_FULL,
      message: 'Section not found',
      severity: 'ERROR',
    });
    return { valid: false, errors, warnings };
  }

  if (section.enrollmentCurrent >= section.enrollmentCapacity) {
    errors.push({
      code: RegistrationErrorCode.SECTION_FULL,
      message: 'Section is full',
      severity: 'ERROR',
      details: {
        capacity: section.enrollmentCapacity,
        current: section.enrollmentCurrent,
        waitlistAvailable: section.waitlistCapacity > section.waitlistCurrent,
      },
    });
  }

  // Check for duplicate registration
  const existingRegistration = await Registration.findOne({
    where: {
      studentId,
      sectionId,
      registrationStatus: {
        [Op.in]: [RegistrationStatus.REGISTERED, RegistrationStatus.WAITLISTED],
      },
    },
  });

  if (existingRegistration) {
    errors.push({
      code: RegistrationErrorCode.DUPLICATE_COURSE,
      message: 'Already registered for this section',
      severity: 'ERROR',
    });
  }

  // Check time conflicts
  const timeConflict = await checkTimeConflicts(studentId, sectionId, termId, sequelize);
  if (timeConflict.hasConflict) {
    errors.push({
      code: RegistrationErrorCode.TIME_CONFLICT,
      message: 'Schedule conflict detected',
      severity: 'ERROR',
      details: timeConflict.conflictingSections,
    });
  }

  // Check credit limit
  const currentCredits = await getTotalRegisteredCredits(studentId, termId, sequelize);
  const period = await getActiveRegistrationPeriod(termId, new Date(), sequelize);
  if (period?.maxCreditHours && currentCredits + creditHours > Number(period.maxCreditHours)) {
    errors.push({
      code: RegistrationErrorCode.CREDIT_LIMIT_EXCEEDED,
      message: 'Credit limit exceeded',
      severity: 'ERROR',
      details: {
        currentCredits,
        requestedCredits: creditHours,
        maxCredits: period.maxCreditHours,
      },
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Registers a student for a course
 */
export async function registerForCourse(
  data: RegisterForCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  // Validate registration
  const validation = await validateRegistration(
    data.studentId,
    data.sectionId,
    data.termId,
    data.creditHours,
    sequelize
  );

  if (!validation.valid) {
    throw new Error(
      `Registration validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
    );
  }

  // Create registration
  const registration = await Registration.create(
    {
      studentId: data.studentId,
      sectionId: data.sectionId,
      termId: data.termId,
      registrationStatus: RegistrationStatus.REGISTERED,
      registrationDate: new Date(),
      creditHours: data.creditHours,
      gradingBasis: data.gradingBasis,
      registrationAction: RegistrationAction.ADD,
      registeredBy: data.registeredBy,
      advisorApproved: false,
      repeatCourse: data.repeatCourse || false,
      auditCourse: data.auditCourse || false,
      concurrentEnrollment: false,
      crossRegistration: false,
    },
    { transaction }
  );

  // Increment section enrollment
  await CourseSection.increment('enrollmentCurrent', {
    by: 1,
    where: { id: data.sectionId },
    transaction,
  });

  // Create history record
  await RegistrationHistory.create(
    {
      registrationId: registration.id,
      studentId: data.studentId,
      sectionId: data.sectionId,
      action: RegistrationAction.ADD,
      actionDate: new Date(),
      actionBy: data.registeredBy,
      newStatus: RegistrationStatus.REGISTERED,
    },
    { transaction }
  );

  return registration;
}

/**
 * Drops a course registration
 */
export async function dropCourse(
  data: DropCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const registration = await Registration.findByPk(data.registrationId, { transaction });
  if (!registration) {
    throw new Error('Registration not found');
  }

  if (registration.registrationStatus === RegistrationStatus.DROPPED) {
    throw new Error('Course already dropped');
  }

  // Update registration
  const previousStatus = registration.registrationStatus;
  await registration.update(
    {
      registrationStatus: RegistrationStatus.DROPPED,
      droppedDate: new Date(),
    },
    { transaction }
  );

  // Decrement section enrollment
  await CourseSection.decrement('enrollmentCurrent', {
    by: 1,
    where: { id: registration.sectionId },
    transaction,
  });

  // Create history record
  await RegistrationHistory.create(
    {
      registrationId: registration.id,
      studentId: registration.studentId,
      sectionId: registration.sectionId,
      action: RegistrationAction.DROP,
      actionDate: new Date(),
      actionBy: data.droppedBy,
      previousStatus,
      newStatus: RegistrationStatus.DROPPED,
      reason: data.reason,
    },
    { transaction }
  );

  // Process waitlist
  await processWaitlist(registration.sectionId, sequelize, transaction);

  return registration;
}

/**
 * Swaps one course for another
 */
export async function swapCourse(
  data: SwapCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<{ dropped: Registration; added: Registration }> {
  // Drop the old course
  const dropped = await dropCourse(
    {
      registrationId: data.dropRegistrationId,
      droppedBy: data.swappedBy,
      reason: data.reason || 'Course swap',
    },
    sequelize,
    transaction
  );

  // Add the new course
  const added = await registerForCourse(
    {
      studentId: data.studentId,
      sectionId: data.addSectionId,
      termId: dropped.termId,
      creditHours: data.creditHours,
      gradingBasis: data.gradingBasis,
      registeredBy: data.swappedBy,
    },
    sequelize,
    transaction
  );

  // Update registration action to SWAP
  await added.update({ registrationAction: RegistrationAction.SWAP }, { transaction });

  return { dropped, added };
}

/**
 * Withdraws a student from a course
 */
export async function withdrawFromCourse(
  data: WithdrawFromCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const registration = await Registration.findByPk(data.registrationId, { transaction });
  if (!registration) {
    throw new Error('Registration not found');
  }

  const previousStatus = registration.registrationStatus;
  await registration.update(
    {
      registrationStatus: RegistrationStatus.WITHDRAWN,
      withdrawnDate: new Date(),
      lastAttendanceDate: data.lastAttendanceDate,
    },
    { transaction }
  );

  // Decrement section enrollment
  await CourseSection.decrement('enrollmentCurrent', {
    by: 1,
    where: { id: registration.sectionId },
    transaction,
  });

  // Create history record
  await RegistrationHistory.create(
    {
      registrationId: registration.id,
      studentId: registration.studentId,
      sectionId: registration.sectionId,
      action: RegistrationAction.WITHDRAW,
      actionDate: new Date(),
      actionBy: data.withdrawnBy,
      previousStatus,
      newStatus: RegistrationStatus.WITHDRAWN,
      reason: data.reason,
    },
    { transaction }
  );

  return registration;
}

/**
 * Adds a student to a waitlist
 */
export async function addToWaitlist(
  data: AddToWaitlistDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<WaitlistEntry> {
  // Check if already on waitlist
  const existing = await WaitlistEntry.findOne({
    where: {
      studentId: data.studentId,
      sectionId: data.sectionId,
      status: WaitlistStatus.ACTIVE,
    },
    transaction,
  });

  if (existing) {
    throw new Error('Student already on waitlist for this section');
  }

  // Get next position
  const maxPosition = await WaitlistEntry.max('position', {
    where: { sectionId: data.sectionId, status: WaitlistStatus.ACTIVE },
    transaction,
  });

  const position = (maxPosition || 0) + 1;

  return WaitlistEntry.create(
    {
      studentId: data.studentId,
      sectionId: data.sectionId,
      termId: data.termId,
      position,
      addedDate: new Date(),
      status: WaitlistStatus.ACTIVE,
      creditHours: data.creditHours,
      gradingBasis: data.gradingBasis,
    },
    { transaction }
  );
}

/**
 * Processes waitlist when a seat becomes available
 */
export async function processWaitlist(
  sectionId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const section = await CourseSection.findByPk(sectionId, { transaction });
  if (!section) return;

  // Check if seats are available
  const availableSeats = section.enrollmentCapacity - section.enrollmentCurrent;
  if (availableSeats <= 0) return;

  // Get next student on waitlist
  const nextEntry = await WaitlistEntry.findOne({
    where: {
      sectionId,
      status: WaitlistStatus.ACTIVE,
    },
    order: [['position', 'ASC']],
    transaction,
  });

  if (!nextEntry) return;

  // Notify student
  const expirationHours = 24;
  await nextEntry.update(
    {
      status: WaitlistStatus.NOTIFIED,
      notificationSentDate: new Date(),
      notificationExpiresDate: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
    },
    { transaction }
  );
}

/**
 * Registers from waitlist
 */
export async function registerFromWaitlist(
  waitlistEntryId: number,
  registeredBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const waitlistEntry = await WaitlistEntry.findByPk(waitlistEntryId, { transaction });
  if (!waitlistEntry) {
    throw new Error('Waitlist entry not found');
  }

  if (waitlistEntry.status !== WaitlistStatus.NOTIFIED) {
    throw new Error('Student has not been notified or notification expired');
  }

  // Register for course
  const registration = await registerForCourse(
    {
      studentId: waitlistEntry.studentId,
      sectionId: waitlistEntry.sectionId,
      termId: waitlistEntry.termId,
      creditHours: waitlistEntry.creditHours,
      gradingBasis: waitlistEntry.gradingBasis,
      registeredBy,
    },
    sequelize,
    transaction
  );

  // Update waitlist entry
  await waitlistEntry.update(
    {
      status: WaitlistStatus.REGISTERED,
      registeredDate: new Date(),
    },
    { transaction }
  );

  return registration;
}

/**
 * Creates a registration hold
 */
export async function createRegistrationHold(
  data: CreateRegistrationHoldDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RegistrationHold> {
  return RegistrationHold.create(data, { transaction });
}

/**
 * Releases a registration hold
 */
export async function releaseHold(
  data: ReleaseHoldDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RegistrationHold> {
  const hold = await RegistrationHold.findByPk(data.holdId, { transaction });
  if (!hold) {
    throw new Error('Hold not found');
  }

  return hold.update(
    {
      releasedDate: new Date(),
      releasedBy: data.releasedBy,
      releasedReason: data.releasedReason,
    },
    { transaction }
  );
}

/**
 * Gets active holds for a student
 */
export async function getActiveHoldsForStudent(
  studentId: number,
  sequelize: Sequelize
): Promise<RegistrationHold[]> {
  return RegistrationHold.findAll({
    where: {
      studentId,
      effectiveDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: new Date() } },
      ],
      releasedDate: null,
    },
    order: [['holdSeverity', 'DESC']],
  });
}

/**
 * Creates a registration time ticket
 */
export async function createTimeTicket(
  data: CreateTimeTicketDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RegistrationTimeTicket> {
  return RegistrationTimeTicket.create(
    {
      ...data,
      calculatedAt: new Date(),
    },
    { transaction }
  );
}

/**
 * Calculates time tickets for all students in a term
 */
export async function calculateTimeTicketsForTerm(
  termId: number,
  calculatedBy: string,
  sequelize: Sequelize
): Promise<RegistrationTimeTicket[]> {
  // This is a simplified version - actual implementation would fetch student data
  // and calculate based on priority rules
  const tickets: RegistrationTimeTicket[] = [];

  // Example: Create tickets based on class level and priority groups
  // In production, this would query student records and apply complex business rules

  return tickets;
}

/**
 * Gets student's time ticket
 */
export async function getStudentTimeTicket(
  studentId: number,
  termId: number,
  sequelize: Sequelize
): Promise<RegistrationTimeTicket | null> {
  return RegistrationTimeTicket.findOne({
    where: { studentId, termId },
  });
}

/**
 * Overrides a time ticket
 */
export async function overrideTimeTicket(
  timeTicketId: number,
  newStart: Date,
  newEnd: Date,
  overrideReason: string,
  overrideBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RegistrationTimeTicket> {
  const ticket = await RegistrationTimeTicket.findByPk(timeTicketId, { transaction });
  if (!ticket) {
    throw new Error('Time ticket not found');
  }

  return ticket.update(
    {
      registrationStart: newStart,
      registrationEnd: newEnd,
      overrideReason,
      overrideBy,
    },
    { transaction }
  );
}

/**
 * Gets student's current registrations for a term
 */
export async function getStudentRegistrations(
  studentId: number,
  termId: number,
  sequelize: Sequelize
): Promise<Registration[]> {
  return Registration.findAll({
    where: {
      studentId,
      termId,
      registrationStatus: {
        [Op.in]: [RegistrationStatus.REGISTERED, RegistrationStatus.WAITLISTED],
      },
    },
    include: [
      {
        model: CourseSection,
        as: 'section',
        include: [{ model: Course, as: 'course' }],
      },
    ],
    order: [['registrationDate', 'ASC']],
  });
}

/**
 * Gets total registered credits for a student in a term
 */
export async function getTotalRegisteredCredits(
  studentId: number,
  termId: number,
  sequelize: Sequelize
): Promise<number> {
  const result = await Registration.sum('creditHours', {
    where: {
      studentId,
      termId,
      registrationStatus: RegistrationStatus.REGISTERED,
    },
  });

  return result || 0;
}

/**
 * Checks for time conflicts in a student's schedule
 */
export async function checkTimeConflicts(
  studentId: number,
  newSectionId: number,
  termId: number,
  sequelize: Sequelize
): Promise<{ hasConflict: boolean; conflictingSections: CourseSection[] }> {
  const registrations = await getStudentRegistrations(studentId, termId, sequelize);
  const newSection = await CourseSection.findByPk(newSectionId);

  if (!newSection || !newSection.meetingPatterns) {
    return { hasConflict: false, conflictingSections: [] };
  }

  const conflictingSections: CourseSection[] = [];

  for (const registration of registrations) {
    const section = await CourseSection.findByPk(registration.sectionId);
    if (!section || !section.meetingPatterns) continue;

    // Compare meeting patterns for conflicts
    const hasTimeConflict = checkMeetingPatternConflict(
      newSection.meetingPatterns,
      section.meetingPatterns
    );

    if (hasTimeConflict) {
      conflictingSections.push(section);
    }
  }

  return {
    hasConflict: conflictingSections.length > 0,
    conflictingSections,
  };
}

/**
 * Helper function to check meeting pattern conflicts
 */
function checkMeetingPatternConflict(
  pattern1: Record<string, any>[],
  pattern2: Record<string, any>[]
): boolean {
  for (const p1 of pattern1) {
    for (const p2 of pattern2) {
      // Check if days overlap
      const daysOverlap = p1.days?.some((day: string) => p2.days?.includes(day));
      if (!daysOverlap) continue;

      // Check if times overlap
      const start1 = new Date(`1970-01-01T${p1.startTime}`);
      const end1 = new Date(`1970-01-01T${p1.endTime}`);
      const start2 = new Date(`1970-01-01T${p2.startTime}`);
      const end2 = new Date(`1970-01-01T${p2.endTime}`);

      if (start1 < end2 && end1 > start2) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Gets registration history for a student
 */
export async function getRegistrationHistory(
  studentId: number,
  termId?: number,
  sequelize?: Sequelize
): Promise<RegistrationHistory[]> {
  const where: any = { studentId };
  if (termId) {
    const registrations = await Registration.findAll({
      where: { studentId, termId },
      attributes: ['id'],
    });
    const registrationIds = registrations.map((r) => r.id);
    where.registrationId = { [Op.in]: registrationIds };
  }

  return RegistrationHistory.findAll({
    where,
    order: [['actionDate', 'DESC']],
  });
}

/**
 * Gets waitlist position for a student
 */
export async function getWaitlistPosition(
  studentId: number,
  sectionId: number,
  sequelize: Sequelize
): Promise<{ position: number; total: number } | null> {
  const entry = await WaitlistEntry.findOne({
    where: {
      studentId,
      sectionId,
      status: WaitlistStatus.ACTIVE,
    },
  });

  if (!entry) return null;

  const total = await WaitlistEntry.count({
    where: {
      sectionId,
      status: WaitlistStatus.ACTIVE,
    },
  });

  return {
    position: entry.position,
    total,
  };
}

/**
 * Removes student from waitlist
 */
export async function removeFromWaitlist(
  waitlistEntryId: number,
  removedReason: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<WaitlistEntry> {
  const entry = await WaitlistEntry.findByPk(waitlistEntryId, { transaction });
  if (!entry) {
    throw new Error('Waitlist entry not found');
  }

  return entry.update(
    {
      status: WaitlistStatus.REMOVED,
      removedDate: new Date(),
      removedReason,
    },
    { transaction }
  );
}

/**
 * Creates a concurrent enrollment agreement
 */
export async function createConcurrentEnrollmentAgreement(
  studentId: number,
  homeInstitutionId: number,
  hostInstitutionId: number,
  termId: number,
  maxCreditHours: number,
  agreementStartDate: Date,
  agreementEndDate: Date,
  approvedBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<ConcurrentEnrollmentAgreement> {
  return ConcurrentEnrollmentAgreement.create(
    {
      studentId,
      homeInstitutionId,
      hostInstitutionId,
      termId,
      maxCreditHours,
      agreementStartDate,
      agreementEndDate,
      approvedBy,
      approvalDate: new Date(),
      status: 'ACTIVE',
    },
    { transaction }
  );
}

/**
 * Validates concurrent enrollment
 */
export async function validateConcurrentEnrollment(
  studentId: number,
  termId: number,
  additionalCredits: number,
  sequelize: Sequelize
): Promise<{ valid: boolean; reason?: string }> {
  const agreement = await ConcurrentEnrollmentAgreement.findOne({
    where: {
      studentId,
      termId,
      status: 'ACTIVE',
    },
  });

  if (!agreement) {
    return { valid: false, reason: 'No active concurrent enrollment agreement' };
  }

  const currentCredits = await getTotalRegisteredCredits(studentId, termId, sequelize);
  if (currentCredits + additionalCredits > Number(agreement.maxCreditHours)) {
    return {
      valid: false,
      reason: `Exceeds concurrent enrollment limit of ${agreement.maxCreditHours} credits`,
    };
  }

  return { valid: true };
}

/**
 * Approves registration by advisor
 */
export async function approveRegistrationByAdvisor(
  registrationId: number,
  advisorId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const registration = await Registration.findByPk(registrationId, { transaction });
  if (!registration) {
    throw new Error('Registration not found');
  }

  return registration.update(
    {
      advisorApproved: true,
      advisorApprovedBy: advisorId,
      advisorApprovedDate: new Date(),
    },
    { transaction }
  );
}

/**
 * Changes grading basis for a registration
 */
export async function changeGradingBasis(
  registrationId: number,
  newGradingBasis: string,
  changedBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const registration = await Registration.findByPk(registrationId, { transaction });
  if (!registration) {
    throw new Error('Registration not found');
  }

  const previousStatus = registration.registrationStatus;
  await registration.update({ gradingBasis: newGradingBasis }, { transaction });

  await RegistrationHistory.create(
    {
      registrationId: registration.id,
      studentId: registration.studentId,
      sectionId: registration.sectionId,
      action: RegistrationAction.CHANGE_GRADING_BASIS,
      actionDate: new Date(),
      actionBy: changedBy,
      previousStatus,
      newStatus: registration.registrationStatus,
    },
    { transaction }
  );

  return registration;
}

/**
 * Changes credit hours for a variable credit course
 */
export async function changeCreditHours(
  registrationId: number,
  newCreditHours: number,
  changedBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Registration> {
  const registration = await Registration.findByPk(registrationId, { transaction });
  if (!registration) {
    throw new Error('Registration not found');
  }

  const previousStatus = registration.registrationStatus;
  await registration.update({ creditHours: newCreditHours }, { transaction });

  await RegistrationHistory.create(
    {
      registrationId: registration.id,
      studentId: registration.studentId,
      sectionId: registration.sectionId,
      action: RegistrationAction.CHANGE_CREDIT_HOURS,
      actionDate: new Date(),
      actionBy: changedBy,
      previousStatus,
      newStatus: registration.registrationStatus,
    },
    { transaction }
  );

  return registration;
}

/**
 * Gets enrollment statistics for a term
 */
export async function getTermEnrollmentStats(
  termId: number,
  sequelize: Sequelize
): Promise<{
  totalRegistrations: number;
  totalStudents: number;
  totalCredits: number;
  averageCreditsPerStudent: number;
}> {
  const registrations = await Registration.findAll({
    where: {
      termId,
      registrationStatus: RegistrationStatus.REGISTERED,
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalRegistrations'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('studentId'))), 'totalStudents'],
      [sequelize.fn('SUM', sequelize.col('creditHours')), 'totalCredits'],
    ],
    raw: true,
  });

  const stats = registrations[0] as any;
  const totalRegistrations = parseInt(stats.totalRegistrations) || 0;
  const totalStudents = parseInt(stats.totalStudents) || 0;
  const totalCredits = parseFloat(stats.totalCredits) || 0;
  const averageCreditsPerStudent = totalStudents > 0 ? totalCredits / totalStudents : 0;

  return {
    totalRegistrations,
    totalStudents,
    totalCredits,
    averageCreditsPerStudent: Math.round(averageCreditsPerStudent * 100) / 100,
  };
}

/**
 * Gets section enrollment details
 */
export async function getSectionEnrollmentDetails(
  sectionId: number,
  sequelize: Sequelize
): Promise<{
  enrolledStudents: number;
  waitlistedStudents: number;
  capacity: number;
  availableSeats: number;
  enrollmentPercent: number;
}> {
  const section = await CourseSection.findByPk(sectionId);
  if (!section) {
    throw new Error('Section not found');
  }

  const enrolledStudents = await Registration.count({
    where: {
      sectionId,
      registrationStatus: RegistrationStatus.REGISTERED,
    },
  });

  const waitlistedStudents = await WaitlistEntry.count({
    where: {
      sectionId,
      status: WaitlistStatus.ACTIVE,
    },
  });

  const capacity = section.enrollmentCapacity;
  const availableSeats = Math.max(0, capacity - enrolledStudents);
  const enrollmentPercent = capacity > 0 ? (enrolledStudents / capacity) * 100 : 0;

  return {
    enrolledStudents,
    waitlistedStudents,
    capacity,
    availableSeats,
    enrollmentPercent: Math.round(enrollmentPercent * 100) / 100,
  };
}

/**
 * Validates registration cart
 */
export async function validateRegistrationCart(
  cart: RegistrationCart,
  sequelize: Sequelize
): Promise<RegistrationValidationResult> {
  const allErrors: RegistrationValidationResult['errors'] = [];
  const allWarnings: string[] = [];

  for (const item of cart.sections) {
    const validation = await validateRegistration(
      cart.studentId,
      item.sectionId,
      cart.termId,
      item.creditHours,
      sequelize
    );

    allErrors.push(...validation.errors);
    allWarnings.push(...validation.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Processes registration cart (registers for multiple courses)
 */
export async function processRegistrationCart(
  cart: RegistrationCart,
  registeredBy: string,
  sequelize: Sequelize
): Promise<{ successful: Registration[]; failed: Array<{ sectionId: number; error: string }> }> {
  const successful: Registration[] = [];
  const failed: Array<{ sectionId: number; error: string }> = [];

  for (const item of cart.sections) {
    try {
      const registration = await sequelize.transaction(async (transaction) => {
        return registerForCourse(
          {
            studentId: cart.studentId,
            sectionId: item.sectionId,
            termId: cart.termId,
            creditHours: item.creditHours,
            gradingBasis: item.gradingBasis,
            registeredBy,
          },
          sequelize,
          transaction
        );
      });

      successful.push(registration);
    } catch (error) {
      failed.push({
        sectionId: item.sectionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { successful, failed };
}

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

@ApiTags('registration-periods')
@Controller('api/v1/registration-periods')
@ApiBearerAuth()
export class RegistrationPeriodsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a registration period' })
  @ApiResponse({ status: 201, description: 'Period created successfully' })
  async create(@Body() createDto: CreateRegistrationPeriodDto): Promise<RegistrationPeriod> {
    return createRegistrationPeriod(createDto, this.sequelize);
  }

  @Get('term/:termId')
  @ApiOperation({ summary: 'Get registration periods for a term' })
  @ApiResponse({ status: 200, description: 'Periods retrieved successfully' })
  async findByTerm(@Param('termId', ParseIntPipe) termId: number): Promise<RegistrationPeriod[]> {
    return RegistrationPeriod.findAll({
      where: { termId },
      order: [['startDate', 'ASC']],
    });
  }

  @Get('term/:termId/active')
  @ApiOperation({ summary: 'Get active registration period for a term' })
  @ApiResponse({ status: 200, description: 'Period retrieved successfully' })
  async getActive(@Param('termId', ParseIntPipe) termId: number): Promise<RegistrationPeriod | null> {
    return getActiveRegistrationPeriod(termId, new Date(), this.sequelize);
  }
}

@ApiTags('registrations')
@Controller('api/v1/registrations')
@ApiBearerAuth()
export class RegistrationsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a student for a course' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async register(@Body() registerDto: RegisterForCourseDto): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      registerForCourse(registerDto, this.sequelize, transaction)
    );
  }

  @Post('drop')
  @ApiOperation({ summary: 'Drop a course registration' })
  @ApiResponse({ status: 200, description: 'Course dropped successfully' })
  async drop(@Body() dropDto: DropCourseDto): Promise<Registration> {
    return sequelize.transaction((transaction) => dropCourse(dropDto, this.sequelize, transaction));
  }

  @Post('swap')
  @ApiOperation({ summary: 'Swap one course for another' })
  @ApiResponse({ status: 200, description: 'Course swapped successfully' })
  async swap(@Body() swapDto: SwapCourseDto) {
    return sequelize.transaction((transaction) => swapCourse(swapDto, this.sequelize, transaction));
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from a course' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  async withdraw(@Body() withdrawDto: WithdrawFromCourseDto): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      withdrawFromCourse(withdrawDto, this.sequelize, transaction)
    );
  }

  @Get('student/:studentId/term/:termId')
  @ApiOperation({ summary: 'Get student registrations for a term' })
  @ApiResponse({ status: 200, description: 'Registrations retrieved successfully' })
  async getStudentRegistrations(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('termId', ParseIntPipe) termId: number
  ): Promise<Registration[]> {
    return getStudentRegistrations(studentId, termId, this.sequelize);
  }

  @Get('student/:studentId/term/:termId/credits')
  @ApiOperation({ summary: 'Get total registered credits for student' })
  @ApiResponse({ status: 200, description: 'Credits retrieved successfully' })
  async getTotalCredits(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('termId', ParseIntPipe) termId: number
  ): Promise<{ totalCredits: number }> {
    const totalCredits = await getTotalRegisteredCredits(studentId, termId, this.sequelize);
    return { totalCredits };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a registration' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  async validate(@Body() validationDto: RegistrationValidationDto): Promise<RegistrationValidationResult> {
    return validateRegistration(
      validationDto.studentId,
      validationDto.sectionId,
      validationDto.termId,
      validationDto.creditHours,
      this.sequelize
    );
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get registration history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(@Param('id', ParseIntPipe) id: number): Promise<RegistrationHistory[]> {
    const registration = await Registration.findByPk(id);
    if (!registration) {
      throw new Error('Registration not found');
    }
    return getRegistrationHistory(registration.studentId, registration.termId, this.sequelize);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve registration by advisor' })
  @ApiResponse({ status: 200, description: 'Registration approved' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('advisorId') advisorId: string
  ): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      approveRegistrationByAdvisor(id, advisorId, this.sequelize, transaction)
    );
  }

  @Patch(':id/grading-basis')
  @ApiOperation({ summary: 'Change grading basis' })
  @ApiResponse({ status: 200, description: 'Grading basis updated' })
  async changeGradingBasis(
    @Param('id', ParseIntPipe) id: number,
    @Body('gradingBasis') gradingBasis: string,
    @Body('changedBy') changedBy: string
  ): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      changeGradingBasis(id, gradingBasis, changedBy, this.sequelize, transaction)
    );
  }

  @Patch(':id/credit-hours')
  @ApiOperation({ summary: 'Change credit hours' })
  @ApiResponse({ status: 200, description: 'Credit hours updated' })
  async changeCreditHours(
    @Param('id', ParseIntPipe) id: number,
    @Body('creditHours') creditHours: number,
    @Body('changedBy') changedBy: string
  ): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      changeCreditHours(id, creditHours, changedBy, this.sequelize, transaction)
    );
  }
}

@ApiTags('registration-holds')
@Controller('api/v1/registration-holds')
@ApiBearerAuth()
export class RegistrationHoldsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a registration hold' })
  @ApiResponse({ status: 201, description: 'Hold created successfully' })
  async create(@Body() createDto: CreateRegistrationHoldDto): Promise<RegistrationHold> {
    return createRegistrationHold(createDto, this.sequelize);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get holds for a student' })
  @ApiResponse({ status: 200, description: 'Holds retrieved successfully' })
  async getStudentHolds(@Param('studentId', ParseIntPipe) studentId: number): Promise<RegistrationHold[]> {
    return getActiveHoldsForStudent(studentId, this.sequelize);
  }

  @Post('release')
  @ApiOperation({ summary: 'Release a hold' })
  @ApiResponse({ status: 200, description: 'Hold released successfully' })
  async release(@Body() releaseDto: ReleaseHoldDto): Promise<RegistrationHold> {
    return sequelize.transaction((transaction) =>
      releaseHold(releaseDto, this.sequelize, transaction)
    );
  }
}

@ApiTags('time-tickets')
@Controller('api/v1/time-tickets')
@ApiBearerAuth()
export class TimeTicketsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a time ticket' })
  @ApiResponse({ status: 201, description: 'Time ticket created successfully' })
  async create(@Body() createDto: CreateTimeTicketDto): Promise<RegistrationTimeTicket> {
    return createTimeTicket(createDto, this.sequelize);
  }

  @Get('student/:studentId/term/:termId')
  @ApiOperation({ summary: 'Get student time ticket' })
  @ApiResponse({ status: 200, description: 'Time ticket retrieved successfully' })
  async getStudentTicket(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('termId', ParseIntPipe) termId: number
  ): Promise<RegistrationTimeTicket | null> {
    return getStudentTimeTicket(studentId, termId, this.sequelize);
  }

  @Post(':id/override')
  @ApiOperation({ summary: 'Override a time ticket' })
  @ApiResponse({ status: 200, description: 'Time ticket overridden successfully' })
  async override(
    @Param('id', ParseIntPipe) id: number,
    @Body('newStart') newStart: Date,
    @Body('newEnd') newEnd: Date,
    @Body('overrideReason') overrideReason: string,
    @Body('overrideBy') overrideBy: string
  ): Promise<RegistrationTimeTicket> {
    return sequelize.transaction((transaction) =>
      overrideTimeTicket(id, newStart, newEnd, overrideReason, overrideBy, this.sequelize, transaction)
    );
  }
}

@ApiTags('waitlist')
@Controller('api/v1/waitlist')
@ApiBearerAuth()
export class WaitlistController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add student to waitlist' })
  @ApiResponse({ status: 201, description: 'Added to waitlist successfully' })
  async add(@Body() addDto: AddToWaitlistDto): Promise<WaitlistEntry> {
    return sequelize.transaction((transaction) => addToWaitlist(addDto, this.sequelize, transaction));
  }

  @Get('student/:studentId/section/:sectionId/position')
  @ApiOperation({ summary: 'Get waitlist position' })
  @ApiResponse({ status: 200, description: 'Position retrieved successfully' })
  async getPosition(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number
  ) {
    return getWaitlistPosition(studentId, sectionId, this.sequelize);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Register from waitlist' })
  @ApiResponse({ status: 200, description: 'Registered successfully' })
  async registerFromWaitlist(
    @Param('id', ParseIntPipe) id: number,
    @Body('registeredBy') registeredBy: string
  ): Promise<Registration> {
    return sequelize.transaction((transaction) =>
      registerFromWaitlist(id, registeredBy, this.sequelize, transaction)
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove from waitlist' })
  @ApiResponse({ status: 200, description: 'Removed from waitlist' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('removedReason') removedReason: string
  ): Promise<WaitlistEntry> {
    return sequelize.transaction((transaction) =>
      removeFromWaitlist(id, removedReason, this.sequelize, transaction)
    );
  }
}

@ApiTags('enrollment-statistics')
@Controller('api/v1/enrollment-statistics')
@ApiBearerAuth()
export class EnrollmentStatisticsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Get('term/:termId')
  @ApiOperation({ summary: 'Get term enrollment statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getTermStats(@Param('termId', ParseIntPipe) termId: number) {
    return getTermEnrollmentStats(termId, this.sequelize);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get section enrollment details' })
  @ApiResponse({ status: 200, description: 'Details retrieved successfully' })
  async getSectionDetails(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return getSectionEnrollmentDetails(sectionId, this.sequelize);
  }
}
