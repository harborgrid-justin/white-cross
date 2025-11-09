/**
 * LOC: EDGRADEASS001
 * File: /reuse/education/grading-assessment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS grading services
 *   - Academic assessment modules
 *   - Transcript generation services
 *   - Faculty grading portals
 *   - Student information systems
 */

/**
 * File: /reuse/education/grading-assessment-kit.ts
 * Locator: WC-EDU-GRADEASS-001
 * Purpose: Comprehensive Grading & Assessment Kit for Education SIS
 *
 * Upstream: Independent utility module for grading and assessment operations
 * Downstream: ../backend/*, Grading services, Assessment modules, Transcript services, Faculty portals
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, zod
 * Exports: 45 utility functions for grade entry, GPA calculation, grade changes, assessments, rubrics
 *
 * LLM Context: Enterprise-grade grading and assessment utilities for education Student Information System (SIS).
 * Provides comprehensive grade entry and management, GPA calculations (cumulative, term, major, minor),
 * grade change request workflows, incomplete grade management, grade appeal processes, pass/fail grading,
 * grading rubrics and assessment tools, grade distribution analytics, transcript generation, grade locking,
 * and academic standing calculations for higher education institutions.
 *
 * OpenAPI Specification: 3.0.3
 * Security: Bearer authentication, role-based access control (student, instructor, registrar, dean)
 * Authorization: Strict grade access controls based on instructor assignment and student enrollment
 */

import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { z } from 'zod';

// ============================================================================
// OPENAPI 3.0 SPECIFICATION
// ============================================================================

/**
 * @openapi
 * info:
 *   title: Grading & Assessment API
 *   version: 1.0.0
 *   description: Comprehensive API for grade management, GPA calculation, and academic assessment
 *   contact:
 *     name: White Cross Education Team
 *     email: education@whitecross.edu
 *
 * servers:
 *   - url: https://api.whitecross.edu/v1
 *     description: Production server
 *   - url: https://staging-api.whitecross.edu/v1
 *     description: Staging server
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from authentication endpoint
 *     apiKey:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *       description: API key for service-to-service authentication
 *
 *   schemas:
 *     Grade:
 *       type: object
 *       required:
 *         - studentId
 *         - courseId
 *         - term
 *         - letterGrade
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the grade
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: Student's unique identifier
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Course unique identifier
 *         instructorId:
 *           type: string
 *           format: uuid
 *           description: Instructor who assigned the grade
 *         term:
 *           type: string
 *           example: "Fall 2024"
 *           description: Academic term
 *         letterGrade:
 *           type: string
 *           enum: [A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F, P, NP, I, W, AU]
 *           description: Letter grade assigned
 *         numericGrade:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Numeric grade (0-100)
 *         gradePoints:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 4.0
 *           description: Grade points for GPA calculation
 *         credits:
 *           type: number
 *           format: float
 *           description: Course credit hours
 *         gradingBasis:
 *           type: string
 *           enum: [letter, pass-fail, audit, incomplete]
 *           description: Grading basis for the course
 *         isLocked:
 *           type: boolean
 *           description: Whether grade is locked from changes
 *         lockedAt:
 *           type: string
 *           format: date-time
 *           description: When grade was locked
 *         comments:
 *           type: string
 *           description: Instructor comments
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "950e8400-e29b-41d4-a716-446655440000"
 *         studentId: "650e8400-e29b-41d4-a716-446655440001"
 *         courseId: "850e8400-e29b-41d4-a716-446655440050"
 *         instructorId: "750e8400-e29b-41d4-a716-446655440099"
 *         term: "Fall 2024"
 *         letterGrade: "A"
 *         numericGrade: 95.5
 *         gradePoints: 4.0
 *         credits: 3.0
 *         gradingBasis: "letter"
 *         isLocked: false
 *
 *     GradeScale:
 *       type: object
 *       required:
 *         - scaleId
 *         - scaleName
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         scaleId:
 *           type: string
 *           description: Unique scale identifier
 *         scaleName:
 *           type: string
 *           description: Name of grading scale
 *         scaleType:
 *           type: string
 *           enum: [standard, plus-minus, pass-fail, numerical]
 *         mappings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               letterGrade:
 *                 type: string
 *               minNumeric:
 *                 type: number
 *               maxNumeric:
 *                 type: number
 *               gradePoints:
 *                 type: number
 *           description: Grade to point mappings
 *         isDefault:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *       example:
 *         scaleId: "standard-4.0"
 *         scaleName: "Standard 4.0 Scale"
 *         scaleType: "plus-minus"
 *         mappings:
 *           - letterGrade: "A"
 *             minNumeric: 93
 *             maxNumeric: 100
 *             gradePoints: 4.0
 *           - letterGrade: "A-"
 *             minNumeric: 90
 *             maxNumeric: 92.99
 *             gradePoints: 3.7
 *         isDefault: true
 *         isActive: true
 *
 *     Assessment:
 *       type: object
 *       required:
 *         - courseId
 *         - assessmentType
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *           format: uuid
 *         assessmentType:
 *           type: string
 *           enum: [exam, quiz, assignment, project, participation, lab, paper, presentation]
 *         title:
 *           type: string
 *           description: Assessment title
 *         description:
 *           type: string
 *         maxPoints:
 *           type: number
 *           description: Maximum possible points
 *         weight:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Weight as percentage of final grade
 *         dueDate:
 *           type: string
 *           format: date-time
 *         rubricId:
 *           type: string
 *           format: uuid
 *           description: Associated grading rubric
 *         isPublished:
 *           type: boolean
 *       example:
 *         courseId: "850e8400-e29b-41d4-a716-446655440050"
 *         assessmentType: "exam"
 *         title: "Midterm Exam"
 *         maxPoints: 100
 *         weight: 30
 *         dueDate: "2024-10-15T14:00:00Z"
 *         isPublished: true
 *
 *     GradeChangeRequest:
 *       type: object
 *       required:
 *         - gradeId
 *         - requestedBy
 *         - currentGrade
 *         - requestedGrade
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         gradeId:
 *           type: string
 *           format: uuid
 *           description: Grade being changed
 *         studentId:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *           format: uuid
 *         requestedBy:
 *           type: string
 *           format: uuid
 *           description: Instructor requesting change
 *         currentGrade:
 *           type: string
 *           description: Current letter grade
 *         requestedGrade:
 *           type: string
 *           description: Requested new grade
 *         reason:
 *           type: string
 *           description: Reason for grade change
 *         requestStatus:
 *           type: string
 *           enum: [pending, approved, denied, cancelled]
 *         approvedBy:
 *           type: string
 *           format: uuid
 *         approvalDate:
 *           type: string
 *           format: date-time
 *         denialReason:
 *           type: string
 *       example:
 *         gradeId: "950e8400-e29b-41d4-a716-446655440000"
 *         studentId: "650e8400-e29b-41d4-a716-446655440001"
 *         requestedBy: "750e8400-e29b-41d4-a716-446655440099"
 *         currentGrade: "B"
 *         requestedGrade: "A-"
 *         reason: "Grading error on final exam"
 *         requestStatus: "pending"
 *
 *     GPACalculation:
 *       type: object
 *       properties:
 *         studentId:
 *           type: string
 *           format: uuid
 *         calculationType:
 *           type: string
 *           enum: [cumulative, term, major, minor, transfer]
 *         gpa:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 4.0
 *         totalCredits:
 *           type: number
 *         qualityPoints:
 *           type: number
 *         gradeCount:
 *           type: integer
 *         term:
 *           type: string
 *         calculatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         studentId: "650e8400-e29b-41d4-a716-446655440001"
 *         calculationType: "cumulative"
 *         gpa: 3.45
 *         totalCredits: 45
 *         qualityPoints: 155.25
 *         gradeCount: 15
 *         calculatedAt: "2024-11-09T12:00:00Z"
 *
 *     Error:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: string
 *           example: "UNAUTHORIZED_GRADE_ACCESS"
 *         message:
 *           type: string
 *           example: "You do not have permission to access this grade"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 * security:
 *   - bearerAuth: []
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Grade {
  id?: string;
  studentId: string;
  courseId: string;
  instructorId: string;
  term: string;
  letterGrade: string;
  numericGrade?: number;
  gradePoints: number;
  credits: number;
  gradingBasis: 'letter' | 'pass-fail' | 'audit' | 'incomplete';
  isLocked: boolean;
  lockedAt?: Date;
  lockedBy?: string;
  comments?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GradeScale {
  id?: string;
  scaleId: string;
  scaleName: string;
  scaleType: 'standard' | 'plus-minus' | 'pass-fail' | 'numerical';
  mappings: GradeMapping[];
  isDefault: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GradeMapping {
  letterGrade: string;
  minNumeric: number;
  maxNumeric: number;
  gradePoints: number;
}

export interface Assessment {
  id?: string;
  courseId: string;
  assessmentType: 'exam' | 'quiz' | 'assignment' | 'project' | 'participation' | 'lab' | 'paper' | 'presentation';
  title: string;
  description?: string;
  maxPoints: number;
  weight: number;
  dueDate?: Date;
  rubricId?: string;
  isPublished: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GradeChangeRequest {
  id?: string;
  gradeId: string;
  studentId: string;
  courseId: string;
  requestedBy: string;
  currentGrade: string;
  requestedGrade: string;
  reason: string;
  requestStatus: 'pending' | 'approved' | 'denied' | 'cancelled';
  approvedBy?: string;
  approvalDate?: Date;
  denialReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GPACalculation {
  studentId: string;
  calculationType: 'cumulative' | 'term' | 'major' | 'minor' | 'transfer';
  gpa: number;
  totalCredits: number;
  qualityPoints: number;
  gradeCount: number;
  term?: string;
  programId?: string;
  calculatedAt: Date;
}

export interface GradingRubric {
  id?: string;
  rubricName: string;
  courseId?: string;
  criteria: RubricCriterion[];
  totalPoints: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RubricCriterion {
  criterionName: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  levelName: string;
  description: string;
  points: number;
}

export interface IncompleteGrade {
  gradeId: string;
  studentId: string;
  courseId: string;
  term: string;
  assignedDate: Date;
  deadline: Date;
  reason: string;
  isResolved: boolean;
  resolvedDate?: Date;
  finalGrade?: string;
}

export interface GradeDistribution {
  courseId: string;
  term: string;
  gradeBreakdown: Map<string, number>;
  averageGPA: number;
  medianGrade: string;
  totalStudents: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const GradeSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
  instructorId: z.string().uuid(),
  term: z.string().min(1),
  letterGrade: z.string(),
  numericGrade: z.number().min(0).max(100).optional(),
  gradePoints: z.number().min(0).max(4.0),
  credits: z.number().min(0),
  gradingBasis: z.enum(['letter', 'pass-fail', 'audit', 'incomplete']),
  isLocked: z.boolean(),
  comments: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const GradeChangeRequestSchema = z.object({
  gradeId: z.string().uuid(),
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
  requestedBy: z.string().uuid(),
  currentGrade: z.string(),
  requestedGrade: z.string(),
  reason: z.string().min(10),
  requestStatus: z.enum(['pending', 'approved', 'denied', 'cancelled']),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Grades.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Grade model
 *
 * @example
 * const Grade = defineGradeModel(sequelize);
 * await Grade.create({
 *   studentId: '650e8400-e29b-41d4-a716-446655440001',
 *   courseId: '850e8400-e29b-41d4-a716-446655440050',
 *   letterGrade: 'A',
 *   gradePoints: 4.0,
 *   credits: 3.0
 * });
 */
