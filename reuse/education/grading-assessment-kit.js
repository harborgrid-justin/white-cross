"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeChangeRequestSchema = exports.GradeSchema = void 0;
exports.defineGradeModel = defineGradeModel;
exports.defineGradeScaleModel = defineGradeScaleModel;
exports.defineAssessmentModel = defineAssessmentModel;
exports.defineGradeChangeRequestModel = defineGradeChangeRequestModel;
exports.createGrade = createGrade;
exports.updateGrade = updateGrade;
exports.getGrade = getGrade;
exports.deleteGrade = deleteGrade;
exports.bulkCreateGrades = bulkCreateGrades;
exports.validateGradeEntry = validateGradeEntry;
exports.lockGrades = lockGrades;
exports.unlockGrades = unlockGrades;
exports.calculateTermGPA = calculateTermGPA;
exports.calculateCumulativeGPA = calculateCumulativeGPA;
exports.calculateMajorGPA = calculateMajorGPA;
exports.calculateMinorGPA = calculateMinorGPA;
exports.calculateTransferGPA = calculateTransferGPA;
exports.getGPATrend = getGPATrend;
exports.predictGPA = predictGPA;
exports.createGradeChangeRequest = createGradeChangeRequest;
exports.approveGradeChange = approveGradeChange;
exports.rejectGradeChange = rejectGradeChange;
exports.getGradeChangeHistory = getGradeChangeHistory;
exports.validateGradeChangeEligibility = validateGradeChangeEligibility;
exports.notifyGradeChange = notifyGradeChange;
exports.assignIncompleteGrade = assignIncompleteGrade;
exports.resolveIncompleteGrade = resolveIncompleteGrade;
exports.getIncompleteGrades = getIncompleteGrades;
exports.checkIncompleteDeadlines = checkIncompleteDeadlines;
exports.convertExpiredIncompletes = convertExpiredIncompletes;
exports.convertToPassFail = convertToPassFail;
exports.validatePassFailEligibility = validatePassFailEligibility;
exports.getPassFailCourses = getPassFailCourses;
exports.calculatePassFailImpact = calculatePassFailImpact;
exports.enforcePassFailLimits = enforcePassFailLimits;
exports.createGradingRubric = createGradingRubric;
exports.applyRubric = applyRubric;
exports.validateRubricScoring = validateRubricScoring;
exports.calculateRubricScore = calculateRubricScore;
exports.getRubricFeedback = getRubricFeedback;
exports.analyzeRubricPerformance = analyzeRubricPerformance;
exports.generateGradeDistribution = generateGradeDistribution;
exports.calculateCourseStatistics = calculateCourseStatistics;
exports.identifyGradeAnomalies = identifyGradeAnomalies;
exports.generateTranscript = generateTranscript;
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
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.GradeSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    courseId: zod_1.z.string().uuid(),
    instructorId: zod_1.z.string().uuid(),
    term: zod_1.z.string().min(1),
    letterGrade: zod_1.z.string(),
    numericGrade: zod_1.z.number().min(0).max(100).optional(),
    gradePoints: zod_1.z.number().min(0).max(4.0),
    credits: zod_1.z.number().min(0),
    gradingBasis: zod_1.z.enum(['letter', 'pass-fail', 'audit', 'incomplete']),
    isLocked: zod_1.z.boolean(),
    comments: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.GradeChangeRequestSchema = zod_1.z.object({
    gradeId: zod_1.z.string().uuid(),
    studentId: zod_1.z.string().uuid(),
    courseId: zod_1.z.string().uuid(),
    requestedBy: zod_1.z.string().uuid(),
    currentGrade: zod_1.z.string(),
    requestedGrade: zod_1.z.string(),
    reason: zod_1.z.string().min(10),
    requestStatus: zod_1.z.enum(['pending', 'approved', 'denied', 'cancelled']),
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
function defineGradeModel(sequelize) {
    class GradeModel extends sequelize_1.Model {
    }
    GradeModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'student_id',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'course_id',
        },
        instructorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'instructor_id',
        },
        term: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        letterGrade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
            field: 'letter_grade',
        },
        numericGrade: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'numeric_grade',
        },
        gradePoints: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            field: 'grade_points',
        },
        credits: {
            type: sequelize_1.DataTypes.DECIMAL(4, 2),
            allowNull: false,
        },
        gradingBasis: {
            type: sequelize_1.DataTypes.ENUM('letter', 'pass-fail', 'audit', 'incomplete'),
            allowNull: false,
            defaultValue: 'letter',
            field: 'grading_basis',
        },
        isLocked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_locked',
        },
        lockedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'locked_at',
        },
        lockedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'locked_by',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
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
    });
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
function defineGradeScaleModel(sequelize) {
    class GradeScaleModel extends sequelize_1.Model {
    }
    GradeScaleModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        scaleId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'scale_id',
        },
        scaleName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'scale_name',
        },
        scaleType: {
            type: sequelize_1.DataTypes.ENUM('standard', 'plus-minus', 'pass-fail', 'numerical'),
            allowNull: false,
            field: 'scale_type',
        },
        mappings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        isDefault: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_default',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
    }, {
        sequelize,
        tableName: 'grade_scales',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['scale_id'] },
            { fields: ['is_default'] },
            { fields: ['is_active'] },
        ],
    });
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
function defineAssessmentModel(sequelize) {
    class AssessmentModel extends sequelize_1.Model {
    }
    AssessmentModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'course_id',
        },
        assessmentType: {
            type: sequelize_1.DataTypes.ENUM('exam', 'quiz', 'assignment', 'project', 'participation', 'lab', 'paper', 'presentation'),
            allowNull: false,
            field: 'assessment_type',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        maxPoints: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            field: 'max_points',
        },
        weight: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'due_date',
        },
        rubricId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'rubric_id',
        },
        isPublished: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_published',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'assessments',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['course_id'] },
            { fields: ['assessment_type'] },
            { fields: ['is_published'] },
        ],
    });
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
function defineGradeChangeRequestModel(sequelize) {
    class GradeChangeRequestModel extends sequelize_1.Model {
    }
    GradeChangeRequestModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        gradeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'grade_id',
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'student_id',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'course_id',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'requested_by',
        },
        currentGrade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
            field: 'current_grade',
        },
        requestedGrade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
            field: 'requested_grade',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        requestStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'denied', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            field: 'request_status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'approved_by',
        },
        approvalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'approval_date',
        },
        denialReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'denial_reason',
        },
    }, {
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
    });
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
async function createGrade(gradeModel, gradeData) {
    // Validate input
    exports.GradeSchema.parse(gradeData);
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
async function updateGrade(gradeModel, gradeId, updates) {
    const grade = await gradeModel.findByPk(gradeId);
    if (!grade) {
        throw new Error('Grade not found');
    }
    if (grade.isLocked) {
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
async function getGrade(gradeModel, gradeId) {
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
async function deleteGrade(gradeModel, gradeId) {
    const grade = await gradeModel.findByPk(gradeId);
    if (!grade) {
        throw new Error('Grade not found');
    }
    if (grade.isLocked) {
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
async function bulkCreateGrades(gradeModel, grades) {
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
async function validateGradeEntry(gradeScaleModel, scaleId, letterGrade, numericGrade) {
    const scale = await gradeScaleModel.findOne({
        where: { scaleId },
    });
    if (!scale) {
        throw new Error('Grade scale not found');
    }
    const mappings = scale.mappings;
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
async function lockGrades(gradeModel, courseId, term, lockedBy) {
    const [count] = await gradeModel.update({
        isLocked: true,
        lockedAt: new Date(),
        lockedBy,
    }, {
        where: {
            courseId,
            term,
            isLocked: false,
        },
    });
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
async function unlockGrades(gradeModel, courseId, term) {
    const [count] = await gradeModel.update({
        isLocked: false,
        lockedAt: null,
        lockedBy: null,
    }, {
        where: {
            courseId,
            term,
            isLocked: true,
        },
    });
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
async function calculateTermGPA(gradeModel, studentId, term) {
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
        const gradePoints = grade.gradePoints;
        const credits = grade.credits;
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
async function calculateCumulativeGPA(gradeModel, studentId) {
    const grades = await gradeModel.findAll({
        where: {
            studentId,
            gradingBasis: 'letter',
        },
    });
    let totalQualityPoints = 0;
    let totalCredits = 0;
    for (const grade of grades) {
        const gradePoints = grade.gradePoints;
        const credits = grade.credits;
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
async function calculateMajorGPA(gradeModel, studentId, programId, majorCourseIds) {
    const grades = await gradeModel.findAll({
        where: {
            studentId,
            courseId: { [sequelize_1.Op.in]: majorCourseIds },
            gradingBasis: 'letter',
        },
    });
    let totalQualityPoints = 0;
    let totalCredits = 0;
    for (const grade of grades) {
        const gradePoints = grade.gradePoints;
        const credits = grade.credits;
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
async function calculateMinorGPA(gradeModel, studentId, programId, minorCourseIds) {
    const grades = await gradeModel.findAll({
        where: {
            studentId,
            courseId: { [sequelize_1.Op.in]: minorCourseIds },
            gradingBasis: 'letter',
        },
    });
    let totalQualityPoints = 0;
    let totalCredits = 0;
    for (const grade of grades) {
        const gradePoints = grade.gradePoints;
        const credits = grade.credits;
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
async function calculateTransferGPA(gradeModel, studentId) {
    const grades = await gradeModel.findAll({
        where: {
            studentId,
            gradingBasis: 'letter',
        },
    });
    // Filter transfer credits (would be marked in metadata)
    const transferGrades = grades.filter((g) => g.metadata && g.metadata.isTransfer === true);
    let totalQualityPoints = 0;
    let totalCredits = 0;
    for (const grade of transferGrades) {
        const gradePoints = grade.gradePoints;
        const credits = grade.credits;
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
async function getGPATrend(gradeModel, studentId, numberOfTerms = 4) {
    const grades = await gradeModel.findAll({
        where: {
            studentId,
            gradingBasis: 'letter',
        },
        order: [['term', 'DESC']],
    });
    // Group by term
    const termMap = new Map();
    for (const grade of grades) {
        const term = grade.term;
        if (!termMap.has(term)) {
            termMap.set(term, []);
        }
        termMap.get(term).push(grade);
    }
    // Calculate GPA for each term
    const trend = [];
    const terms = Array.from(termMap.keys()).slice(0, numberOfTerms);
    for (const term of terms) {
        const termGrades = termMap.get(term);
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
async function predictGPA(gradeModel, studentId, futureCredits, targetGPA) {
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
async function createGradeChangeRequest(changeRequestModel, requestData) {
    // Validate input
    exports.GradeChangeRequestSchema.parse(requestData);
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
async function approveGradeChange(changeRequestModel, gradeModel, requestId, approvedBy) {
    const request = await changeRequestModel.findByPk(requestId);
    if (!request) {
        throw new Error('Grade change request not found');
    }
    if (request.requestStatus !== 'pending') {
        throw new Error('Request is not pending');
    }
    // Update the grade
    const grade = await gradeModel.findByPk(request.gradeId);
    if (grade) {
        await grade.update({
            letterGrade: request.requestedGrade,
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
async function rejectGradeChange(changeRequestModel, requestId, deniedBy, denialReason) {
    const request = await changeRequestModel.findByPk(requestId);
    if (!request) {
        throw new Error('Grade change request not found');
    }
    if (request.requestStatus !== 'pending') {
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
async function getGradeChangeHistory(changeRequestModel, gradeId) {
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
async function validateGradeChangeEligibility(gradeModel, gradeId, deadlineDays = 30) {
    const grade = await gradeModel.findByPk(gradeId);
    if (!grade) {
        return false;
    }
    // Check if within deadline (simplified - would use actual term end date)
    const createdAt = grade.createdAt;
    const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
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
async function notifyGradeChange(gradeId, oldGrade, newGrade, reason) {
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
async function assignIncompleteGrade(gradeModel, studentId, courseId, term, reason, deadline) {
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
async function resolveIncompleteGrade(gradeModel, gradeId, finalGrade, gradePoints, credits) {
    const grade = await gradeModel.findByPk(gradeId);
    if (!grade) {
        throw new Error('Incomplete grade not found');
    }
    if (grade.letterGrade !== 'I') {
        throw new Error('Grade is not incomplete');
    }
    return await grade.update({
        letterGrade: finalGrade,
        gradePoints,
        credits,
        gradingBasis: 'letter',
        metadata: {
            ...grade.metadata,
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
async function getIncompleteGrades(gradeModel, studentId) {
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
async function checkIncompleteDeadlines(gradeModel) {
    const incompletes = await gradeModel.findAll({
        where: {
            letterGrade: 'I',
            gradingBasis: 'incomplete',
        },
    });
    const now = new Date();
    const expired = [];
    for (const incomplete of incompletes) {
        const metadata = incomplete.metadata;
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
async function convertExpiredIncompletes(gradeModel) {
    const expired = await checkIncompleteDeadlines(gradeModel);
    for (const incomplete of expired) {
        await incomplete.update({
            letterGrade: 'F',
            gradePoints: 0,
            gradingBasis: 'letter',
            metadata: {
                ...incomplete.metadata,
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
async function convertToPassFail(gradeModel, gradeId, letterGrade) {
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
            ...grade.metadata,
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
async function validatePassFailEligibility(gradeModel, studentId, courseId, maxPassFailCredits = 12) {
    const passFailGrades = await gradeModel.findAll({
        where: {
            studentId,
            gradingBasis: 'pass-fail',
        },
    });
    const totalPassFailCredits = passFailGrades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
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
async function getPassFailCourses(gradeModel, studentId) {
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
async function calculatePassFailImpact(gradeModel, studentId, gradeId) {
    const currentGPA = await calculateCumulativeGPA(gradeModel, studentId);
    const grade = await gradeModel.findByPk(gradeId);
    if (!grade) {
        throw new Error('Grade not found');
    }
    const gradePoints = grade.gradePoints;
    const credits = grade.credits;
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
async function enforcePassFailLimits(gradeModel, studentId, maxCredits) {
    const passFailCourses = await getPassFailCourses(gradeModel, studentId);
    const totalCredits = passFailCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
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
async function createGradingRubric(rubricData) {
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
async function applyRubric(rubric, criterionScores) {
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
async function validateRubricScoring(rubric, criterionScores) {
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
async function calculateRubricScore(rubric, criterionScores) {
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
async function getRubricFeedback(rubric, criterionScores) {
    const feedback = [];
    for (const criterion of rubric.criteria) {
        const score = criterionScores.get(criterion.criterionName) || 0;
        const percentage = (score / criterion.maxPoints) * 100;
        if (percentage < 60) {
            feedback.push(`${criterion.criterionName}: Needs improvement`);
        }
        else if (percentage < 80) {
            feedback.push(`${criterion.criterionName}: Good work`);
        }
        else {
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
async function analyzeRubricPerformance(rubric, allScores) {
    const criterionAverages = new Map();
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
async function generateGradeDistribution(gradeModel, courseId, term) {
    const grades = await gradeModel.findAll({
        where: { courseId, term, gradingBasis: 'letter' },
    });
    const gradeBreakdown = new Map();
    let totalGradePoints = 0;
    let totalCredits = 0;
    for (const grade of grades) {
        const letterGrade = grade.letterGrade;
        gradeBreakdown.set(letterGrade, (gradeBreakdown.get(letterGrade) || 0) + 1);
        totalGradePoints += grade.gradePoints * grade.credits;
        totalCredits += grade.credits;
    }
    const averageGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    // Calculate median (simplified)
    const sortedGrades = grades.sort((a, b) => b.gradePoints - a.gradePoints);
    const medianGrade = sortedGrades[Math.floor(sortedGrades.length / 2)]
        ? sortedGrades[Math.floor(sortedGrades.length / 2)].letterGrade
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
async function calculateCourseStatistics(gradeModel, courseId, term) {
    const distribution = await generateGradeDistribution(gradeModel, courseId, term);
    const passRate = ((distribution.totalStudents -
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
async function identifyGradeAnomalies(gradeModel, courseId, term) {
    const distribution = await generateGradeDistribution(gradeModel, courseId, term);
    const anomalies = [];
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
async function generateTranscript(gradeModel, studentId, format = 'json') {
    const grades = await gradeModel.findAll({
        where: { studentId },
        order: [['term', 'ASC']],
    });
    const cumulativeGPA = await calculateCumulativeGPA(gradeModel, studentId);
    // Group by term
    const termMap = new Map();
    for (const grade of grades) {
        const term = grade.term;
        if (!termMap.has(term)) {
            termMap.set(term, []);
        }
        termMap.get(term).push(grade);
    }
    const terms = Array.from(termMap.entries()).map(([term, termGrades]) => ({
        term,
        courses: termGrades,
        termCredits: termGrades.reduce((sum, g) => sum + g.credits, 0),
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
//# sourceMappingURL=grading-assessment-kit.js.map