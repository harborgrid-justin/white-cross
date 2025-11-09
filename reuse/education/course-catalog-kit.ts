/**
 * LOC: EDUCUCRSCATL001
 * File: /reuse/education/course-catalog-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Course management controllers
 *   - Academic scheduling systems
 */

/**
 * File: /reuse/education/course-catalog-kit.ts
 * Locator: WC-EDU-CRSE-001
 * Purpose: Comprehensive Course Catalog Management - Ellucian Banner/Colleague-level SIS functionality
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Education controllers, course services, scheduling engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 45+ utility functions for course catalog, course creation, prerequisites, capacity, scheduling
 *
 * LLM Context: Enterprise-grade course catalog management system competing with Ellucian Banner/Colleague.
 * Provides complete course lifecycle management, course prerequisites/corequisites, course equivalencies,
 * capacity management, scheduling rules, course descriptions, approval workflows, section management,
 * cross-listing, attribute management, fee structures, grading policies, transfer credit evaluation.
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Transaction,
  Op,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
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
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  DISCONTINUED = 'DISCONTINUED',
}

export enum CourseLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  DOCTORAL = 'DOCTORAL',
  PROFESSIONAL = 'PROFESSIONAL',
  CONTINUING_EDUCATION = 'CONTINUING_EDUCATION',
  NON_CREDIT = 'NON_CREDIT',
}

export enum InstructionMethod {
  IN_PERSON = 'IN_PERSON',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
  HYFLEX = 'HYFLEX',
  ASYNCHRONOUS = 'ASYNCHRONOUS',
  SYNCHRONOUS = 'SYNCHRONOUS',
}

export enum GradingBasis {
  LETTER_GRADE = 'LETTER_GRADE',
  PASS_FAIL = 'PASS_FAIL',
  SATISFACTORY_UNSATISFACTORY = 'SATISFACTORY_UNSATISFACTORY',
  AUDIT = 'AUDIT',
  HONORS = 'HONORS',
  CREDIT_NO_CREDIT = 'CREDIT_NO_CREDIT',
}

export enum SectionStatus {
  PLANNING = 'PLANNING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  FULL = 'FULL',
  WAITLIST = 'WAITLIST',
}

export enum PrerequisiteType {
  PREREQUISITE = 'PREREQUISITE',
  COREQUISITE = 'COREQUISITE',
  CONCURRENT = 'CONCURRENT',
  RECOMMENDED = 'RECOMMENDED',
  RESTRICTED = 'RESTRICTED',
}

export enum ApprovalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
}

export interface CourseAttribute {
  attributeCode: string;
  attributeName: string;
  attributeValue: string;
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface CourseFee {
  feeType: string;
  feeAmount: number;
  feeDescription: string;
  mandatory: boolean;
  refundable: boolean;
}

export interface CourseOutcome {
  outcomeId: string;
  description: string;
  assessmentMethods: string[];
  bloomLevel: number;
}

export interface SchedulingRule {
  ruleId: string;
  ruleType: 'TIME_BLOCK' | 'ROOM_TYPE' | 'INSTRUCTOR_PREFERENCE' | 'ENROLLMENT_CAP';
  parameters: Record<string, any>;
  priority: number;
}

export interface TransferEquivalency {
  institutionId: string;
  institutionName: string;
  externalCourseCode: string;
  externalCourseName: string;
  creditHours: number;
  effectiveDate: Date;
  expirationDate?: Date;
  notes?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export class CourseCatalog extends Model {
  public id!: number;
  public catalogYear!: number;
  public catalogTerm!: string;
  public catalogName!: string;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public status!: CourseStatus;
  public description?: string;
  public publishedDate?: Date;
  public publishedBy?: string;
  public version!: number;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getCourses!: HasManyGetAssociationsMixin<Course>;
  public addCourse!: HasManyAddAssociationMixin<Course, number>;
  public createCourse!: HasManyCreateAssociationMixin<Course>;

  public static associations: {
    courses: Association<CourseCatalog, Course>;
  };

  public static initModel(sequelize: Sequelize): typeof CourseCatalog {
    CourseCatalog.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        catalogYear: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1900,
            max: 2100,
          },
        },
        catalogTerm: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        catalogName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(CourseStatus)),
          allowNull: false,
          defaultValue: CourseStatus.DRAFT,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        publishedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        publishedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'course_catalogs',
        timestamps: true,
        indexes: [
          { fields: ['catalogYear', 'catalogTerm'] },
          { fields: ['status'] },
          { fields: ['effectiveDate'] },
        ],
      }
    );
    return CourseCatalog;
  }
}

export class Course extends Model {
  public id!: number;
  public courseCode!: string;
  public subjectCode!: string;
  public courseNumber!: string;
  public courseTitle!: string;
  public longTitle?: string;
  public description!: string;
  public creditHours!: number;
  public minCreditHours?: number;
  public maxCreditHours?: number;
  public contactHours!: number;
  public lectureHours?: number;
  public labHours?: number;
  public clinicalHours?: number;
  public courseLevel!: CourseLevel;
  public status!: CourseStatus;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public catalogId?: number;
  public departmentId?: number;
  public collegeId?: number;
  public instructionMethod!: InstructionMethod;
  public gradingBasis!: GradingBasis;
  public repeatableForCredit!: boolean;
  public maxRepetitions?: number;
  public crossListedWith?: string[];
  public attributes?: CourseAttribute[];
  public fees?: CourseFee[];
  public learningOutcomes?: CourseOutcome[];
  public syllabus?: string;
  public prerequisites?: string;
  public corequisites?: string;
  public restrictedTo?: string[];
  public approvalWorkflowId?: number;
  public approvedBy?: string;
  public approvedDate?: Date;
  public version!: number;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getCatalog!: BelongsToGetAssociationMixin<CourseCatalog>;
  public getSections!: HasManyGetAssociationsMixin<CourseSection>;
  public getPrerequisites!: BelongsToManyGetAssociationsMixin<Course>;
  public getCorequisites!: BelongsToManyGetAssociationsMixin<Course>;

  public static associations: {
    catalog: Association<Course, CourseCatalog>;
    sections: Association<Course, CourseSection>;
    prerequisites: Association<Course, Course>;
    corequisites: Association<Course, Course>;
  };

  public static initModel(sequelize: Sequelize): typeof Course {
    Course.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },
        subjectCode: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        courseNumber: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        courseTitle: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        longTitle: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        creditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 99.99,
          },
        },
        minCreditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: true,
        },
        maxCreditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: true,
        },
        contactHours: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
        },
        lectureHours: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
        },
        labHours: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
        },
        clinicalHours: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
        },
        courseLevel: {
          type: DataTypes.ENUM(...Object.values(CourseLevel)),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(CourseStatus)),
          allowNull: false,
          defaultValue: CourseStatus.DRAFT,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        catalogId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'course_catalogs',
            key: 'id',
          },
        },
        departmentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        collegeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        instructionMethod: {
          type: DataTypes.ENUM(...Object.values(InstructionMethod)),
          allowNull: false,
          defaultValue: InstructionMethod.IN_PERSON,
        },
        gradingBasis: {
          type: DataTypes.ENUM(...Object.values(GradingBasis)),
          allowNull: false,
          defaultValue: GradingBasis.LETTER_GRADE,
        },
        repeatableForCredit: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        maxRepetitions: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        crossListedWith: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        attributes: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        fees: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        learningOutcomes: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        syllabus: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        prerequisites: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        corequisites: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        restrictedTo: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        approvalWorkflowId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        approvedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        approvedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'courses',
        timestamps: true,
        indexes: [
          { fields: ['courseCode'], unique: true },
          { fields: ['subjectCode', 'courseNumber'] },
          { fields: ['status'] },
          { fields: ['courseLevel'] },
          { fields: ['catalogId'] },
          { fields: ['departmentId'] },
        ],
      }
    );
    return Course;
  }
}

export class CourseSection extends Model {
  public id!: number;
  public courseId!: number;
  public sectionNumber!: string;
  public sectionCode!: string;
  public termId!: number;
  public termCode!: string;
  public academicYear!: number;
  public status!: SectionStatus;
  public enrollmentCapacity!: number;
  public enrollmentCurrent!: number;
  public waitlistCapacity!: number;
  public waitlistCurrent!: number;
  public instructionMethod!: InstructionMethod;
  public meetingPatterns?: Record<string, any>[];
  public instructorIds?: number[];
  public roomIds?: number[];
  public startDate!: Date;
  public endDate!: Date;
  public censusDate?: Date;
  public withdrawalDeadline?: Date;
  public gradingBasis!: GradingBasis;
  public crossListedWith?: number[];
  public combinedWith?: number[];
  public fees?: CourseFee[];
  public notes?: string;
  public schedulingRules?: SchedulingRule[];
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getCourse!: BelongsToGetAssociationMixin<Course>;

  public static associations: {
    course: Association<CourseSection, Course>;
  };

  public static initModel(sequelize: Sequelize): typeof CourseSection {
    CourseSection.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        sectionNumber: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        sectionCode: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        termId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        termCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        academicYear: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(SectionStatus)),
          allowNull: false,
          defaultValue: SectionStatus.PLANNING,
        },
        enrollmentCapacity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        enrollmentCurrent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        waitlistCapacity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        waitlistCurrent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        instructionMethod: {
          type: DataTypes.ENUM(...Object.values(InstructionMethod)),
          allowNull: false,
        },
        meetingPatterns: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        instructorIds: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        roomIds: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        censusDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        withdrawalDeadline: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        gradingBasis: {
          type: DataTypes.ENUM(...Object.values(GradingBasis)),
          allowNull: false,
        },
        crossListedWith: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        combinedWith: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
        fees: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        schedulingRules: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'course_sections',
        timestamps: true,
        indexes: [
          { fields: ['sectionCode'], unique: true },
          { fields: ['courseId'] },
          { fields: ['termId'] },
          { fields: ['termCode'] },
          { fields: ['academicYear'] },
          { fields: ['status'] },
        ],
      }
    );
    return CourseSection;
  }
}

export class CoursePrerequisite extends Model {
  public id!: number;
  public courseId!: number;
  public prerequisiteType!: PrerequisiteType;
  public prerequisiteCourseId?: number;
  public prerequisiteExpression?: string;
  public minimumGrade?: string;
  public testScore?: Record<string, any>;
  public enforced!: boolean;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof CoursePrerequisite {
    CoursePrerequisite.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        prerequisiteType: {
          type: DataTypes.ENUM(...Object.values(PrerequisiteType)),
          allowNull: false,
        },
        prerequisiteCourseId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        prerequisiteExpression: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        minimumGrade: {
          type: DataTypes.STRING(5),
          allowNull: true,
        },
        testScore: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        enforced: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'course_prerequisites',
        timestamps: true,
        indexes: [
          { fields: ['courseId'] },
          { fields: ['prerequisiteCourseId'] },
          { fields: ['prerequisiteType'] },
        ],
      }
    );
    return CoursePrerequisite;
  }
}

export class CourseEquivalency extends Model {
  public id!: number;
  public courseId!: number;
  public equivalentCourseId?: number;
  public transferEquivalency?: TransferEquivalency;
  public equivalencyType!: 'INTERNAL' | 'TRANSFER' | 'EXAM' | 'PORTFOLIO';
  public creditHours!: number;
  public effectiveDate!: Date;
  public expirationDate?: Date;
  public approvedBy?: string;
  public approvedDate?: Date;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof CourseEquivalency {
    CourseEquivalency.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        equivalentCourseId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        transferEquivalency: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        equivalencyType: {
          type: DataTypes.ENUM('INTERNAL', 'TRANSFER', 'EXAM', 'PORTFOLIO'),
          allowNull: false,
        },
        creditHours: {
          type: DataTypes.DECIMAL(4, 2),
          allowNull: false,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        approvedBy: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        approvedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'course_equivalencies',
        timestamps: true,
        indexes: [
          { fields: ['courseId'] },
          { fields: ['equivalentCourseId'] },
          { fields: ['equivalencyType'] },
        ],
      }
    );
    return CourseEquivalency;
  }
}

export class CourseApprovalWorkflow extends Model {
  public id!: number;
  public courseId!: number;
  public workflowType!: 'NEW_COURSE' | 'MODIFICATION' | 'DISCONTINUATION';
  public status!: ApprovalStatus;
  public currentStepId?: number;
  public submittedBy!: string;
  public submittedDate!: Date;
  public approvalSteps?: Array<{
    stepId: number;
    stepName: string;
    approverRole: string;
    approverId?: string;
    status: ApprovalStatus;
    comments?: string;
    actionDate?: Date;
  }>;
  public completedDate?: Date;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof CourseApprovalWorkflow {
    CourseApprovalWorkflow.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'courses',
            key: 'id',
          },
        },
        workflowType: {
          type: DataTypes.ENUM('NEW_COURSE', 'MODIFICATION', 'DISCONTINUATION'),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
          allowNull: false,
          defaultValue: ApprovalStatus.DRAFT,
        },
        currentStepId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        submittedBy: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        submittedDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        approvalSteps: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        completedDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'course_approval_workflows',
        timestamps: true,
        indexes: [
          { fields: ['courseId'] },
          { fields: ['status'] },
          { fields: ['workflowType'] },
        ],
      }
    );
    return CourseApprovalWorkflow;
  }
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export class CreateCourseCatalogDto {
  @IsNumber()
  @Min(1900)
  @Max(2100)
  catalogYear!: number;

  @IsString()
  @Length(1, 20)
  catalogTerm!: string;

  @IsString()
  @Length(1, 255)
  catalogName!: string;

  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCourseCatalogDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  catalogName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  effectiveDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCourseDto {
  @IsString()
  @Length(1, 20)
  @Matches(/^[A-Z]{3,4}\s?\d{3,4}[A-Z]?$/, {
    message: 'Course code must follow pattern: ABC 1234 or ABCD1234',
  })
  courseCode!: string;

  @IsString()
  @Length(1, 10)
  subjectCode!: string;

  @IsString()
  @Length(1, 10)
  courseNumber!: string;

  @IsString()
  @Length(1, 255)
  courseTitle!: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  longTitle?: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(99.99)
  creditHours!: number;

  @IsOptional()
  @IsNumber()
  minCreditHours?: number;

  @IsOptional()
  @IsNumber()
  maxCreditHours?: number;

  @IsNumber()
  @Min(0)
  contactHours!: number;

  @IsOptional()
  @IsNumber()
  lectureHours?: number;

  @IsOptional()
  @IsNumber()
  labHours?: number;

  @IsOptional()
  @IsNumber()
  clinicalHours?: number;

  @IsEnum(CourseLevel)
  courseLevel!: CourseLevel;

  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsNumber()
  catalogId?: number;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsNumber()
  collegeId?: number;

  @IsEnum(InstructionMethod)
  instructionMethod!: InstructionMethod;

  @IsEnum(GradingBasis)
  gradingBasis!: GradingBasis;

  @IsBoolean()
  repeatableForCredit!: boolean;

  @IsOptional()
  @IsNumber()
  maxRepetitions?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  crossListedWith?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  attributes?: CourseAttribute[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  fees?: CourseFee[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  learningOutcomes?: CourseOutcome[];

  @IsOptional()
  @IsString()
  syllabus?: string;

  @IsOptional()
  @IsString()
  prerequisites?: string;

  @IsOptional()
  @IsString()
  corequisites?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictedTo?: string[];
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  courseTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  creditHours?: number;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsEnum(InstructionMethod)
  instructionMethod?: InstructionMethod;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  fees?: CourseFee[];

  @IsOptional()
  @IsString()
  syllabus?: string;
}

export class CreateCourseSectionDto {
  @IsNumber()
  courseId!: number;

  @IsString()
  @Length(1, 10)
  sectionNumber!: string;

  @IsNumber()
  termId!: number;

  @IsString()
  termCode!: string;

  @IsNumber()
  academicYear!: number;

  @IsNumber()
  @Min(0)
  enrollmentCapacity!: number;

  @IsNumber()
  @Min(0)
  waitlistCapacity!: number;

  @IsEnum(InstructionMethod)
  instructionMethod!: InstructionMethod;

  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @IsEnum(GradingBasis)
  gradingBasis!: GradingBasis;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  instructorIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roomIds?: number[];
}

export class UpdateCourseSectionDto {
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: SectionStatus;

  @IsOptional()
  @IsNumber()
  enrollmentCapacity?: number;

  @IsOptional()
  @IsNumber()
  waitlistCapacity?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  instructorIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roomIds?: number[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateCoursePrerequisiteDto {
  @IsNumber()
  courseId!: number;

  @IsEnum(PrerequisiteType)
  prerequisiteType!: PrerequisiteType;

  @IsOptional()
  @IsNumber()
  prerequisiteCourseId?: number;

  @IsOptional()
  @IsString()
  prerequisiteExpression?: string;

  @IsOptional()
  @IsString()
  minimumGrade?: string;

  @IsBoolean()
  enforced!: boolean;

  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;
}

export class CreateCourseEquivalencyDto {
  @IsNumber()
  courseId!: number;

  @IsOptional()
  @IsNumber()
  equivalentCourseId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  transferEquivalency?: TransferEquivalency;

  @IsEnum(['INTERNAL', 'TRANSFER', 'EXAM', 'PORTFOLIO'])
  equivalencyType!: 'INTERNAL' | 'TRANSFER' | 'EXAM' | 'PORTFOLIO';

  @IsNumber()
  creditHours!: number;

  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;
}

export class CourseSearchQueryDto {
  @IsOptional()
  @IsString()
  subjectCode?: string;

  @IsOptional()
  @IsString()
  courseNumber?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  courseLevel?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  catalogId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minCreditHours?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxCreditHours?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a new course catalog
 */