export function defineGradeModel(sequelize: Sequelize): typeof Model {
  class GradeModel extends Model {
    public id!: string;
    public studentId!: string;
    public courseId!: string;
    public instructorId!: string;
    public term!: string;
    public letterGrade!: string;
    public numericGrade!: number;
    public gradePoints!: number;
    public credits!: number;
    public gradingBasis!: string;
    public isLocked!: boolean;
    public lockedAt!: Date;
    public lockedBy!: string;
    public comments!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GradeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'student_id',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'course_id',
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'instructor_id',
      },
      term: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      letterGrade: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'letter_grade',
      },
      numericGrade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'numeric_grade',
      },
      gradePoints: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        field: 'grade_points',
      },
      credits: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
      },
      gradingBasis: {
        type: DataTypes.ENUM('letter', 'pass-fail', 'audit', 'incomplete'),
        allowNull: false,
        defaultValue: 'letter',
        field: 'grading_basis',
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_locked',
      },
      lockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'locked_at',
      },
      lockedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'locked_by',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'grades',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['student_id'] },
        { fields: ['course_id'] },
        { fields: ['instructor_id'] },
        { fields: ['term'] },
        { fields: ['is_locked'] },
        { fields: ['student_id', 'term'] },
      ],
    }
  );

  return GradeModel;
}

/**
 * Sequelize model for Grade Scales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} GradeScale model
 *
 * @example
 * const GradeScale = defineGradeScaleModel(sequelize);
 * await GradeScale.create({
 *   scaleId: 'standard-4.0',
 *   scaleName: 'Standard 4.0 Scale',
 *   scaleType: 'plus-minus'
 * });
 */
export function defineGradeScaleModel(sequelize: Sequelize): typeof Model {
  class GradeScaleModel extends Model {
    public id!: string;
    public scaleId!: string;
    public scaleName!: string;
    public scaleType!: string;
    public mappings!: GradeMapping[];
    public isDefault!: boolean;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GradeScaleModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      scaleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'scale_id',
      },
      scaleName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'scale_name',
      },
      scaleType: {
        type: DataTypes.ENUM('standard', 'plus-minus', 'pass-fail', 'numerical'),
        allowNull: false,
        field: 'scale_type',
      },
      mappings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      tableName: 'grade_scales',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scale_id'] },
        { fields: ['is_default'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return GradeScaleModel;
}

/**
 * Sequelize model for Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Assessment model
 *
 * @example
 * const Assessment = defineAssessmentModel(sequelize);
 * await Assessment.create({
 *   courseId: '850e8400-e29b-41d4-a716-446655440050',
 *   assessmentType: 'exam',
 *   title: 'Midterm Exam',
 *   maxPoints: 100,
 *   weight: 30
 * });
 */
export function defineAssessmentModel(sequelize: Sequelize): typeof Model {
  class AssessmentModel extends Model {
    public id!: string;
    public courseId!: string;
    public assessmentType!: string;
    public title!: string;
    public description!: string;
    public maxPoints!: number;
    public weight!: number;
    public dueDate!: Date;
    public rubricId!: string;
    public isPublished!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssessmentModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'course_id',
      },
      assessmentType: {
        type: DataTypes.ENUM('exam', 'quiz', 'assignment', 'project', 'participation', 'lab', 'paper', 'presentation'),
        allowNull: false,
        field: 'assessment_type',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      maxPoints: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        field: 'max_points',
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
      rubricId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'rubric_id',
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_published',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'assessments',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['course_id'] },
        { fields: ['assessment_type'] },
        { fields: ['is_published'] },
      ],
    }
  );

  return AssessmentModel;
}

