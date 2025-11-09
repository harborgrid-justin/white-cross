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
import { Model, Sequelize } from 'sequelize';
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
export declare const AcademicPlanSchema: any;
export declare const MajorMinorSchema: any;
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
export declare function defineAcademicPlanModel(sequelize: Sequelize): typeof Model;
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
export declare function defineProgramPlanModel(sequelize: Sequelize): typeof Model;
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
export declare function defineMajorMinorModel(sequelize: Sequelize): typeof Model;
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
export declare function defineDegreeRequirementModel(sequelize: Sequelize): typeof Model;
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
export declare function createAcademicPlan(planModel: typeof Model, planData: AcademicPlan): Promise<any>;
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
export declare function getAcademicPlan(planModel: typeof Model, planId: string): Promise<any>;
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
export declare function updateAcademicPlan(planModel: typeof Model, planId: string, updates: Partial<AcademicPlan>): Promise<any>;
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
export declare function deleteAcademicPlan(planModel: typeof Model, planId: string): Promise<boolean>;
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
export declare function listAcademicPlans(planModel: typeof Model, filters?: Record<string, any>, limit?: number, offset?: number): Promise<{
    rows: any[];
    count: number;
}>;
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
export declare function searchAcademicPlans(planModel: typeof Model, searchCriteria: Record<string, any>): Promise<any[]>;
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
export declare function archiveAcademicPlan(planModel: typeof Model, planId: string): Promise<any>;
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
export declare function restoreAcademicPlan(planModel: typeof Model, planId: string): Promise<any>;
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
export declare function generateDegreeRoadmap(planModel: typeof Model, requirementModel: typeof Model, studentId: string, programId: string, startTerm: string, creditsPerTerm?: number): Promise<DegreeRoadmap>;
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
export declare function calculateDegreeProgress(planModel: typeof Model, studentId: string): Promise<any>;
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
export declare function identifyMissingRequirements(planModel: typeof Model, requirementModel: typeof Model, studentId: string): Promise<string[]>;
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
export declare function suggestCourseSequence(requirementModel: typeof Model, programId: string, completedCourses: string[]): Promise<CourseSequence[]>;
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
export declare function validateDegreeCompletion(planModel: typeof Model, requirementModel: typeof Model, studentId: string): Promise<PlanValidationResult>;
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
export declare function estimateGraduationDate(planModel: typeof Model, studentId: string, creditsPerTerm?: number): Promise<Date>;
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
export declare function generateWhatIfScenario(planModel: typeof Model, programModel: typeof Model, studentId: string, alternativeProgramId: string): Promise<WhatIfScenario>;
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
export declare function compareDegreePaths(planModel: typeof Model, programModel: typeof Model, studentId: string, programIds: string[]): Promise<WhatIfScenario[]>;
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
export declare function declareMajor(majorMinorModel: typeof Model, studentId: string, programId: string, isPrimary?: boolean): Promise<any>;
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
export declare function declareMinor(majorMinorModel: typeof Model, studentId: string, programId: string): Promise<any>;
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
export declare function changeMajor(majorMinorModel: typeof Model, studentId: string, currentMajorId: string, newMajorId: string): Promise<any>;
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
export declare function dropMinor(majorMinorModel: typeof Model, studentId: string, programId: string): Promise<boolean>;
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
export declare function validateMajorRequirements(majorMinorModel: typeof Model, requirementModel: typeof Model, studentId: string, majorId: string): Promise<PlanValidationResult>;
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
export declare function getMajorMinorCombinations(programModel: typeof Model, majorId: string): Promise<string[]>;
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
export declare function validatePrerequisites(courseId: string, requiredPrereqs: string[], completedCourses: string[]): Promise<boolean>;
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
export declare function generateCourseSequence(requirementModel: typeof Model, programId: string, completedCourses: string[], termsRemaining: number): Promise<TermPlan[]>;
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
export declare function checkCorequisites(courseId: string, requiredCoreqs: string[], enrolledCourses: string[]): Promise<boolean>;
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
export declare function identifyBlockedCourses(allCourses: string[], prerequisiteMap: Map<string, string[]>, completedCourses: string[]): Promise<string[]>;
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
export declare function suggestNextTermCourses(requirementModel: typeof Model, programId: string, completedCourses: string[], maxCredits?: number): Promise<CourseSequence[]>;
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
export declare function validateCourseLoad(courses: CourseSequence[], minCredits?: number, maxCredits?: number): Promise<PlanValidationResult>;
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
export declare function optimizeCourseSchedule(courses: CourseSequence[], maxCredits?: number): Promise<CourseSequence[]>;
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
export declare function getElectiveOptions(requirementModel: typeof Model, programId: string, category?: string): Promise<CourseSequence[]>;
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
export declare function validateElectiveChoice(requirementModel: typeof Model, programId: string, courseId: string, category: string): Promise<boolean>;
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
export declare function trackElectiveProgress(planModel: typeof Model, studentId: string, category: string): Promise<any>;
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
export declare function suggestElectives(requirementModel: typeof Model, programId: string, interests: string[], creditsNeeded: number): Promise<CourseSequence[]>;
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
export declare function calculateElectiveCredits(planModel: typeof Model, studentId: string): Promise<number>;
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
export declare function validateProgramRequirements(planModel: typeof Model, requirementModel: typeof Model, studentId: string, programId: string): Promise<PlanValidationResult>;
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
export declare function checkCreditRequirements(planModel: typeof Model, studentId: string, requiredCredits: number): Promise<boolean>;
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
export declare function validateDistributionRequirements(requirementModel: typeof Model, programId: string, completedByCategory: Map<string, number>): Promise<PlanValidationResult>;
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
export declare function checkResidencyRequirements(planModel: typeof Model, programModel: typeof Model, studentId: string, creditsAtInstitution: number): Promise<boolean>;
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
export declare function validateGPARequirements(planModel: typeof Model, studentId: string, minimumGPA: number): Promise<boolean>;
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
export declare function auditDegreeProgress(planModel: typeof Model, requirementModel: typeof Model, studentId: string): Promise<any>;
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
export declare function generateDegreeAuditReport(planModel: typeof Model, requirementModel: typeof Model, studentId: string, format?: 'json' | 'pdf' | 'html'): Promise<any>;
//# sourceMappingURL=academic-planning-kit.d.ts.map