export async function createCourseCatalog(
  data: CreateCourseCatalogDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseCatalog> {
  return CourseCatalog.create(
    {
      ...data,
      status: CourseStatus.DRAFT,
      version: 1,
    },
    { transaction }
  );
}

/**
 * Updates an existing course catalog
 */
export async function updateCourseCatalog(
  catalogId: number,
  data: UpdateCourseCatalogDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseCatalog> {
  const catalog = await CourseCatalog.findByPk(catalogId, { transaction });
  if (!catalog) {
    throw new Error(`Course catalog with ID ${catalogId} not found`);
  }
  return catalog.update(data, { transaction });
}

/**
 * Publishes a course catalog
 */
export async function publishCourseCatalog(
  catalogId: number,
  publishedBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseCatalog> {
  const catalog = await CourseCatalog.findByPk(catalogId, { transaction });
  if (!catalog) {
    throw new Error(`Course catalog with ID ${catalogId} not found`);
  }
  return catalog.update(
    {
      status: CourseStatus.ACTIVE,
      publishedDate: new Date(),
      publishedBy,
    },
    { transaction }
  );
}

/**
 * Creates a new course
 */
export async function createCourse(
  data: CreateCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  return Course.create(
    {
      ...data,
      status: CourseStatus.DRAFT,
      version: 1,
    },
    { transaction }
  );
}

/**
 * Updates an existing course
 */
export async function updateCourse(
  courseId: number,
  data: UpdateCourseDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  const updatedCourse = await course.update(data, { transaction });
  await updatedCourse.increment('version', { transaction });

  return updatedCourse;
}

/**
 * Retrieves a course by code
 */
export async function getCourseByCode(
  courseCode: string,
  sequelize: Sequelize
): Promise<Course | null> {
  return Course.findOne({
    where: { courseCode },
    include: [
      { model: CourseCatalog, as: 'catalog' },
      { model: CourseSection, as: 'sections' },
    ],
  });
}

/**
 * Searches courses with filters
 */
export async function searchCourses(
  query: CourseSearchQueryDto,
  sequelize: Sequelize
): Promise<{ courses: Course[]; total: number; page: number; totalPages: number }> {
  const where: any = {};

  if (query.subjectCode) {
    where.subjectCode = query.subjectCode;
  }
  if (query.courseNumber) {
    where.courseNumber = query.courseNumber;
  }
  if (query.keyword) {
    where[Op.or] = [
      { courseTitle: { [Op.iLike]: `%${query.keyword}%` } },
      { description: { [Op.iLike]: `%${query.keyword}%` } },
    ];
  }
  if (query.courseLevel) {
    where.courseLevel = query.courseLevel;
  }
  if (query.status) {
    where.status = query.status;
  }
  if (query.catalogId) {
    where.catalogId = query.catalogId;
  }
  if (query.minCreditHours !== undefined || query.maxCreditHours !== undefined) {
    where.creditHours = {};
    if (query.minCreditHours !== undefined) {
      where.creditHours[Op.gte] = query.minCreditHours;
    }
    if (query.maxCreditHours !== undefined) {
      where.creditHours[Op.lte] = query.maxCreditHours;
    }
  }

  const page = query.page || 1;
  const limit = query.limit || 20;
  const offset = (page - 1) * limit;

  const { rows: courses, count: total } = await Course.findAndCountAll({
    where,
    limit,
    offset,
    order: [['subjectCode', 'ASC'], ['courseNumber', 'ASC']],
  });

  return {
    courses,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Creates a course section
 */
export async function createCourseSection(
  data: CreateCourseSectionDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseSection> {
  const course = await Course.findByPk(data.courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${data.courseId} not found`);
  }

  const sectionCode = `${course.courseCode}-${data.sectionNumber}-${data.termCode}`;

  return CourseSection.create(
    {
      ...data,
      sectionCode,
      status: SectionStatus.PLANNING,
      enrollmentCurrent: 0,
      waitlistCurrent: 0,
    },
    { transaction }
  );
}

/**
 * Updates a course section
 */
export async function updateCourseSection(
  sectionId: number,
  data: UpdateCourseSectionDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseSection> {
  const section = await CourseSection.findByPk(sectionId, { transaction });
  if (!section) {
    throw new Error(`Course section with ID ${sectionId} not found`);
  }
  return section.update(data, { transaction });
}

/**
 * Gets available sections for a course in a term
 */
export async function getAvailableSections(
  courseId: number,
  termId: number,
  sequelize: Sequelize
): Promise<CourseSection[]> {
  return CourseSection.findAll({
    where: {
      courseId,
      termId,
      status: {
        [Op.in]: [SectionStatus.OPEN, SectionStatus.WAITLIST],
      },
    },
    include: [{ model: Course, as: 'course' }],
  });
}

/**
 * Checks section capacity availability
 */
export async function checkSectionCapacity(
  sectionId: number,
  sequelize: Sequelize
): Promise<{
  hasCapacity: boolean;
  availableSeats: number;
  waitlistAvailable: boolean;
  waitlistSeats: number;
}> {
  const section = await CourseSection.findByPk(sectionId);
  if (!section) {
    throw new Error(`Course section with ID ${sectionId} not found`);
  }

  const availableSeats = section.enrollmentCapacity - section.enrollmentCurrent;
  const waitlistSeats = section.waitlistCapacity - section.waitlistCurrent;

  return {
    hasCapacity: availableSeats > 0,
    availableSeats,
    waitlistAvailable: waitlistSeats > 0,
    waitlistSeats,
  };
}

/**
 * Increments section enrollment
 */
export async function incrementSectionEnrollment(
  sectionId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseSection> {
  const section = await CourseSection.findByPk(sectionId, { transaction });
  if (!section) {
    throw new Error(`Course section with ID ${sectionId} not found`);
  }

  await section.increment('enrollmentCurrent', { transaction });
  await section.reload({ transaction });

  // Update status based on enrollment
  if (section.enrollmentCurrent >= section.enrollmentCapacity) {
    if (section.waitlistCapacity > 0) {
      await section.update({ status: SectionStatus.WAITLIST }, { transaction });
    } else {
      await section.update({ status: SectionStatus.FULL }, { transaction });
    }
  }

  return section;
}

/**
 * Decrements section enrollment
 */
export async function decrementSectionEnrollment(
  sectionId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseSection> {
  const section = await CourseSection.findByPk(sectionId, { transaction });
  if (!section) {
    throw new Error(`Course section with ID ${sectionId} not found`);
  }

  await section.decrement('enrollmentCurrent', { transaction });
  await section.reload({ transaction });

  // Update status based on enrollment
  if (section.enrollmentCurrent < section.enrollmentCapacity && section.status === SectionStatus.FULL) {
    await section.update({ status: SectionStatus.OPEN }, { transaction });
  }

  return section;
}

/**
 * Adds a course prerequisite
 */
export async function addCoursePrerequisite(
  data: CreateCoursePrerequisiteDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CoursePrerequisite> {
  const course = await Course.findByPk(data.courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${data.courseId} not found`);
  }

  if (data.prerequisiteCourseId) {
    const prerequisiteCourse = await Course.findByPk(data.prerequisiteCourseId, { transaction });
    if (!prerequisiteCourse) {
      throw new Error(`Prerequisite course with ID ${data.prerequisiteCourseId} not found`);
    }
  }

  return CoursePrerequisite.create(data, { transaction });
}

/**
 * Validates course prerequisites for a student
 */
export async function validatePrerequisites(
  courseId: number,
  studentId: number,
  studentTranscript: any[],
  sequelize: Sequelize
): Promise<{ valid: boolean; missingPrerequisites: CoursePrerequisite[] }> {
  const prerequisites = await CoursePrerequisite.findAll({
    where: {
      courseId,
      enforced: true,
      effectiveDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: new Date() } },
      ],
    },
  });

  const missingPrerequisites: CoursePrerequisite[] = [];

  for (const prereq of prerequisites) {
    if (prereq.prerequisiteCourseId) {
      const completed = studentTranscript.some(
        (record) =>
          record.courseId === prereq.prerequisiteCourseId &&
          record.grade &&
          (!prereq.minimumGrade || record.grade >= prereq.minimumGrade)
      );

      if (!completed) {
        missingPrerequisites.push(prereq);
      }
    }
  }

  return {
    valid: missingPrerequisites.length === 0,
    missingPrerequisites,
  };
}

/**
 * Gets all prerequisites for a course
 */
export async function getCoursePrerequisites(
  courseId: number,
  sequelize: Sequelize
): Promise<CoursePrerequisite[]> {
  return CoursePrerequisite.findAll({
    where: { courseId },
    order: [['prerequisiteType', 'ASC']],
  });
}

/**
 * Adds a course equivalency
 */
export async function addCourseEquivalency(
  data: CreateCourseEquivalencyDto,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseEquivalency> {
  return CourseEquivalency.create(data, { transaction });
}

/**
 * Gets course equivalencies
 */
export async function getCourseEquivalencies(
  courseId: number,
  sequelize: Sequelize
): Promise<CourseEquivalency[]> {
  return CourseEquivalency.findAll({
    where: { courseId },
    order: [['equivalencyType', 'ASC']],
  });
}

/**
 * Finds transfer equivalency for a course
 */
export async function findTransferEquivalency(
  institutionId: string,
  externalCourseCode: string,
  sequelize: Sequelize
): Promise<CourseEquivalency | null> {
  return CourseEquivalency.findOne({
    where: {
      equivalencyType: 'TRANSFER',
      transferEquivalency: {
        institutionId,
        externalCourseCode,
      },
      effectiveDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: new Date() } },
      ],
    },
  });
}

