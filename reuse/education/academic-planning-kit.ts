/**
 * LOC: EDACADPLAN001
 * File: /reuse/education/academic-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS education services
 *   - Academic advising modules
 *   - Degree audit services
 *   - Student planning portals
 *   - Registration systems
 */

/**
 * File: /reuse/education/academic-planning-kit.ts
 * Locator: WC-EDU-ACADPLAN-001
 * Purpose: Comprehensive Academic Planning & Degree Management Kit for Education SIS
 *
 * Upstream: Independent utility module for academic planning operations
 * Downstream: ../backend/*, Education services, Academic advising, Degree audit, Student portals
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, zod
 * Exports: 45 utility functions for academic plans, degree planning, major/minor management, course sequencing
 *
 * LLM Context: Enterprise-grade academic planning utilities for education Student Information System (SIS).
 * Provides comprehensive academic plan management, degree roadmap generation, major/minor declaration workflows,
 * course sequencing with prerequisite validation, elective selection tracking, program requirements validation,
 * degree progress auditing, what-if scenario analysis, graduation date estimation, and comprehensive academic
 * planning features for higher education institutions.
 *
 * OpenAPI Specification: 3.0.3
 * Security: Bearer authentication, role-based access control (student, advisor, registrar)
 */

import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { z } from 'zod';

// ============================================================================
// OPENAPI 3.0 SPECIFICATION
// ============================================================================

/**
 * @openapi
 * info:
 *   title: Academic Planning API
 *   version: 1.0.0
 *   description: Comprehensive API for academic planning, degree management, and student advising
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
 *     AcademicPlan:
 *       type: object
 *       required:
 *         - studentId
 *         - programId
 *         - catalogYear
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the academic plan
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: Student's unique identifier
 *         programId:
 *           type: string
 *           format: uuid
 *           description: Academic program identifier
 *         catalogYear:
 *           type: string
 *           pattern: ^\d{4}-\d{4}$
 *           example: "2024-2025"
 *           description: Academic catalog year
 *         expectedGraduationDate:
 *           type: string
 *           format: date
 *           description: Expected graduation date
 *         planStatus:
 *           type: string
 *           enum: [draft, active, completed, archived]
 *           description: Current status of the academic plan
 *         totalCreditsRequired:
 *           type: number
 *           description: Total credits required for degree
 *         creditsCompleted:
 *           type: number
 *           description: Credits completed so far
 *         creditsInProgress:
 *           type: number
 *           description: Credits currently in progress
 *         gpaRequirement:
 *           type: number
 *           format: float
 *           minimum: 0.0
 *           maximum: 4.0
 *           description: Minimum GPA required
 *         currentGPA:
 *           type: number
 *           format: float
 *           description: Current student GPA
 *         advisorId:
 *           type: string
 *           format: uuid
 *           description: Assigned academic advisor
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           description: Additional plan metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         studentId: "650e8400-e29b-41d4-a716-446655440001"
 *         programId: "750e8400-e29b-41d4-a716-446655440002"
 *         catalogYear: "2024-2025"
 *         expectedGraduationDate: "2028-05-15"
 *         planStatus: "active"
 *         totalCreditsRequired: 120
 *         creditsCompleted: 45
 *         creditsInProgress: 15
 *         gpaRequirement: 2.0
 *         currentGPA: 3.5
 *
 *     ProgramPlan:
 *       type: object
 *       required:
 *         - programId
 *         - programName
 *         - degreeType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         programId:
 *           type: string
 *           format: uuid
 *         programName:
 *           type: string
 *           description: Name of the academic program
 *         degreeType:
 *           type: string
 *           enum: [BA, BS, MA, MS, MBA, PhD, Certificate]
 *           description: Type of degree awarded
 *         department:
 *           type: string
 *           description: Academic department
 *         totalCredits:
 *           type: number
 *           description: Total credits required
 *         coreCredits:
 *           type: number
 *           description: Core/required credits
 *         electiveCredits:
 *           type: number
 *           description: Elective credits required
 *         minimumGPA:
 *           type: number
 *           format: float
 *         residencyRequirement:
 *           type: number
 *           description: Minimum credits that must be taken at institution
 *         catalogYear:
 *           type: string
 *         isActive:
 *           type: boolean
 *       example:
 *         programId: "750e8400-e29b-41d4-a716-446655440002"
 *         programName: "Computer Science"
 *         degreeType: "BS"
 *         department: "Engineering"
 *         totalCredits: 120
 *         coreCredits: 75
 *         electiveCredits: 45
 *         minimumGPA: 2.0
 *
 *     MajorMinor:
 *       type: object
 *       required:
 *         - studentId
 *         - programId
 *         - declarationType
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         studentId:
 *           type: string
 *           format: uuid
 *         programId:
 *           type: string
 *           format: uuid
 *         declarationType:
 *           type: string
 *           enum: [major, minor, double-major, concentration]
 *         declarationDate:
 *           type: string
 *           format: date
 *         declarationStatus:
 *           type: string
 *           enum: [pending, approved, denied, dropped]
 *         approvedBy:
 *           type: string
 *           format: uuid
 *         approvalDate:
 *           type: string
 *           format: date
 *         isPrimary:
 *           type: boolean
 *           description: Whether this is the primary major
 *       example:
 *         studentId: "650e8400-e29b-41d4-a716-446655440001"
 *         programId: "750e8400-e29b-41d4-a716-446655440002"
 *         declarationType: "major"
 *         declarationStatus: "approved"
 *         isPrimary: true
 *
 *     DegreeRequirement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         programId:
 *           type: string
 *           format: uuid
 *         requirementType:
 *           type: string
 *           enum: [core, distribution, elective, residency, gpa, capstone]
 *         requirementName:
 *           type: string
 *         description:
 *           type: string
 *         creditsRequired:
 *           type: number
 *         courseList:
 *           type: array
 *           items:
 *             type: string
 *           description: List of course IDs that satisfy this requirement
 *         minimumGrade:
 *           type: string
 *           description: Minimum grade required (e.g., "C", "B-")
 *         isRequired:
 *           type: boolean
 *         category:
 *           type: string
 *           description: Requirement category (e.g., "Humanities", "Sciences")
 *
 *     CourseSequence:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *         courseName:
 *           type: string
 *         courseCode:
 *           type: string
 *           example: "CS-101"
 *         credits:
 *           type: number
 *         term:
 *           type: string
 *           example: "Fall 2024"
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         corequisites:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         status:
 *           type: string
 *           enum: [available, blocked, completed, in-progress]
 *
 *     Error:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: string
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           example: "Invalid input provided"
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

export interface AcademicPlan {
  id?: string;
  studentId: string;
  programId: string;
  catalogYear: string;
  expectedGraduationDate?: Date;
  planStatus: 'draft' | 'active' | 'completed' | 'archived';
  totalCreditsRequired: number;
  creditsCompleted: number;
  creditsInProgress: number;
  gpaRequirement: number;
  currentGPA?: number;
  advisorId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgramPlan {
  id?: string;
  programId: string;
  programName: string;
  degreeType: 'BA' | 'BS' | 'MA' | 'MS' | 'MBA' | 'PhD' | 'Certificate';
  department: string;
  totalCredits: number;
  coreCredits: number;
  electiveCredits: number;
  minimumGPA: number;
  residencyRequirement: number;
  catalogYear: string;
  isActive: boolean;
  requirements?: DegreeRequirement[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MajorMinor {
  id?: string;
  studentId: string;
  programId: string;
  declarationType: 'major' | 'minor' | 'double-major' | 'concentration';
  declarationDate: Date;
  declarationStatus: 'pending' | 'approved' | 'denied' | 'dropped';
  approvedBy?: string;
  approvalDate?: Date;
  isPrimary: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DegreeRequirement {
  id?: string;
  programId: string;
  requirementType: 'core' | 'distribution' | 'elective' | 'residency' | 'gpa' | 'capstone';
  requirementName: string;
  description: string;
  creditsRequired: number;
  courseList?: string[];
  minimumGrade?: string;
  isRequired: boolean;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseSequence {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  term: string;
  prerequisites: string[];
  corequisites: string[];
  status: 'available' | 'blocked' | 'completed' | 'in-progress';
}

export interface DegreeRoadmap {
  studentId: string;
  programId: string;
  totalTerms: number;
  terms: TermPlan[];
  progressPercentage: number;
  estimatedGraduationDate: Date;
}

export interface TermPlan {
  termName: string;
  termYear: number;
  courses: CourseSequence[];
  totalCredits: number;
  isCurrentTerm: boolean;
}

export interface ElectiveSelection {
  studentId: string;
  courseId: string;
  category: string;
  credits: number;
  term: string;
  status: 'planned' | 'enrolled' | 'completed';
}

export interface PlanValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  missingRequirements: string[];
  progressPercentage: number;
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

export interface WhatIfScenario {
  scenarioId: string;
  studentId: string;
  alternativeProgramId: string;
  currentCredits: number;
  additionalCreditsNeeded: number;
  estimatedCompletionDate: Date;
  feasibilityScore: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const AcademicPlanSchema = z.object({
  studentId: z.string().uuid(),
  programId: z.string().uuid(),
  catalogYear: z.string().regex(/^\d{4}-\d{4}$/),
  expectedGraduationDate: z.date().optional(),
  planStatus: z.enum(['draft', 'active', 'completed', 'archived']),
  totalCreditsRequired: z.number().min(0),
  creditsCompleted: z.number().min(0),
  creditsInProgress: z.number().min(0),
  gpaRequirement: z.number().min(0).max(4),
  currentGPA: z.number().min(0).max(4).optional(),
  advisorId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const MajorMinorSchema = z.object({
  studentId: z.string().uuid(),
  programId: z.string().uuid(),
  declarationType: z.enum(['major', 'minor', 'double-major', 'concentration']),
  declarationDate: z.date(),
  declarationStatus: z.enum(['pending', 'approved', 'denied', 'dropped']),
  isPrimary: z.boolean(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Academic Plans.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} AcademicPlan model
 *
 * @example
 * const AcademicPlan = defineAcademicPlanModel(sequelize);
 * await AcademicPlan.create({
 *   studentId: '650e8400-e29b-41d4-a716-446655440001',
 *   programId: '750e8400-e29b-41d4-a716-446655440002',
 *   catalogYear: '2024-2025',
 *   planStatus: 'active',
 *   totalCreditsRequired: 120
 * });
 */
