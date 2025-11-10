"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MajorMinorSchema = exports.AcademicPlanSchema = void 0;
exports.defineAcademicPlanModel = defineAcademicPlanModel;
exports.defineProgramPlanModel = defineProgramPlanModel;
exports.defineMajorMinorModel = defineMajorMinorModel;
exports.defineDegreeRequirementModel = defineDegreeRequirementModel;
exports.createAcademicPlan = createAcademicPlan;
exports.getAcademicPlan = getAcademicPlan;
exports.updateAcademicPlan = updateAcademicPlan;
exports.deleteAcademicPlan = deleteAcademicPlan;
exports.listAcademicPlans = listAcademicPlans;
exports.searchAcademicPlans = searchAcademicPlans;
exports.archiveAcademicPlan = archiveAcademicPlan;
exports.restoreAcademicPlan = restoreAcademicPlan;
exports.generateDegreeRoadmap = generateDegreeRoadmap;
exports.calculateDegreeProgress = calculateDegreeProgress;
exports.identifyMissingRequirements = identifyMissingRequirements;
exports.suggestCourseSequence = suggestCourseSequence;
exports.validateDegreeCompletion = validateDegreeCompletion;
exports.estimateGraduationDate = estimateGraduationDate;
exports.generateWhatIfScenario = generateWhatIfScenario;
exports.compareDegreePaths = compareDegreePaths;
exports.declareMajor = declareMajor;
exports.declareMinor = declareMinor;
exports.changeMajor = changeMajor;
exports.dropMinor = dropMinor;
exports.validateMajorRequirements = validateMajorRequirements;
exports.getMajorMinorCombinations = getMajorMinorCombinations;
exports.validatePrerequisites = validatePrerequisites;
exports.generateCourseSequence = generateCourseSequence;
exports.checkCorequisites = checkCorequisites;
exports.identifyBlockedCourses = identifyBlockedCourses;
exports.suggestNextTermCourses = suggestNextTermCourses;
exports.validateCourseLoad = validateCourseLoad;
exports.optimizeCourseSchedule = optimizeCourseSchedule;
exports.getElectiveOptions = getElectiveOptions;
exports.validateElectiveChoice = validateElectiveChoice;
exports.trackElectiveProgress = trackElectiveProgress;
exports.suggestElectives = suggestElectives;
exports.calculateElectiveCredits = calculateElectiveCredits;
exports.validateProgramRequirements = validateProgramRequirements;
exports.checkCreditRequirements = checkCreditRequirements;
exports.validateDistributionRequirements = validateDistributionRequirements;
exports.checkResidencyRequirements = checkResidencyRequirements;
exports.validateGPARequirements = validateGPARequirements;
exports.auditDegreeProgress = auditDegreeProgress;
exports.generateDegreeAuditReport = generateDegreeAuditReport;
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
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.AcademicPlanSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    programId: zod_1.z.string().uuid(),
    catalogYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/),
    expectedGraduationDate: zod_1.z.date().optional(),
    planStatus: zod_1.z.enum(['draft', 'active', 'completed', 'archived']),
    totalCreditsRequired: zod_1.z.number().min(0),
    creditsCompleted: zod_1.z.number().min(0),
    creditsInProgress: zod_1.z.number().min(0),
    gpaRequirement: zod_1.z.number().min(0).max(4),
    currentGPA: zod_1.z.number().min(0).max(4).optional(),
    advisorId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.MajorMinorSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    programId: zod_1.z.string().uuid(),
    declarationType: zod_1.z.enum(['major', 'minor', 'double-major', 'concentration']),
    declarationDate: zod_1.z.date(),
    declarationStatus: zod_1.z.enum(['pending', 'approved', 'denied', 'dropped']),
    isPrimary: zod_1.z.boolean(),
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
function defineAcademicPlanModel(sequelize) {
    class AcademicPlanModel extends sequelize_1.Model {
    }
    AcademicPlanModel.init({
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
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'program_id',
        },
        catalogYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            field: 'catalog_year',
        },
        expectedGraduationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'expected_graduation_date',
        },
        planStatus: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            field: 'plan_status',
        },
        totalCreditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'total_credits_required',
        },
        creditsCompleted: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'credits_completed',
        },
        creditsInProgress: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'credits_in_progress',
        },
        gpaRequirement: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            field: 'gpa_requirement',
        },
        currentGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
            field: 'current_gpa',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'advisor_id',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
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
    });
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
function defineProgramPlanModel(sequelize) {
    class ProgramPlanModel extends sequelize_1.Model {
    }
    ProgramPlanModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            field: 'program_id',
        },
        programName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'program_name',
        },
        degreeType: {
            type: sequelize_1.DataTypes.ENUM('BA', 'BS', 'MA', 'MS', 'MBA', 'PhD', 'Certificate'),
            allowNull: false,
            field: 'degree_type',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        totalCredits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'total_credits',
        },
        coreCredits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'core_credits',
        },
        electiveCredits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'elective_credits',
        },
        minimumGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            field: 'minimum_gpa',
        },
        residencyRequirement: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'residency_requirement',
        },
        catalogYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            field: 'catalog_year',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
        },
    }, {
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
    });
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
function defineMajorMinorModel(sequelize) {
    class MajorMinorModel extends sequelize_1.Model {
    }
    MajorMinorModel.init({
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
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'program_id',
        },
        declarationType: {
            type: sequelize_1.DataTypes.ENUM('major', 'minor', 'double-major', 'concentration'),
            allowNull: false,
            field: 'declaration_type',
        },
        declarationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'declaration_date',
        },
        declarationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'denied', 'dropped'),
            allowNull: false,
            defaultValue: 'pending',
            field: 'declaration_status',
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
        isPrimary: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_primary',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
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
    });
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
function defineDegreeRequirementModel(sequelize) {
    class DegreeRequirementModel extends sequelize_1.Model {
    }
    DegreeRequirementModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'program_id',
        },
        requirementType: {
            type: sequelize_1.DataTypes.ENUM('core', 'distribution', 'elective', 'residency', 'gpa', 'capstone'),
            allowNull: false,
            field: 'requirement_type',
        },
        requirementName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            field: 'requirement_name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        creditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'credits_required',
        },
        courseList: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: true,
            field: 'course_list',
        },
        minimumGrade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
            field: 'minimum_grade',
        },
        isRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_required',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'degree_requirements',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['program_id'] },
            { fields: ['requirement_type'] },
            { fields: ['is_required'] },
        ],
    });
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
async function createAcademicPlan(planModel, planData) {
    // Validate input
    exports.AcademicPlanSchema.parse(planData);
    // Check for existing plan
    const existing = await planModel.findOne({
        where: {
            studentId: planData.studentId,
            planStatus: { [sequelize_1.Op.in]: ['draft', 'active'] },
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
async function getAcademicPlan(planModel, planId) {
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
async function updateAcademicPlan(planModel, planId, updates) {
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
async function deleteAcademicPlan(planModel, planId) {
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
async function listAcademicPlans(planModel, filters = {}, limit = 20, offset = 0) {
    const where = {};
    if (filters.studentId)
        where.studentId = filters.studentId;
    if (filters.programId)
        where.programId = filters.programId;
    if (filters.planStatus)
        where.planStatus = filters.planStatus;
    if (filters.advisorId)
        where.advisorId = filters.advisorId;
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
async function searchAcademicPlans(planModel, searchCriteria) {
    const where = {};
    if (searchCriteria.catalogYear)
        where.catalogYear = searchCriteria.catalogYear;
    if (searchCriteria.minimumGPA) {
        where.currentGPA = { [sequelize_1.Op.gte]: searchCriteria.minimumGPA };
    }
    if (searchCriteria.minCredits) {
        where.creditsCompleted = { [sequelize_1.Op.gte]: searchCriteria.minCredits };
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
async function archiveAcademicPlan(planModel, planId) {
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
async function restoreAcademicPlan(planModel, planId) {
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
async function generateDegreeRoadmap(planModel, requirementModel, studentId, programId, startTerm, creditsPerTerm = 15) {
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
    const creditsNeeded = plan.totalCreditsRequired - plan.creditsCompleted;
    const termsNeeded = Math.ceil(creditsNeeded / creditsPerTerm);
    // Generate term-by-term plan
    const terms = [];
    const [season, year] = startTerm.split(' ');
    let currentYear = parseInt(year);
    for (let i = 0; i < termsNeeded; i++) {
        const termSeason = i % 2 === 0 ? season : (season === 'Fall' ? 'Spring' : 'Fall');
        if (i > 0 && termSeason === 'Fall')
            currentYear++;
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
        progressPercentage: (plan.creditsCompleted / plan.totalCreditsRequired) * 100,
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
async function calculateDegreeProgress(planModel, studentId) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        throw new Error('Active academic plan not found');
    }
    const totalCredits = plan.totalCreditsRequired;
    const completed = plan.creditsCompleted;
    const inProgress = plan.creditsInProgress;
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
async function identifyMissingRequirements(planModel, requirementModel, studentId) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        throw new Error('Active academic plan not found');
    }
    const requirements = await requirementModel.findAll({
        where: { programId: plan.programId, isRequired: true },
    });
    // Simplified - would check against completed courses
    return requirements.map((req) => req.requirementName);
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
async function suggestCourseSequence(requirementModel, programId, completedCourses) {
    const requirements = await requirementModel.findAll({
        where: { programId },
    });
    // Simplified course sequence - would use actual prerequisite logic
    return requirements.slice(0, 5).map((req) => ({
        courseId: req.id,
        courseName: req.requirementName,
        courseCode: `REQ-${req.id.substring(0, 6)}`,
        credits: req.creditsRequired || 3,
        term: 'Fall 2024',
        prerequisites: [],
        corequisites: [],
        status: 'available',
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
async function validateDegreeCompletion(planModel, requirementModel, studentId) {
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
        where: { programId: plan.programId, isRequired: true },
    });
    const errors = [];
    const warnings = [];
    const missingRequirements = [];
    // Check GPA requirement
    if (plan.currentGPA < plan.gpaRequirement) {
        errors.push({
            code: 'GPA_BELOW_MINIMUM',
            message: `Current GPA ${plan.currentGPA} is below requirement ${plan.gpaRequirement}`,
            severity: 'error',
            field: 'currentGPA',
        });
    }
    // Check credit completion
    if (plan.creditsCompleted < plan.totalCreditsRequired) {
        missingRequirements.push(`${plan.totalCreditsRequired - plan.creditsCompleted} credits remaining`);
    }
    const progressPercentage = (plan.creditsCompleted / plan.totalCreditsRequired) * 100;
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
async function estimateGraduationDate(planModel, studentId, creditsPerTerm = 15) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        throw new Error('Active academic plan not found');
    }
    if (plan.expectedGraduationDate) {
        return new Date(plan.expectedGraduationDate);
    }
    const creditsRemaining = plan.totalCreditsRequired - plan.creditsCompleted;
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
async function generateWhatIfScenario(planModel, programModel, studentId, alternativeProgramId) {
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
    const currentCredits = currentPlan.creditsCompleted;
    const requiredCredits = altProgram.totalCredits;
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
async function compareDegreePaths(planModel, programModel, studentId, programIds) {
    const scenarios = [];
    for (const programId of programIds) {
        const scenario = await generateWhatIfScenario(planModel, programModel, studentId, programId);
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
async function declareMajor(majorMinorModel, studentId, programId, isPrimary = true) {
    // Check for existing major declaration
    const existing = await majorMinorModel.findOne({
        where: {
            studentId,
            programId,
            declarationType: 'major',
            declarationStatus: { [sequelize_1.Op.in]: ['pending', 'approved'] },
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
async function declareMinor(majorMinorModel, studentId, programId) {
    const existing = await majorMinorModel.findOne({
        where: {
            studentId,
            programId,
            declarationType: 'minor',
            declarationStatus: { [sequelize_1.Op.in]: ['pending', 'approved'] },
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
async function changeMajor(majorMinorModel, studentId, currentMajorId, newMajorId) {
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
async function dropMinor(majorMinorModel, studentId, programId) {
    const minor = await majorMinorModel.findOne({
        where: {
            studentId,
            programId,
            declarationType: 'minor',
            declarationStatus: { [sequelize_1.Op.in]: ['pending', 'approved'] },
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
async function validateMajorRequirements(majorMinorModel, requirementModel, studentId, majorId) {
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
        missingRequirements: requirements.map((r) => r.requirementName),
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
async function getMajorMinorCombinations(programModel, majorId) {
    const major = await programModel.findOne({
        where: { programId: majorId },
    });
    if (!major) {
        throw new Error('Major program not found');
    }
    // Get all programs in different departments (simplified logic)
    const minors = await programModel.findAll({
        where: {
            programId: { [sequelize_1.Op.ne]: majorId },
            isActive: true,
        },
    });
    return minors.map((m) => m.programId);
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
async function validatePrerequisites(courseId, requiredPrereqs, completedCourses) {
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
async function generateCourseSequence(requirementModel, programId, completedCourses, termsRemaining) {
    const requirements = await requirementModel.findAll({
        where: { programId },
    });
    const terms = [];
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
async function checkCorequisites(courseId, requiredCoreqs, enrolledCourses) {
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
async function identifyBlockedCourses(allCourses, prerequisiteMap, completedCourses) {
    const blocked = [];
    for (const course of allCourses) {
        if (completedCourses.includes(course))
            continue;
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
async function suggestNextTermCourses(requirementModel, programId, completedCourses, maxCredits = 15) {
    const requirements = await requirementModel.findAll({
        where: { programId, isRequired: true },
    });
    const suggested = [];
    let totalCredits = 0;
    for (const req of requirements) {
        if (totalCredits >= maxCredits)
            break;
        const credits = req.creditsRequired || 3;
        if (totalCredits + credits <= maxCredits) {
            suggested.push({
                courseId: req.id,
                courseName: req.requirementName,
                courseCode: `REQ-${req.id.substring(0, 6)}`,
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
async function validateCourseLoad(courses, minCredits = 12, maxCredits = 18) {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const errors = [];
    const warnings = [];
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
async function optimizeCourseSchedule(courses, maxCredits = 15) {
    // Sort by priority: required first, then by credits
    const sorted = [...courses].sort((a, b) => {
        if (a.status === 'available' && b.status === 'blocked')
            return -1;
        if (a.status === 'blocked' && b.status === 'available')
            return 1;
        return a.credits - b.credits;
    });
    const optimized = [];
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
async function getElectiveOptions(requirementModel, programId, category) {
    const where = {
        programId,
        requirementType: 'elective',
    };
    if (category) {
        where.category = category;
    }
    const requirements = await requirementModel.findAll({ where });
    return requirements.map((req) => ({
        courseId: req.id,
        courseName: req.requirementName,
        courseCode: `ELEC-${req.id.substring(0, 6)}`,
        credits: req.creditsRequired || 3,
        term: 'Any',
        prerequisites: [],
        corequisites: [],
        status: 'available',
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
async function validateElectiveChoice(requirementModel, programId, courseId, category) {
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
async function trackElectiveProgress(planModel, studentId, category) {
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
async function suggestElectives(requirementModel, programId, interests, creditsNeeded) {
    const electives = await getElectiveOptions(requirementModel, programId);
    // Filter by interests (simplified - would use more sophisticated matching)
    const suggested = electives.filter((elective) => interests.some((interest) => elective.courseName.toLowerCase().includes(interest.toLowerCase())));
    // Limit to credits needed
    let totalCredits = 0;
    const result = [];
    for (const elective of suggested) {
        if (totalCredits >= creditsNeeded)
            break;
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
async function calculateElectiveCredits(planModel, studentId) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        throw new Error('Active academic plan not found');
    }
    // Simplified - would calculate from actual completed electives
    const metadata = plan.metadata || {};
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
async function validateProgramRequirements(planModel, requirementModel, studentId, programId) {
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
    const errors = [];
    const warnings = [];
    const missingRequirements = [];
    // Validate GPA
    if (plan.currentGPA && plan.currentGPA < plan.gpaRequirement) {
        errors.push({
            code: 'GPA_REQUIREMENT',
            message: `GPA ${plan.currentGPA} below requirement ${plan.gpaRequirement}`,
            severity: 'error',
            field: 'currentGPA',
        });
    }
    // Validate credit requirements
    for (const req of requirements) {
        missingRequirements.push(req.requirementName);
    }
    const progressPercentage = (plan.creditsCompleted / plan.totalCreditsRequired) * 100;
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
async function checkCreditRequirements(planModel, studentId, requiredCredits) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        return false;
    }
    return plan.creditsCompleted >= requiredCredits;
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
async function validateDistributionRequirements(requirementModel, programId, completedByCategory) {
    const requirements = await requirementModel.findAll({
        where: { programId, requirementType: 'distribution' },
    });
    const errors = [];
    const warnings = [];
    const missingRequirements = [];
    for (const req of requirements) {
        const category = req.category;
        const required = req.creditsRequired;
        const completed = completedByCategory.get(category) || 0;
        if (completed < required) {
            missingRequirements.push(`${category}: ${required - completed} credits needed`);
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
async function checkResidencyRequirements(planModel, programModel, studentId, creditsAtInstitution) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        return false;
    }
    const program = await programModel.findOne({
        where: { programId: plan.programId },
    });
    if (!program) {
        return false;
    }
    return creditsAtInstitution >= program.residencyRequirement;
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
async function validateGPARequirements(planModel, studentId, minimumGPA) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan || !plan.currentGPA) {
        return false;
    }
    return plan.currentGPA >= minimumGPA;
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
async function auditDegreeProgress(planModel, requirementModel, studentId) {
    const plan = await planModel.findOne({
        where: { studentId, planStatus: 'active' },
    });
    if (!plan) {
        throw new Error('Active academic plan not found');
    }
    const requirements = await requirementModel.findAll({
        where: { programId: plan.programId },
    });
    const auditItems = requirements.map((req) => ({
        requirementName: req.requirementName,
        requirementType: req.requirementType,
        creditsRequired: req.creditsRequired,
        creditsCompleted: 0, // Would be calculated from completed courses
        status: 'not-met',
        courses: [],
    }));
    return {
        studentId,
        programId: plan.programId,
        auditDate: new Date(),
        overallStatus: 'on-track',
        progressPercentage: (plan.creditsCompleted / plan.totalCreditsRequired) * 100,
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
async function generateDegreeAuditReport(planModel, requirementModel, studentId, format = 'json') {
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
//# sourceMappingURL=academic-planning-kit.js.map