/**
 * Adds course attributes
 */
export async function addCourseAttributes(
  courseId: number,
  attributes: CourseAttribute[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  const existingAttributes = course.attributes || [];
  const updatedAttributes = [...existingAttributes, ...attributes];

  return course.update({ attributes: updatedAttributes }, { transaction });
}

/**
 * Updates course fees
 */
export async function updateCourseFees(
  courseId: number,
  fees: CourseFee[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  return course.update({ fees }, { transaction });
}

/**
 * Adds learning outcomes to a course
 */
export async function addLearningOutcomes(
  courseId: number,
  outcomes: CourseOutcome[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  const existingOutcomes = course.learningOutcomes || [];
  const updatedOutcomes = [...existingOutcomes, ...outcomes];

  return course.update({ learningOutcomes: updatedOutcomes }, { transaction });
}

/**
 * Updates course description
 */
export async function updateCourseDescription(
  courseId: number,
  description: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  await course.update({ description }, { transaction });
  await course.increment('version', { transaction });

  return course;
}

/**
 * Updates course syllabus
 */
export async function updateCourseSyllabus(
  courseId: number,
  syllabus: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  return course.update({ syllabus }, { transaction });
}

/**
 * Cross-lists courses
 */
export async function crossListCourses(
  courseIds: number[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course[]> {
  if (courseIds.length < 2) {
    throw new Error('At least two courses required for cross-listing');
  }

  const courses = await Course.findAll({
    where: { id: { [Op.in]: courseIds } },
    transaction,
  });

  if (courses.length !== courseIds.length) {
    throw new Error('One or more courses not found');
  }

  const courseCodes = courses.map((c) => c.courseCode);

  for (const course of courses) {
    const crossListedWith = courseCodes.filter((code) => code !== course.courseCode);
    await course.update({ crossListedWith }, { transaction });
  }

  return courses;
}

/**
 * Approves a course
 */
export async function approveCourse(
  courseId: number,
  approvedBy: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  return course.update(
    {
      status: CourseStatus.APPROVED,
      approvedBy,
      approvedDate: new Date(),
    },
    { transaction }
  );
}

/**
 * Activates a course
 */
export async function activateCourse(
  courseId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  if (course.status !== CourseStatus.APPROVED) {
    throw new Error('Course must be approved before activation');
  }

  return course.update({ status: CourseStatus.ACTIVE }, { transaction });
}

/**
 * Discontinues a course
 */
export async function discontinueCourse(
  courseId: number,
  expirationDate: Date,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const course = await Course.findByPk(courseId, { transaction });
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  return course.update(
    {
      status: CourseStatus.DISCONTINUED,
      expirationDate,
    },
    { transaction }
  );
}

/**
 * Creates a course approval workflow
 */
export async function createCourseApprovalWorkflow(
  courseId: number,
  workflowType: 'NEW_COURSE' | 'MODIFICATION' | 'DISCONTINUATION',
  submittedBy: string,
  approvalSteps: any[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseApprovalWorkflow> {
  return CourseApprovalWorkflow.create(
    {
      courseId,
      workflowType,
      status: ApprovalStatus.SUBMITTED,
      currentStepId: 1,
      submittedBy,
      submittedDate: new Date(),
      approvalSteps,
    },
    { transaction }
  );
}

/**
 * Advances approval workflow to next step
 */
export async function advanceApprovalWorkflow(
  workflowId: number,
  approverId: string,
  approved: boolean,
  comments: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<CourseApprovalWorkflow> {
  const workflow = await CourseApprovalWorkflow.findByPk(workflowId, { transaction });
  if (!workflow) {
    throw new Error(`Workflow with ID ${workflowId} not found`);
  }

  const approvalSteps = workflow.approvalSteps || [];
  const currentStep = approvalSteps.find((step) => step.stepId === workflow.currentStepId);

  if (!currentStep) {
    throw new Error('Current approval step not found');
  }

  currentStep.approverId = approverId;
  currentStep.status = approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
  currentStep.comments = comments;
  currentStep.actionDate = new Date();

  let newStatus = workflow.status;
  let newCurrentStepId = workflow.currentStepId;

  if (!approved) {
    newStatus = ApprovalStatus.REJECTED;
  } else if (workflow.currentStepId === approvalSteps.length) {
    newStatus = ApprovalStatus.APPROVED;
  } else {
    newCurrentStepId = (workflow.currentStepId || 0) + 1;
    newStatus = ApprovalStatus.IN_REVIEW;
  }

  return workflow.update(
    {
      approvalSteps,
      status: newStatus,
      currentStepId: newCurrentStepId,
      completedDate: newStatus === ApprovalStatus.APPROVED || newStatus === ApprovalStatus.REJECTED
        ? new Date()
        : null,
    },
    { transaction }
  );
}

/**
 * Gets pending approvals for a user
 */
export async function getPendingApprovalsForUser(
  userRole: string,
  sequelize: Sequelize
): Promise<CourseApprovalWorkflow[]> {
  return CourseApprovalWorkflow.findAll({
    where: {
      status: ApprovalStatus.IN_REVIEW,
    },
  }).then((workflows) =>
    workflows.filter((workflow) => {
      const currentStep = (workflow.approvalSteps || []).find(
        (step) => step.stepId === workflow.currentStepId
      );
      return currentStep && currentStep.approverRole === userRole;
    })
  );
}

/**
 * Gets courses by department
 */
export async function getCoursesByDepartment(
  departmentId: number,
  sequelize: Sequelize
): Promise<Course[]> {
  return Course.findAll({
    where: { departmentId },
    order: [['subjectCode', 'ASC'], ['courseNumber', 'ASC']],
  });
}

/**
 * Gets courses by college
 */
export async function getCoursesByCollege(
  collegeId: number,
  sequelize: Sequelize
): Promise<Course[]> {
  return Course.findAll({
    where: { collegeId },
    order: [['subjectCode', 'ASC'], ['courseNumber', 'ASC']],
  });
}

/**
 * Gets sections by instructor
 */
export async function getSectionsByInstructor(
  instructorId: number,
  termId: number,
  sequelize: Sequelize
): Promise<CourseSection[]> {
  return CourseSection.findAll({
    where: {
      termId,
      instructorIds: {
        [Op.contains]: [instructorId],
      },
    },
    include: [{ model: Course, as: 'course' }],
  });
}

/**
 * Gets section enrollment statistics
 */
export async function getSectionEnrollmentStats(
  sectionId: number,
  sequelize: Sequelize
): Promise<{
  enrollmentCapacity: number;
  enrollmentCurrent: number;
  enrollmentPercent: number;
  availableSeats: number;
  waitlistCurrent: number;
}> {
  const section = await CourseSection.findByPk(sectionId);
  if (!section) {
    throw new Error(`Section with ID ${sectionId} not found`);
  }

  const enrollmentPercent =
    section.enrollmentCapacity > 0
      ? (section.enrollmentCurrent / section.enrollmentCapacity) * 100
      : 0;

  return {
    enrollmentCapacity: section.enrollmentCapacity,
    enrollmentCurrent: section.enrollmentCurrent,
    enrollmentPercent: Math.round(enrollmentPercent * 100) / 100,
    availableSeats: section.enrollmentCapacity - section.enrollmentCurrent,
    waitlistCurrent: section.waitlistCurrent,
  };
}

/**
 * Validates course scheduling rules
 */
export async function validateSchedulingRules(
  sectionId: number,
  proposedSchedule: Record<string, any>,
  sequelize: Sequelize
): Promise<{ valid: boolean; violations: string[] }> {
  const section = await CourseSection.findByPk(sectionId);
  if (!section) {
    throw new Error(`Section with ID ${sectionId} not found`);
  }

  const violations: string[] = [];
  const rules = section.schedulingRules || [];

  for (const rule of rules) {
    switch (rule.ruleType) {
      case 'TIME_BLOCK':
        // Validate time block constraints
        if (proposedSchedule.startTime < rule.parameters.minStartTime) {
          violations.push(`Start time before minimum allowed: ${rule.parameters.minStartTime}`);
        }
        break;
      case 'ROOM_TYPE':
        // Validate room type requirements
        if (!rule.parameters.allowedRoomTypes.includes(proposedSchedule.roomType)) {
          violations.push(`Room type not allowed: ${proposedSchedule.roomType}`);
        }
        break;
      case 'ENROLLMENT_CAP':
        // Validate enrollment cap
        if (proposedSchedule.capacity > rule.parameters.maxCapacity) {
          violations.push(`Capacity exceeds maximum: ${rule.parameters.maxCapacity}`);
        }
        break;
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Clones a course for a new catalog year
 */
export async function cloneCourseForNewCatalog(
  courseId: number,
  newCatalogId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Course> {
  const originalCourse = await Course.findByPk(courseId, { transaction });
  if (!originalCourse) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  const courseData = originalCourse.toJSON();
  delete courseData.id;
  delete courseData.createdAt;
  delete courseData.updatedAt;

  return Course.create(
    {
      ...courseData,
      catalogId: newCatalogId,
      version: 1,
      status: CourseStatus.DRAFT,
    },
    { transaction }
  );
}

/**
 * Gets course history/versions
 */
export async function getCourseHistory(
  courseCode: string,
  sequelize: Sequelize
): Promise<Course[]> {
  return Course.findAll({
    where: { courseCode },
    order: [['version', 'DESC']],
  });
}

/**
 * Validates course capacity settings
 */
export async function validateCourseCapacity(
  capacity: number,
  waitlistCapacity: number,
  roomCapacity: number
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (capacity <= 0) {
    errors.push('Enrollment capacity must be greater than 0');
  }

  if (waitlistCapacity < 0) {
    errors.push('Waitlist capacity cannot be negative');
  }

  if (capacity > roomCapacity) {
    errors.push(`Enrollment capacity (${capacity}) exceeds room capacity (${roomCapacity})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

@ApiTags('course-catalogs')
@Controller('api/v1/course-catalogs')
@ApiBearerAuth()
export class CourseCatalogsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new course catalog' })
  @ApiResponse({ status: 201, description: 'Catalog created successfully' })
  async create(@Body() createDto: CreateCourseCatalogDto): Promise<CourseCatalog> {
    return createCourseCatalog(createDto, this.sequelize);
  }

  @Get()
  @ApiOperation({ summary: 'Get all course catalogs' })
  @ApiResponse({ status: 200, description: 'Catalogs retrieved successfully' })
  async findAll(): Promise<CourseCatalog[]> {
    return CourseCatalog.findAll({
      order: [['catalogYear', 'DESC'], ['catalogTerm', 'ASC']],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course catalog by ID' })
  @ApiResponse({ status: 200, description: 'Catalog found' })
  @ApiResponse({ status: 404, description: 'Catalog not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CourseCatalog> {
    const catalog = await CourseCatalog.findByPk(id, {
      include: [{ model: Course, as: 'courses' }],
    });
    if (!catalog) {
      throw new Error('Catalog not found');
    }
    return catalog;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course catalog' })
  @ApiResponse({ status: 200, description: 'Catalog updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourseCatalogDto
  ): Promise<CourseCatalog> {
    return updateCourseCatalog(id, updateDto, this.sequelize);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a course catalog' })
  @ApiResponse({ status: 200, description: 'Catalog published successfully' })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Body('publishedBy') publishedBy: string
  ): Promise<CourseCatalog> {
    return publishCourseCatalog(id, publishedBy, this.sequelize);
  }
}

@ApiTags('courses')
@Controller('api/v1/courses')
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async create(@Body() createDto: CreateCourseDto): Promise<Course> {
    return createCourse(createDto, this.sequelize);
  }

  @Get()
  @ApiOperation({ summary: 'Search courses with filters' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  async search(@Query() query: CourseSearchQueryDto) {
    return searchCourses(query, this.sequelize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    const course = await Course.findByPk(id, {
      include: [
        { model: CourseCatalog, as: 'catalog' },
        { model: CourseSection, as: 'sections' },
      ],
    });
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  @Get('code/:courseCode')
  @ApiOperation({ summary: 'Get a course by course code' })
  @ApiResponse({ status: 200, description: 'Course found' })
  async findByCode(@Param('courseCode') courseCode: string): Promise<Course | null> {
    return getCourseByCode(courseCode, this.sequelize);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourseDto
  ): Promise<Course> {
    return updateCourse(id, updateDto, this.sequelize);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a course' })
  @ApiResponse({ status: 200, description: 'Course approved successfully' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('approvedBy') approvedBy: string
  ): Promise<Course> {
    return approveCourse(id, approvedBy, this.sequelize);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a course' })
  @ApiResponse({ status: 200, description: 'Course activated successfully' })
  async activate(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return activateCourse(id, this.sequelize);
  }

  @Post(':id/discontinue')
  @ApiOperation({ summary: 'Discontinue a course' })
  @ApiResponse({ status: 200, description: 'Course discontinued successfully' })
  async discontinue(
    @Param('id', ParseIntPipe) id: number,
    @Body('expirationDate') expirationDate: Date
  ): Promise<Course> {
    return discontinueCourse(id, expirationDate, this.sequelize);
  }

  @Post(':id/attributes')
  @ApiOperation({ summary: 'Add attributes to a course' })
  @ApiResponse({ status: 200, description: 'Attributes added successfully' })
  async addAttributes(
    @Param('id', ParseIntPipe) id: number,
    @Body('attributes') attributes: CourseAttribute[]
  ): Promise<Course> {
    return addCourseAttributes(id, attributes, this.sequelize);
  }

  @Put(':id/fees')
  @ApiOperation({ summary: 'Update course fees' })
  @ApiResponse({ status: 200, description: 'Fees updated successfully' })
  async updateFees(
    @Param('id', ParseIntPipe) id: number,
    @Body('fees') fees: CourseFee[]
  ): Promise<Course> {
    return updateCourseFees(id, fees, this.sequelize);
  }

  @Post(':id/outcomes')
  @ApiOperation({ summary: 'Add learning outcomes to a course' })
  @ApiResponse({ status: 200, description: 'Outcomes added successfully' })
  async addOutcomes(
    @Param('id', ParseIntPipe) id: number,
    @Body('outcomes') outcomes: CourseOutcome[]
  ): Promise<Course> {
    return addLearningOutcomes(id, outcomes, this.sequelize);
  }

  @Put(':id/description')
  @ApiOperation({ summary: 'Update course description' })
  @ApiResponse({ status: 200, description: 'Description updated successfully' })
  async updateDescription(
    @Param('id', ParseIntPipe) id: number,
    @Body('description') description: string
  ): Promise<Course> {
    return updateCourseDescription(id, description, this.sequelize);
  }

  @Put(':id/syllabus')
  @ApiOperation({ summary: 'Update course syllabus' })
  @ApiResponse({ status: 200, description: 'Syllabus updated successfully' })
  async updateSyllabus(
    @Param('id', ParseIntPipe) id: number,
    @Body('syllabus') syllabus: string
  ): Promise<Course> {
    return updateCourseSyllabus(id, syllabus, this.sequelize);
  }

  @Post('cross-list')
  @ApiOperation({ summary: 'Cross-list courses' })
  @ApiResponse({ status: 200, description: 'Courses cross-listed successfully' })
  async crossList(@Body('courseIds') courseIds: number[]): Promise<Course[]> {
    return crossListCourses(courseIds, this.sequelize);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get course history' })
  @ApiResponse({ status: 200, description: 'Course history retrieved' })
  async getHistory(@Param('id', ParseIntPipe) id: number): Promise<Course[]> {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return getCourseHistory(course.courseCode, this.sequelize);
  }
}

@ApiTags('course-sections')
@Controller('api/v1/course-sections')
@ApiBearerAuth()
export class CourseSectionsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new course section' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  async create(@Body() createDto: CreateCourseSectionDto): Promise<CourseSection> {
    return createCourseSection(createDto, this.sequelize);
  }

  @Get()
  @ApiOperation({ summary: 'Get all course sections' })
  @ApiQuery({ name: 'termId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiResponse({ status: 200, description: 'Sections retrieved successfully' })
  async findAll(
    @Query('termId', ParseIntPipe) termId?: number,
    @Query('courseId', ParseIntPipe) courseId?: number
  ): Promise<CourseSection[]> {
    const where: any = {};
    if (termId) where.termId = termId;
    if (courseId) where.courseId = courseId;

    return CourseSection.findAll({
      where,
      include: [{ model: Course, as: 'course' }],
      order: [['sectionCode', 'ASC']],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course section by ID' })
  @ApiResponse({ status: 200, description: 'Section found' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CourseSection> {
    const section = await CourseSection.findByPk(id, {
      include: [{ model: Course, as: 'course' }],
    });
    if (!section) {
      throw new Error('Section not found');
    }
    return section;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course section' })
  @ApiResponse({ status: 200, description: 'Section updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourseSectionDto
  ): Promise<CourseSection> {
    return updateCourseSection(id, updateDto, this.sequelize);
  }

  @Get(':id/capacity')
  @ApiOperation({ summary: 'Check section capacity' })
  @ApiResponse({ status: 200, description: 'Capacity information retrieved' })
  async checkCapacity(@Param('id', ParseIntPipe) id: number) {
    return checkSectionCapacity(id, this.sequelize);
  }

  @Get(':id/enrollment-stats')
  @ApiOperation({ summary: 'Get section enrollment statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getEnrollmentStats(@Param('id', ParseIntPipe) id: number) {
    return getSectionEnrollmentStats(id, this.sequelize);
  }
}

@ApiTags('course-prerequisites')
@Controller('api/v1/course-prerequisites')
@ApiBearerAuth()
export class CoursePrerequisitesController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a course prerequisite' })
  @ApiResponse({ status: 201, description: 'Prerequisite added successfully' })
  async create(@Body() createDto: CreateCoursePrerequisiteDto): Promise<CoursePrerequisite> {
    return addCoursePrerequisite(createDto, this.sequelize);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all prerequisites for a course' })
  @ApiResponse({ status: 200, description: 'Prerequisites retrieved successfully' })
  async findByCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<CoursePrerequisite[]> {
    return getCoursePrerequisites(courseId, this.sequelize);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate prerequisites for a student' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  async validate(
    @Body('courseId') courseId: number,
    @Body('studentId') studentId: number,
    @Body('studentTranscript') studentTranscript: any[]
  ) {
    return validatePrerequisites(courseId, studentId, studentTranscript, this.sequelize);
  }
}

@ApiTags('course-equivalencies')
@Controller('api/v1/course-equivalencies')
@ApiBearerAuth()
export class CourseEquivalenciesController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a course equivalency' })
  @ApiResponse({ status: 201, description: 'Equivalency added successfully' })
  async create(@Body() createDto: CreateCourseEquivalencyDto): Promise<CourseEquivalency> {
    return addCourseEquivalency(createDto, this.sequelize);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all equivalencies for a course' })
  @ApiResponse({ status: 200, description: 'Equivalencies retrieved successfully' })
  async findByCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<CourseEquivalency[]> {
    return getCourseEquivalencies(courseId, this.sequelize);
  }

  @Get('transfer')
  @ApiOperation({ summary: 'Find transfer equivalency' })
  @ApiQuery({ name: 'institutionId', required: true })
  @ApiQuery({ name: 'externalCourseCode', required: true })
  @ApiResponse({ status: 200, description: 'Equivalency found' })
  async findTransfer(
    @Query('institutionId') institutionId: string,
    @Query('externalCourseCode') externalCourseCode: string
  ): Promise<CourseEquivalency | null> {
    return findTransferEquivalency(institutionId, externalCourseCode, this.sequelize);
  }
}