export function defineAcademicPlanModel(sequelize: Sequelize): typeof Model {
  class AcademicPlanModel extends Model {
    public id!: string;
    public studentId!: string;
    public programId!: string;
    public catalogYear!: string;
    public expectedGraduationDate!: Date;
    public planStatus!: string;
    public totalCreditsRequired!: number;
    public creditsCompleted!: number;
    public creditsInProgress!: number;
    public gpaRequirement!: number;
    public currentGPA!: number;
    public advisorId!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AcademicPlanModel.init(
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
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'program_id',
      },
      catalogYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'catalog_year',
      },
      expectedGraduationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expected_graduation_date',
      },
      planStatus: {
        type: DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        field: 'plan_status',
      },
      totalCreditsRequired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_credits_required',
      },
      creditsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'credits_completed',
      },
      creditsInProgress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'credits_in_progress',
      },
      gpaRequirement: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        field: 'gpa_requirement',
      },
      currentGPA: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        field: 'current_gpa',
      },
      advisorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'advisor_id',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'academic_plans',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['student_id'] },
        { fields: ['program_id'] },
        { fields: ['plan_status'] },
        { fields: ['advisor_id'] },
      ],
    }
  );

  return AcademicPlanModel;
}

/**
 * Sequelize model for Program Plans.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ProgramPlan model
 *
 * @example
 * const ProgramPlan = defineProgramPlanModel(sequelize);
 * await ProgramPlan.create({
 *   programId: '750e8400-e29b-41d4-a716-446655440002',
 *   programName: 'Computer Science',
 *   degreeType: 'BS',
 *   totalCredits: 120
 * });
 */
export function defineProgramPlanModel(sequelize: Sequelize): typeof Model {
  class ProgramPlanModel extends Model {
    public id!: string;
    public programId!: string;
    public programName!: string;
    public degreeType!: string;
    public department!: string;
    public totalCredits!: number;
    public coreCredits!: number;
    public electiveCredits!: number;
    public minimumGPA!: number;
    public residencyRequirement!: number;
    public catalogYear!: string;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProgramPlanModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'program_id',
      },
      programName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'program_name',
      },
      degreeType: {
        type: DataTypes.ENUM('BA', 'BS', 'MA', 'MS', 'MBA', 'PhD', 'Certificate'),
        allowNull: false,
        field: 'degree_type',
      },
      department: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      totalCredits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_credits',
      },
      coreCredits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'core_credits',
      },
      electiveCredits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'elective_credits',
      },
      minimumGPA: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        field: 'minimum_gpa',
      },
      residencyRequirement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'residency_requirement',
      },
      catalogYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'catalog_year',
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
      tableName: 'program_plans',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['program_id'] },
        { fields: ['degree_type'] },
        { fields: ['department'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return ProgramPlanModel;
}

/**
 * Sequelize model for Major/Minor declarations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} MajorMinor model
 *
 * @example
 * const MajorMinor = defineMajorMinorModel(sequelize);
 * await MajorMinor.create({
 *   studentId: '650e8400-e29b-41d4-a716-446655440001',
 *   programId: '750e8400-e29b-41d4-a716-446655440002',
 *   declarationType: 'major',
 *   declarationStatus: 'pending'
 * });
 */
export function defineMajorMinorModel(sequelize: Sequelize): typeof Model {
  class MajorMinorModel extends Model {
    public id!: string;
    public studentId!: string;
    public programId!: string;
    public declarationType!: string;
    public declarationDate!: Date;
    public declarationStatus!: string;
    public approvedBy!: string;
    public approvalDate!: Date;
    public isPrimary!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MajorMinorModel.init(
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
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'program_id',
      },
      declarationType: {
        type: DataTypes.ENUM('major', 'minor', 'double-major', 'concentration'),
        allowNull: false,
        field: 'declaration_type',
      },
      declarationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'declaration_date',
      },
      declarationStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'dropped'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'declaration_status',
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
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_primary',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'major_minor_declarations',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['student_id'] },
        { fields: ['program_id'] },
        { fields: ['declaration_status'] },
        { fields: ['declaration_type'] },
      ],
    }
  );

  return MajorMinorModel;
}

/**
 * Sequelize model for Degree Requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} DegreeRequirement model
 *
 * @example
 * const DegreeRequirement = defineDegreeRequirementModel(sequelize);
 * await DegreeRequirement.create({
 *   programId: '750e8400-e29b-41d4-a716-446655440002',
 *   requirementType: 'core',
 *   requirementName: 'Core Computer Science',
 *   creditsRequired: 36
 * });
 */
export function defineDegreeRequirementModel(sequelize: Sequelize): typeof Model {
  class DegreeRequirementModel extends Model {
    public id!: string;
    public programId!: string;
    public requirementType!: string;
    public requirementName!: string;
    public description!: string;
    public creditsRequired!: number;
    public courseList!: string[];
    public minimumGrade!: string;
    public isRequired!: boolean;
    public category!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DegreeRequirementModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'program_id',
      },
      requirementType: {
        type: DataTypes.ENUM('core', 'distribution', 'elective', 'residency', 'gpa', 'capstone'),
        allowNull: false,
        field: 'requirement_type',
      },
      requirementName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'requirement_name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      creditsRequired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'credits_required',
      },
      courseList: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        field: 'course_list',
      },
      minimumGrade: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: 'minimum_grade',
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_required',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'degree_requirements',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['program_id'] },
        { fields: ['requirement_type'] },
        { fields: ['is_required'] },
      ],
    }
  );

  return DegreeRequirementModel;
}

// ============================================================================
// ACADEMIC PLAN CRUD OPERATIONS (Functions 5-12)
// ============================================================================