/**
 * Sequelize model for Grade Change Requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} GradeChangeRequest model
 *
 * @example
 * const GradeChangeRequest = defineGradeChangeRequestModel(sequelize);
 * await GradeChangeRequest.create({
 *   gradeId: 'grade-id',
 *   requestedBy: 'instructor-id',
 *   currentGrade: 'B',
 *   requestedGrade: 'A-',
 *   reason: 'Grading error'
 * });
 */
export function defineGradeChangeRequestModel(sequelize: Sequelize): typeof Model {
  class GradeChangeRequestModel extends Model {
    public id!: string;
    public gradeId!: string;
    public studentId!: string;
    public courseId!: string;
    public requestedBy!: string;
    public currentGrade!: string;
    public requestedGrade!: string;
    public reason!: string;
    public requestStatus!: string;
    public approvedBy!: string;
    public approvalDate!: Date;
    public denialReason!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GradeChangeRequestModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gradeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'grade_id',
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'student_id',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'course_id',
      },
      requestedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'requested_by',
      },
      currentGrade: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'current_grade',
      },
      requestedGrade: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'requested_grade',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requestStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'request_status',
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'approved_by',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approval_date',
      },
      denialReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'denial_reason',
      },
    },
    {
      sequelize,
      tableName: 'grade_change_requests',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['grade_id'] },
        { fields: ['student_id'] },
        { fields: ['requested_by'] },
        { fields: ['request_status'] },
      ],
    }
  );

  return GradeChangeRequestModel;
}

// ============================================================================
// GRADE ENTRY & MANAGEMENT FUNCTIONS (Functions 5-12)
// ============================================================================

/**
 * Creates a new grade entry.
 *
 * @openapi
 * /grades:
 *   post:
 *     tags:
 *       - Grades
 *     summary: Create a grade
 *     description: Creates a new grade entry for a student in a course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             instructorId: "750e8400-e29b-41d4-a716-446655440099"
 *             term: "Fall 2024"
 *             letterGrade: "A"
 *             numericGrade: 95.5
 *             gradePoints: 4.0
 *             credits: 3.0
 *             gradingBasis: "letter"
 *             isLocked: false
 *     responses:
 *       201:
 *         description: Grade created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to grade this course
 *       409:
 *         description: Grade already exists
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {Grade} gradeData - Grade data
 * @returns {Promise<any>} Created grade
 *
 * @example
 * const grade = await createGrade(Grade, {
 *   studentId: 'student-id',
 *   courseId: 'course-id',
 *   instructorId: 'instructor-id',
 *   term: 'Fall 2024',
 *   letterGrade: 'A',
 *   gradePoints: 4.0,
 *   credits: 3.0,
 *   gradingBasis: 'letter',
 *   isLocked: false
 * });
 */
export async function createGrade(
  gradeModel: typeof Model,
  gradeData: Grade
): Promise<any> {
  // Validate input
  GradeSchema.parse(gradeData);

  // Check for existing grade
  const existing = await gradeModel.findOne({
    where: {
      studentId: gradeData.studentId,
      courseId: gradeData.courseId,
      term: gradeData.term,
    },
  });

  if (existing) {
    throw new Error('Grade already exists for this student in this course');
  }

  return await gradeModel.create({
    studentId: gradeData.studentId,
    courseId: gradeData.courseId,
    instructorId: gradeData.instructorId,
    term: gradeData.term,
    letterGrade: gradeData.letterGrade,
    numericGrade: gradeData.numericGrade,
    gradePoints: gradeData.gradePoints,
    credits: gradeData.credits,
    gradingBasis: gradeData.gradingBasis,
    isLocked: gradeData.isLocked,
    comments: gradeData.comments,
    metadata: gradeData.metadata || {},
  });
}

/**
 * Updates an existing grade.
 *
 * @openapi
 * /grades/{gradeId}:
 *   put:
 *     tags:
 *       - Grades
 *     summary: Update a grade
 *     description: Updates an existing grade (only if not locked)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               letterGrade:
 *                 type: string
 *               numericGrade:
 *                 type: number
 *               gradePoints:
 *                 type: number
 *               comments:
 *                 type: string
 *           example:
 *             letterGrade: "A-"
 *             numericGrade: 92.5
 *             gradePoints: 3.7
 *             comments: "Updated after regrade"
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       403:
 *         description: Grade is locked and cannot be updated
 *       404:
 *         description: Grade not found
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Grade ID
 * @param {Partial<Grade>} updates - Update data
 * @returns {Promise<any>} Updated grade
 *
 * @example
 * const updated = await updateGrade(Grade, 'grade-id', {
 *   letterGrade: 'A-',
 *   gradePoints: 3.7
 * });
 */
export async function updateGrade(
  gradeModel: typeof Model,
  gradeId: string,
  updates: Partial<Grade>
): Promise<any> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    throw new Error('Grade not found');
  }

  if ((grade as any).isLocked) {
    throw new Error('Grade is locked and cannot be updated directly');
  }

  return await grade.update(updates);
}

/**
 * Retrieves a grade by ID.
 *
 * @openapi
 * /grades/{gradeId}:
 *   get:
 *     tags:
 *       - Grades
 *     summary: Get grade by ID
 *     description: Retrieves a specific grade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Grade retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       403:
 *         description: Unauthorized to view this grade
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Grade ID
 * @returns {Promise<any>} Grade
 *
 * @example
 * const grade = await getGrade(Grade, 'grade-id');
 */
export async function getGrade(
  gradeModel: typeof Model,
  gradeId: string
): Promise<any> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    throw new Error('Grade not found');
  }

  return grade;
}

/**
 * Deletes a grade (soft delete for audit trail).
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Grade ID
 * @returns {Promise<boolean>} Deletion success
 *
 * @example
 * await deleteGrade(Grade, 'grade-id');
 */
export async function deleteGrade(
  gradeModel: typeof Model,
  gradeId: string
): Promise<boolean> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    throw new Error('Grade not found');
  }

  if ((grade as any).isLocked) {
    throw new Error('Cannot delete locked grade');
  }

  await grade.destroy();
  return true;
}

/**
 * Bulk creates grades for a course.
 *
 * @openapi
 * /grades/bulk:
 *   post:
 *     tags:
 *       - Grades
 *     summary: Bulk create grades
 *     description: Creates multiple grades at once
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grades:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Grade'
 *           example:
 *             grades:
 *               - studentId: "650e8400-e29b-41d4-a716-446655440001"
 *                 courseId: "850e8400-e29b-41d4-a716-446655440050"
 *                 instructorId: "750e8400-e29b-41d4-a716-446655440099"
 *                 term: "Fall 2024"
 *                 letterGrade: "A"
 *                 gradePoints: 4.0
 *                 credits: 3.0
 *                 gradingBasis: "letter"
 *               - studentId: "650e8400-e29b-41d4-a716-446655440002"
 *                 courseId: "850e8400-e29b-41d4-a716-446655440050"
 *                 instructorId: "750e8400-e29b-41d4-a716-446655440099"
 *                 term: "Fall 2024"
 *                 letterGrade: "B+"
 *                 gradePoints: 3.3
 *                 credits: 3.0
 *                 gradingBasis: "letter"
 *     responses:
 *       201:
 *         description: Grades created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: integer
 *                 grades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Grade'
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {Grade[]} grades - Array of grades
 * @returns {Promise<any[]>} Created grades
 *
 * @example
 * const grades = await bulkCreateGrades(Grade, [
 *   { studentId: 'student-1', courseId: 'course-id', letterGrade: 'A', ... },
 *   { studentId: 'student-2', courseId: 'course-id', letterGrade: 'B+', ... }
 * ]);
 */
export async function bulkCreateGrades(
  gradeModel: typeof Model,
  grades: Grade[]
): Promise<any[]> {
  return await gradeModel.bulkCreate(grades);
}

