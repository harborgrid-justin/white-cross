"use strict";
/**
 * @fileoverview Curriculum Management Kit - Comprehensive curriculum and program management
 * @module reuse/education/curriculum-management-kit
 * @description Complete curriculum management system with NestJS services, Sequelize models,
 * program creation, curriculum versioning, requirement management, approval workflows,
 * program catalog, and articulation agreements. Implements proper IoC patterns, service
 * layer architecture, and business logic separation.
 *
 * Key Features:
 * - Comprehensive Sequelize models for curriculum domain
 * - Program creation and modification workflows
 * - Curriculum versioning and revision tracking
 * - Degree requirement management
 * - Course prerequisite and corequisite handling
 * - Program approval workflow with multi-level authorization
 * - Program catalog with search and filtering
 * - Articulation agreement management
 * - Transfer credit evaluation
 * - NestJS providers with proper IoC patterns
 * - Factory providers and async providers
 * - Service composition and orchestration
 * - Repository pattern implementation
 * - Business logic layering
 *
 * @target NestJS 10.x, Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Role-based access control for curriculum modifications
 * - Approval workflow enforcement
 * - Audit logging for all curriculum changes
 * - Version control and change tracking
 * - Input sanitization and validation
 * - SQL injection prevention
 * - Data integrity validation
 *
 * @example Basic service usage
 * ```typescript
 * import { CurriculumService } from './curriculum-management-kit';
 *
 * @Controller('curriculum')
 * export class CurriculumController {
 *   constructor(private readonly curriculumService: CurriculumService) {}
 *
 *   @Post('programs')
 *   async createProgram(@Body() dto: CreateProgramDto) {
 *     return this.curriculumService.createProgram(dto);
 *   }
 * }
 * ```
 *
 * @example Curriculum versioning
 * ```typescript
 * const revision = await curriculumService.createRevision(
 *   curriculumId,
 *   {
 *     versionNumber: '2.0',
 *     changes: ['Updated core requirements', 'Added new electives'],
 *     effectiveDate: new Date('2026-09-01')
 *   }
 * );
 * ```
 *
 * LOC: EDU-CUR-001
 * UPSTREAM: sequelize, @nestjs/common, @nestjs/sequelize
 * DOWNSTREAM: academic-planning, course-management, degree-audit
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulationAgreementService = exports.ProgramCatalogService = exports.ApprovalWorkflowService = exports.CurriculumRevisionService = exports.RequirementService = exports.CurriculumService = exports.ProgramService = exports.ArticulationAgreementRepository = exports.ProgramCatalogRepository = exports.ApprovalWorkflowRepository = exports.CurriculumRevisionRepository = exports.RequirementRepository = exports.CurriculumRepository = exports.ProgramRepository = exports.ArticulationAgreementType = exports.ApprovalDecision = exports.ApprovalStage = exports.FulfillmentMode = exports.RequirementType = exports.RevisionStatus = exports.ProgramStatus = exports.DeliveryMode = exports.DegreeLevel = void 0;
exports.createProgramModel = createProgramModel;
exports.createCurriculumModel = createCurriculumModel;
exports.createConcentrationModel = createConcentrationModel;
exports.createCurriculumRevisionModel = createCurriculumRevisionModel;
exports.createRequirementModel = createRequirementModel;
exports.createApprovalWorkflowModel = createApprovalWorkflowModel;
exports.createProgramCatalogModel = createProgramCatalogModel;
exports.createArticulationAgreementModel = createArticulationAgreementModel;
exports.validateProgramCode = validateProgramCode;
exports.calculateTotalCredits = calculateTotalCredits;
exports.validateVersionNumber = validateVersionNumber;
exports.compareVersions = compareVersions;
exports.validateCIPCode = validateCIPCode;
exports.formatDegreeLevel = formatDegreeLevel;
exports.isCurriculumExpired = isCurriculumExpired;
exports.generateCatalogYear = generateCatalogYear;
exports.validatePrerequisiteChain = validatePrerequisiteChain;
exports.validateCreditTotals = validateCreditTotals;
exports.validateAdmissionRequirements = validateAdmissionRequirements;
exports.canDiscontinueProgram = canDiscontinueProgram;
exports.validateCurriculumEffectiveDate = validateCurriculumEffectiveDate;
exports.generateRequirementValidationReport = generateRequirementValidationReport;
exports.validateArticulationMapping = validateArticulationMapping;
exports.generateProgramEnrollmentSummary = generateProgramEnrollmentSummary;
exports.generateRevisionHistoryReport = generateRevisionHistoryReport;
exports.calculateAverageReviewTime = calculateAverageReviewTime;
exports.generateApprovalWorkflowMetrics = generateApprovalWorkflowMetrics;
exports.generateCatalogAnalytics = generateCatalogAnalytics;
exports.createCurriculumModelProviders = createCurriculumModelProviders;
exports.createCurriculumModuleConfig = createCurriculumModuleConfig;
exports.createCurriculumManagementModule = createCurriculumManagementModule;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Program degree levels
 */
var DegreeLevel;
(function (DegreeLevel) {
    DegreeLevel["CERTIFICATE"] = "CERTIFICATE";
    DegreeLevel["ASSOCIATE"] = "ASSOCIATE";
    DegreeLevel["BACHELOR"] = "BACHELOR";
    DegreeLevel["MASTER"] = "MASTER";
    DegreeLevel["DOCTORAL"] = "DOCTORAL";
    DegreeLevel["POST_DOCTORAL"] = "POST_DOCTORAL";
})(DegreeLevel || (exports.DegreeLevel = DegreeLevel = {}));
/**
 * Program delivery modes
 */
var DeliveryMode;
(function (DeliveryMode) {
    DeliveryMode["ON_CAMPUS"] = "ON_CAMPUS";
    DeliveryMode["ONLINE"] = "ONLINE";
    DeliveryMode["HYBRID"] = "HYBRID";
    DeliveryMode["DISTANCE"] = "DISTANCE";
})(DeliveryMode || (exports.DeliveryMode = DeliveryMode = {}));
/**
 * Program status
 */
var ProgramStatus;
(function (ProgramStatus) {
    ProgramStatus["DRAFT"] = "DRAFT";
    ProgramStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    ProgramStatus["APPROVED"] = "APPROVED";
    ProgramStatus["ACTIVE"] = "ACTIVE";
    ProgramStatus["SUSPENDED"] = "SUSPENDED";
    ProgramStatus["DISCONTINUED"] = "DISCONTINUED";
    ProgramStatus["ARCHIVED"] = "ARCHIVED";
})(ProgramStatus || (exports.ProgramStatus = ProgramStatus = {}));
/**
 * Curriculum revision status
 */
var RevisionStatus;
(function (RevisionStatus) {
    RevisionStatus["DRAFT"] = "DRAFT";
    RevisionStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    RevisionStatus["APPROVED"] = "APPROVED";
    RevisionStatus["REJECTED"] = "REJECTED";
    RevisionStatus["IMPLEMENTED"] = "IMPLEMENTED";
    RevisionStatus["SUPERSEDED"] = "SUPERSEDED";
})(RevisionStatus || (exports.RevisionStatus = RevisionStatus = {}));
/**
 * Requirement types
 */