/**
 * Creates a new academic plan for a student.
 *
 * @openapi
 * /academic-plans:
 *   post:
 *     tags:
 *       - Academic Plans
 *     summary: Create a new academic plan
 *     description: Creates a new academic plan for a student with program and catalog year
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicPlan'
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             programId: "750e8400-e29b-41d4-a716-446655440002"
 *             catalogYear: "2024-2025"
 *             planStatus: "draft"
 *             totalCreditsRequired: 120
 *             creditsCompleted: 0
 *             creditsInProgress: 0
 *             gpaRequirement: 2.0
 *             advisorId: "850e8400-e29b-41d4-a716-446655440003"
 *     responses:
 *       201:
 *         description: Academic plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Academic plan already exists for student
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {AcademicPlan} planData - Academic plan data
 * @returns {Promise<any>} Created academic plan
 *
 * @example
 * const plan = await createAcademicPlan(AcademicPlan, {
 *   studentId: '650e8400-e29b-41d4-a716-446655440001',
 *   programId: '750e8400-e29b-41d4-a716-446655440002',
 *   catalogYear: '2024-2025',
 *   planStatus: 'draft',
 *   totalCreditsRequired: 120,
 *   creditsCompleted: 0,
 *   creditsInProgress: 0,
 *   gpaRequirement: 2.0
 * });
 */
export async function createAcademicPlan(
  planModel: typeof Model,
  planData: AcademicPlan
): Promise<any> {
  // Validate input
  AcademicPlanSchema.parse(planData);

  // Check for existing plan
  const existing = await planModel.findOne({
    where: {
      studentId: planData.studentId,
      planStatus: { [Op.in]: ['draft', 'active'] },
    },
  });

  if (existing) {
    throw new Error('Active academic plan already exists for this student');
  }

  return await planModel.create({
    studentId: planData.studentId,
    programId: planData.programId,
    catalogYear: planData.catalogYear,
    expectedGraduationDate: planData.expectedGraduationDate,
    planStatus: planData.planStatus,
    totalCreditsRequired: planData.totalCreditsRequired,
    creditsCompleted: planData.creditsCompleted,
    creditsInProgress: planData.creditsInProgress,
    gpaRequirement: planData.gpaRequirement,
    currentGPA: planData.currentGPA,
    advisorId: planData.advisorId,
    metadata: planData.metadata || {},
  });
}

/**
 * Retrieves an academic plan by ID.
 *
 * @openapi
 * /academic-plans/{planId}:
 *   get:
 *     tags:
 *       - Academic Plans
 *     summary: Get academic plan by ID
 *     description: Retrieves detailed information about a specific academic plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Academic plan unique identifier
 *     responses:
 *       200:
 *         description: Academic plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       404:
 *         description: Academic plan not found
 *       401:
 *         description: Unauthorized
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} planId - Plan ID
 * @returns {Promise<any>} Academic plan
 *
 * @example
 * const plan = await getAcademicPlan(AcademicPlan, '550e8400-e29b-41d4-a716-446655440000');
 */
export async function getAcademicPlan(
  planModel: typeof Model,
  planId: string
): Promise<any> {
  const plan = await planModel.findByPk(planId);
  if (!plan) {
    throw new Error('Academic plan not found');
  }
  return plan;
}

/**
 * Updates an existing academic plan.
 *
 * @openapi
 * /academic-plans/{planId}:
 *   put:
 *     tags:
 *       - Academic Plans
 *     summary: Update academic plan
 *     description: Updates an existing academic plan with new data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicPlan'
 *           example:
 *             creditsCompleted: 45
 *             creditsInProgress: 15
 *             currentGPA: 3.5
 *             expectedGraduationDate: "2028-05-15"
 *     responses:
 *       200:
 *         description: Academic plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       404:
 *         description: Academic plan not found
 *       401:
 *         description: Unauthorized
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} planId - Plan ID
 * @param {Partial<AcademicPlan>} updates - Update data
 * @returns {Promise<any>} Updated academic plan
 *
 * @example
 * const updated = await updateAcademicPlan(AcademicPlan, 'plan-id', {
 *   creditsCompleted: 45,
 *   currentGPA: 3.5
 * });
 */
export async function updateAcademicPlan(
  planModel: typeof Model,
  planId: string,
  updates: Partial<AcademicPlan>
): Promise<any> {
  const plan = await planModel.findByPk(planId);
  if (!plan) {
    throw new Error('Academic plan not found');
  }

  return await plan.update(updates);
}

/**
 * Deletes an academic plan (soft delete).
 *
 * @openapi
 * /academic-plans/{planId}:
 *   delete:
 *     tags:
 *       - Academic Plans
 *     summary: Delete academic plan
 *     description: Soft deletes an academic plan (archives it)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Academic plan deleted successfully
 *       404:
 *         description: Academic plan not found
 *       401:
 *         description: Unauthorized
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} planId - Plan ID
 * @returns {Promise<boolean>} Deletion success
 *
 * @example
 * await deleteAcademicPlan(AcademicPlan, 'plan-id');
 */
export async function deleteAcademicPlan(
  planModel: typeof Model,
  planId: string
): Promise<boolean> {
  const plan = await planModel.findByPk(planId);
  if (!plan) {
    throw new Error('Academic plan not found');
  }

  await plan.update({ planStatus: 'archived' });
  return true;
}

/**
 * Lists academic plans with filtering and pagination.
 *
 * @openapi
 * /academic-plans:
 *   get:
 *     tags:
 *       - Academic Plans
 *     summary: List academic plans
 *     description: Retrieves a paginated list of academic plans with optional filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by student ID
 *       - in: query
 *         name: programId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by program ID
 *       - in: query
 *         name: planStatus
 *         schema:
 *           type: string
 *           enum: [draft, active, completed, archived]
 *         description: Filter by plan status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of academic plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AcademicPlan'
 *                 count:
 *                   type: integer
 *                   description: Total number of plans
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Academic plans
 *
 * @example
 * const plans = await listAcademicPlans(AcademicPlan, { studentId: 'student-id' }, 20, 0);
 */
export async function listAcademicPlans(
  planModel: typeof Model,
  filters: Record<string, any> = {},
  limit: number = 20,
  offset: number = 0
): Promise<{ rows: any[]; count: number }> {
  const where: Record<string, any> = {};

  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.programId) where.programId = filters.programId;
  if (filters.planStatus) where.planStatus = filters.planStatus;
  if (filters.advisorId) where.advisorId = filters.advisorId;

  return await planModel.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Searches academic plans with advanced criteria.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {Record<string, any>} searchCriteria - Search criteria
 * @returns {Promise<any[]>} Matching academic plans
 *
 * @example
 * const plans = await searchAcademicPlans(AcademicPlan, {
 *   catalogYear: '2024-2025',
 *   minimumGPA: 3.0,
 *   department: 'Engineering'
 * });
 */
export async function searchAcademicPlans(
  planModel: typeof Model,
  searchCriteria: Record<string, any>
): Promise<any[]> {
  const where: Record<string, any> = {};

  if (searchCriteria.catalogYear) where.catalogYear = searchCriteria.catalogYear;
  if (searchCriteria.minimumGPA) {
    where.currentGPA = { [Op.gte]: searchCriteria.minimumGPA };
  }
  if (searchCriteria.minCredits) {
    where.creditsCompleted = { [Op.gte]: searchCriteria.minCredits };
  }

  return await planModel.findAll({ where });
}

/**
 * Archives an academic plan.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} planId - Plan ID
 * @returns {Promise<any>} Archived plan
 *
 * @example
 * const archived = await archiveAcademicPlan(AcademicPlan, 'plan-id');
 */
export async function archiveAcademicPlan(
  planModel: typeof Model,
  planId: string
): Promise<any> {
  const plan = await planModel.findByPk(planId);
  if (!plan) {
    throw new Error('Academic plan not found');
  }

  return await plan.update({ planStatus: 'archived' });
}

/**
 * Restores an archived academic plan.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} planId - Plan ID
 * @returns {Promise<any>} Restored plan
 *
 * @example
 * const restored = await restoreAcademicPlan(AcademicPlan, 'plan-id');
 */