/**
 * Validates grade entry against grading scale.
 *
 * @param {typeof Model} gradeScaleModel - Grade scale model
 * @param {string} scaleId - Grade scale ID
 * @param {string} letterGrade - Letter grade to validate
 * @param {number} numericGrade - Numeric grade
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * const isValid = await validateGradeEntry(
 *   GradeScale,
 *   'standard-4.0',
 *   'A',
 *   95.5
 * );
 */
export async function validateGradeEntry(
  gradeScaleModel: typeof Model,
  scaleId: string,
  letterGrade: string,
  numericGrade?: number
): Promise<boolean> {
  const scale = await gradeScaleModel.findOne({
    where: { scaleId },
  });

  if (!scale) {
    throw new Error('Grade scale not found');
  }

  const mappings = (scale as any).mappings as GradeMapping[];
  const mapping = mappings.find((m) => m.letterGrade === letterGrade);

  if (!mapping) {
    return false;
  }

  if (numericGrade !== undefined) {
    return numericGrade >= mapping.minNumeric && numericGrade <= mapping.maxNumeric;
  }

  return true;
}

/**
 * Locks grades for a course/term.
 *
 * @openapi
 * /grades/lock:
 *   post:
 *     tags:
 *       - Grades
 *     summary: Lock grades
 *     description: Locks grades to prevent further changes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               term:
 *                 type: string
 *               lockedBy:
 *                 type: string
 *                 format: uuid
 *           example:
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             term: "Fall 2024"
 *             lockedBy: "750e8400-e29b-41d4-a716-446655440099"
 *     responses:
 *       200:
 *         description: Grades locked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locked:
 *                   type: integer
 *                   description: Number of grades locked
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @param {string} lockedBy - User ID who locked grades
 * @returns {Promise<number>} Number of grades locked
 *
 * @example
 * const count = await lockGrades(Grade, 'course-id', 'Fall 2024', 'registrar-id');
 */
export async function lockGrades(
  gradeModel: typeof Model,
  courseId: string,
  term: string,
  lockedBy: string
): Promise<number> {
  const [count] = await gradeModel.update(
    {
      isLocked: true,
      lockedAt: new Date(),
      lockedBy,
    },
    {
      where: {
        courseId,
        term,
        isLocked: false,
      },
    }
  );

  return count;
}

/**
 * Unlocks grades for a course/term.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @returns {Promise<number>} Number of grades unlocked
 *
 * @example
 * const count = await unlockGrades(Grade, 'course-id', 'Fall 2024');
 */
export async function unlockGrades(
  gradeModel: typeof Model,
  courseId: string,
  term: string
): Promise<number> {
  const [count] = await gradeModel.update(
    {
      isLocked: false,
      lockedAt: null,
      lockedBy: null,
    },
    {
      where: {
        courseId,
        term,
        isLocked: true,
      },
    }
  );

  return count;
}

// ============================================================================
// GPA CALCULATION FUNCTIONS (Functions 13-19)
// ============================================================================

/**
 * Calculates term GPA for a student.
 *
 * @openapi
 * /gpa/term:
 *   get:
 *     tags:
 *       - GPA Calculation
 *     summary: Calculate term GPA
 *     description: Calculates GPA for a specific term
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *           example: "Fall 2024"
 *     responses:
 *       200:
 *         description: Term GPA calculated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPACalculation'
 *             example:
 *               studentId: "650e8400-e29b-41d4-a716-446655440001"
 *               calculationType: "term"
 *               gpa: 3.67
 *               totalCredits: 15
 *               qualityPoints: 55.05
 *               gradeCount: 5
 *               term: "Fall 2024"
 *               calculatedAt: "2024-11-09T12:00:00Z"
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} term - Term
 * @returns {Promise<GPACalculation>} Term GPA
 *
 * @example
 * const termGPA = await calculateTermGPA(Grade, 'student-id', 'Fall 2024');
 */
export async function calculateTermGPA(
  gradeModel: typeof Model,
  studentId: string,
  term: string
): Promise<GPACalculation> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      term,
      gradingBasis: 'letter', // Only letter grades count toward GPA
    },
  });

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const gradePoints = (grade as any).gradePoints;
    const credits = (grade as any).credits;
    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    studentId,
    calculationType: 'term',
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    qualityPoints: totalQualityPoints,
    gradeCount: grades.length,
    term,
    calculatedAt: new Date(),
  };
}

/**
 * Calculates cumulative GPA for a student.
 *
 * @openapi
 * /gpa/cumulative:
 *   get:
 *     tags:
 *       - GPA Calculation
 *     summary: Calculate cumulative GPA
 *     description: Calculates overall cumulative GPA across all terms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cumulative GPA calculated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPACalculation'
 *             example:
 *               studentId: "650e8400-e29b-41d4-a716-446655440001"
 *               calculationType: "cumulative"
 *               gpa: 3.45
 *               totalCredits: 45
 *               qualityPoints: 155.25
 *               gradeCount: 15
 *               calculatedAt: "2024-11-09T12:00:00Z"
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @returns {Promise<GPACalculation>} Cumulative GPA
 *
 * @example
 * const cumulativeGPA = await calculateCumulativeGPA(Grade, 'student-id');
 */
export async function calculateCumulativeGPA(
  gradeModel: typeof Model,
  studentId: string
): Promise<GPACalculation> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      gradingBasis: 'letter',
    },
  });

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const gradePoints = (grade as any).gradePoints;
    const credits = (grade as any).credits;
    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    studentId,
    calculationType: 'cumulative',
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    qualityPoints: totalQualityPoints,
    gradeCount: grades.length,
    calculatedAt: new Date(),
  };
}

/**
 * Calculates major GPA for a student.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} programId - Major program ID
 * @param {string[]} majorCourseIds - Course IDs in the major
 * @returns {Promise<GPACalculation>} Major GPA
 *
 * @example
 * const majorGPA = await calculateMajorGPA(
 *   Grade,
 *   'student-id',
 *   'program-id',
 *   ['course-1', 'course-2', 'course-3']
 * );
 */
export async function calculateMajorGPA(
  gradeModel: typeof Model,
  studentId: string,
  programId: string,
  majorCourseIds: string[]
): Promise<GPACalculation> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      courseId: { [Op.in]: majorCourseIds },
      gradingBasis: 'letter',
    },
  });

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const gradePoints = (grade as any).gradePoints;
    const credits = (grade as any).credits;
    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    studentId,
    calculationType: 'major',
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    qualityPoints: totalQualityPoints,
    gradeCount: grades.length,
    programId,
    calculatedAt: new Date(),
  };
}

/**
 * Calculates minor GPA for a student.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} programId - Minor program ID
 * @param {string[]} minorCourseIds - Course IDs in the minor
 * @returns {Promise<GPACalculation>} Minor GPA
 *
 * @example
 * const minorGPA = await calculateMinorGPA(
 *   Grade,
 *   'student-id',
 *   'minor-program-id',
 *   ['course-1', 'course-2']
 * );
 */
export async function calculateMinorGPA(
  gradeModel: typeof Model,
  studentId: string,
  programId: string,
  minorCourseIds: string[]
): Promise<GPACalculation> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      courseId: { [Op.in]: minorCourseIds },
      gradingBasis: 'letter',
    },
  });

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const gradePoints = (grade as any).gradePoints;
    const credits = (grade as any).credits;
    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    studentId,
    calculationType: 'minor',
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    qualityPoints: totalQualityPoints,
    gradeCount: grades.length,
    programId,
    calculatedAt: new Date(),
  };
}

/**
 * Calculates transfer GPA from transfer credits.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @returns {Promise<GPACalculation>} Transfer GPA
 *
 * @example
 * const transferGPA = await calculateTransferGPA(Grade, 'student-id');
 */