var RequirementType;
(function (RequirementType) {
    RequirementType["CORE"] = "CORE";
    RequirementType["MAJOR"] = "MAJOR";
    RequirementType["MINOR"] = "MINOR";
    RequirementType["ELECTIVE"] = "ELECTIVE";
    RequirementType["GENERAL_EDUCATION"] = "GENERAL_EDUCATION";
    RequirementType["CONCENTRATION"] = "CONCENTRATION";
    RequirementType["CAPSTONE"] = "CAPSTONE";
    RequirementType["INTERNSHIP"] = "INTERNSHIP";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
/**
 * Requirement fulfillment modes
 */
var FulfillmentMode;
(function (FulfillmentMode) {
    FulfillmentMode["SPECIFIC_COURSES"] = "SPECIFIC_COURSES";
    FulfillmentMode["COURSE_GROUP"] = "COURSE_GROUP";
    FulfillmentMode["CREDIT_HOURS"] = "CREDIT_HOURS";
    FulfillmentMode["GPA_REQUIREMENT"] = "GPA_REQUIREMENT";
    FulfillmentMode["COMPETENCY"] = "COMPETENCY";
})(FulfillmentMode || (exports.FulfillmentMode = FulfillmentMode = {}));
/**
 * Approval workflow stages
 */
var ApprovalStage;
(function (ApprovalStage) {
    ApprovalStage["DEPARTMENT"] = "DEPARTMENT";
    ApprovalStage["COLLEGE"] = "COLLEGE";
    ApprovalStage["CURRICULUM_COMMITTEE"] = "CURRICULUM_COMMITTEE";
    ApprovalStage["ACADEMIC_SENATE"] = "ACADEMIC_SENATE";
    ApprovalStage["PROVOST"] = "PROVOST";
    ApprovalStage["BOARD"] = "BOARD";
})(ApprovalStage || (exports.ApprovalStage = ApprovalStage = {}));
/**
 * Approval decision
 */
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["PENDING"] = "PENDING";
    ApprovalDecision["APPROVED"] = "APPROVED";
    ApprovalDecision["REJECTED"] = "REJECTED";
    ApprovalDecision["RETURNED"] = "RETURNED";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
/**
 * Articulation agreement types
 */
var ArticulationAgreementType;
(function (ArticulationAgreementType) {
    ArticulationAgreementType["COURSE_TO_COURSE"] = "COURSE_TO_COURSE";
    ArticulationAgreementType["PROGRAM_TO_PROGRAM"] = "PROGRAM_TO_PROGRAM";
    ArticulationAgreementType["GENERAL_TRANSFER"] = "GENERAL_TRANSFER";
    ArticulationAgreementType["GUARANTEED_ADMISSION"] = "GUARANTEED_ADMISSION";
})(ArticulationAgreementType || (exports.ArticulationAgreementType = ArticulationAgreementType = {}));
// ============================================================================
// SECTION 1: SEQUELIZE MODELS (Functions 1-8)
// ============================================================================
/**
 * 1. Creates the Program Sequelize model with comprehensive attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Program model
 *
 * @example
 * const Program = createProgramModel(sequelize);
 * const program = await Program.create({
 *   code: 'CS-BS',
 *   title: 'Bachelor of Science in Computer Science',
 *   degreeLevel: DegreeLevel.BACHELOR,
 *   departmentId: 'dept-123',
 *   totalCreditsRequired: 120,
 *   status: ProgramStatus.ACTIVE
 * });
 */
function createProgramModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique program code',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Official program title',
        },
        degreeLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DegreeLevel)),
            allowNull: false,
            comment: 'Degree level offered',
        },
        departmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Owning department',
        },
        collegeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Owning college/school',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Program description',
        },
        deliveryMode: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DeliveryMode)),
            allowNull: false,
            defaultValue: DeliveryMode.ON_CAMPUS,
            comment: 'Program delivery mode',
        },
        totalCreditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 300,
            },
            comment: 'Total credits required for degree',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ProgramStatus)),
            allowNull: false,
            defaultValue: ProgramStatus.DRAFT,
            comment: 'Current program status',
        },
        cipCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'CIP (Classification of Instructional Programs) code',
        },
        accreditation: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Accreditation information',
        },
        admissionRequirements: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Program admission requirements',
        },
        learningOutcomes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Program learning outcomes',
        },
        careerPathways: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Career pathways for graduates',
        },
        tuitionInfo: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Tuition and fee information',
        },
        catalogYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Catalog year (e.g., 2025-2026)',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When program becomes effective',
        },
        discontinuedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When program was discontinued',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional program metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Program',
        tableName: 'programs',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['code'],
                unique: true,
                where: { deletedAt: null },
            },
            {
                fields: ['degreeLevel'],
            },
            {
                fields: ['departmentId'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['catalogYear'],
            },
            {
                fields: ['effectiveDate'],
            },
            {
                name: 'programs_title_search',
                using: 'GIN',
                fields: [sequelize.fn('to_tsvector', 'english', sequelize.col('title'))],
            },
        ],
    };
    return sequelize.define('Program', attributes, options);
}
/**
 * 2. Creates the Curriculum Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Curriculum model
 *
 * @example
 * const Curriculum = createCurriculumModel(sequelize);
 * const curriculum = await Curriculum.create({
 *   programId: 'program-123',
 *   versionNumber: '1.0',
 *   isActive: true,
 *   effectiveDate: new Date('2025-09-01'),
 *   totalCreditsRequired: 120,
 *   minGPA: 2.0
 * });
 */
function createCurriculumModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to program',
        },
        versionNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Curriculum version number',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is the active curriculum',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When curriculum becomes effective',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When curriculum expires',
        },
        totalCreditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
            comment: 'Total credits required',
        },
        minGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 2.0,
            validate: {
                min: 0.0,
                max: 4.0,
            },
            comment: 'Minimum GPA requirement',
        },
        maxTimeToComplete: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum years to complete (if applicable)',
        },
        residencyRequirement: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Minimum credits required in residency',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional curriculum metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Curriculum',
        tableName: 'curricula',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['programId'],
            },
            {
                fields: ['programId', 'versionNumber'],
                unique: true,
                where: { deletedAt: null },
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['effectiveDate'],
            },
            {
                fields: ['programId', 'isActive'],
                unique: true,
                where: { deletedAt: null, isActive: true },
            },
        ],
    };
    return sequelize.define('Curriculum', attributes, options);
}
/**
 * 3. Creates the Concentration Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Concentration model
 *
 * @example
 * const Concentration = createConcentrationModel(sequelize);
 * const concentration = await Concentration.create({
 *   programId: 'program-123',
 *   code: 'AI',
 *   title: 'Artificial Intelligence',
 *   creditsRequired: 18,
 *   isActive: true
 * });
 */
function createConcentrationModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to parent program',
        },
        code: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Concentration code',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Concentration title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Concentration description',
        },
        creditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
            comment: 'Credits required for concentration',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether concentration is active',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When concentration becomes effective',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When concentration expires',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional concentration metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Concentration',
        tableName: 'concentrations',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['programId'],
            },
            {
                fields: ['programId', 'code'],
                unique: true,
                where: { deletedAt: null },
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['effectiveDate'],
            },
        ],
    };
    return sequelize.define('Concentration', attributes, options);
}
/**
 * 4. Creates the CurriculumRevision Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} CurriculumRevision model
 *
 * @example
 * const CurriculumRevision = createCurriculumRevisionModel(sequelize);
 * const revision = await CurriculumRevision.create({
 *   curriculumId: 'curriculum-123',
 *   versionNumber: '2.0',
 *   status: RevisionStatus.DRAFT,
 *   changes: ['Updated core requirements'],
 *   rationale: 'Industry demands have changed',
 *   proposedBy: 'user-456'
 * });
 */
function createCurriculumRevisionModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        curriculumId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to curriculum',
        },
        versionNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'New version number',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RevisionStatus)),
            allowNull: false,
            defaultValue: RevisionStatus.DRAFT,
            comment: 'Revision status',
        },
        changes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'List of changes in this revision',
        },
        rationale: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Rationale for revision',
        },
        proposedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who proposed the revision',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When revision becomes effective if approved',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When revision was approved',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who approved the revision',
        },
        rejectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When revision was rejected',
        },
        rejectedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who rejected the revision',
        },
        rejectionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for rejection',
        },
        implementedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When revision was implemented',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional revision metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'CurriculumRevision',
        tableName: 'curriculum_revisions',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['curriculumId'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['proposedBy'],
            },
            {
                fields: ['effectiveDate'],
            },
            {
                fields: ['createdAt'],
            },
        ],
    };
    return sequelize.define('CurriculumRevision', attributes, options);
}
/**
 * 5. Creates the Requirement Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Requirement model
 *
 * @example
 * const Requirement = createRequirementModel(sequelize);
 * const requirement = await Requirement.create({
 *   curriculumId: 'curriculum-123',
 *   requirementType: RequirementType.CORE,
 *   fulfillmentMode: FulfillmentMode.SPECIFIC_COURSES,
 *   title: 'Core Computer Science Courses',
 *   creditsRequired: 24,
 *   isRequired: true
 * });
 */
function createRequirementModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        curriculumId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to curriculum',
        },
        requirementType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RequirementType)),
            allowNull: false,
            comment: 'Type of requirement',
        },
        fulfillmentMode: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FulfillmentMode)),
            allowNull: false,
            comment: 'How requirement is fulfilled',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Requirement title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed requirement description',
        },
        creditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
            },
            comment: 'Credits required (if applicable)',
        },
        minGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: {
                min: 0.0,
                max: 4.0,
            },
            comment: 'Minimum GPA for this requirement',
        },
        courseIds: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Specific course IDs (if applicable)',
        },
        courseGroups: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Course groups for selection',
        },
        prerequisites: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Prerequisite requirements',
        },
        corequisites: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Corequisite requirements',
        },
        isRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether this requirement is mandatory',
        },
        displayOrder: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order in curriculum',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional requirement metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'Requirement',
        tableName: 'requirements',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['curriculumId'],
            },
            {
                fields: ['requirementType'],
            },
            {
                fields: ['isRequired'],
            },
            {
                fields: ['displayOrder'],
            },
            {
                name: 'requirements_course_ids_gin',
                using: 'GIN',
                fields: ['courseIds'],
            },
        ],
    };
    return sequelize.define('Requirement', attributes, options);
}
/**
 * 6. Creates the ApprovalWorkflow Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ApprovalWorkflow model
 *
 * @example
 * const ApprovalWorkflow = createApprovalWorkflowModel(sequelize);
 * const approval = await ApprovalWorkflow.create({
 *   resourceType: 'program',
 *   resourceId: 'program-123',
 *   stage: ApprovalStage.DEPARTMENT,
 *   decision: ApprovalDecision.PENDING
 * });
 */
function createApprovalWorkflowModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        resourceType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Type of resource being approved (program, curriculum, etc.)',
        },
        resourceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'ID of resource being approved',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ApprovalStage)),
            allowNull: false,
            comment: 'Current approval stage',
        },
        decision: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ApprovalDecision)),
            allowNull: false,
            defaultValue: ApprovalDecision.PENDING,
            comment: 'Approval decision',
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who reviewed at this stage',
        },
        reviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When review was completed',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reviewer comments',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Supporting documents',
        },
        nextStage: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ApprovalStage)),
            allowNull: true,
            comment: 'Next stage in workflow',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional workflow metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'ApprovalWorkflow',
        tableName: 'approval_workflows',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['resourceType', 'resourceId'],
            },
            {
                fields: ['stage'],
            },
            {
                fields: ['decision'],
            },
            {
                fields: ['reviewedBy'],
            },
            {
                fields: ['createdAt'],
            },
        ],
    };
    return sequelize.define('ApprovalWorkflow', attributes, options);
}
/**
 * 7. Creates the ProgramCatalog Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ProgramCatalog model
 *
 * @example
 * const ProgramCatalog = createProgramCatalogModel(sequelize);
 * const catalog = await ProgramCatalog.create({
 *   programId: 'program-123',
 *   academicYear: '2025-2026',
 *   catalogDescription: 'Comprehensive CS program...',
 *   isPublished: true
 * });
 */
function createProgramCatalogModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to program',
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Academic year for catalog',
        },
        catalogDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Public-facing program description',
        },
        featuredImage: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to featured image',
        },
        brochureUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to program brochure',
        },
        applicationDeadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Application deadline',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Program start date',
        },
        isPublished: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether catalog entry is published',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When catalog was published',
        },
        viewCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times viewed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional catalog metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'ProgramCatalog',
        tableName: 'program_catalogs',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['programId'],
            },
            {
                fields: ['academicYear'],
            },
            {
                fields: ['isPublished'],
            },
            {
                fields: ['programId', 'academicYear'],
                unique: true,
                where: { deletedAt: null },
            },
            {
                fields: ['viewCount'],
            },
        ],
    };
    return sequelize.define('ProgramCatalog', attributes, options);
}
/**
 * 8. Creates the ArticulationAgreement Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} ArticulationAgreement model
 *
 * @example
 * const ArticulationAgreement = createArticulationAgreementModel(sequelize);
 * const agreement = await ArticulationAgreement.create({
 *   agreementType: ArticulationAgreementType.PROGRAM_TO_PROGRAM,
 *   sourceInstitutionId: 'inst-123',
 *   targetProgramId: 'program-456',
 *   title: '2+2 Transfer Agreement',
 *   effectiveDate: new Date(),
 *   isActive: true
 * });
 */
function createArticulationAgreementModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        agreementType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ArticulationAgreementType)),
            allowNull: false,
            comment: 'Type of articulation agreement',
        },
        sourceInstitutionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Source (sending) institution',
        },
        targetProgramId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Target program at receiving institution',
        },
        sourceProgramId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Source program at sending institution',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Agreement title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Agreement description',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When agreement becomes effective',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When agreement expires',
        },
        courseMapping: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Course-to-course mapping',
        },
        creditTransferRules: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Credit transfer rules and policies',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether agreement is active',
        },
        signedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who signed the agreement',
        },
        signedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When agreement was signed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional agreement metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        sequelize,
        modelName: 'ArticulationAgreement',
        tableName: 'articulation_agreements',
        paranoid: true,
        timestamps: true,
        indexes: [
            {
                fields: ['agreementType'],
            },
            {
                fields: ['sourceInstitutionId'],
            },
            {
                fields: ['targetProgramId'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['effectiveDate'],
            },
            {
                fields: ['expirationDate'],
            },
        ],
    };
    return sequelize.define('ArticulationAgreement', attributes, options);
}
// ============================================================================
// SECTION 2: REPOSITORY PATTERN (Functions 9-15)
// ============================================================================
/**
 * 9. Creates a ProgramRepository service for data access layer.
 *
 * @returns {Injectable} ProgramRepository service
 */
let ProgramRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProgramRepository = _classThis = class {
        constructor(programModel) {
            this.programModel = programModel;
            this.logger = new common_1.Logger(ProgramRepository.name);
        }
        async findById(id) {
            return this.programModel.findByPk(id);
        }
        async findByCode(code) {
            return this.programModel.findOne({
                where: { code, deletedAt: null },
            });
        }
        async search(criteria) {
            const where = { deletedAt: null };
            if (criteria.degreeLevel) {
                where.degreeLevel = criteria.degreeLevel;
            }
            if (criteria.departmentId) {
                where.departmentId = criteria.departmentId;
            }
            if (criteria.status) {
                where.status = criteria.status;
            }
            if (criteria.deliveryMode) {
                where.deliveryMode = criteria.deliveryMode;
            }
            if (criteria.searchText) {
                where[sequelize_1.Op.or] = [
                    { title: { [sequelize_1.Op.iLike]: `%${criteria.searchText}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${criteria.searchText}%` } },
                    { code: { [sequelize_1.Op.iLike]: `%${criteria.searchText}%` } },
                ];
            }
            return this.programModel.findAll({
                where,
                order: [['title', 'ASC']],
            });
        }
        async create(data) {
            return this.programModel.create(data);
        }
        async update(id, data) {
            const program = await this.findById(id);
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID ${id} not found`);
            }
            return program.update(data);
        }
        async delete(id) {
            const program = await this.findById(id);
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID ${id} not found`);
            }
            await program.destroy();
        }
    };
    __setFunctionName(_classThis, "ProgramRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgramRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgramRepository = _classThis;
})();
exports.ProgramRepository = ProgramRepository;
/**
 * 10. Creates a CurriculumRepository service.
 *
 * @returns {Injectable} CurriculumRepository service
 */
let CurriculumRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CurriculumRepository = _classThis = class {
        constructor(curriculumModel) {
            this.curriculumModel = curriculumModel;
            this.logger = new common_1.Logger(CurriculumRepository.name);
        }
        async findById(id) {
            return this.curriculumModel.findByPk(id);
        }
        async findByProgram(programId) {
            return this.curriculumModel.findAll({
                where: { programId, deletedAt: null },
                order: [['effectiveDate', 'DESC']],
            });
        }
        async findActiveCurriculum(programId) {
            return this.curriculumModel.findOne({
                where: {
                    programId,
                    isActive: true,
                    deletedAt: null,
                },
            });
        }
        async create(data) {
            return this.curriculumModel.create(data);
        }
        async update(id, data) {
            const curriculum = await this.findById(id);
            if (!curriculum) {
                throw new common_1.NotFoundException(`Curriculum with ID ${id} not found`);
            }
            return curriculum.update(data);
        }
        async setActive(curriculumId, programId) {
            // Deactivate all other curricula for this program
            await this.curriculumModel.update({ isActive: false }, {
                where: {
                    programId,
                    id: { [sequelize_1.Op.ne]: curriculumId },
                },
            });
            // Activate the specified curriculum
            const curriculum = await this.findById(curriculumId);
            if (!curriculum) {
                throw new common_1.NotFoundException(`Curriculum with ID ${curriculumId} not found`);
            }
            return curriculum.update({ isActive: true });
        }
    };
    __setFunctionName(_classThis, "CurriculumRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CurriculumRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CurriculumRepository = _classThis;
})();
exports.CurriculumRepository = CurriculumRepository;
/**
 * 11. Creates a RequirementRepository service.
 *
 * @returns {Injectable} RequirementRepository service
 */
let RequirementRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequirementRepository = _classThis = class {
        constructor(requirementModel) {
            this.requirementModel = requirementModel;
            this.logger = new common_1.Logger(RequirementRepository.name);
        }
        async findById(id) {
            return this.requirementModel.findByPk(id);
        }
        async findByCurriculum(curriculumId) {
            return this.requirementModel.findAll({
                where: { curriculumId, deletedAt: null },
                order: [['displayOrder', 'ASC']],
            });
        }
        async findByType(curriculumId, type) {
            return this.requirementModel.findAll({
                where: {
                    curriculumId,
                    requirementType: type,
                    deletedAt: null,
                },
                order: [['displayOrder', 'ASC']],
            });
        }
        async create(data) {
            return this.requirementModel.create(data);
        }
        async update(id, data) {
            const requirement = await this.findById(id);
            if (!requirement) {
                throw new common_1.NotFoundException(`Requirement with ID ${id} not found`);
            }
            return requirement.update(data);
        }
        async delete(id) {
            const requirement = await this.findById(id);
            if (!requirement) {
                throw new common_1.NotFoundException(`Requirement with ID ${id} not found`);
            }
            await requirement.destroy();
        }
        async reorder(curriculumId, requirementIds) {
            // Update display order for each requirement
            for (let i = 0; i < requirementIds.length; i++) {
                await this.requirementModel.update({ displayOrder: i }, {
                    where: {
                        id: requirementIds[i],
                        curriculumId,
                    },
                });
            }
        }
    };
    __setFunctionName(_classThis, "RequirementRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RequirementRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RequirementRepository = _classThis;
})();
exports.RequirementRepository = RequirementRepository;
/**
 * 12. Creates a CurriculumRevisionRepository service.
 *
 * @returns {Injectable} CurriculumRevisionRepository service
 */
let CurriculumRevisionRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CurriculumRevisionRepository = _classThis = class {
        constructor(revisionModel) {
            this.revisionModel = revisionModel;
            this.logger = new common_1.Logger(CurriculumRevisionRepository.name);
        }
        async findById(id) {
            return this.revisionModel.findByPk(id);
        }
        async findByCurriculum(curriculumId) {
            return this.revisionModel.findAll({
                where: { curriculumId, deletedAt: null },
                order: [['createdAt', 'DESC']],
            });
        }
        async findPendingRevisions() {
            return this.revisionModel.findAll({
                where: {
                    status: {
                        [sequelize_1.Op.in]: [RevisionStatus.DRAFT, RevisionStatus.UNDER_REVIEW],
                    },
                    deletedAt: null,
                },
                order: [['createdAt', 'ASC']],
            });
        }
        async create(data) {
            return this.revisionModel.create(data);
        }
        async update(id, data) {
            const revision = await this.findById(id);
            if (!revision) {
                throw new common_1.NotFoundException(`Curriculum revision with ID ${id} not found`);
            }
            return revision.update(data);
        }
        async approve(id, approvedBy) {
            return this.update(id, {
                status: RevisionStatus.APPROVED,
                approvedAt: new Date(),
                approvedBy,
            });
        }
        async reject(id, rejectedBy, reason) {
            return this.update(id, {
                status: RevisionStatus.REJECTED,
                rejectedAt: new Date(),
                rejectedBy,
                rejectionReason: reason,
            });
        }
        async implement(id) {
            return this.update(id, {
                status: RevisionStatus.IMPLEMENTED,
                implementedAt: new Date(),
            });
        }
    };
    __setFunctionName(_classThis, "CurriculumRevisionRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CurriculumRevisionRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CurriculumRevisionRepository = _classThis;
})();
exports.CurriculumRevisionRepository = CurriculumRevisionRepository;
/**
 * 13. Creates an ApprovalWorkflowRepository service.
 *
 * @returns {Injectable} ApprovalWorkflowRepository service
 */
let ApprovalWorkflowRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApprovalWorkflowRepository = _classThis = class {
        constructor(workflowModel) {
            this.workflowModel = workflowModel;
            this.logger = new common_1.Logger(ApprovalWorkflowRepository.name);
        }
        async findById(id) {
            return this.workflowModel.findByPk(id);
        }
        async findByResource(resourceType, resourceId) {
            return this.workflowModel.findAll({
                where: {
                    resourceType,
                    resourceId,
                    deletedAt: null,
                },
                order: [['createdAt', 'ASC']],
            });
        }
        async findPendingApprovals(stage) {
            return this.workflowModel.findAll({
                where: {
                    stage,
                    decision: ApprovalDecision.PENDING,
                    deletedAt: null,
                },
                order: [['createdAt', 'ASC']],
            });
        }
        async create(data) {
            return this.workflowModel.create(data);
        }
        async update(id, data) {
            const workflow = await this.findById(id);
            if (!workflow) {
                throw new common_1.NotFoundException(`Approval workflow with ID ${id} not found`);
            }
            return workflow.update(data);
        }
        async approve(id, reviewedBy, comments) {
            return this.update(id, {
                decision: ApprovalDecision.APPROVED,
                reviewedBy,
                reviewedAt: new Date(),
                comments,
            });
        }
        async reject(id, reviewedBy, comments) {
            return this.update(id, {
                decision: ApprovalDecision.REJECTED,
                reviewedBy,
                reviewedAt: new Date(),
                comments,
            });
        }
    };
    __setFunctionName(_classThis, "ApprovalWorkflowRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalWorkflowRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalWorkflowRepository = _classThis;
})();
exports.ApprovalWorkflowRepository = ApprovalWorkflowRepository;
/**
 * 14. Creates a ProgramCatalogRepository service.
 *
 * @returns {Injectable} ProgramCatalogRepository service
 */
let ProgramCatalogRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProgramCatalogRepository = _classThis = class {
        constructor(catalogModel) {
            this.catalogModel = catalogModel;
            this.logger = new common_1.Logger(ProgramCatalogRepository.name);
        }
        async findById(id) {
            return this.catalogModel.findByPk(id);
        }
        async findByProgram(programId, academicYear) {
            const where = { programId, deletedAt: null };
            if (academicYear) {
                where.academicYear = academicYear;
            }
            return this.catalogModel.findOne({ where });
        }
        async findPublished(academicYear) {
            return this.catalogModel.findAll({
                where: {
                    academicYear,
                    isPublished: true,
                    deletedAt: null,
                },
                order: [['viewCount', 'DESC']],
            });
        }
        async create(data) {
            return this.catalogModel.create(data);
        }
        async update(id, data) {
            const catalog = await this.findById(id);
            if (!catalog) {
                throw new common_1.NotFoundException(`Program catalog with ID ${id} not found`);
            }
            return catalog.update(data);
        }
        async publish(id) {
            return this.update(id, {
                isPublished: true,
                publishedAt: new Date(),
            });
        }
        async incrementViewCount(id) {
            const catalog = await this.findById(id);
            if (catalog) {
                await catalog.increment('viewCount');
            }
        }
    };
    __setFunctionName(_classThis, "ProgramCatalogRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgramCatalogRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgramCatalogRepository = _classThis;
})();
exports.ProgramCatalogRepository = ProgramCatalogRepository;
/**
 * 15. Creates an ArticulationAgreementRepository service.
 *
 * @returns {Injectable} ArticulationAgreementRepository service
 */
let ArticulationAgreementRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ArticulationAgreementRepository = _classThis = class {
        constructor(agreementModel) {
            this.agreementModel = agreementModel;
            this.logger = new common_1.Logger(ArticulationAgreementRepository.name);
        }
        async findById(id) {
            return this.agreementModel.findByPk(id);
        }
        async findByInstitution(institutionId) {
            return this.agreementModel.findAll({
                where: {
                    sourceInstitutionId: institutionId,
                    isActive: true,
                    deletedAt: null,
                },
                order: [['effectiveDate', 'DESC']],
            });
        }
        async findByProgram(programId) {
            return this.agreementModel.findAll({
                where: {
                    targetProgramId: programId,
                    isActive: true,
                    deletedAt: null,
                },
                order: [['effectiveDate', 'DESC']],
            });
        }
        async create(data) {
            return this.agreementModel.create(data);
        }
        async update(id, data) {
            const agreement = await this.findById(id);
            if (!agreement) {
                throw new common_1.NotFoundException(`Articulation agreement with ID ${id} not found`);
            }
            return agreement.update(data);
        }
        async deactivate(id) {
            return this.update(id, { isActive: false });
        }
    };
    __setFunctionName(_classThis, "ArticulationAgreementRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArticulationAgreementRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArticulationAgreementRepository = _classThis;
})();
exports.ArticulationAgreementRepository = ArticulationAgreementRepository;
// ============================================================================
// SECTION 3: CORE CURRICULUM SERVICES (Functions 16-22)
// ============================================================================
/**
 * 16. Creates a ProgramService with comprehensive business logic.
 *
 * @returns {Injectable} ProgramService
 */
let ProgramService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProgramService = _classThis = class {
        constructor(programRepository, workflowRepository) {
            this.programRepository = programRepository;
            this.workflowRepository = workflowRepository;
            this.logger = new common_1.Logger(ProgramService.name);
        }
        async createProgram(options) {
            this.logger.log(`Creating program: ${options.code}`);
            // Check for duplicate code
            const existing = await this.programRepository.findByCode(options.code);
            if (existing) {
                throw new common_1.ConflictException(`Program with code ${options.code} already exists`);
            }
            // Create program in draft status
            const program = await this.programRepository.create({
                ...options,
                status: ProgramStatus.DRAFT,
            });
            this.logger.log(`Program ${program.get('id')} created successfully`);
            return program;
        }
        async updateProgram(programId, updates) {
            const program = await this.programRepository.findById(programId);
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID ${programId} not found`);
            }
            // Prevent status changes through this method
            if (updates.status) {
                throw new common_1.BadRequestException('Use dedicated status change methods');
            }
            return this.programRepository.update(programId, updates);
        }
        async submitForApproval(programId) {
            await this.programRepository.update(programId, {
                status: ProgramStatus.PENDING_APPROVAL,
            });
            // Initiate approval workflow
            await this.workflowRepository.create({
                resourceType: 'program',
                resourceId: programId,
                stage: ApprovalStage.DEPARTMENT,
                decision: ApprovalDecision.PENDING,
            });
            this.logger.log(`Program ${programId} submitted for approval`);
        }
        async approveProgram(programId) {
            return this.programRepository.update(programId, {
                status: ProgramStatus.APPROVED,
            });
        }
        async activateProgram(programId) {
            return this.programRepository.update(programId, {
                status: ProgramStatus.ACTIVE,
            });
        }
        async suspendProgram(programId, reason) {
            const program = await this.programRepository.update(programId, {
                status: ProgramStatus.SUSPENDED,
            });
            this.logger.warn(`Program ${programId} suspended: ${reason}`);
            return program;
        }
        async discontinueProgram(programId) {
            return this.programRepository.update(programId, {
                status: ProgramStatus.DISCONTINUED,
                discontinuedDate: new Date(),
            });
        }
        async searchPrograms(criteria) {
            return this.programRepository.search(criteria);
        }
    };
    __setFunctionName(_classThis, "ProgramService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgramService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgramService = _classThis;
})();
exports.ProgramService = ProgramService;
/**
 * 17. Creates a CurriculumService for curriculum management.
 *
 * @returns {Injectable} CurriculumService
 */
let CurriculumService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CurriculumService = _classThis = class {
        constructor(curriculumRepository, programRepository) {
            this.curriculumRepository = curriculumRepository;
            this.programRepository = programRepository;
            this.logger = new common_1.Logger(CurriculumService.name);
        }
        async createCurriculum(options) {
            // Verify program exists
            const program = await this.programRepository.findById(options.programId);
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID ${options.programId} not found`);
            }
            // Create curriculum
            const curriculum = await this.curriculumRepository.create({
                ...options,
                isActive: false, // Start as inactive
            });
            this.logger.log(`Curriculum ${curriculum.get('id')} created for program ${options.programId}`);
            return curriculum;
        }
        async activateCurriculum(curriculumId) {
            const curriculum = await this.curriculumRepository.findById(curriculumId);
            if (!curriculum) {
                throw new common_1.NotFoundException(`Curriculum with ID ${curriculumId} not found`);
            }
            const programId = curriculum.get('programId');
            return this.curriculumRepository.setActive(curriculumId, programId);
        }
        async getActiveCurriculum(programId) {
            const curriculum = await this.curriculumRepository.findActiveCurriculum(programId);
            if (!curriculum) {
                throw new common_1.NotFoundException(`No active curriculum found for program ${programId}`);
            }
            return curriculum;
        }
        async getCurriculumHistory(programId) {
            return this.curriculumRepository.findByProgram(programId);
        }
        async updateCurriculum(curriculumId, updates) {
            return this.curriculumRepository.update(curriculumId, updates);
        }
        async expireCurriculum(curriculumId, expirationDate) {
            return this.curriculumRepository.update(curriculumId, {
                expirationDate,
                isActive: false,
            });
        }
    };
    __setFunctionName(_classThis, "CurriculumService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CurriculumService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CurriculumService = _classThis;
})();
exports.CurriculumService = CurriculumService;
/**
 * 18. Creates a RequirementService for requirement management.
 *
 * @returns {Injectable} RequirementService
 */
let RequirementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequirementService = _classThis = class {
        constructor(requirementRepository, curriculumRepository) {
            this.requirementRepository = requirementRepository;
            this.curriculumRepository = curriculumRepository;
            this.logger = new common_1.Logger(RequirementService.name);
        }
        async createRequirement(options) {
            // Verify curriculum exists
            const curriculum = await this.curriculumRepository.findById(options.curriculumId);
            if (!curriculum) {
                throw new common_1.NotFoundException(`Curriculum with ID ${options.curriculumId} not found`);
            }
            // Get next display order
            const existingRequirements = await this.requirementRepository.findByCurriculum(options.curriculumId);
            const displayOrder = existingRequirements.length;
            const requirement = await this.requirementRepository.create({
                ...options,
                displayOrder,
            });
            this.logger.log(`Requirement ${requirement.get('id')} created`);
            return requirement;
        }
        async updateRequirement(requirementId, updates) {
            return this.requirementRepository.update(requirementId, updates);
        }
        async deleteRequirement(requirementId) {
            await this.requirementRepository.delete(requirementId);
            this.logger.log(`Requirement ${requirementId} deleted`);
        }
        async getRequirementsByCurriculum(curriculumId) {
            return this.requirementRepository.findByCurriculum(curriculumId);
        }
        async getRequirementsByType(curriculumId, type) {
            return this.requirementRepository.findByType(curriculumId, type);
        }
        async reorderRequirements(curriculumId, requirementIds) {
            await this.requirementRepository.reorder(curriculumId, requirementIds);
            this.logger.log(`Requirements reordered for curriculum ${curriculumId}`);
        }
        async addPrerequisite(requirementId, prerequisite) {
            const requirement = await this.requirementRepository.findById(requirementId);
            if (!requirement) {
                throw new common_1.NotFoundException(`Requirement with ID ${requirementId} not found`);
            }
            const prerequisites = requirement.get('prerequisites') || [];
            prerequisites.push(prerequisite);
            return requirement.update({ prerequisites });
        }
        async addCorequisite(requirementId, corequisite) {
            const requirement = await this.requirementRepository.findById(requirementId);
            if (!requirement) {
                throw new common_1.NotFoundException(`Requirement with ID ${requirementId} not found`);
            }
            const corequisites = requirement.get('corequisites') || [];
            corequisites.push(corequisite);
            return requirement.update({ corequisites });
        }
    };
    __setFunctionName(_classThis, "RequirementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RequirementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RequirementService = _classThis;
})();
exports.RequirementService = RequirementService;
/**
 * 19. Creates a CurriculumRevisionService.
 *
 * @returns {Injectable} CurriculumRevisionService
 */
let CurriculumRevisionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CurriculumRevisionService = _classThis = class {
        constructor(revisionRepository, curriculumRepository) {
            this.revisionRepository = revisionRepository;
            this.curriculumRepository = curriculumRepository;
            this.logger = new common_1.Logger(CurriculumRevisionService.name);
        }
        async createRevision(options) {
            // Verify curriculum exists
            const curriculum = await this.curriculumRepository.findById(options.curriculumId);
            if (!curriculum) {
                throw new common_1.NotFoundException(`Curriculum with ID ${options.curriculumId} not found`);
            }
            const revision = await this.revisionRepository.create({
                ...options,
                status: RevisionStatus.DRAFT,
            });
            this.logger.log(`Curriculum revision ${revision.get('id')} created`);
            return revision;
        }
        async submitForReview(revisionId) {
            return this.revisionRepository.update(revisionId, {
                status: RevisionStatus.UNDER_REVIEW,
            });
        }
        async approveRevision(revisionId, approvedBy) {
            return this.revisionRepository.approve(revisionId, approvedBy);
        }
        async rejectRevision(revisionId, rejectedBy, reason) {
            return this.revisionRepository.reject(revisionId, rejectedBy, reason);
        }
        async implementRevision(revisionId) {
            const revision = await this.revisionRepository.findById(revisionId);
            if (!revision) {
                throw new common_1.NotFoundException(`Revision with ID ${revisionId} not found`);
            }
            if (revision.get('status') !== RevisionStatus.APPROVED) {
                throw new common_1.BadRequestException('Only approved revisions can be implemented');
            }
            // Mark old revisions as superseded
            const curriculumId = revision.get('curriculumId');
            const existingRevisions = await this.revisionRepository.findByCurriculum(curriculumId);
            for (const existing of existingRevisions) {
                if (existing.get('status') === RevisionStatus.IMPLEMENTED &&
                    existing.get('id') !== revisionId) {
                    await existing.update({ status: RevisionStatus.SUPERSEDED });
                }
            }
            return this.revisionRepository.implement(revisionId);
        }
        async getRevisionHistory(curriculumId) {
            return this.revisionRepository.findByCurriculum(curriculumId);
        }
    };
    __setFunctionName(_classThis, "CurriculumRevisionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CurriculumRevisionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CurriculumRevisionService = _classThis;
})();
exports.CurriculumRevisionService = CurriculumRevisionService;
/**
 * 20. Creates an ApprovalWorkflowService.
 *
 * @returns {Injectable} ApprovalWorkflowService
 */
let ApprovalWorkflowService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApprovalWorkflowService = _classThis = class {
        constructor(workflowRepository) {
            this.workflowRepository = workflowRepository;
            this.logger = new common_1.Logger(ApprovalWorkflowService.name);
        }
        async initiateWorkflow(resourceType, resourceId, initialStage = ApprovalStage.DEPARTMENT) {
            const workflow = await this.workflowRepository.create({
                resourceType,
                resourceId,
                stage: initialStage,
                decision: ApprovalDecision.PENDING,
            });
            this.logger.log(`Approval workflow initiated for ${resourceType} ${resourceId}`);
            return workflow;
        }
        async approve(workflowId, reviewedBy, comments) {
            const workflow = await this.workflowRepository.approve(workflowId, reviewedBy, comments);
            // Determine next stage
            const nextStage = this.getNextApprovalStage(workflow.get('stage'));
            if (nextStage) {
                // Create next stage workflow entry
                await this.workflowRepository.create({
                    resourceType: workflow.get('resourceType'),
                    resourceId: workflow.get('resourceId'),
                    stage: nextStage,
                    decision: ApprovalDecision.PENDING,
                });
                await workflow.update({ nextStage });
            }
            return workflow;
        }
        async reject(workflowId, reviewedBy, comments) {
            return this.workflowRepository.reject(workflowId, reviewedBy, comments);
        }
        async getPendingApprovals(stage) {
            return this.workflowRepository.findPendingApprovals(stage);
        }
        async getWorkflowHistory(resourceType, resourceId) {
            return this.workflowRepository.findByResource(resourceType, resourceId);
        }
        getNextApprovalStage(currentStage) {
            const stageOrder = [
                ApprovalStage.DEPARTMENT,
                ApprovalStage.COLLEGE,
                ApprovalStage.CURRICULUM_COMMITTEE,
                ApprovalStage.ACADEMIC_SENATE,
                ApprovalStage.PROVOST,
                ApprovalStage.BOARD,
            ];
            const currentIndex = stageOrder.indexOf(currentStage);
            if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
                return null;
            }
            return stageOrder[currentIndex + 1];
        }
    };
    __setFunctionName(_classThis, "ApprovalWorkflowService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalWorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalWorkflowService = _classThis;
})();
exports.ApprovalWorkflowService = ApprovalWorkflowService;
/**
 * 21. Creates a ProgramCatalogService.
 *
 * @returns {Injectable} ProgramCatalogService
 */
let ProgramCatalogService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProgramCatalogService = _classThis = class {
        constructor(catalogRepository) {
            this.catalogRepository = catalogRepository;
            this.logger = new common_1.Logger(ProgramCatalogService.name);
        }
        async createCatalogEntry(programId, academicYear, catalogDescription) {
            const catalog = await this.catalogRepository.create({
                programId,
                academicYear,
                catalogDescription,
                isPublished: false,
                viewCount: 0,
            });
            this.logger.log(`Catalog entry created for program ${programId}`);
            return catalog;
        }
        async updateCatalogEntry(catalogId, updates) {
            return this.catalogRepository.update(catalogId, updates);
        }
        async publishCatalog(catalogId) {
            return this.catalogRepository.publish(catalogId);
        }
        async getPublishedCatalogs(academicYear) {
            return this.catalogRepository.findPublished(academicYear);
        }
        async incrementViews(catalogId) {
            await this.catalogRepository.incrementViewCount(catalogId);
        }
    };
    __setFunctionName(_classThis, "ProgramCatalogService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgramCatalogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgramCatalogService = _classThis;
})();
exports.ProgramCatalogService = ProgramCatalogService;
/**
 * 22. Creates an ArticulationAgreementService.
 *
 * @returns {Injectable} ArticulationAgreementService
 */
let ArticulationAgreementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ArticulationAgreementService = _classThis = class {
        constructor(agreementRepository) {
            this.agreementRepository = agreementRepository;
            this.logger = new common_1.Logger(ArticulationAgreementService.name);
        }
        async createAgreement(data) {
            const agreement = await this.agreementRepository.create({
                ...data,
                isActive: false, // Start inactive until signed
            });
            this.logger.log(`Articulation agreement ${agreement.get('id')} created`);
            return agreement;
        }
        async signAgreement(agreementId, signedBy) {
            const agreement = await this.agreementRepository.update(agreementId, {
                isActive: true,
                signedBy,
                signedAt: new Date(),
            });
            this.logger.log(`Articulation agreement ${agreementId} signed and activated`);
            return agreement;
        }
        async getAgreementsByInstitution(institutionId) {
            return this.agreementRepository.findByInstitution(institutionId);
        }
        async getAgreementsByProgram(programId) {
            return this.agreementRepository.findByProgram(programId);
        }
        async deactivateAgreement(agreementId) {
            return this.agreementRepository.deactivate(agreementId);
        }
        async addCourseMapping(agreementId, mapping) {
            const agreement = await this.agreementRepository.findById(agreementId);
            if (!agreement) {
                throw new common_1.NotFoundException(`Agreement with ID ${agreementId} not found`);
            }
            const courseMappings = agreement.get('courseMapping') || [];
            courseMappings.push(mapping);
            return agreement.update({ courseMapping: courseMappings });
        }
    };
    __setFunctionName(_classThis, "ArticulationAgreementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArticulationAgreementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArticulationAgreementService = _classThis;
})();
exports.ArticulationAgreementService = ArticulationAgreementService;
// ============================================================================
// SECTION 4: UTILITY FUNCTIONS (Functions 23-30)
// ============================================================================
/**
 * 23. Validates program code format.
 *
 * @param {string} code - Program code
 * @returns {boolean} Whether code is valid
 */
function validateProgramCode(code) {
    // Format: DEPT-LEVEL (e.g., CS-BS, MATH-MS)
    const codePattern = /^[A-Z]{2,10}-[A-Z]{2,10}$/;
    return codePattern.test(code);
}
/**
 * 24. Calculates total credits from requirements.
 *
 * @param {Model[]} requirements - Array of requirements
 * @returns {number} Total credits
 */
function calculateTotalCredits(requirements) {
    return requirements.reduce((total, req) => {
        const credits = req.get('creditsRequired') || 0;
        return total + credits;
    }, 0);
}
/**
 * 25. Validates curriculum version number format.
 *
 * @param {string} versionNumber - Version number
 * @returns {boolean} Whether version is valid
 */
function validateVersionNumber(versionNumber) {
    // Format: X.Y or X.Y.Z
    const versionPattern = /^\d+\.\d+(\.\d+)?$/;
    return versionPattern.test(versionNumber);
}
/**
 * 26. Compares version numbers.
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part < v2Part)
            return -1;
        if (v1Part > v2Part)
            return 1;
    }
    return 0;
}
/**
 * 27. Generates CIP code validation.
 *
 * @param {string} cipCode - CIP code
 * @returns {boolean} Whether CIP code is valid
 */
function validateCIPCode(cipCode) {
    // Format: XX.XXXX or XX.XXXX.XX
    const cipPattern = /^\d{2}\.\d{4}(\.\d{2})?$/;
    return cipPattern.test(cipCode);
}
/**
 * 28. Formats degree level for display.
 *
 * @param {DegreeLevel} level - Degree level
 * @returns {string} Formatted degree level
 */
function formatDegreeLevel(level) {
    const formatMap = {
        [DegreeLevel.CERTIFICATE]: 'Certificate',
        [DegreeLevel.ASSOCIATE]: "Associate's Degree",
        [DegreeLevel.BACHELOR]: "Bachelor's Degree",
        [DegreeLevel.MASTER]: "Master's Degree",
        [DegreeLevel.DOCTORAL]: 'Doctoral Degree',
        [DegreeLevel.POST_DOCTORAL]: 'Post-Doctoral',
    };
    return formatMap[level];
}
/**
 * 29. Checks if curriculum is expired.
 *
 * @param {Model} curriculum - Curriculum model
 * @returns {boolean} Whether curriculum is expired
 */
function isCurriculumExpired(curriculum) {
    const expirationDate = curriculum.get('expirationDate');
    if (!expirationDate)
        return false;
    return new Date() > new Date(expirationDate);
}
/**
 * 30. Generates program catalog year from date.
 *
 * @param {Date} date - Reference date
 * @returns {string} Catalog year (e.g., "2025-2026")
 */
function generateCatalogYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    // Academic year typically starts in August/September
    const startYear = month >= 7 ? year : year - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
}
// ============================================================================
// SECTION 5: VALIDATION AND BUSINESS RULES (Functions 31-37)
// ============================================================================
/**
 * 31. Validates prerequisite chain for circular dependencies.
 *
 * @param {object[]} requirements - All requirements
 * @param {string} requirementId - Requirement to check
 * @param {Set<string>} visited - Visited requirements
 * @returns {boolean} Whether chain is valid (no cycles)
 */
function validatePrerequisiteChain(requirements, requirementId, visited = new Set()) {
    if (visited.has(requirementId)) {
        return false; // Circular dependency detected
    }
    visited.add(requirementId);
    const requirement = requirements.find((r) => r.id === requirementId);
    if (!requirement)
        return true;
    const prerequisites = requirement.prerequisites || [];
    for (const prereq of prerequisites) {
        if (!validatePrerequisiteChain(requirements, prereq.courseId, new Set(visited))) {
            return false;
        }
    }
    return true;
}
/**
 * 32. Validates that total credits match sum of requirements.
 *
 * @param {number} declaredTotal - Declared total credits
 * @param {Model[]} requirements - Requirements
 * @returns {boolean} Whether totals match
 */
function validateCreditTotals(declaredTotal, requirements) {
    const calculatedTotal = calculateTotalCredits(requirements);
    return Math.abs(declaredTotal - calculatedTotal) < 0.01; // Allow for floating point errors
}
/**
 * 33. Validates program admission requirements structure.
 *
 * @param {object} admissionRequirements - Admission requirements object
 * @returns {boolean} Whether structure is valid
 */
function validateAdmissionRequirements(admissionRequirements) {
    if (!admissionRequirements || typeof admissionRequirements !== 'object') {
        return false;
    }
    const requiredFields = ['minGPA', 'requiredTests', 'applicationDocuments'];
    return requiredFields.every(field => field in admissionRequirements);
}
/**
 * 34. Checks if program can be discontinued.
 *
 * @param {Model} program - Program model
 * @param {number} activeStudentCount - Number of active students
 * @returns {object} Validation result
 */
function canDiscontinueProgram(program, activeStudentCount) {
    const status = program.get('status');
    if (status === ProgramStatus.DISCONTINUED) {
        return {
            allowed: false,
            reason: 'Program is already discontinued',
        };
    }
    if (activeStudentCount > 0) {
        return {
            allowed: false,
            reason: `Program has ${activeStudentCount} active students. Suspend instead.`,
        };
    }
    return { allowed: true };
}
/**
 * 35. Validates curriculum effective date.
 *
 * @param {Date} effectiveDate - Proposed effective date
 * @param {Date} programEffectiveDate - Program effective date
 * @returns {boolean} Whether effective date is valid
 */
function validateCurriculumEffectiveDate(effectiveDate, programEffectiveDate) {
    // Curriculum effective date cannot be before program effective date
    return new Date(effectiveDate) >= new Date(programEffectiveDate);
}
/**
 * 36. Generates requirement validation report.
 *
 * @param {Model[]} requirements - Requirements to validate
 * @returns {object} Validation report
 */
function generateRequirementValidationReport(requirements) {
    const issues = [];
    const warnings = [];
    let totalCredits = 0;
    const requirementTypes = new Set();
    for (const req of requirements) {
        const credits = req.get('creditsRequired') || 0;
        totalCredits += credits;
        const type = req.get('requirementType');
        requirementTypes.add(type);
        // Check for missing title
        if (!req.get('title')) {
            issues.push(`Requirement ${req.get('id')} missing title`);
        }
        // Check for zero credits on required requirements
        if (req.get('isRequired') && credits === 0) {
            warnings.push(`Required requirement ${req.get('title')} has zero credits`);
        }
    }
    // Check for missing core requirements
    if (!requirementTypes.has(RequirementType.CORE)) {
        warnings.push('No core requirements defined');
    }
    return {
        isValid: issues.length === 0,
        totalCredits,
        requirementCount: requirements.length,
        requirementTypes: Array.from(requirementTypes),
        issues,
        warnings,
    };
}
/**
 * 37. Validates articulation agreement course mapping.
 *
 * @param {object[]} courseMapping - Course mappings
 * @returns {object} Validation result
 */