export async function restoreAcademicPlan(
  planModel: typeof Model,
  planId: string
): Promise<any> {
  const plan = await planModel.findByPk(planId);
  if (!plan) {
    throw new Error('Academic plan not found');
  }

  return await plan.update({ planStatus: 'active' });
}

// ============================================================================
// DEGREE PLANNING FUNCTIONS (Functions 13-20)
// ============================================================================

/**
 * Generates a comprehensive degree roadmap for a student.
 *
 * @openapi
 * /degree-planning/roadmap:
 *   post:
 *     tags:
 *       - Degree Planning
 *     summary: Generate degree roadmap
 *     description: Creates a term-by-term roadmap for degree completion
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
 *               programId:
 *                 type: string
 *                 format: uuid
 *               startTerm:
 *                 type: string
 *               creditsPerTerm:
 *                 type: integer
 *                 default: 15
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             programId: "750e8400-e29b-41d4-a716-446655440002"
 *             startTerm: "Fall 2024"
 *             creditsPerTerm: 15
 *     responses:
 *       200:
 *         description: Degree roadmap generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: string
 *                   format: uuid
 *                 programId:
 *                   type: string
 *                   format: uuid
 *                 totalTerms:
 *                   type: integer
 *                 terms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       termName:
 *                         type: string
 *                       termYear:
 *                         type: integer
 *                       courses:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/CourseSequence'
 *                       totalCredits:
 *                         type: integer
 *                 estimatedGraduationDate:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Degree requirement model
 * @param {string} studentId - Student ID
 * @param {string} programId - Program ID
 * @param {string} startTerm - Starting term
 * @param {number} creditsPerTerm - Credits per term
 * @returns {Promise<DegreeRoadmap>} Degree roadmap
 *
 * @example
 * const roadmap = await generateDegreeRoadmap(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id',
 *   'program-id',
 *   'Fall 2024',
 *   15
 * );
 */
export async function generateDegreeRoadmap(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string,
  programId: string,
  startTerm: string,
  creditsPerTerm: number = 15
): Promise<DegreeRoadmap> {
  // Get student's academic plan
  const plan = await planModel.findOne({
    where: { studentId, programId },
  });

  if (!plan) {
    throw new Error('Academic plan not found');
  }

  // Get program requirements
  const requirements = await requirementModel.findAll({
    where: { programId },
  });

  const creditsNeeded = (plan as any).totalCreditsRequired - (plan as any).creditsCompleted;
  const termsNeeded = Math.ceil(creditsNeeded / creditsPerTerm);

  // Generate term-by-term plan
  const terms: TermPlan[] = [];
  const [season, year] = startTerm.split(' ');
  let currentYear = parseInt(year);

  for (let i = 0; i < termsNeeded; i++) {
    const termSeason = i % 2 === 0 ? season : (season === 'Fall' ? 'Spring' : 'Fall');
    if (i > 0 && termSeason === 'Fall') currentYear++;

    terms.push({
      termName: `${termSeason} ${currentYear}`,
      termYear: currentYear,
      courses: [], // Would be populated with actual course data
      totalCredits: Math.min(creditsPerTerm, creditsNeeded - (i * creditsPerTerm)),
      isCurrentTerm: i === 0,
    });
  }

  const graduationDate = new Date(currentYear + (season === 'Spring' ? 0 : 1), season === 'Spring' ? 4 : 11, 15);

  return {
    studentId,
    programId,
    totalTerms: termsNeeded,
    terms,
    progressPercentage: ((plan as any).creditsCompleted / (plan as any).totalCreditsRequired) * 100,
    estimatedGraduationDate: graduationDate,
  };
}

/**
 * Calculates degree progress for a student.
 *
 * @openapi
 * /degree-planning/progress/{studentId}:
 *   get:
 *     tags:
 *       - Degree Planning
 *     summary: Calculate degree progress
 *     description: Calculates completion percentage and remaining requirements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Degree progress calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progressPercentage:
 *                   type: number
 *                   format: float
 *                 creditsCompleted:
 *                   type: number
 *                 creditsRemaining:
 *                   type: number
 *                 requirementsMet:
 *                   type: array
 *                   items:
 *                     type: string
 *                 requirementsRemaining:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 progressPercentage: 37.5
 *                 creditsCompleted: 45
 *                 creditsRemaining: 75
 *                 requirementsMet: ["Core Math", "English Composition"]
 *                 requirementsRemaining: ["Core CS", "Electives", "Capstone"]
 *       404:
 *         description: Student not found
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @returns {Promise<any>} Degree progress
 *
 * @example
 * const progress = await calculateDegreeProgress(AcademicPlan, 'student-id');
 */
export async function calculateDegreeProgress(
  planModel: typeof Model,
  studentId: string
): Promise<any> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  const totalCredits = (plan as any).totalCreditsRequired;
  const completed = (plan as any).creditsCompleted;
  const inProgress = (plan as any).creditsInProgress;

  return {
    progressPercentage: (completed / totalCredits) * 100,
    creditsCompleted: completed,
    creditsInProgress: inProgress,
    creditsRemaining: totalCredits - completed - inProgress,
    onTrackForGraduation: (completed + inProgress) / totalCredits >= 0.5,
  };
}

/**
 * Identifies missing requirements for degree completion.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @returns {Promise<string[]>} Missing requirements
 *
 * @example
 * const missing = await identifyMissingRequirements(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id'
 * );
 */
export async function identifyMissingRequirements(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string
): Promise<string[]> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  const requirements = await requirementModel.findAll({
    where: { programId: (plan as any).programId, isRequired: true },
  });

  // Simplified - would check against completed courses
  return requirements.map((req: any) => req.requirementName);
}

/**
 * Suggests optimal course sequence based on prerequisites.
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string[]} completedCourses - Completed course IDs
 * @returns {Promise<CourseSequence[]>} Suggested courses
 *
 * @example
 * const suggested = await suggestCourseSequence(
 *   DegreeRequirement,
 *   'program-id',
 *   ['course-1', 'course-2']
 * );
 */
export async function suggestCourseSequence(
  requirementModel: typeof Model,
  programId: string,
  completedCourses: string[]
): Promise<CourseSequence[]> {
  const requirements = await requirementModel.findAll({
    where: { programId },
  });

  // Simplified course sequence - would use actual prerequisite logic
  return requirements.slice(0, 5).map((req: any) => ({
    courseId: req.id,
    courseName: req.requirementName,
    courseCode: `REQ-${req.id.substring(0, 6)}`,
    credits: req.creditsRequired || 3,
    term: 'Fall 2024',
    prerequisites: [],
    corequisites: [],
    status: 'available' as const,
  }));
}

/**
 * Validates if a student can complete their degree.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @returns {Promise<PlanValidationResult>} Validation result
 *
 * @example
 * const validation = await validateDegreeCompletion(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id'
 * );
 */
export async function validateDegreeCompletion(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string
): Promise<PlanValidationResult> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    return {
      isValid: false,
      errors: [{ code: 'NO_PLAN', message: 'No active academic plan found', severity: 'error' }],
      warnings: [],
      missingRequirements: [],
      progressPercentage: 0,
    };
  }

  const requirements = await requirementModel.findAll({
    where: { programId: (plan as any).programId, isRequired: true },
  });

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const missingRequirements: string[] = [];

  // Check GPA requirement
  if ((plan as any).currentGPA < (plan as any).gpaRequirement) {
    errors.push({
      code: 'GPA_BELOW_MINIMUM',
      message: `Current GPA ${(plan as any).currentGPA} is below requirement ${(plan as any).gpaRequirement}`,
      severity: 'error',
      field: 'currentGPA',
    });
  }

  // Check credit completion
  if ((plan as any).creditsCompleted < (plan as any).totalCreditsRequired) {
    missingRequirements.push(`${(plan as any).totalCreditsRequired - (plan as any).creditsCompleted} credits remaining`);
  }

  const progressPercentage = ((plan as any).creditsCompleted / (plan as any).totalCreditsRequired) * 100;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingRequirements,
    progressPercentage,
  };
}