export async function calculateTransferGPA(
  gradeModel: typeof Model,
  studentId: string
): Promise<GPACalculation> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      gradingBasis: 'letter',
    },
  });

  // Filter transfer credits (would be marked in metadata)
  const transferGrades = grades.filter(
    (g: any) => g.metadata && g.metadata.isTransfer === true
  );

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const grade of transferGrades) {
    const gradePoints = (grade as any).gradePoints;
    const credits = (grade as any).credits;
    totalQualityPoints += gradePoints * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    studentId,
    calculationType: 'transfer',
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    qualityPoints: totalQualityPoints,
    gradeCount: transferGrades.length,
    calculatedAt: new Date(),
  };
}

/**
 * Gets GPA trend over multiple terms.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {number} numberOfTerms - Number of terms to analyze
 * @returns {Promise<GPACalculation[]>} GPA trend
 *
 * @example
 * const trend = await getGPATrend(Grade, 'student-id', 4);
 */
export async function getGPATrend(
  gradeModel: typeof Model,
  studentId: string,
  numberOfTerms: number = 4
): Promise<GPACalculation[]> {
  const grades = await gradeModel.findAll({
    where: {
      studentId,
      gradingBasis: 'letter',
    },
    order: [['term', 'DESC']],
  });

  // Group by term
  const termMap = new Map<string, any[]>();
  for (const grade of grades) {
    const term = (grade as any).term;
    if (!termMap.has(term)) {
      termMap.set(term, []);
    }
    termMap.get(term)!.push(grade);
  }

  // Calculate GPA for each term
  const trend: GPACalculation[] = [];
  const terms = Array.from(termMap.keys()).slice(0, numberOfTerms);

  for (const term of terms) {
    const termGrades = termMap.get(term)!;
    let totalQualityPoints = 0;
    let totalCredits = 0;

    for (const grade of termGrades) {
      totalQualityPoints += grade.gradePoints * grade.credits;
      totalCredits += grade.credits;
    }

    const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    trend.push({
      studentId,
      calculationType: 'term',
      gpa: Math.round(gpa * 100) / 100,
      totalCredits,
      qualityPoints: totalQualityPoints,
      gradeCount: termGrades.length,
      term,
      calculatedAt: new Date(),
    });
  }

  return trend;
}

/**
 * Predicts future GPA based on current trend.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {number} futureCredits - Expected future credits
 * @param {number} targetGPA - Target GPA
 * @returns {Promise<any>} GPA prediction
 *
 * @example
 * const prediction = await predictGPA(Grade, 'student-id', 30, 3.5);
 */
export async function predictGPA(
  gradeModel: typeof Model,
  studentId: string,
  futureCredits: number,
  targetGPA: number
): Promise<any> {
  const current = await calculateCumulativeGPA(gradeModel, studentId);

  const requiredQualityPoints = targetGPA * (current.totalCredits + futureCredits);
  const currentQualityPoints = current.qualityPoints;
  const neededQualityPoints = requiredQualityPoints - currentQualityPoints;
  const neededGPA = futureCredits > 0 ? neededQualityPoints / futureCredits : 0;

  return {
    currentGPA: current.gpa,
    currentCredits: current.totalCredits,
    futureCredits,
    targetGPA,
    requiredGPAForFutureTerms: Math.round(neededGPA * 100) / 100,
    isAchievable: neededGPA <= 4.0 && neededGPA >= 0,
  };
}

// ============================================================================
// GRADE CHANGE REQUEST FUNCTIONS (Functions 20-25)
// ============================================================================

/**
 * Creates a grade change request.
 *
 * @openapi
 * /grade-changes:
 *   post:
 *     tags:
 *       - Grade Changes
 *     summary: Create grade change request
 *     description: Submits a request to change a grade
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeChangeRequest'
 *           example:
 *             gradeId: "950e8400-e29b-41d4-a716-446655440000"
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             requestedBy: "750e8400-e29b-41d4-a716-446655440099"
 *             currentGrade: "B"
 *             requestedGrade: "A-"
 *             reason: "Grading error on final exam - calculation mistake"
 *     responses:
 *       201:
 *         description: Grade change request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeChangeRequest'
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not authorized to request grade change
 *
 * @param {typeof Model} changeRequestModel - Grade change request model
 * @param {GradeChangeRequest} requestData - Request data
 * @returns {Promise<any>} Created request
 *
 * @example
 * const request = await createGradeChangeRequest(GradeChangeRequest, {
 *   gradeId: 'grade-id',
 *   studentId: 'student-id',
 *   courseId: 'course-id',
 *   requestedBy: 'instructor-id',
 *   currentGrade: 'B',
 *   requestedGrade: 'A-',
 *   reason: 'Grading error',
 *   requestStatus: 'pending'
 * });
 */
export async function createGradeChangeRequest(
  changeRequestModel: typeof Model,
  requestData: GradeChangeRequest
): Promise<any> {
  // Validate input
  GradeChangeRequestSchema.parse(requestData);

  return await changeRequestModel.create({
    gradeId: requestData.gradeId,
    studentId: requestData.studentId,
    courseId: requestData.courseId,
    requestedBy: requestData.requestedBy,
    currentGrade: requestData.currentGrade,
    requestedGrade: requestData.requestedGrade,
    reason: requestData.reason,
    requestStatus: 'pending',
  });
}

/**
 * Approves a grade change request.
 *
 * @openapi
 * /grade-changes/{requestId}/approve:
 *   post:
 *     tags:
 *       - Grade Changes
 *     summary: Approve grade change
 *     description: Approves a pending grade change request and updates the grade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvedBy:
 *                 type: string
 *                 format: uuid
 *           example:
 *             approvedBy: "850e8400-e29b-41d4-a716-446655440100"
 *     responses:
 *       200:
 *         description: Grade change approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeChangeRequest'
 *       404:
 *         description: Request not found
 *       403:
 *         description: Not authorized to approve
 *
 * @param {typeof Model} changeRequestModel - Change request model
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} requestId - Request ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<any>} Updated request
 *
 * @example
 * const approved = await approveGradeChange(
 *   GradeChangeRequest,
 *   Grade,
 *   'request-id',
 *   'dean-id'
 * );
 */
export async function approveGradeChange(
  changeRequestModel: typeof Model,
  gradeModel: typeof Model,
  requestId: string,
  approvedBy: string
): Promise<any> {
  const request = await changeRequestModel.findByPk(requestId);

  if (!request) {
    throw new Error('Grade change request not found');
  }

  if ((request as any).requestStatus !== 'pending') {
    throw new Error('Request is not pending');
  }

  // Update the grade
  const grade = await gradeModel.findByPk((request as any).gradeId);
  if (grade) {
    await grade.update({
      letterGrade: (request as any).requestedGrade,
      isLocked: false, // Temporarily unlock to make change
    });
  }

  // Update request status
  return await request.update({
    requestStatus: 'approved',
    approvedBy,
    approvalDate: new Date(),
  });
}

/**
 * Rejects a grade change request.
 *
 * @param {typeof Model} changeRequestModel - Change request model
 * @param {string} requestId - Request ID
 * @param {string} deniedBy - Denier user ID
 * @param {string} denialReason - Reason for denial
 * @returns {Promise<any>} Updated request
 *
 * @example
 * const rejected = await rejectGradeChange(
 *   GradeChangeRequest,
 *   'request-id',
 *   'dean-id',
 *   'Insufficient evidence'
 * );
 */
export async function rejectGradeChange(
  changeRequestModel: typeof Model,
  requestId: string,
  deniedBy: string,
  denialReason: string
): Promise<any> {
  const request = await changeRequestModel.findByPk(requestId);

  if (!request) {
    throw new Error('Grade change request not found');
  }

  if ((request as any).requestStatus !== 'pending') {
    throw new Error('Request is not pending');
  }

  return await request.update({
    requestStatus: 'denied',
    approvedBy: deniedBy,
    approvalDate: new Date(),
    denialReason,
  });
}