function validateArticulationMapping(courseMapping) {
    const errors = [];
    if (!Array.isArray(courseMapping)) {
        errors.push('Course mapping must be an array');
        return { isValid: false, errors };
    }
    for (let i = 0; i < courseMapping.length; i++) {
        const mapping = courseMapping[i];
        if (!mapping.sourceCourseId) {
            errors.push(`Mapping ${i}: missing sourceCourseId`);
        }
        if (!mapping.targetCourseId) {
            errors.push(`Mapping ${i}: missing targetCourseId`);
        }
        if (typeof mapping.credits !== 'number' || mapping.credits <= 0) {
            errors.push(`Mapping ${i}: invalid credits value`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// SECTION 6: REPORTING AND ANALYTICS (Functions 38-42)
// ============================================================================
/**
 * 38. Generates program enrollment summary.
 *
 * @param {string} programId - Program ID
 * @param {object} enrollmentData - Enrollment statistics
 * @returns {object} Enrollment summary
 */
function generateProgramEnrollmentSummary(programId, enrollmentData) {
    return {
        programId,
        ...enrollmentData,
        growthRate: enrollmentData.totalEnrolled > 0
            ? Math.round((enrollmentData.newEnrollments / enrollmentData.totalEnrolled) * 100)
            : 0,
        completionTrend: enrollmentData.graduations > 0 && enrollmentData.totalEnrolled > 0
            ? Math.round((enrollmentData.graduations / enrollmentData.totalEnrolled) * 100)
            : 0,
    };
}
/**
 * 39. Generates curriculum revision history report.
 *
 * @param {Model[]} revisions - Revision history
 * @returns {object} Revision report
 */
function generateRevisionHistoryReport(revisions) {
    const byStatus = revisions.reduce((acc, rev) => {
        const status = rev.get('status');
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const avgReviewTime = calculateAverageReviewTime(revisions);
    return {
        totalRevisions: revisions.length,
        revisionsByStatus: byStatus,
        averageReviewTimeDays: avgReviewTime,
        latestRevision: revisions[0]
            ? {
                id: revisions[0].get('id'),
                version: revisions[0].get('versionNumber'),
                status: revisions[0].get('status'),
            }
            : null,
    };
}
/**
 * 40. Calculates average revision review time in days.
 *
 * @param {Model[]} revisions - Revisions
 * @returns {number} Average review time in days
 */
function calculateAverageReviewTime(revisions) {
    const reviewedRevisions = revisions.filter((r) => r.get('approvedAt') || r.get('rejectedAt'));
    if (reviewedRevisions.length === 0)
        return 0;
    const totalDays = reviewedRevisions.reduce((sum, rev) => {
        const created = new Date(rev.get('createdAt'));
        const reviewed = new Date((rev.get('approvedAt') || rev.get('rejectedAt')));
        const days = (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
    }, 0);
    return Math.round(totalDays / reviewedRevisions.length);
}
/**
 * 41. Generates approval workflow metrics.
 *
 * @param {Model[]} workflows - Workflow records
 * @returns {object} Workflow metrics
 */
function generateApprovalWorkflowMetrics(workflows) {
    const byStage = workflows.reduce((acc, wf) => {
        const stage = wf.get('stage');
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, {});
    const byDecision = workflows.reduce((acc, wf) => {
        const decision = wf.get('decision');
        acc[decision] = (acc[decision] || 0) + 1;
        return acc;
    }, {});
    const pending = workflows.filter((wf) => wf.get('decision') === ApprovalDecision.PENDING).length;
    const approved = workflows.filter((wf) => wf.get('decision') === ApprovalDecision.APPROVED).length;
    const approvalRate = workflows.length > 0 ? Math.round((approved / workflows.length) * 100) : 0;
    return {
        totalWorkflows: workflows.length,
        workflowsByStage: byStage,
        workflowsByDecision: byDecision,
        pendingCount: pending,
        approvalRate,
    };
}
/**
 * 42. Generates program catalog analytics.
 *
 * @param {Model[]} catalogs - Catalog entries
 * @returns {object} Catalog analytics
 */
function generateCatalogAnalytics(catalogs) {
    const published = catalogs.filter((c) => c.get('isPublished')).length;
    const totalViews = catalogs.reduce((sum, c) => {
        return sum + (c.get('viewCount') || 0);
    }, 0);
    const avgViewsPerCatalog = catalogs.length > 0 ? Math.round(totalViews / catalogs.length) : 0;
    const topViewed = catalogs
        .sort((a, b) => b.get('viewCount') - a.get('viewCount'))
        .slice(0, 5)
        .map((c) => ({
        programId: c.get('programId'),
        views: c.get('viewCount'),
    }));
    return {
        totalCatalogs: catalogs.length,
        publishedCount: published,
        publishRate: catalogs.length > 0 ? Math.round((published / catalogs.length) * 100) : 0,
        totalViews,
        avgViewsPerCatalog,
        topViewed,
    };
}
// ============================================================================
// SECTION 7: PROVIDER FACTORIES AND MODULE CONFIGURATION (Functions 43-45)
// ============================================================================
/**
 * 43. Creates provider factories for all curriculum models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider[]} Array of model providers
 */
function createCurriculumModelProviders(sequelize) {
    return [
        {
            provide: 'PROGRAM_MODEL',
            useFactory: () => createProgramModel(sequelize),
        },
        {
            provide: 'CURRICULUM_MODEL',
            useFactory: () => createCurriculumModel(sequelize),
        },
        {
            provide: 'CONCENTRATION_MODEL',
            useFactory: () => createConcentrationModel(sequelize),
        },
        {
            provide: 'CURRICULUM_REVISION_MODEL',
            useFactory: () => createCurriculumRevisionModel(sequelize),
        },
        {
            provide: 'REQUIREMENT_MODEL',
            useFactory: () => createRequirementModel(sequelize),
        },
        {
            provide: 'APPROVAL_WORKFLOW_MODEL',
            useFactory: () => createApprovalWorkflowModel(sequelize),
        },
        {
            provide: 'PROGRAM_CATALOG_MODEL',
            useFactory: () => createProgramCatalogModel(sequelize),
        },
        {
            provide: 'ARTICULATION_AGREEMENT_MODEL',
            useFactory: () => createArticulationAgreementModel(sequelize),
        },
    ];
}
/**
 * 44. Creates curriculum module configuration with all providers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Module configuration
 */
function createCurriculumModuleConfig(sequelize) {
    const modelProviders = createCurriculumModelProviders(sequelize);
    const serviceProviders = [
        ProgramRepository,
        CurriculumRepository,
        RequirementRepository,
        CurriculumRevisionRepository,
        ApprovalWorkflowRepository,
        ProgramCatalogRepository,
        ArticulationAgreementRepository,
        ProgramService,
        CurriculumService,
        RequirementService,
        CurriculumRevisionService,
        ApprovalWorkflowService,
        ProgramCatalogService,
        ArticulationAgreementService,
    ];
    return {
        providers: [...modelProviders, ...serviceProviders],
        exports: serviceProviders,
    };
}
/**
 * 45. Creates a complete curriculum management dynamic module.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Module options
 * @returns {DynamicModule} NestJS dynamic module
 */
function createCurriculumManagementModule(sequelize, options = {}) {
    const config = createCurriculumModuleConfig(sequelize);
    return {
        module: class CurriculumManagementModule {
        },
        global: options.isGlobal ?? false,
        providers: config.providers,
        exports: config.exports,
    };
}
//# sourceMappingURL=curriculum-management-kit.js.map