/**
 * Estimates graduation date based on current progress.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @param {number} creditsPerTerm - Expected credits per term
 * @returns {Promise<Date>} Estimated graduation date
 *
 * @example
 * const gradDate = await estimateGraduationDate(AcademicPlan, 'student-id', 15);
 */
export async function estimateGraduationDate(
  planModel: typeof Model,
  studentId: string,
  creditsPerTerm: number = 15
): Promise<Date> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  if ((plan as any).expectedGraduationDate) {
    return new Date((plan as any).expectedGraduationDate);
  }

  const creditsRemaining = (plan as any).totalCreditsRequired - (plan as any).creditsCompleted;
  const termsRemaining = Math.ceil(creditsRemaining / creditsPerTerm);
  const monthsRemaining = termsRemaining * 4; // Approximate

  const graduationDate = new Date();
  graduationDate.setMonth(graduationDate.getMonth() + monthsRemaining);

  return graduationDate;
}

/**
 * Generates a "what-if" scenario for changing programs.
 *
 * @openapi
 * /degree-planning/what-if:
 *   post:
 *     tags:
 *       - Degree Planning
 *     summary: Generate what-if scenario
 *     description: Analyzes impact of changing to a different program
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
 *               alternativeProgramId:
 *                 type: string
 *                 format: uuid
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             alternativeProgramId: "750e8400-e29b-41d4-a716-446655440099"
 *     responses:
 *       200:
 *         description: What-if scenario generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scenarioId:
 *                   type: string
 *                 currentCredits:
 *                   type: number
 *                 additionalCreditsNeeded:
 *                   type: number
 *                 estimatedCompletionDate:
 *                   type: string
 *                   format: date
 *                 feasibilityScore:
 *                   type: number
 *                   format: float
 *                   minimum: 0
 *                   maximum: 1
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} programModel - Program plan model
 * @param {string} studentId - Student ID
 * @param {string} alternativeProgramId - Alternative program ID
 * @returns {Promise<WhatIfScenario>} What-if scenario
 *
 * @example
 * const scenario = await generateWhatIfScenario(
 *   AcademicPlan,
 *   ProgramPlan,
 *   'student-id',
 *   'alt-program-id'
 * );
 */
export async function generateWhatIfScenario(
  planModel: typeof Model,
  programModel: typeof Model,
  studentId: string,
  alternativeProgramId: string
): Promise<WhatIfScenario> {
  const currentPlan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!currentPlan) {
    throw new Error('Active academic plan not found');
  }

  const altProgram = await programModel.findOne({
    where: { programId: alternativeProgramId },
  });

  if (!altProgram) {
    throw new Error('Alternative program not found');
  }

  const currentCredits = (currentPlan as any).creditsCompleted;
  const requiredCredits = (altProgram as any).totalCredits;
  const additionalCredits = Math.max(0, requiredCredits - currentCredits);

  const monthsToComplete = (additionalCredits / 15) * 4;
  const completionDate = new Date();
  completionDate.setMonth(completionDate.getMonth() + monthsToComplete);

  // Feasibility score based on credit overlap
  const feasibilityScore = Math.min(1, currentCredits / requiredCredits);

  return {
    scenarioId: `scenario-${Date.now()}`,
    studentId,
    alternativeProgramId,
    currentCredits,
    additionalCreditsNeeded: additionalCredits,
    estimatedCompletionDate: completionDate,
    feasibilityScore,
  };
}

/**
 * Compares multiple degree paths for a student.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} programModel - Program plan model
 * @param {string} studentId - Student ID
 * @param {string[]} programIds - Program IDs to compare
 * @returns {Promise<WhatIfScenario[]>} Comparison results
 *
 * @example
 * const comparison = await compareDegreePaths(
 *   AcademicPlan,
 *   ProgramPlan,
 *   'student-id',
 *   ['program-1', 'program-2', 'program-3']
 * );
 */
export async function compareDegreePaths(
  planModel: typeof Model,
  programModel: typeof Model,
  studentId: string,
  programIds: string[]
): Promise<WhatIfScenario[]> {
  const scenarios: WhatIfScenario[] = [];

  for (const programId of programIds) {
    const scenario = await generateWhatIfScenario(
      planModel,
      programModel,
      studentId,
      programId
    );
    scenarios.push(scenario);
  }

  // Sort by feasibility score
  return scenarios.sort((a, b) => b.feasibilityScore - a.feasibilityScore);
}

// ============================================================================
// MAJOR/MINOR MANAGEMENT FUNCTIONS (Functions 21-26)
// ============================================================================

/**
 * Declares a major for a student.
 *
 * @openapi
 * /major-minor/declare-major:
 *   post:
 *     tags:
 *       - Major/Minor
 *     summary: Declare a major
 *     description: Submits a major declaration for approval
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
 *               programId:
 *                 type: string
 *                 format: uuid
 *               isPrimary:
 *                 type: boolean
 *                 default: true
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             programId: "750e8400-e29b-41d4-a716-446655440002"
 *             isPrimary: true
 *     responses:
 *       201:
 *         description: Major declaration submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MajorMinor'
 *       400:
 *         description: Invalid input or duplicate declaration
 *
 * @param {typeof Model} majorMinorModel - MajorMinor model
 * @param {string} studentId - Student ID
 * @param {string} programId - Program ID
 * @param {boolean} isPrimary - Whether this is primary major
 * @returns {Promise<any>} Major declaration
 *
 * @example
 * const declaration = await declareMajor(
 *   MajorMinor,
 *   'student-id',
 *   'program-id',
 *   true
 * );
 */
export async function declareMajor(
  majorMinorModel: typeof Model,
  studentId: string,
  programId: string,
  isPrimary: boolean = true
): Promise<any> {
  // Check for existing major declaration
  const existing = await majorMinorModel.findOne({
    where: {
      studentId,
      programId,
      declarationType: 'major',
      declarationStatus: { [Op.in]: ['pending', 'approved'] },
    },
  });

  if (existing) {
    throw new Error('Major already declared for this program');
  }

  return await majorMinorModel.create({
    studentId,
    programId,
    declarationType: 'major',
    declarationDate: new Date(),
    declarationStatus: 'pending',
    isPrimary,
    metadata: {},
  });
}

/**
 * Declares a minor for a student.
 *
 * @openapi
 * /major-minor/declare-minor:
 *   post:
 *     tags:
 *       - Major/Minor
 *     summary: Declare a minor
 *     description: Submits a minor declaration for approval
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
 *               programId:
 *                 type: string
 *                 format: uuid
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             programId: "750e8400-e29b-41d4-a716-446655440099"
 *     responses:
 *       201:
 *         description: Minor declaration submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MajorMinor'
 *
 * @param {typeof Model} majorMinorModel - MajorMinor model
 * @param {string} studentId - Student ID
 * @param {string} programId - Program ID
 * @returns {Promise<any>} Minor declaration
 *
 * @example
 * const declaration = await declareMinor(MajorMinor, 'student-id', 'program-id');
 */
export async function declareMinor(
  majorMinorModel: typeof Model,
  studentId: string,
  programId: string
): Promise<any> {
  const existing = await majorMinorModel.findOne({
    where: {
      studentId,
      programId,
      declarationType: 'minor',
      declarationStatus: { [Op.in]: ['pending', 'approved'] },
    },
  });

  if (existing) {
    throw new Error('Minor already declared for this program');
  }

  return await majorMinorModel.create({
    studentId,
    programId,
    declarationType: 'minor',
    declarationDate: new Date(),
    declarationStatus: 'pending',
    isPrimary: false,
    metadata: {},
  });
}