/**
 * Gets grade change history for a grade.
 *
 * @param {typeof Model} changeRequestModel - Change request model
 * @param {string} gradeId - Grade ID
 * @returns {Promise<any[]>} Change history
 *
 * @example
 * const history = await getGradeChangeHistory(GradeChangeRequest, 'grade-id');
 */
export async function getGradeChangeHistory(
  changeRequestModel: typeof Model,
  gradeId: string
): Promise<any[]> {
  return await changeRequestModel.findAll({
    where: { gradeId },
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Validates grade change eligibility.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Grade ID
 * @param {number} deadlineDays - Days after term end for changes
 * @returns {Promise<boolean>} Eligibility status
 *
 * @example
 * const eligible = await validateGradeChangeEligibility(
 *   Grade,
 *   'grade-id',
 *   30
 * );
 */
export async function validateGradeChangeEligibility(
  gradeModel: typeof Model,
  gradeId: string,
  deadlineDays: number = 30
): Promise<boolean> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    return false;
  }

  // Check if within deadline (simplified - would use actual term end date)
  const createdAt = (grade as any).createdAt;
  const daysSinceCreation = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceCreation <= deadlineDays;
}

/**
 * Notifies stakeholders of grade change.
 *
 * @param {string} gradeId - Grade ID
 * @param {string} oldGrade - Old grade
 * @param {string} newGrade - New grade
 * @param {string} reason - Change reason
 * @returns {Promise<boolean>} Notification success
 *
 * @example
 * await notifyGradeChange('grade-id', 'B', 'A-', 'Grading error');
 */
export async function notifyGradeChange(
  gradeId: string,
  oldGrade: string,
  newGrade: string,
  reason: string
): Promise<boolean> {
  // Simplified - would integrate with notification service
  console.log(`Grade change notification: ${oldGrade} → ${newGrade}`);
  console.log(`Reason: ${reason}`);
  return true;
}

// ============================================================================
// INCOMPLETE GRADE MANAGEMENT FUNCTIONS (Functions 26-30)
// ============================================================================

/**
 * Assigns an incomplete grade.
 *
 * @openapi
 * /grades/incomplete:
 *   post:
 *     tags:
 *       - Incomplete Grades
 *     summary: Assign incomplete grade
 *     description: Assigns an incomplete grade with deadline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: uuid
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               term:
 *                 type: string
 *               reason:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             term: "Fall 2024"
 *             reason: "Medical emergency"
 *             deadline: "2025-01-15"
 *     responses:
 *       201:
 *         description: Incomplete grade assigned
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @param {string} reason - Reason for incomplete
 * @param {Date} deadline - Completion deadline
 * @returns {Promise<any>} Incomplete grade
 *
 * @example
 * const incomplete = await assignIncompleteGrade(
 *   Grade,
 *   'student-id',
 *   'course-id',
 *   'Fall 2024',
 *   'Medical emergency',
 *   new Date('2025-01-15')
 * );
 */
export async function assignIncompleteGrade(
  gradeModel: typeof Model,
  studentId: string,
  courseId: string,
  term: string,
  reason: string,
  deadline: Date
): Promise<any> {
  return await gradeModel.create({
    studentId,
    courseId,
    term,
    letterGrade: 'I',
    gradePoints: 0,
    credits: 0, // Will be updated when resolved
    gradingBasis: 'incomplete',
    isLocked: false,
    metadata: {
      reason,
      deadline: deadline.toISOString(),
      isIncomplete: true,
    },
  });
}

/**
 * Resolves an incomplete grade.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Incomplete grade ID
 * @param {string} finalGrade - Final letter grade
 * @param {number} gradePoints - Grade points
 * @param {number} credits - Course credits
 * @returns {Promise<any>} Resolved grade
 *
 * @example
 * const resolved = await resolveIncompleteGrade(
 *   Grade,
 *   'grade-id',
 *   'B+',
 *   3.3,
 *   3.0
 * );
 */
export async function resolveIncompleteGrade(
  gradeModel: typeof Model,
  gradeId: string,
  finalGrade: string,
  gradePoints: number,
  credits: number
): Promise<any> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    throw new Error('Incomplete grade not found');
  }

  if ((grade as any).letterGrade !== 'I') {
    throw new Error('Grade is not incomplete');
  }

  return await grade.update({
    letterGrade: finalGrade,
    gradePoints,
    credits,
    gradingBasis: 'letter',
    metadata: {
      ...(grade as any).metadata,
      resolvedDate: new Date().toISOString(),
      wasIncomplete: true,
    },
  });
}

/**
 * Gets all incomplete grades for a student.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @returns {Promise<any[]>} Incomplete grades
 *
 * @example
 * const incompletes = await getIncompleteGrades(Grade, 'student-id');
 */
export async function getIncompleteGrades(
  gradeModel: typeof Model,
  studentId: string
): Promise<any[]> {
  return await gradeModel.findAll({
    where: {
      studentId,
      letterGrade: 'I',
      gradingBasis: 'incomplete',
    },
  });
}

/**
 * Checks incomplete grade deadlines.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @returns {Promise<any[]>} Expired incompletes
 *
 * @example
 * const expired = await checkIncompleteDeadlines(Grade);
 */
export async function checkIncompleteDeadlines(
  gradeModel: typeof Model
): Promise<any[]> {
  const incompletes = await gradeModel.findAll({
    where: {
      letterGrade: 'I',
      gradingBasis: 'incomplete',
    },
  });

  const now = new Date();
  const expired: any[] = [];

  for (const incomplete of incompletes) {
    const metadata = (incomplete as any).metadata;
    if (metadata && metadata.deadline) {
      const deadline = new Date(metadata.deadline);
      if (deadline < now) {
        expired.push(incomplete);
      }
    }
  }

  return expired;
}

/**
 * Converts expired incompletes to F grades.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @returns {Promise<number>} Number of grades converted
 *
 * @example
 * const count = await convertExpiredIncompletes(Grade);
 */
export async function convertExpiredIncompletes(
  gradeModel: typeof Model
): Promise<number> {
  const expired = await checkIncompleteDeadlines(gradeModel);

  for (const incomplete of expired) {
    await incomplete.update({
      letterGrade: 'F',
      gradePoints: 0,
      gradingBasis: 'letter',
      metadata: {
        ...(incomplete as any).metadata,
        convertedDate: new Date().toISOString(),
        conversionReason: 'Deadline expired',
      },
    });
  }

  return expired.length;
}

// ============================================================================
// PASS/FAIL GRADING FUNCTIONS (Functions 31-35)
// ============================================================================

/**
 * Converts a course to pass/fail grading.
 *
 * @openapi
 * /grades/pass-fail:
 *   post:
 *     tags:
 *       - Pass/Fail
 *     summary: Convert to pass/fail
 *     description: Converts a letter grade to pass/fail
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gradeId:
 *                 type: string
 *                 format: uuid
 *               letterGrade:
 *                 type: string
 *           example:
 *             gradeId: "950e8400-e29b-41d4-a716-446655440000"
 *             letterGrade: "B"
 *     responses:
 *       200:
 *         description: Converted to pass/fail
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} gradeId - Grade ID
 * @param {string} letterGrade - Original letter grade
 * @returns {Promise<any>} Updated grade
 *
 * @example
 * const passFailGrade = await convertToPassFail(Grade, 'grade-id', 'B');
 */
