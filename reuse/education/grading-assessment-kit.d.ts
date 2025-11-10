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
import { Model, Sequelize } from 'sequelize';
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
export declare const GradeSchema: any;
export declare const GradeChangeRequestSchema: any;
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
export declare function defineGradeModel(sequelize: Sequelize): typeof Model;
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
export declare function defineGradeScaleModel(sequelize: Sequelize): typeof Model;
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
export declare function defineAssessmentModel(sequelize: Sequelize): typeof Model;
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
export declare function defineGradeChangeRequestModel(sequelize: Sequelize): typeof Model;
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
export declare function createGrade(gradeModel: typeof Model, gradeData: Grade): Promise<any>;
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
export declare function updateGrade(gradeModel: typeof Model, gradeId: string, updates: Partial<Grade>): Promise<any>;
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
export declare function getGrade(gradeModel: typeof Model, gradeId: string): Promise<any>;
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
export declare function deleteGrade(gradeModel: typeof Model, gradeId: string): Promise<boolean>;
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
export declare function bulkCreateGrades(gradeModel: typeof Model, grades: Grade[]): Promise<any[]>;
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
export declare function validateGradeEntry(gradeScaleModel: typeof Model, scaleId: string, letterGrade: string, numericGrade?: number): Promise<boolean>;
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
export declare function lockGrades(gradeModel: typeof Model, courseId: string, term: string, lockedBy: string): Promise<number>;
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
export declare function unlockGrades(gradeModel: typeof Model, courseId: string, term: string): Promise<number>;
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
export declare function calculateTermGPA(gradeModel: typeof Model, studentId: string, term: string): Promise<GPACalculation>;
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
export declare function calculateCumulativeGPA(gradeModel: typeof Model, studentId: string): Promise<GPACalculation>;
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
export declare function calculateMajorGPA(gradeModel: typeof Model, studentId: string, programId: string, majorCourseIds: string[]): Promise<GPACalculation>;
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
export declare function calculateMinorGPA(gradeModel: typeof Model, studentId: string, programId: string, minorCourseIds: string[]): Promise<GPACalculation>;
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
export declare function calculateTransferGPA(gradeModel: typeof Model, studentId: string): Promise<GPACalculation>;
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
export declare function getGPATrend(gradeModel: typeof Model, studentId: string, numberOfTerms?: number): Promise<GPACalculation[]>;
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
export declare function predictGPA(gradeModel: typeof Model, studentId: string, futureCredits: number, targetGPA: number): Promise<any>;
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
export declare function createGradeChangeRequest(changeRequestModel: typeof Model, requestData: GradeChangeRequest): Promise<any>;
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
export declare function approveGradeChange(changeRequestModel: typeof Model, gradeModel: typeof Model, requestId: string, approvedBy: string): Promise<any>;
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
export declare function rejectGradeChange(changeRequestModel: typeof Model, requestId: string, deniedBy: string, denialReason: string): Promise<any>;
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
export declare function getGradeChangeHistory(changeRequestModel: typeof Model, gradeId: string): Promise<any[]>;
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
export declare function validateGradeChangeEligibility(gradeModel: typeof Model, gradeId: string, deadlineDays?: number): Promise<boolean>;
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
export declare function notifyGradeChange(gradeId: string, oldGrade: string, newGrade: string, reason: string): Promise<boolean>;
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
export declare function assignIncompleteGrade(gradeModel: typeof Model, studentId: string, courseId: string, term: string, reason: string, deadline: Date): Promise<any>;
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
export declare function resolveIncompleteGrade(gradeModel: typeof Model, gradeId: string, finalGrade: string, gradePoints: number, credits: number): Promise<any>;
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
export declare function getIncompleteGrades(gradeModel: typeof Model, studentId: string): Promise<any[]>;
/**
 * Checks incomplete grade deadlines.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @returns {Promise<any[]>} Expired incompletes
 *
 * @example
 * const expired = await checkIncompleteDeadlines(Grade);
 */
export declare function checkIncompleteDeadlines(gradeModel: typeof Model): Promise<any[]>;
/**
 * Converts expired incompletes to F grades.
 *
 * @param {typeof Model} gradeModel - Grade model
 * @returns {Promise<number>} Number of grades converted
 *
 * @example
 * const count = await convertExpiredIncompletes(Grade);
 */
export declare function convertExpiredIncompletes(gradeModel: typeof Model): Promise<number>;
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
export declare function convertToPassFail(gradeModel: typeof Model, gradeId: string, letterGrade: string): Promise<any>;
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
export declare function validatePassFailEligibility(gradeModel: typeof Model, studentId: string, courseId: string, maxPassFailCredits?: number): Promise<boolean>;
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
export declare function getPassFailCourses(gradeModel: typeof Model, studentId: string): Promise<any[]>;
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
export declare function calculatePassFailImpact(gradeModel: typeof Model, studentId: string, gradeId: string): Promise<any>;
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
export declare function enforcePassFailLimits(gradeModel: typeof Model, studentId: string, maxCredits: number): Promise<boolean>;
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
export declare function createGradingRubric(rubricData: GradingRubric): Promise<GradingRubric>;
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
export declare function applyRubric(rubric: GradingRubric, criterionScores: Map<string, number>): Promise<number>;
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
export declare function validateRubricScoring(rubric: GradingRubric, criterionScores: Map<string, number>): Promise<boolean>;
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
export declare function calculateRubricScore(rubric: GradingRubric, criterionScores: Map<string, number>): Promise<number>;
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
export declare function getRubricFeedback(rubric: GradingRubric, criterionScores: Map<string, number>): Promise<string[]>;
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
export declare function analyzeRubricPerformance(rubric: GradingRubric, allScores: Map<string, number>[]): Promise<any>;
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
export declare function generateGradeDistribution(gradeModel: typeof Model, courseId: string, term: string): Promise<GradeDistribution>;
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
export declare function calculateCourseStatistics(gradeModel: typeof Model, courseId: string, term: string): Promise<any>;
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
export declare function identifyGradeAnomalies(gradeModel: typeof Model, courseId: string, term: string): Promise<any[]>;
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
export declare function generateTranscript(gradeModel: typeof Model, studentId: string, format?: 'json' | 'pdf'): Promise<any>;
//# sourceMappingURL=grading-assessment-kit.d.ts.map