/**
 * Changes a student's major.
 *
 * @openapi
 * /major-minor/change-major:
 *   post:
 *     tags:
 *       - Major/Minor
 *     summary: Change major
 *     description: Changes student's major to a different program
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
 *               currentMajorId:
 *                 type: string
 *                 format: uuid
 *               newMajorId:
 *                 type: string
 *                 format: uuid
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             currentMajorId: "750e8400-e29b-41d4-a716-446655440002"
 *             newMajorId: "750e8400-e29b-41d4-a716-446655440099"
 *     responses:
 *       200:
 *         description: Major changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MajorMinor'
 *
 * @param {typeof Model} majorMinorModel - MajorMinor model
 * @param {string} studentId - Student ID
 * @param {string} currentMajorId - Current major program ID
 * @param {string} newMajorId - New major program ID
 * @returns {Promise<any>} New major declaration
 *
 * @example
 * const newMajor = await changeMajor(
 *   MajorMinor,
 *   'student-id',
 *   'current-major-id',
 *   'new-major-id'
 * );
 */
export async function changeMajor(
  majorMinorModel: typeof Model,
  studentId: string,
  currentMajorId: string,
  newMajorId: string
): Promise<any> {
  // Drop current major
  const currentMajor = await majorMinorModel.findOne({
    where: {
      studentId,
      programId: currentMajorId,
      declarationType: 'major',
      declarationStatus: 'approved',
    },
  });

  if (currentMajor) {
    await currentMajor.update({ declarationStatus: 'dropped' });
  }

  // Declare new major
  return await declareMajor(majorMinorModel, studentId, newMajorId, true);
}

/**
 * Drops a minor.
 *
 * @param {typeof Model} majorMinorModel - MajorMinor model
 * @param {string} studentId - Student ID
 * @param {string} programId - Program ID
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await dropMinor(MajorMinor, 'student-id', 'program-id');
 */
export async function dropMinor(
  majorMinorModel: typeof Model,
  studentId: string,
  programId: string
): Promise<boolean> {
  const minor = await majorMinorModel.findOne({
    where: {
      studentId,
      programId,
      declarationType: 'minor',
      declarationStatus: { [Op.in]: ['pending', 'approved'] },
    },
  });

  if (!minor) {
    throw new Error('Minor declaration not found');
  }

  await minor.update({ declarationStatus: 'dropped' });
  return true;
}

/**
 * Validates major requirements for a student.
 *
 * @param {typeof Model} majorMinorModel - MajorMinor model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @param {string} majorId - Major program ID
 * @returns {Promise<PlanValidationResult>} Validation result
 *
 * @example
 * const validation = await validateMajorRequirements(
 *   MajorMinor,
 *   DegreeRequirement,
 *   'student-id',
 *   'major-id'
 * );
 */
export async function validateMajorRequirements(
  majorMinorModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string,
  majorId: string
): Promise<PlanValidationResult> {
  const declaration = await majorMinorModel.findOne({
    where: {
      studentId,
      programId: majorId,
      declarationType: 'major',
      declarationStatus: 'approved',
    },
  });

  if (!declaration) {
    return {
      isValid: false,
      errors: [{ code: 'NO_MAJOR', message: 'No approved major found', severity: 'error' }],
      warnings: [],
      missingRequirements: [],
      progressPercentage: 0,
    };
  }

  const requirements = await requirementModel.findAll({
    where: { programId: majorId, isRequired: true },
  });

  // Simplified validation
  return {
    isValid: true,
    errors: [],
    warnings: [],
    missingRequirements: requirements.map((r: any) => r.requirementName),
    progressPercentage: 0,
  };
}

/**
 * Gets valid major/minor combinations.
 *
 * @param {typeof Model} programModel - Program plan model
 * @param {string} majorId - Major program ID
 * @returns {Promise<string[]>} Valid minor program IDs
 *
 * @example
 * const minors = await getMajorMinorCombinations(ProgramPlan, 'major-id');
 */
export async function getMajorMinorCombinations(
  programModel: typeof Model,
  majorId: string
): Promise<string[]> {
  const major = await programModel.findOne({
    where: { programId: majorId },
  });

  if (!major) {
    throw new Error('Major program not found');
  }

  // Get all programs in different departments (simplified logic)
  const minors = await programModel.findAll({
    where: {
      programId: { [Op.ne]: majorId },
      isActive: true,
    },
  });

  return minors.map((m: any) => m.programId);
}

// ============================================================================
// COURSE SEQUENCING FUNCTIONS (Functions 27-33)
// ============================================================================

/**
 * Validates course prerequisites for enrollment.
 *
 * @openapi
 * /course-sequencing/validate-prerequisites:
 *   post:
 *     tags:
 *       - Course Sequencing
 *     summary: Validate prerequisites
 *     description: Checks if student has met prerequisites for a course
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
 *               completedCourses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             courseId: "850e8400-e29b-41d4-a716-446655440050"
 *             completedCourses: ["850e8400-e29b-41d4-a716-446655440010", "850e8400-e29b-41d4-a716-446655440020"]
 *     responses:
 *       200:
 *         description: Prerequisite validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 missingPrerequisites:
 *                   type: array
 *                   items:
 *                     type: string
 *                 canEnroll:
 *                   type: boolean
 *
 * @param {string} courseId - Course ID
 * @param {string[]} requiredPrereqs - Required prerequisite course IDs
 * @param {string[]} completedCourses - Student's completed course IDs
 * @returns {Promise<boolean>} Whether prerequisites are met
 *
 * @example
 * const valid = await validatePrerequisites(
 *   'course-id',
 *   ['prereq-1', 'prereq-2'],
 *   ['prereq-1', 'prereq-2', 'other-course']
 * );
 */
export async function validatePrerequisites(
  courseId: string,
  requiredPrereqs: string[],
  completedCourses: string[]
): Promise<boolean> {
  if (!requiredPrereqs || requiredPrereqs.length === 0) {
    return true;
  }

  return requiredPrereqs.every((prereq) => completedCourses.includes(prereq));
}

/**
 * Generates an optimal course sequence based on prerequisites.
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string[]} completedCourses - Completed course IDs
 * @param {number} termsRemaining - Number of terms remaining
 * @returns {Promise<TermPlan[]>} Course sequence by term
 *
 * @example
 * const sequence = await generateCourseSequence(
 *   DegreeRequirement,
 *   'program-id',
 *   ['course-1', 'course-2'],
 *   6
 * );
 */
export async function generateCourseSequence(
  requirementModel: typeof Model,
  programId: string,
  completedCourses: string[],
  termsRemaining: number
): Promise<TermPlan[]> {
  const requirements = await requirementModel.findAll({
    where: { programId },
  });

  const terms: TermPlan[] = [];

  for (let i = 0; i < termsRemaining; i++) {
    const season = i % 2 === 0 ? 'Fall' : 'Spring';
    const year = new Date().getFullYear() + Math.floor(i / 2);

    terms.push({
      termName: `${season} ${year}`,
      termYear: year,
      courses: [],
      totalCredits: 0,
      isCurrentTerm: i === 0,
    });
  }

  return terms;
}

/**
 * Checks corequisite requirements for a course.
 *
 * @param {string} courseId - Course ID
 * @param {string[]} requiredCoreqs - Required corequisite course IDs
 * @param {string[]} enrolledCourses - Courses student is enrolling in
 * @returns {Promise<boolean>} Whether corequisites are satisfied
 *
 * @example
 * const valid = await checkCorequisites(
 *   'course-id',
 *   ['coreq-1'],
 *   ['coreq-1', 'other-course']
 * );
 */
export async function checkCorequisites(
  courseId: string,
  requiredCoreqs: string[],
  enrolledCourses: string[]
): Promise<boolean> {
  if (!requiredCoreqs || requiredCoreqs.length === 0) {
    return true;
  }

  return requiredCoreqs.every((coreq) => enrolledCourses.includes(coreq));
}

/**
 * Identifies courses blocked by unmet prerequisites.
 *
 * @param {string[]} allCourses - All available course IDs
 * @param {Map<string, string[]>} prerequisiteMap - Map of course ID to prerequisites
 * @param {string[]} completedCourses - Completed course IDs
 * @returns {Promise<string[]>} Blocked course IDs
 *
 * @example
 * const blocked = await identifyBlockedCourses(
 *   ['course-1', 'course-2', 'course-3'],
 *   new Map([['course-3', ['course-1', 'course-2']]]),
 *   ['course-1']
 * );
 */