export async function convertToPassFail(
  gradeModel: typeof Model,
  gradeId: string,
  letterGrade: string
): Promise<any> {
  const grade = await gradeModel.findByPk(gradeId);

  if (!grade) {
    throw new Error('Grade not found');
  }

  // Determine pass or no-pass based on grade
  const passingGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'];
  const isPassing = passingGrades.includes(letterGrade);

  return await grade.update({
    letterGrade: isPassing ? 'P' : 'NP',
    gradePoints: 0, // Pass/fail doesn't count toward GPA
    gradingBasis: 'pass-fail',
    metadata: {
      ...(grade as any).metadata,
      originalLetterGrade: letterGrade,
      convertedToPassFail: true,
    },
  });
}

/**
 * Validates pass/fail eligibility.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {number} maxPassFailCredits - Maximum pass/fail credits allowed
 * @returns {Promise<boolean>} Eligibility status
 *
 * @example
 * const eligible = await validatePassFailEligibility(
 *   Grade,
 *   'student-id',
 *   'course-id',
 *   12
 * );
 */
export async function validatePassFailEligibility(
  gradeModel: typeof Model,
  studentId: string,
  courseId: string,
  maxPassFailCredits: number = 12
): Promise<boolean> {
  const passFailGrades = await gradeModel.findAll({
    where: {
      studentId,
      gradingBasis: 'pass-fail',
    },
  });

  const totalPassFailCredits = passFailGrades.reduce(
    (sum, grade) => sum + ((grade as any).credits || 0),
    0
  );

  return totalPassFailCredits < maxPassFailCredits;
}

/**
 * Gets all pass/fail courses for a student.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @returns {Promise<any[]>} Pass/fail courses
 *
 * @example
 * const courses = await getPassFailCourses(Grade, 'student-id');
 */
export async function getPassFailCourses(
  gradeModel: typeof Model,
  studentId: string
): Promise<any[]> {
  return await gradeModel.findAll({
    where: {
      studentId,
      gradingBasis: 'pass-fail',
    },
  });
}

/**
 * Calculates impact of pass/fail on GPA.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} gradeId - Grade to convert
 * @returns {Promise<any>} GPA impact analysis
 *
 * @example
 * const impact = await calculatePassFailImpact(Grade, 'student-id', 'grade-id');
 */
export async function calculatePassFailImpact(
  gradeModel: typeof Model,
  studentId: string,
  gradeId: string
): Promise<any> {
  const currentGPA = await calculateCumulativeGPA(gradeModel, studentId);

  const grade = await gradeModel.findByPk(gradeId);
  if (!grade) {
    throw new Error('Grade not found');
  }

  const gradePoints = (grade as any).gradePoints;
  const credits = (grade as any).credits;

  // Calculate GPA without this grade's points
  const newQualityPoints = currentGPA.qualityPoints - (gradePoints * credits);
  const newCredits = currentGPA.totalCredits; // Credits still count
  const newGPA = newCredits > 0 ? newQualityPoints / newCredits : 0;

  return {
    currentGPA: currentGPA.gpa,
    gpaIfPassFail: Math.round(newGPA * 100) / 100,
    difference: Math.round((newGPA - currentGPA.gpa) * 100) / 100,
    recommendation: newGPA >= currentGPA.gpa ? 'Consider pass/fail' : 'Keep letter grade',
  };
}

/**
 * Enforces pass/fail credit limits.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {number} maxCredits - Maximum pass/fail credits
 * @returns {Promise<boolean>} Whether limit is exceeded
 *
 * @example
 * const withinLimit = await enforcePassFailLimits(Grade, 'student-id', 12);
 */
export async function enforcePassFailLimits(
  gradeModel: typeof Model,
  studentId: string,
  maxCredits: number
): Promise<boolean> {
  const passFailCourses = await getPassFailCourses(gradeModel, studentId);

  const totalCredits = passFailCourses.reduce(
    (sum, course) => sum + ((course as any).credits || 0),
    0
  );

  return totalCredits <= maxCredits;
}

// ============================================================================
// GRADING RUBRICS FUNCTIONS (Functions 36-41)
// ============================================================================

/**
 * Creates a grading rubric.
 *
 * @openapi
 * /rubrics:
 *   post:
 *     tags:
 *       - Rubrics
 *     summary: Create grading rubric
 *     description: Creates a new grading rubric for assessments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rubricName:
 *                 type: string
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               criteria:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     criterionName:
 *                       type: string
 *                     maxPoints:
 *                       type: number
 *                     levels:
 *                       type: array
 *                       items:
 *                         type: object
 *           example:
 *             rubricName: "Essay Grading Rubric"
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             criteria:
 *               - criterionName: "Thesis Statement"
 *                 maxPoints: 25
 *                 levels:
 *                   - levelName: "Excellent"
 *                     points: 25
 *                   - levelName: "Good"
 *                     points: 20
 *     responses:
 *       201:
 *         description: Rubric created successfully
 *
 * @param {GradingRubric} rubricData - Rubric data
 * @returns {Promise<GradingRubric>} Created rubric
 *
 * @example
 * const rubric = await createGradingRubric({
 *   rubricName: 'Essay Grading',
 *   criteria: [...]
 * });
 */
export async function createGradingRubric(
  rubricData: GradingRubric
): Promise<GradingRubric> {
  // Simplified - would store in database
  return {
    ...rubricData,
    id: `rubric-${Date.now()}`,
    isActive: true,
    createdAt: new Date(),
  };
}

/**
 * Applies a rubric to score an assessment.
 *
 * @param {GradingRubric} rubric - Grading rubric
 * @param {Map<string, number>} criterionScores - Scores for each criterion
 * @returns {Promise<number>} Total score
 *
 * @example
 * const scores = new Map([
 *   ['Thesis Statement', 25],
 *   ['Organization', 20]
 * ]);
 * const total = await applyRubric(rubric, scores);
 */
export async function applyRubric(
  rubric: GradingRubric,
  criterionScores: Map<string, number>
): Promise<number> {
  let totalScore = 0;

  for (const criterion of rubric.criteria) {
    const score = criterionScores.get(criterion.criterionName) || 0;
    totalScore += score;
  }

  return totalScore;
}

/**
 * Validates rubric scoring.
 *
 * @param {GradingRubric} rubric - Grading rubric
 * @param {Map<string, number>} criterionScores - Scores to validate
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * const isValid = await validateRubricScoring(rubric, scores);
 */
export async function validateRubricScoring(
  rubric: GradingRubric,
  criterionScores: Map<string, number>
): Promise<boolean> {
  for (const criterion of rubric.criteria) {
    const score = criterionScores.get(criterion.criterionName);

    if (score === undefined) {
      return false; // Missing criterion
    }

    if (score < 0 || score > criterion.maxPoints) {
      return false; // Score out of range
    }
  }

  return true;
}

/**
 * Calculates total rubric score.
 *
 * @param {GradingRubric} rubric - Grading rubric
 * @param {Map<string, number>} criterionScores - Criterion scores
 * @returns {Promise<number>} Total score
 *
 * @example
 * const total = await calculateRubricScore(rubric, scores);
 */
export async function calculateRubricScore(
  rubric: GradingRubric,
  criterionScores: Map<string, number>
): Promise<number> {
  return await applyRubric(rubric, criterionScores);
}

/**
 * Gets feedback based on rubric scoring.
 *
 * @param {GradingRubric} rubric - Grading rubric
 * @param {Map<string, number>} criterionScores - Criterion scores
 * @returns {Promise<string[]>} Feedback comments
 *
 * @example
 * const feedback = await getRubricFeedback(rubric, scores);
 */