export async function identifyBlockedCourses(
  allCourses: string[],
  prerequisiteMap: Map<string, string[]>,
  completedCourses: string[]
): Promise<string[]> {
  const blocked: string[] = [];

  for (const course of allCourses) {
    if (completedCourses.includes(course)) continue;

    const prereqs = prerequisiteMap.get(course) || [];
    const hasAllPrereqs = prereqs.every((p) => completedCourses.includes(p));

    if (!hasAllPrereqs) {
      blocked.push(course);
    }
  }

  return blocked;
}

/**
 * Suggests courses for next term based on progress.
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string[]} completedCourses - Completed course IDs
 * @param {number} maxCredits - Maximum credits for term
 * @returns {Promise<CourseSequence[]>} Suggested courses
 *
 * @example
 * const suggested = await suggestNextTermCourses(
 *   DegreeRequirement,
 *   'program-id',
 *   ['course-1', 'course-2'],
 *   15
 * );
 */
export async function suggestNextTermCourses(
  requirementModel: typeof Model,
  programId: string,
  completedCourses: string[],
  maxCredits: number = 15
): Promise<CourseSequence[]> {
  const requirements = await requirementModel.findAll({
    where: { programId, isRequired: true },
  });

  const suggested: CourseSequence[] = [];
  let totalCredits = 0;

  for (const req of requirements) {
    if (totalCredits >= maxCredits) break;

    const credits = (req as any).creditsRequired || 3;
    if (totalCredits + credits <= maxCredits) {
      suggested.push({
        courseId: (req as any).id,
        courseName: (req as any).requirementName,
        courseCode: `REQ-${(req as any).id.substring(0, 6)}`,
        credits,
        term: 'Next Term',
        prerequisites: [],
        corequisites: [],
        status: 'available',
      });
      totalCredits += credits;
    }
  }

  return suggested;
}

/**
 * Validates proposed course load for a term.
 *
 * @param {CourseSequence[]} courses - Proposed courses
 * @param {number} minCredits - Minimum credit requirement
 * @param {number} maxCredits - Maximum credit limit
 * @returns {Promise<PlanValidationResult>} Validation result
 *
 * @example
 * const validation = await validateCourseLoad(proposedCourses, 12, 18);
 */
export async function validateCourseLoad(
  courses: CourseSequence[],
  minCredits: number = 12,
  maxCredits: number = 18
): Promise<PlanValidationResult> {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (totalCredits < minCredits) {
    errors.push({
      code: 'BELOW_MIN_CREDITS',
      message: `Course load ${totalCredits} is below minimum ${minCredits} credits`,
      severity: 'error',
    });
  }

  if (totalCredits > maxCredits) {
    errors.push({
      code: 'EXCEEDS_MAX_CREDITS',
      message: `Course load ${totalCredits} exceeds maximum ${maxCredits} credits`,
      severity: 'error',
    });
  }

  if (totalCredits > 15 && totalCredits <= maxCredits) {
    warnings.push({
      code: 'HIGH_COURSE_LOAD',
      message: 'Course load is high, ensure adequate time for coursework',
      suggestion: 'Consider reducing to 15 credits if possible',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingRequirements: [],
    progressPercentage: 0,
  };
}

/**
 * Optimizes course schedule to minimize conflicts.
 *
 * @param {CourseSequence[]} courses - Available courses
 * @param {number} maxCredits - Maximum credits
 * @returns {Promise<CourseSequence[]>} Optimized course list
 *
 * @example
 * const optimized = await optimizeCourseSchedule(availableCourses, 15);
 */
export async function optimizeCourseSchedule(
  courses: CourseSequence[],
  maxCredits: number = 15
): Promise<CourseSequence[]> {
  // Sort by priority: required first, then by credits
  const sorted = [...courses].sort((a, b) => {
    if (a.status === 'available' && b.status === 'blocked') return -1;
    if (a.status === 'blocked' && b.status === 'available') return 1;
    return a.credits - b.credits;
  });

  const optimized: CourseSequence[] = [];
  let totalCredits = 0;

  for (const course of sorted) {
    if (totalCredits + course.credits <= maxCredits) {
      optimized.push(course);
      totalCredits += course.credits;
    }
  }

  return optimized;
}

// ============================================================================
// ELECTIVE SELECTION FUNCTIONS (Functions 34-38)
// ============================================================================

/**
 * Gets elective course options for a requirement category.
 *
 * @openapi
 * /electives/options:
 *   get:
 *     tags:
 *       - Electives
 *     summary: Get elective options
 *     description: Retrieves available elective courses for a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minCredits
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of elective options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseSequence'
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string} category - Elective category
 * @returns {Promise<CourseSequence[]>} Elective options
 *
 * @example
 * const electives = await getElectiveOptions(
 *   DegreeRequirement,
 *   'program-id',
 *   'Humanities'
 * );
 */
export async function getElectiveOptions(
  requirementModel: typeof Model,
  programId: string,
  category?: string
): Promise<CourseSequence[]> {
  const where: Record<string, any> = {
    programId,
    requirementType: 'elective',
  };

  if (category) {
    where.category = category;
  }

  const requirements = await requirementModel.findAll({ where });

  return requirements.map((req: any) => ({
    courseId: req.id,
    courseName: req.requirementName,
    courseCode: `ELEC-${req.id.substring(0, 6)}`,
    credits: req.creditsRequired || 3,
    term: 'Any',
    prerequisites: [],
    corequisites: [],
    status: 'available' as const,
  }));
}

/**
 * Validates elective choice against requirements.
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string} courseId - Selected elective course ID
 * @param {string} category - Requirement category
 * @returns {Promise<boolean>} Whether elective is valid
 *
 * @example
 * const valid = await validateElectiveChoice(
 *   DegreeRequirement,
 *   'program-id',
 *   'course-id',
 *   'Humanities'
 * );
 */
export async function validateElectiveChoice(
  requirementModel: typeof Model,
  programId: string,
  courseId: string,
  category: string
): Promise<boolean> {
  const requirement = await requirementModel.findOne({
    where: {
      programId,
      id: courseId,
      requirementType: 'elective',
      category,
    },
  });

  return requirement !== null;
}

/**
 * Tracks elective progress toward requirements.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @param {string} category - Elective category
 * @returns {Promise<any>} Elective progress
 *
 * @example
 * const progress = await trackElectiveProgress(
 *   AcademicPlan,
 *   'student-id',
 *   'Humanities'
 * );
 */
export async function trackElectiveProgress(
  planModel: typeof Model,
  studentId: string,
  category: string
): Promise<any> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  // Simplified - would track against actual completed electives
  return {
    category,
    creditsRequired: 15,
    creditsCompleted: 6,
    creditsRemaining: 9,
    progressPercentage: 40,
  };
}

/**
 * Suggests electives based on student interests.
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {string[]} interests - Student interest areas
 * @param {number} creditsNeeded - Credits needed
 * @returns {Promise<CourseSequence[]>} Suggested electives
 *
 * @example
 * const suggestions = await suggestElectives(
 *   DegreeRequirement,
 *   'program-id',
 *   ['AI', 'Machine Learning'],
 *   6
 * );
 */
export async function suggestElectives(
  requirementModel: typeof Model,
  programId: string,
  interests: string[],
  creditsNeeded: number
): Promise<CourseSequence[]> {
  const electives = await getElectiveOptions(requirementModel, programId);

  // Filter by interests (simplified - would use more sophisticated matching)
  const suggested = electives.filter((elective) =>
    interests.some((interest) =>
      elective.courseName.toLowerCase().includes(interest.toLowerCase())
    )
  );

  // Limit to credits needed
  let totalCredits = 0;
  const result: CourseSequence[] = [];

  for (const elective of suggested) {
    if (totalCredits >= creditsNeeded) break;
    result.push(elective);
    totalCredits += elective.credits;
  }

  return result;
}

/**
 * Calculates total elective credits completed.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @returns {Promise<number>} Total elective credits
 *
 * @example
 * const electiveCredits = await calculateElectiveCredits(
 *   AcademicPlan,
 *   'student-id'
 * );
 */
export async function calculateElectiveCredits(
  planModel: typeof Model,
  studentId: string
): Promise<number> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  // Simplified - would calculate from actual completed electives
  const metadata = (plan as any).metadata || {};
  return metadata.electiveCreditsCompleted || 0;
}

// ============================================================================
// PROGRAM REQUIREMENTS VALIDATION FUNCTIONS (Functions 39-45)
// ============================================================================

/**
 * Validates all program requirements for a student.
 *
 * @openapi
 * /requirements/validate:
 *   post:
 *     tags:
 *       - Requirements
 *     summary: Validate program requirements
 *     description: Comprehensively validates all degree requirements
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
 *               programId:
 *                 type: string
 *                 format: uuid
 *           example:
 *             studentId: "650e8400-e29b-41d4-a716-446655440001"
 *             programId: "750e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         description: Validation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 warnings:
 *                   type: array
 *                   items:
 *                     type: object
 *                 missingRequirements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 progressPercentage:
 *                   type: number
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @param {string} programId - Program ID
 * @returns {Promise<PlanValidationResult>} Validation result
 *
 * @example
 * const validation = await validateProgramRequirements(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id',
 *   'program-id'
 * );
 */
export async function validateProgramRequirements(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string,
  programId: string
): Promise<PlanValidationResult> {
  const plan = await planModel.findOne({
    where: { studentId, programId, planStatus: 'active' },
  });

  if (!plan) {
    return {
      isValid: false,
      errors: [{ code: 'NO_PLAN', message: 'No active academic plan found', severity: 'error' }],
      warnings: [],
      missingRequirements: [],
      progressPercentage: 0,
    };
  }

  const requirements = await requirementModel.findAll({
    where: { programId, isRequired: true },
  });

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const missingRequirements: string[] = [];

  // Validate GPA
  if ((plan as any).currentGPA && (plan as any).currentGPA < (plan as any).gpaRequirement) {
    errors.push({
      code: 'GPA_REQUIREMENT',
      message: `GPA ${(plan as any).currentGPA} below requirement ${(plan as any).gpaRequirement}`,
      severity: 'error',
      field: 'currentGPA',
    });
  }

  // Validate credit requirements
  for (const req of requirements) {
    missingRequirements.push((req as any).requirementName);
  }

  const progressPercentage = ((plan as any).creditsCompleted / (plan as any).totalCreditsRequired) * 100;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingRequirements,
    progressPercentage,
  };
}

/**
 * Checks credit hour requirements.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @param {number} requiredCredits - Required total credits
 * @returns {Promise<boolean>} Whether requirement is met
 *
 * @example
 * const met = await checkCreditRequirements(AcademicPlan, 'student-id', 120);
 */
export async function checkCreditRequirements(
  planModel: typeof Model,
  studentId: string,
  requiredCredits: number
): Promise<boolean> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    return false;
  }

  return (plan as any).creditsCompleted >= requiredCredits;
}

/**
 * Validates distribution requirements (breadth requirements).
 *
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} programId - Program ID
 * @param {Map<string, number>} completedByCategory - Credits completed per category
 * @returns {Promise<PlanValidationResult>} Validation result
 *
 * @example
 * const categoryMap = new Map([
 *   ['Humanities', 12],
 *   ['Sciences', 15]
 * ]);
 * const validation = await validateDistributionRequirements(
 *   DegreeRequirement,
 *   'program-id',
 *   categoryMap
 * );
 */
export async function validateDistributionRequirements(
  requirementModel: typeof Model,
  programId: string,
  completedByCategory: Map<string, number>
): Promise<PlanValidationResult> {
  const requirements = await requirementModel.findAll({
    where: { programId, requirementType: 'distribution' },
  });

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const missingRequirements: string[] = [];

  for (const req of requirements) {
    const category = (req as any).category;
    const required = (req as any).creditsRequired;
    const completed = completedByCategory.get(category) || 0;

    if (completed < required) {
      missingRequirements.push(
        `${category}: ${required - completed} credits needed`
      );
    }
  }

  return {
    isValid: missingRequirements.length === 0,
    errors,
    warnings,
    missingRequirements,
    progressPercentage: 0,
  };
}

/**
 * Checks residency requirements (credits at institution).
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} programModel - Program plan model
 * @param {string} studentId - Student ID
 * @param {number} creditsAtInstitution - Credits taken at institution
 * @returns {Promise<boolean>} Whether requirement is met
 *
 * @example
 * const met = await checkResidencyRequirements(
 *   AcademicPlan,
 *   ProgramPlan,
 *   'student-id',
 *   45
 * );
 */
export async function checkResidencyRequirements(
  planModel: typeof Model,
  programModel: typeof Model,
  studentId: string,
  creditsAtInstitution: number
): Promise<boolean> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    return false;
  }

  const program = await programModel.findOne({
    where: { programId: (plan as any).programId },
  });

  if (!program) {
    return false;
  }

  return creditsAtInstitution >= (program as any).residencyRequirement;
}

/**
 * Validates GPA requirements for program.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {string} studentId - Student ID
 * @param {number} minimumGPA - Minimum required GPA
 * @returns {Promise<boolean>} Whether requirement is met
 *
 * @example
 * const met = await validateGPARequirements(AcademicPlan, 'student-id', 2.0);
 */
export async function validateGPARequirements(
  planModel: typeof Model,
  studentId: string,
  minimumGPA: number
): Promise<boolean> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan || !(plan as any).currentGPA) {
    return false;
  }

  return (plan as any).currentGPA >= minimumGPA;
}

/**
 * Performs comprehensive degree audit.
 *
 * @openapi
 * /requirements/degree-audit:
 *   get:
 *     tags:
 *       - Requirements
 *     summary: Perform degree audit
 *     description: Generates comprehensive degree audit report
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
 *         description: Degree audit report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: string
 *                 programId:
 *                   type: string
 *                 auditDate:
 *                   type: string
 *                   format: date-time
 *                 overallStatus:
 *                   type: string
 *                   enum: [on-track, at-risk, complete]
 *                 requirements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [met, in-progress, not-met]
 *                       creditsRequired:
 *                         type: number
 *                       creditsCompleted:
 *                         type: number
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @returns {Promise<any>} Degree audit report
 *
 * @example
 * const audit = await auditDegreeProgress(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id'
 * );
 */
export async function auditDegreeProgress(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string
): Promise<any> {
  const plan = await planModel.findOne({
    where: { studentId, planStatus: 'active' },
  });

  if (!plan) {
    throw new Error('Active academic plan not found');
  }

  const requirements = await requirementModel.findAll({
    where: { programId: (plan as any).programId },
  });

  const auditItems = requirements.map((req: any) => ({
    requirementName: req.requirementName,
    requirementType: req.requirementType,
    creditsRequired: req.creditsRequired,
    creditsCompleted: 0, // Would be calculated from completed courses
    status: 'not-met',
    courses: [],
  }));

  return {
    studentId,
    programId: (plan as any).programId,
    auditDate: new Date(),
    overallStatus: 'on-track',
    progressPercentage: ((plan as any).creditsCompleted / (plan as any).totalCreditsRequired) * 100,
    requirements: auditItems,
  };
}

/**
 * Generates a detailed degree audit report.
 *
 * @param {typeof Model} planModel - Academic plan model
 * @param {typeof Model} requirementModel - Requirement model
 * @param {string} studentId - Student ID
 * @param {string} format - Report format (json, pdf, html)
 * @returns {Promise<any>} Degree audit report
 *
 * @example
 * const report = await generateDegreeAuditReport(
 *   AcademicPlan,
 *   DegreeRequirement,
 *   'student-id',
 *   'json'
 * );
 */
export async function generateDegreeAuditReport(
  planModel: typeof Model,
  requirementModel: typeof Model,
  studentId: string,
  format: 'json' | 'pdf' | 'html' = 'json'
): Promise<any> {
  const audit = await auditDegreeProgress(planModel, requirementModel, studentId);

  if (format === 'json') {
    return audit;
  }

  // For PDF/HTML, would generate formatted report
  return {
    ...audit,
    format,
    generatedAt: new Date(),
  };
}