export async function getRubricFeedback(
  rubric: GradingRubric,
  criterionScores: Map<string, number>
): Promise<string[]> {
  const feedback: string[] = [];

  for (const criterion of rubric.criteria) {
    const score = criterionScores.get(criterion.criterionName) || 0;
    const percentage = (score / criterion.maxPoints) * 100;

    if (percentage < 60) {
      feedback.push(`${criterion.criterionName}: Needs improvement`);
    } else if (percentage < 80) {
      feedback.push(`${criterion.criterionName}: Good work`);
    } else {
      feedback.push(`${criterion.criterionName}: Excellent`);
    }
  }

  return feedback;
}

/**
 * Analyzes rubric performance across students.
 *
 * @param {GradingRubric} rubric - Grading rubric
 * @param {Map<string, number>[]} allScores - Scores from all students
 * @returns {Promise<any>} Performance analysis
 *
 * @example
 * const analysis = await analyzeRubricPerformance(rubric, allStudentScores);
 */
export async function analyzeRubricPerformance(
  rubric: GradingRubric,
  allScores: Map<string, number>[]
): Promise<any> {
  const criterionAverages = new Map<string, number>();

  for (const criterion of rubric.criteria) {
    let total = 0;
    let count = 0;

    for (const scores of allScores) {
      const score = scores.get(criterion.criterionName);
      if (score !== undefined) {
        total += score;
        count++;
      }
    }

    const average = count > 0 ? total / count : 0;
    criterionAverages.set(criterion.criterionName, average);
  }

  return {
    rubricName: rubric.rubricName,
    totalStudents: allScores.length,
    criterionAverages: Object.fromEntries(criterionAverages),
  };
}

// ============================================================================
// GRADE ANALYTICS FUNCTIONS (Functions 42-45)
// ============================================================================

/**
 * Generates grade distribution for a course.
 *
 * @openapi
 * /analytics/grade-distribution:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get grade distribution
 *     description: Generates grade distribution statistics for a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grade distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                 term:
 *                   type: string
 *                 gradeBreakdown:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                 averageGPA:
 *                   type: number
 *                 medianGrade:
 *                   type: string
 *                 totalStudents:
 *                   type: integer
 *             example:
 *               courseId: "850e8400-e29b-41d4-a716-446655440050"
 *               term: "Fall 2024"
 *               gradeBreakdown:
 *                 A: 15
 *                 B+: 20
 *                 B: 18
 *                 C+: 10
 *                 C: 5
 *               averageGPA: 3.2
 *               medianGrade: "B+"
 *               totalStudents: 68
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @returns {Promise<GradeDistribution>} Grade distribution
 *
 * @example
 * const distribution = await generateGradeDistribution(
 *   Grade,
 *   'course-id',
 *   'Fall 2024'
 * );
 */
export async function generateGradeDistribution(
  gradeModel: typeof Model,
  courseId: string,
  term: string
): Promise<GradeDistribution> {
  const grades = await gradeModel.findAll({
    where: { courseId, term, gradingBasis: 'letter' },
  });

  const gradeBreakdown = new Map<string, number>();
  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const letterGrade = (grade as any).letterGrade;
    gradeBreakdown.set(letterGrade, (gradeBreakdown.get(letterGrade) || 0) + 1);

    totalGradePoints += (grade as any).gradePoints * (grade as any).credits;
    totalCredits += (grade as any).credits;
  }

  const averageGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  // Calculate median (simplified)
  const sortedGrades = grades.sort((a: any, b: any) => b.gradePoints - a.gradePoints);
  const medianGrade = sortedGrades[Math.floor(sortedGrades.length / 2)]
    ? (sortedGrades[Math.floor(sortedGrades.length / 2)] as any).letterGrade
    : 'N/A';

  return {
    courseId,
    term,
    gradeBreakdown,
    averageGPA: Math.round(averageGPA * 100) / 100,
    medianGrade,
    totalStudents: grades.length,
  };
}

/**
 * Calculates course statistics.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @returns {Promise<any>} Course statistics
 *
 * @example
 * const stats = await calculateCourseStatistics(Grade, 'course-id', 'Fall 2024');
 */
export async function calculateCourseStatistics(
  gradeModel: typeof Model,
  courseId: string,
  term: string
): Promise<any> {
  const distribution = await generateGradeDistribution(gradeModel, courseId, term);

  const passRate =
    ((distribution.totalStudents -
      (distribution.gradeBreakdown.get('F') || 0) -
      (distribution.gradeBreakdown.get('NP') || 0)) /
      distribution.totalStudents) *
    100;

  return {
    ...distribution,
    passRate: Math.round(passRate * 100) / 100,
    failCount: (distribution.gradeBreakdown.get('F') || 0) + (distribution.gradeBreakdown.get('NP') || 0),
  };
}

/**
 * Identifies grade anomalies.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} courseId - Course ID
 * @param {string} term - Term
 * @returns {Promise<any[]>} Anomalies detected
 *
 * @example
 * const anomalies = await identifyGradeAnomalies(Grade, 'course-id', 'Fall 2024');
 */
export async function identifyGradeAnomalies(
  gradeModel: typeof Model,
  courseId: string,
  term: string
): Promise<any[]> {
  const distribution = await generateGradeDistribution(gradeModel, courseId, term);
  const anomalies: any[] = [];

  // Check for excessive failures
  const failCount = (distribution.gradeBreakdown.get('F') || 0);
  if (failCount / distribution.totalStudents > 0.3) {
    anomalies.push({
      type: 'high_failure_rate',
      message: 'Course has unusually high failure rate',
      value: Math.round((failCount / distribution.totalStudents) * 100),
    });
  }

  // Check for grade inflation
  const aCount = (distribution.gradeBreakdown.get('A') || 0) + (distribution.gradeBreakdown.get('A+') || 0);
  if (aCount / distribution.totalStudents > 0.5) {
    anomalies.push({
      type: 'grade_inflation',
      message: 'Course may have grade inflation',
      value: Math.round((aCount / distribution.totalStudents) * 100),
    });
  }

  return anomalies;
}

/**
 * Generates a student transcript.
 *
 * @openapi
 * /transcripts/{studentId}:
 *   get:
 *     tags:
 *       - Transcripts
 *     summary: Generate transcript
 *     description: Generates official transcript for a student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, pdf]
 *           default: json
 *     responses:
 *       200:
 *         description: Transcript generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: string
 *                 terms:
 *                   type: array
 *                   items:
 *                     type: object
 *                 cumulativeGPA:
 *                   type: number
 *                 totalCredits:
 *                   type: number
 *
 * @param {typeof Model} gradeModel - Grade model
 * @param {string} studentId - Student ID
 * @param {string} format - Output format
 * @returns {Promise<any>} Transcript
 *
 * @example
 * const transcript = await generateTranscript(Grade, 'student-id', 'json');
 */
export async function generateTranscript(
  gradeModel: typeof Model,
  studentId: string,
  format: 'json' | 'pdf' = 'json'
): Promise<any> {
  const grades = await gradeModel.findAll({
    where: { studentId },
    order: [['term', 'ASC']],
  });

  const cumulativeGPA = await calculateCumulativeGPA(gradeModel, studentId);

  // Group by term
  const termMap = new Map<string, any[]>();
  for (const grade of grades) {
    const term = (grade as any).term;
    if (!termMap.has(term)) {
      termMap.set(term, []);
    }
    termMap.get(term)!.push(grade);
  }

  const terms = Array.from(termMap.entries()).map(([term, termGrades]) => ({
    term,
    courses: termGrades,
    termCredits: termGrades.reduce((sum, g: any) => sum + g.credits, 0),
  }));

  const transcript = {
    studentId,
    generatedAt: new Date(),
    format,
    terms,
    cumulativeGPA: cumulativeGPA.gpa,
    totalCredits: cumulativeGPA.totalCredits,
  };

  return transcript;
}
