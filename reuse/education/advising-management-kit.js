"use strict";
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
exports.AuditService = exports.RequestContextService = exports.GraduationPlanningService = exports.AcademicProbationService = exports.EarlyAlertService = exports.AdvisingNoteService = exports.AdvisingSessionService = exports.AdvisingService = exports.GraduationPlanRepository = exports.EarlyAlertRepository = exports.AdvisingNoteRepository = exports.AdvisingSessionRepository = exports.AdviseeRepository = exports.AdvisorRepository = exports.NoteCategory = exports.GraduationPlanStatus = exports.AcademicStanding = exports.AlertSeverity = exports.EarlyAlertType = exports.AdvisingSessionType = exports.AdvisingSessionStatus = exports.AdvisorType = void 0;
exports.createAdvisorModel = createAdvisorModel;
exports.createAdviseeModel = createAdviseeModel;
exports.createAdvisingSessionModel = createAdvisingSessionModel;
exports.createAdvisingNoteModel = createAdvisingNoteModel;
exports.createEarlyAlertModel = createEarlyAlertModel;
exports.createAcademicProbationModel = createAcademicProbationModel;
exports.createGraduationPlanModel = createGraduationPlanModel;
exports.validateAdvisorCapacity = validateAdvisorCapacity;
exports.calculateAdvisorUtilization = calculateAdvisorUtilization;
exports.calculateAlertPriority = calculateAlertPriority;
exports.formatSessionDuration = formatSessionDuration;
exports.isSessionUpcoming = isSessionUpcoming;
exports.sanitizeNoteContent = sanitizeNoteContent;
exports.generateImprovementPlanTemplate = generateImprovementPlanTemplate;
exports.validateFERPAAccess = validateFERPAAccess;
exports.redactSensitiveContent = redactSensitiveContent;
exports.generateFERPAConsent = generateFERPAConsent;
exports.validateDataRetention = validateDataRetention;
exports.encryptConfidentialContent = encryptConfidentialContent;
exports.decryptConfidentialContent = decryptConfidentialContent;
exports.generateAdvisorWorkloadReport = generateAdvisorWorkloadReport;
exports.generateEarlyAlertSummary = generateEarlyAlertSummary;
exports.calculateAverageResolutionTime = calculateAverageResolutionTime;
exports.generateStudentEngagementReport = generateStudentEngagementReport;
exports.identifyInterventionNeeded = identifyInterventionNeeded;
exports.generateGraduationProgressReport = generateGraduationProgressReport;
exports.calculateAdvisorPerformanceMetrics = calculateAdvisorPerformanceMetrics;
exports.createAdvisorModelProvider = createAdvisorModelProvider;
exports.createAdvisingModelProviders = createAdvisingModelProviders;
exports.createAdvisingModuleConfig = createAdvisingModuleConfig;
exports.createAdvisingManagementModule = createAdvisingManagementModule;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Advisor types in the system
 */
var AdvisorType;
(function (AdvisorType) {
    AdvisorType["ACADEMIC"] = "ACADEMIC";
    AdvisorType["FACULTY"] = "FACULTY";
    AdvisorType["CAREER"] = "CAREER";
    AdvisorType["PEER"] = "PEER";
    AdvisorType["ATHLETIC"] = "ATHLETIC";
})(AdvisorType || (exports.AdvisorType = AdvisorType = {}));
/**
 * Advising session status
 */
var AdvisingSessionStatus;
(function (AdvisingSessionStatus) {
    AdvisingSessionStatus["SCHEDULED"] = "SCHEDULED";
    AdvisingSessionStatus["CONFIRMED"] = "CONFIRMED";
    AdvisingSessionStatus["COMPLETED"] = "COMPLETED";
    AdvisingSessionStatus["CANCELLED"] = "CANCELLED";
    AdvisingSessionStatus["NO_SHOW"] = "NO_SHOW";
    AdvisingSessionStatus["RESCHEDULED"] = "RESCHEDULED";
})(AdvisingSessionStatus || (exports.AdvisingSessionStatus = AdvisingSessionStatus = {}));
/**
 * Advising session types
 */
var AdvisingSessionType;
(function (AdvisingSessionType) {
    AdvisingSessionType["INITIAL"] = "INITIAL";
    AdvisingSessionType["REGULAR"] = "REGULAR";
    AdvisingSessionType["ACADEMIC_PLANNING"] = "ACADEMIC_PLANNING";
    AdvisingSessionType["REGISTRATION"] = "REGISTRATION";
    AdvisingSessionType["PROBATION"] = "PROBATION";
    AdvisingSessionType["GRADUATION"] = "GRADUATION";
    AdvisingSessionType["CRISIS"] = "CRISIS";
})(AdvisingSessionType || (exports.AdvisingSessionType = AdvisingSessionType = {}));
/**
 * Early alert types
 */
var EarlyAlertType;
(function (EarlyAlertType) {
    EarlyAlertType["ACADEMIC_PERFORMANCE"] = "ACADEMIC_PERFORMANCE";
    EarlyAlertType["ATTENDANCE"] = "ATTENDANCE";
    EarlyAlertType["ENGAGEMENT"] = "ENGAGEMENT";
    EarlyAlertType["FINANCIAL"] = "FINANCIAL";
    EarlyAlertType["PERSONAL"] = "PERSONAL";
    EarlyAlertType["HEALTH"] = "HEALTH";
})(EarlyAlertType || (exports.EarlyAlertType = EarlyAlertType = {}));
/**
 * Alert severity levels
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Academic standing status
 */
var AcademicStanding;
(function (AcademicStanding) {
    AcademicStanding["GOOD_STANDING"] = "GOOD_STANDING";
    AcademicStanding["ACADEMIC_WARNING"] = "ACADEMIC_WARNING";
    AcademicStanding["ACADEMIC_PROBATION"] = "ACADEMIC_PROBATION";
    AcademicStanding["ACADEMIC_SUSPENSION"] = "ACADEMIC_SUSPENSION";
    AcademicStanding["ACADEMIC_DISMISSAL"] = "ACADEMIC_DISMISSAL";
})(AcademicStanding || (exports.AcademicStanding = AcademicStanding = {}));
/**
 * Graduation plan status
 */
var GraduationPlanStatus;
(function (GraduationPlanStatus) {
    GraduationPlanStatus["DRAFT"] = "DRAFT";
    GraduationPlanStatus["IN_PROGRESS"] = "IN_PROGRESS";
    GraduationPlanStatus["ADVISOR_APPROVED"] = "ADVISOR_APPROVED";
    GraduationPlanStatus["DEPARTMENT_APPROVED"] = "DEPARTMENT_APPROVED";
    GraduationPlanStatus["COMPLETED"] = "COMPLETED";
})(GraduationPlanStatus || (exports.GraduationPlanStatus = GraduationPlanStatus = {}));
/**
 * Note categories
 */
var NoteCategory;
(function (NoteCategory) {
    NoteCategory["ACADEMIC"] = "ACADEMIC";
    NoteCategory["PERSONAL"] = "PERSONAL";
    NoteCategory["CAREER"] = "CAREER";
    NoteCategory["REGISTRATION"] = "REGISTRATION";
    NoteCategory["PROBATION"] = "PROBATION";
    NoteCategory["GRADUATION"] = "GRADUATION";
    NoteCategory["GENERAL"] = "GENERAL";
})(NoteCategory || (exports.NoteCategory = NoteCategory = {}));
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
function createAdvisorModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            comment: 'Reference to user account',
        },
        advisorType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AdvisorType)),
            allowNull: false,
            comment: 'Type of advisor role',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Academic department affiliation',
        },
        maxAdvisees: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 25,
            validate: {
                min: 1,
                max: 100,
            },
            comment: 'Maximum number of assigned advisees',
        },
        specializations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Advisor specialization areas',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether advisor is actively advising',
        },
        availabilitySchedule: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Advisor availability schedule',
        },
        officeLocation: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Physical office location',
        },
        contactEmail: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true,
            },
            comment: 'Primary contact email',
        },
        contactPhone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Primary contact phone',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional advisor metadata',
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
function createAdviseeModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to advisor',
        },
        advisorType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AdvisorType)),
            allowNull: false,
            comment: 'Type of advising relationship',
        },
        isPrimary: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is the primary advisor',
        },
        assignedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When the assignment was made',
        },
        assignedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who made the assignment',
        },
        unassignedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When the assignment was removed',
        },
        unassignedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who removed the assignment',
        },
        unassignedReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for unassignment',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional assignment metadata',
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
function createAdvisingSessionModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        adviseeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to advisee assignment',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to advisor',
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        sessionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AdvisingSessionType)),
            allowNull: false,
            comment: 'Type of advising session',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AdvisingSessionStatus)),
            allowNull: false,
            defaultValue: AdvisingSessionStatus.SCHEDULED,
            comment: 'Current session status',
        },
        scheduledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Scheduled date and time',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            validate: {
                min: 15,
                max: 180,
            },
            comment: 'Duration in minutes',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Physical meeting location',
        },
        meetingLink: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
            comment: 'Virtual meeting link',
        },
        agenda: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Session agenda',
        },
        summary: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Session summary after completion',
        },
        outcomes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Session outcomes',
        },
        actionItems: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Action items from session',
        },
        followUpRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether follow-up is needed',
        },
        followUpDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled follow-up date',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When session was completed',
        },
        cancelledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When session was cancelled',
        },
        cancellationReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for cancellation',
        },
        noShowAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Marked as no-show timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional session metadata',
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
function createAdvisingNoteModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        adviseeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to advisee assignment',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to advisor who created note',
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        sessionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Optional reference to advising session',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(NoteCategory)),
            allowNull: false,
            comment: 'Note category',
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Note subject/title',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Note content',
        },
        isConfidential: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether note is confidential',
        },
        tags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Searchable tags',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'File attachments metadata',
        },
        sharedWith: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'User IDs note is shared with',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional note metadata',
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
function createEarlyAlertModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Assigned advisor for follow-up',
        },
        reportedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who reported the alert',
        },
        alertType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(EarlyAlertType)),
            allowNull: false,
            comment: 'Type of early alert',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AlertSeverity)),
            allowNull: false,
            comment: 'Alert severity level',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed description of concern',
        },
        courseIds: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Related course IDs',
        },
        detectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When alert was detected',
        },
        acknowledgedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When alert was acknowledged',
        },
        acknowledgedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who acknowledged alert',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When alert was resolved',
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who resolved alert',
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Resolution details',
        },
        followUpActions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Follow-up actions taken',
        },
        escalatedTo: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User alert was escalated to',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional alert metadata',
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
function createAcademicProbationModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Assigned advisor for probation support',
        },
        standing: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AcademicStanding)),
            allowNull: false,
            comment: 'Current academic standing',
        },
        termId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Academic term of probation',
        },
        gpa: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            validate: {
                min: 0.0,
                max: 4.0,
            },
            comment: 'GPA at time of probation',
        },
        creditsAttempted: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Total credits attempted',
        },
        creditsEarned: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Total credits earned',
        },
        probationStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When probation period started',
        },
        probationEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When probation period ended',
        },
        requirementsMet: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether probation requirements were met',
        },
        improvementPlan: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Academic improvement plan',
        },
        checkInSchedule: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Scheduled check-in meetings',
        },
        progressNotes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Progress tracking notes',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When probation was resolved',
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Resolution details',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional probation metadata',
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
function createGraduationPlanModel(sequelize) {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to student',
        },
        advisorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Primary advisor for graduation planning',
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to academic program',
        },
        expectedGraduationTerm: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Expected graduation term',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(GraduationPlanStatus)),
            allowNull: false,
            defaultValue: GraduationPlanStatus.DRAFT,
            comment: 'Plan status',
        },
        plannedCourses: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Planned course schedule',
        },
        completedCourses: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Completed courses',
        },
        remainingRequirements: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Remaining degree requirements',
        },
        totalCreditsRequired: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
            comment: 'Total credits required for degree',
        },
        creditsCompleted: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
            comment: 'Credits completed',
        },
        creditsInProgress: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
            comment: 'Credits currently in progress',
        },
        creditsRemaining: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
            comment: 'Credits remaining to complete',
        },
        milestones: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Graduation milestones',
        },
        advisorApprovedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When advisor approved the plan',
        },
        advisorApprovedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Advisor who approved',
        },
        departmentApprovedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When department approved the plan',
        },
        departmentApprovedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Department user who approved',
        },
        lastReviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last review timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional plan metadata',
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
let AdvisorRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisorRepository = _classThis = class {
        constructor(advisorModel) {
            this.advisorModel = advisorModel;
            this.logger = new common_1.Logger(AdvisorRepository.name);
        }
        async findById(id) {
            return this.advisorModel.findByPk(id);
        }
        async findByUserId(userId) {
            return this.advisorModel.findOne({
                where: { userId, deletedAt: null },
            });
        }
        async findActiveAdvisors(criteria = {}) {
            const where = { isActive: true, deletedAt: null };
            if (criteria.advisorType) {
                where.advisorType = criteria.advisorType;
            }
            if (criteria.department) {
                where.department = criteria.department;
            }
            return this.advisorModel.findAll({ where });
        }
        async getAdviseeCount(advisorId) {
            // This would require the Advisee model, simplified for example
            return 0;
        }
        async create(data) {
            return this.advisorModel.create(data);
        }
        async update(id, data) {
            const advisor = await this.findById(id);
            if (!advisor) {
                throw new common_1.NotFoundException(`Advisor with ID ${id} not found`);
            }
            return advisor.update(data);
        }
        async delete(id) {
            const advisor = await this.findById(id);
            if (!advisor) {
                throw new common_1.NotFoundException(`Advisor with ID ${id} not found`);
            }
            await advisor.destroy();
        }
    };
    __setFunctionName(_classThis, "AdvisorRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisorRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisorRepository = _classThis;
})();
exports.AdvisorRepository = AdvisorRepository;
/**
 * 9. Creates an AdviseeRepository service for advisor-student assignments.
 *
 * @param {ModelStatic<Model>} adviseeModel - Advisee model
 * @returns {Injectable} AdviseeRepository service
 */
let AdviseeRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdviseeRepository = _classThis = class {
        constructor(adviseeModel) {
            this.adviseeModel = adviseeModel;
            this.logger = new common_1.Logger(AdviseeRepository.name);
        }
        async findById(id) {
            return this.adviseeModel.findByPk(id);
        }
        async findByStudentId(studentId) {
            return this.adviseeModel.findAll({
                where: {
                    studentId,
                    unassignedAt: null,
                    deletedAt: null,
                },
            });
        }
        async findByAdvisorId(advisorId) {
            return this.adviseeModel.findAll({
                where: {
                    advisorId,
                    unassignedAt: null,
                    deletedAt: null,
                },
            });
        }
        async findPrimaryAdvisor(studentId) {
            return this.adviseeModel.findOne({
                where: {
                    studentId,
                    isPrimary: true,
                    unassignedAt: null,
                    deletedAt: null,
                },
            });
        }
        async create(data) {
            return this.adviseeModel.create(data);
        }
        async unassign(id, unassignedBy, reason) {
            const advisee = await this.findById(id);
            if (!advisee) {
                throw new common_1.NotFoundException(`Advisee assignment with ID ${id} not found`);
            }
            return advisee.update({
                unassignedAt: new Date(),
                unassignedBy,
                unassignedReason: reason,
            });
        }
    };
    __setFunctionName(_classThis, "AdviseeRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdviseeRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdviseeRepository = _classThis;
})();
exports.AdviseeRepository = AdviseeRepository;
/**
 * 10. Creates an AdvisingSessionRepository service.
 *
 * @param {ModelStatic<Model>} sessionModel - AdvisingSession model
 * @returns {Injectable} AdvisingSessionRepository service
 */
let AdvisingSessionRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisingSessionRepository = _classThis = class {
        constructor(sessionModel) {
            this.sessionModel = sessionModel;
            this.logger = new common_1.Logger(AdvisingSessionRepository.name);
        }
        async findById(id) {
            return this.sessionModel.findByPk(id);
        }
        async findByStudent(studentId, options = {}) {
            const where = { studentId, deletedAt: null };
            if (options.status) {
                where.status = options.status;
            }
            if (options.sessionType) {
                where.sessionType = options.sessionType;
            }
            if (options.startDate && options.endDate) {
                where.scheduledAt = {
                    [sequelize_1.Op.between]: [options.startDate, options.endDate],
                };
            }
            return this.sessionModel.findAll({
                where,
                order: [['scheduledAt', 'DESC']],
            });
        }
        async findUpcoming(advisorId, days = 7) {
            const now = new Date();
            const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            return this.sessionModel.findAll({
                where: {
                    advisorId,
                    scheduledAt: {
                        [sequelize_1.Op.between]: [now, futureDate],
                    },
                    status: {
                        [sequelize_1.Op.in]: [AdvisingSessionStatus.SCHEDULED, AdvisingSessionStatus.CONFIRMED],
                    },
                    deletedAt: null,
                },
                order: [['scheduledAt', 'ASC']],
            });
        }
        async create(data) {
            return this.sessionModel.create(data);
        }
        async update(id, data) {
            const session = await this.findById(id);
            if (!session) {
                throw new common_1.NotFoundException(`Advising session with ID ${id} not found`);
            }
            return session.update(data);
        }
        async complete(id, summary, outcomes) {
            return this.update(id, {
                status: AdvisingSessionStatus.COMPLETED,
                summary,
                outcomes,
                completedAt: new Date(),
            });
        }
        async cancel(id, reason) {
            return this.update(id, {
                status: AdvisingSessionStatus.CANCELLED,
                cancellationReason: reason,
                cancelledAt: new Date(),
            });
        }
    };
    __setFunctionName(_classThis, "AdvisingSessionRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisingSessionRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisingSessionRepository = _classThis;
})();
exports.AdvisingSessionRepository = AdvisingSessionRepository;
/**
 * 11. Creates an AdvisingNoteRepository service.
 *
 * @param {ModelStatic<Model>} noteModel - AdvisingNote model
 * @returns {Injectable} AdvisingNoteRepository service
 */
let AdvisingNoteRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisingNoteRepository = _classThis = class {
        constructor(noteModel) {
            this.noteModel = noteModel;
            this.logger = new common_1.Logger(AdvisingNoteRepository.name);
        }
        async findById(id) {
            return this.noteModel.findByPk(id);
        }
        async findByStudent(studentId, criteria = {}) {
            const where = { studentId, deletedAt: null };
            if (criteria.category) {
                where.category = criteria.category;
            }
            if (criteria.isConfidential !== undefined) {
                where.isConfidential = criteria.isConfidential;
            }
            if (criteria.searchText) {
                where[sequelize_1.Op.or] = [
                    { subject: { [sequelize_1.Op.iLike]: `%${criteria.searchText}%` } },
                    { content: { [sequelize_1.Op.iLike]: `%${criteria.searchText}%` } },
                ];
            }
            return this.noteModel.findAll({
                where,
                order: [['createdAt', 'DESC']],
            });
        }
        async create(data) {
            return this.noteModel.create(data);
        }
        async update(id, data) {
            const note = await this.findById(id);
            if (!note) {
                throw new common_1.NotFoundException(`Advising note with ID ${id} not found`);
            }
            return note.update(data);
        }
    };
    __setFunctionName(_classThis, "AdvisingNoteRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisingNoteRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisingNoteRepository = _classThis;
})();
exports.AdvisingNoteRepository = AdvisingNoteRepository;
/**
 * 12. Creates an EarlyAlertRepository service.
 *
 * @param {ModelStatic<Model>} alertModel - EarlyAlert model
 * @returns {Injectable} EarlyAlertRepository service
 */
let EarlyAlertRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EarlyAlertRepository = _classThis = class {
        constructor(alertModel) {
            this.alertModel = alertModel;
            this.logger = new common_1.Logger(EarlyAlertRepository.name);
        }
        async findById(id) {
            return this.alertModel.findByPk(id);
        }
        async findActiveAlerts(studentId) {
            return this.alertModel.findAll({
                where: {
                    studentId,
                    resolvedAt: null,
                    deletedAt: null,
                },
                order: [['severity', 'DESC'], ['detectedAt', 'DESC']],
            });
        }
        async findUnacknowledgedAlerts() {
            return this.alertModel.findAll({
                where: {
                    acknowledgedAt: null,
                    resolvedAt: null,
                    deletedAt: null,
                },
                order: [['severity', 'DESC'], ['detectedAt', 'ASC']],
            });
        }
        async create(data) {
            return this.alertModel.create(data);
        }
        async acknowledge(id, acknowledgedBy) {
            const alert = await this.findById(id);
            if (!alert) {
                throw new common_1.NotFoundException(`Early alert with ID ${id} not found`);
            }
            return alert.update({
                acknowledgedAt: new Date(),
                acknowledgedBy,
            });
        }
        async resolve(id, resolvedBy, resolution) {
            const alert = await this.findById(id);
            if (!alert) {
                throw new common_1.NotFoundException(`Early alert with ID ${id} not found`);
            }
            return alert.update({
                resolvedAt: new Date(),
                resolvedBy,
                resolution,
            });
        }
    };
    __setFunctionName(_classThis, "EarlyAlertRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EarlyAlertRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EarlyAlertRepository = _classThis;
})();
exports.EarlyAlertRepository = EarlyAlertRepository;
/**
 * 13. Creates a GraduationPlanRepository service.
 *
 * @param {ModelStatic<Model>} planModel - GraduationPlan model
 * @returns {Injectable} GraduationPlanRepository service
 */
let GraduationPlanRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GraduationPlanRepository = _classThis = class {
        constructor(planModel) {
            this.planModel = planModel;
            this.logger = new common_1.Logger(GraduationPlanRepository.name);
        }
        async findById(id) {
            return this.planModel.findByPk(id);
        }
        async findByStudent(studentId) {
            return this.planModel.findOne({
                where: { studentId, deletedAt: null },
            });
        }
        async create(data) {
            return this.planModel.create(data);
        }
        async update(id, data) {
            const plan = await this.findById(id);
            if (!plan) {
                throw new common_1.NotFoundException(`Graduation plan with ID ${id} not found`);
            }
            return plan.update(data);
        }
        async advisorApprove(id, approvedBy) {
            return this.update(id, {
                status: GraduationPlanStatus.ADVISOR_APPROVED,
                advisorApprovedAt: new Date(),
                advisorApprovedBy: approvedBy,
            });
        }
        async departmentApprove(id, approvedBy) {
            return this.update(id, {
                status: GraduationPlanStatus.DEPARTMENT_APPROVED,
                departmentApprovedAt: new Date(),
                departmentApprovedBy: approvedBy,
            });
        }
    };
    __setFunctionName(_classThis, "GraduationPlanRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GraduationPlanRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GraduationPlanRepository = _classThis;
})();
exports.GraduationPlanRepository = GraduationPlanRepository;
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
let AdvisingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisingService = _classThis = class {
        constructor(advisorRepository, adviseeRepository, sessionRepository) {
            this.advisorRepository = advisorRepository;
            this.adviseeRepository = adviseeRepository;
            this.sessionRepository = sessionRepository;
            this.logger = new common_1.Logger(AdvisingService.name);
        }
        async assignAdvisorToStudent(options) {
            this.logger.log(`Assigning advisor ${options.advisorId} to student ${options.studentId}`);
            // Verify advisor exists and is active
            const advisor = await this.advisorRepository.findById(options.advisorId);
            if (!advisor) {
                throw new common_1.NotFoundException(`Advisor with ID ${options.advisorId} not found`);
            }
            if (!advisor.get('isActive')) {
                throw new common_1.BadRequestException('Advisor is not active');
            }
            // Check if advisor has reached max advisees
            const currentAdviseeCount = await this.advisorRepository.getAdviseeCount(options.advisorId);
            const maxAdvisees = advisor.get('maxAdvisees');
            if (maxAdvisees && currentAdviseeCount >= maxAdvisees) {
                throw new common_1.ConflictException('Advisor has reached maximum advisee limit');
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
        async unassignAdvisor(adviseeId, unassignedBy, reason) {
            return this.adviseeRepository.unassign(adviseeId, unassignedBy, reason);
        }
        async getStudentAdvisors(studentId) {
            return this.adviseeRepository.findByStudentId(studentId);
        }
        async getAdvisorAdvisees(advisorId) {
            return this.adviseeRepository.findByAdvisorId(advisorId);
        }
        async reassignAdvisor(oldAdviseeId, newAdvisorId, reassignedBy, reason) {
            const oldAdvisee = await this.adviseeRepository.findById(oldAdviseeId);
            if (!oldAdvisee) {
                throw new common_1.NotFoundException(`Advisee assignment with ID ${oldAdviseeId} not found`);
            }
            // Unassign old advisor
            await this.unassignAdvisor(oldAdviseeId, reassignedBy, reason);
            // Assign new advisor
            return this.assignAdvisorToStudent({
                advisorId: newAdvisorId,
                studentId: oldAdvisee.get('studentId'),
                advisorType: oldAdvisee.get('advisorType'),
                isPrimary: oldAdvisee.get('isPrimary'),
                assignedBy: reassignedBy,
            });
        }
    };
    __setFunctionName(_classThis, "AdvisingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisingService = _classThis;
})();
exports.AdvisingService = AdvisingService;
/**
 * 15. Creates an AdvisingSessionService for session management.
 *
 * @returns {Injectable} AdvisingSessionService
 */
let AdvisingSessionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisingSessionService = _classThis = class {
        constructor(sessionRepository, adviseeRepository) {
            this.sessionRepository = sessionRepository;
            this.adviseeRepository = adviseeRepository;
            this.logger = new common_1.Logger(AdvisingSessionService.name);
        }
        async scheduleSession(options) {
            // Verify advisee relationship exists
            const advisees = await this.adviseeRepository.findByStudentId(options.studentId);
            const advisee = advisees.find((a) => a.get('advisorId') === options.advisorId);
            if (!advisee) {
                throw new common_1.BadRequestException('No active advisor-student relationship found');
            }
            // Create session
            const session = await this.sessionRepository.create({
                ...options,
                adviseeId: advisee.get('id'),
                status: AdvisingSessionStatus.SCHEDULED,
                followUpRequired: false,
            });
            this.logger.log(`Scheduled advising session ${session.get('id')}`);
            return session;
        }
        async confirmSession(sessionId) {
            return this.sessionRepository.update(sessionId, {
                status: AdvisingSessionStatus.CONFIRMED,
            });
        }
        async completeSession(sessionId, summary, outcomes, actionItems) {
            const session = await this.sessionRepository.complete(sessionId, summary, outcomes);
            if (actionItems && actionItems.length > 0) {
                await session.update({ actionItems });
            }
            return session;
        }
        async cancelSession(sessionId, reason) {
            return this.sessionRepository.cancel(sessionId, reason);
        }
        async markNoShow(sessionId) {
            return this.sessionRepository.update(sessionId, {
                status: AdvisingSessionStatus.NO_SHOW,
                noShowAt: new Date(),
            });
        }
        async rescheduleSession(sessionId, newScheduledAt, duration) {
            const updateData = {
                status: AdvisingSessionStatus.RESCHEDULED,
                scheduledAt: newScheduledAt,
            };
            if (duration) {
                updateData.duration = duration;
            }
            return this.sessionRepository.update(sessionId, updateData);
        }
        async getUpcomingSessions(advisorId, days = 7) {
            return this.sessionRepository.findUpcoming(advisorId, days);
        }
        async getStudentSessions(studentId, criteria = {}) {
            return this.sessionRepository.findByStudent(studentId, criteria);
        }
    };
    __setFunctionName(_classThis, "AdvisingSessionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisingSessionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisingSessionService = _classThis;
})();
exports.AdvisingSessionService = AdvisingSessionService;
/**
 * 16. Creates an AdvisingNoteService for note management.
 *
 * @returns {Injectable} AdvisingNoteService
 */
let AdvisingNoteService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdvisingNoteService = _classThis = class {
        constructor(noteRepository, adviseeRepository) {
            this.noteRepository = noteRepository;
            this.adviseeRepository = adviseeRepository;
            this.logger = new common_1.Logger(AdvisingNoteService.name);
        }
        async createNote(options) {
            // Verify advisee relationship
            const advisees = await this.adviseeRepository.findByStudentId(options.studentId);
            const advisee = advisees.find((a) => a.get('advisorId') === options.advisorId);
            if (!advisee) {
                throw new common_1.BadRequestException('No active advisor-student relationship found');
            }
            const note = await this.noteRepository.create({
                ...options,
                adviseeId: advisee.get('id'),
                isConfidential: options.isConfidential ?? false,
            });
            this.logger.log(`Created advising note ${note.get('id')}`);
            return note;
        }
        async updateNote(noteId, updates) {
            return this.noteRepository.update(noteId, updates);
        }
        async getNoteById(noteId) {
            const note = await this.noteRepository.findById(noteId);
            if (!note) {
                throw new common_1.NotFoundException(`Advising note with ID ${noteId} not found`);
            }
            return note;
        }
        async searchNotes(studentId, criteria) {
            return this.noteRepository.findByStudent(studentId, criteria);
        }
        async shareNote(noteId, userIds) {
            const note = await this.getNoteById(noteId);
            const currentSharedWith = note.get('sharedWith') || [];
            const updatedSharedWith = [...new Set([...currentSharedWith, ...userIds])];
            return this.noteRepository.update(noteId, {
                sharedWith: updatedSharedWith,
            });
        }
        async deleteNote(noteId) {
            const note = await this.getNoteById(noteId);
            await note.destroy();
        }
    };
    __setFunctionName(_classThis, "AdvisingNoteService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvisingNoteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvisingNoteService = _classThis;
})();
exports.AdvisingNoteService = AdvisingNoteService;
/**
 * 17. Creates an EarlyAlertService for at-risk student intervention.
 *
 * @returns {Injectable} EarlyAlertService
 */
let EarlyAlertService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EarlyAlertService = _classThis = class {
        constructor(alertRepository, adviseeRepository) {
            this.alertRepository = alertRepository;
            this.adviseeRepository = adviseeRepository;
            this.logger = new common_1.Logger(EarlyAlertService.name);
        }
        async createEarlyAlert(options) {
            // Auto-assign to primary advisor if not specified
            let advisorId = options.advisorId;
            if (!advisorId) {
                const primaryAdvisor = await this.adviseeRepository.findPrimaryAdvisor(options.studentId);
                if (primaryAdvisor) {
                    advisorId = primaryAdvisor.get('advisorId');
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
        async acknowledgeAlert(alertId, acknowledgedBy) {
            return this.alertRepository.acknowledge(alertId, acknowledgedBy);
        }
        async resolveAlert(alertId, resolvedBy, resolution) {
            return this.alertRepository.resolve(alertId, resolvedBy, resolution);
        }
        async getActiveAlerts(studentId) {
            return this.alertRepository.findActiveAlerts(studentId);
        }
        async getUnacknowledgedAlerts() {
            return this.alertRepository.findUnacknowledgedAlerts();
        }
        async escalateAlert(alertId, escalatedTo) {
            const alert = await this.alertRepository.findById(alertId);
            if (!alert) {
                throw new common_1.NotFoundException(`Early alert with ID ${alertId} not found`);
            }
            await alert.update({ escalatedTo });
            this.logger.log(`Alert ${alertId} escalated to ${escalatedTo}`);
            return alert;
        }
        async addFollowUpAction(alertId, action) {
            const alert = await this.alertRepository.findById(alertId);
            if (!alert) {
                throw new common_1.NotFoundException(`Early alert with ID ${alertId} not found`);
            }
            const currentActions = alert.get('followUpActions') || [];
            const updatedActions = [...currentActions, { ...action, createdAt: new Date() }];
            return alert.update({ followUpActions: updatedActions });
        }
    };
    __setFunctionName(_classThis, "EarlyAlertService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EarlyAlertService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EarlyAlertService = _classThis;
})();
exports.EarlyAlertService = EarlyAlertService;
/**
 * 18. Creates an AcademicProbationService.
 *
 * @returns {Injectable} AcademicProbationService
 */
let AcademicProbationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AcademicProbationService = _classThis = class {
        constructor(probationModel, adviseeRepository) {
            this.probationModel = probationModel;
            this.adviseeRepository = adviseeRepository;
            this.logger = new common_1.Logger(AcademicProbationService.name);
        }
        async createProbation(options) {
            // Auto-assign to primary advisor if not specified
            let advisorId = options.advisorId;
            if (!advisorId) {
                const primaryAdvisor = await this.adviseeRepository.findPrimaryAdvisor(options.studentId);
                if (primaryAdvisor) {
                    advisorId = primaryAdvisor.get('advisorId');
                }
            }
            const probation = await this.probationModel.create({
                ...options,
                advisorId,
                probationStartDate: new Date(),
                requirementsMet: false,
            });
            this.logger.warn(`Student ${options.studentId} placed on ${options.standing} for term ${options.termId}`);
            return probation;
        }
        async updateImprovementPlan(probationId, plan) {
            const probation = await this.probationModel.findByPk(probationId);
            if (!probation) {
                throw new common_1.NotFoundException(`Academic probation record with ID ${probationId} not found`);
            }
            return probation.update({ improvementPlan: plan });
        }
        async addProgressNote(probationId, note) {
            const probation = await this.probationModel.findByPk(probationId);
            if (!probation) {
                throw new common_1.NotFoundException(`Academic probation record with ID ${probationId} not found`);
            }
            const currentNotes = probation.get('progressNotes') || [];
            const updatedNotes = [...currentNotes, note];
            return probation.update({ progressNotes: updatedNotes });
        }
        async resolveProbation(probationId, requirementsMet, resolution) {
            const probation = await this.probationModel.findByPk(probationId);
            if (!probation) {
                throw new common_1.NotFoundException(`Academic probation record with ID ${probationId} not found`);
            }
            return probation.update({
                requirementsMet,
                resolution,
                resolvedAt: new Date(),
                probationEndDate: new Date(),
            });
        }
    };
    __setFunctionName(_classThis, "AcademicProbationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AcademicProbationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AcademicProbationService = _classThis;
})();
exports.AcademicProbationService = AcademicProbationService;
/**
 * 19. Creates a GraduationPlanningService.
 *
 * @returns {Injectable} GraduationPlanningService
 */
let GraduationPlanningService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GraduationPlanningService = _classThis = class {
        constructor(planRepository) {
            this.planRepository = planRepository;
            this.logger = new common_1.Logger(GraduationPlanningService.name);
        }
        async createGraduationPlan(options) {
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
        async updatePlannedCourses(planId, courses) {
            return this.planRepository.update(planId, {
                plannedCourses: courses,
                lastReviewedAt: new Date(),
            });
        }
        async updateCredits(planId, credits) {
            return this.planRepository.update(planId, {
                creditsCompleted: credits.completed,
                creditsInProgress: credits.inProgress,
                creditsRemaining: credits.remaining,
                lastReviewedAt: new Date(),
            });
        }
        async advisorApprove(planId, approvedBy) {
            return this.planRepository.advisorApprove(planId, approvedBy);
        }
        async departmentApprove(planId, approvedBy) {
            return this.planRepository.departmentApprove(planId, approvedBy);
        }
        async addMilestone(planId, milestone) {
            const plan = await this.planRepository.findById(planId);
            if (!plan) {
                throw new common_1.NotFoundException(`Graduation plan with ID ${planId} not found`);
            }
            const currentMilestones = plan.get('milestones') || [];
            const updatedMilestones = [...currentMilestones, { ...milestone, id: Date.now().toString() }];
            return plan.update({ milestones: updatedMilestones });
        }
    };
    __setFunctionName(_classThis, "GraduationPlanningService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GraduationPlanningService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GraduationPlanningService = _classThis;
})();
exports.GraduationPlanningService = GraduationPlanningService;
/**
 * 20. Creates a RequestContextService for request-scoped user context.
 *
 * @returns {Injectable} RequestContextService with request scope
 */
let RequestContextService = (() => {
    let _classDecorators = [(0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RequestContextService = _classThis = class {
        constructor(request) {
            this.request = request;
            this._userRoles = [];
            this._requestId = this.generateRequestId();
            this._ipAddress = request.ip;
            // Extract user context from request (assumes authentication middleware)
            const user = request.user;
            if (user) {
                this._userId = user.id;
                this._userRoles = user.roles || [];
            }
        }
        get userId() {
            return this._userId;
        }
        get userRoles() {
            return this._userRoles;
        }
        get requestId() {
            return this._requestId;
        }
        get ipAddress() {
            return this._ipAddress;
        }
        hasRole(role) {
            return this._userRoles.includes(role);
        }
        isAuthorized() {
            return !!this._userId;
        }
        generateRequestId() {
            return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    };
    __setFunctionName(_classThis, "RequestContextService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RequestContextService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RequestContextService = _classThis;
})();
exports.RequestContextService = RequestContextService;
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
function validateAdvisorCapacity(currentAdvisees, maxAdvisees) {
    return currentAdvisees < maxAdvisees;
}
/**
 * 22. Calculates advisor utilization percentage.
 *
 * @param {number} currentAdvisees - Current advisee count
 * @param {number} maxAdvisees - Maximum allowed advisees
 * @returns {number} Utilization percentage
 */
function calculateAdvisorUtilization(currentAdvisees, maxAdvisees) {
    if (maxAdvisees === 0)
        return 0;
    return Math.round((currentAdvisees / maxAdvisees) * 100);
}
/**
 * 23. Determines alert priority based on severity and type.
 *
 * @param {AlertSeverity} severity - Alert severity
 * @param {EarlyAlertType} alertType - Alert type
 * @returns {number} Priority score (higher = more urgent)
 */
function calculateAlertPriority(severity, alertType) {
    const severityScores = {
        [AlertSeverity.CRITICAL]: 100,
        [AlertSeverity.HIGH]: 75,
        [AlertSeverity.MEDIUM]: 50,
        [AlertSeverity.LOW]: 25,
    };
    const typeScores = {
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
function formatSessionDuration(minutes) {
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
function isSessionUpcoming(scheduledAt) {
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
function sanitizeNoteContent(content) {
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
function generateImprovementPlanTemplate(standing) {
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
let AuditService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditService = _classThis = class {
        constructor(auditLogModel, requestContext) {
            this.auditLogModel = auditLogModel;
            this.requestContext = requestContext;
            this.logger = new common_1.Logger(AuditService.name);
        }
        async logAccess(resource, resourceId, action) {
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
        async logAdvisorAssignment(studentId, advisorId) {
            await this.logAccess('advisee_assignment', studentId, 'ASSIGN_ADVISOR');
        }
        async logSessionAccess(sessionId) {
            await this.logAccess('advising_session', sessionId, 'VIEW_SESSION');
        }
        async logNoteCreation(noteId, isConfidential) {
            const action = isConfidential ? 'CREATE_CONFIDENTIAL_NOTE' : 'CREATE_NOTE';
            await this.logAccess('advising_note', noteId, action);
        }
        async logEarlyAlert(alertId, severity) {
            await this.logAccess('early_alert', alertId, `CREATE_ALERT_${severity}`);
        }
    };
    __setFunctionName(_classThis, "AuditService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditService = _classThis;
})();
exports.AuditService = AuditService;
/**
 * 29. Validates FERPA compliance for data access.
 *
 * @param {string[]} userRoles - User roles
 * @param {string} resourceType - Type of resource being accessed
 * @param {boolean} isConfidential - Whether resource is confidential
 * @returns {boolean} Whether access is allowed
 */
function validateFERPAAccess(userRoles, resourceType, isConfidential = false) {
    // Advisors can access non-confidential student records
    if (userRoles.includes('advisor') && !isConfidential) {
        return true;
    }
    // Senior advisors and administrators can access confidential records
    if (isConfidential &&
        (userRoles.includes('senior_advisor') || userRoles.includes('administrator'))) {
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
function redactSensitiveContent(content, userRoles) {
    // Only redact for non-authorized roles
    if (userRoles.includes('senior_advisor') ||
        userRoles.includes('administrator') ||
        userRoles.includes('counselor')) {
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
function generateFERPAConsent(studentId, authorizedUsers, expirationDate) {
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
function validateDataRetention(recordCreatedAt, retentionYears = 7) {
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
function encryptConfidentialContent(content, encryptionKey) {
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
function decryptConfidentialContent(encryptedContent, encryptionKey) {
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
function generateAdvisorWorkloadReport(advisorId, advisees, sessions) {
    const totalAdvisees = advisees.length;
    const sessionsByType = sessions.reduce((acc, session) => {
        const type = session.get('sessionType');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const completedSessions = sessions.filter((s) => s.get('status') === AdvisingSessionStatus.COMPLETED).length;
    const cancelledSessions = sessions.filter((s) => s.get('status') === AdvisingSessionStatus.CANCELLED).length;
    const noShowSessions = sessions.filter((s) => s.get('status') === AdvisingSessionStatus.NO_SHOW).length;
    return {
        advisorId,
        totalAdvisees,
        sessionsByType,
        completedSessions,
        cancelledSessions,
        noShowSessions,
        completionRate: sessions.length > 0
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
function generateEarlyAlertSummary(alerts) {
    const totalAlerts = alerts.length;
    const alertsBySeverity = alerts.reduce((acc, alert) => {
        const severity = alert.get('severity');
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});
    const alertsByType = alerts.reduce((acc, alert) => {
        const type = alert.get('alertType');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
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
        acknowledgementRate: totalAlerts > 0 ? Math.round((acknowledgedAlerts / totalAlerts) * 100) : 0,
        resolutionRate: totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0,
        avgResolutionTimeHours: avgResolutionTime,
    };
}
/**
 * 37. Calculates average alert resolution time in hours.
 *
 * @param {Model[]} alerts - Early alerts
 * @returns {number} Average resolution time in hours
 */
function calculateAverageResolutionTime(alerts) {
    const resolvedAlerts = alerts.filter((a) => a.get('resolvedAt'));
    if (resolvedAlerts.length === 0)
        return 0;
    const totalHours = resolvedAlerts.reduce((sum, alert) => {
        const detected = new Date(alert.get('detectedAt'));
        const resolved = new Date(alert.get('resolvedAt'));
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
function generateStudentEngagementReport(studentId, sessions, notes) {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.get('status') === AdvisingSessionStatus.COMPLETED).length;
    const noShowSessions = sessions.filter((s) => s.get('status') === AdvisingSessionStatus.NO_SHOW).length;
    const lastSessionDate = sessions.length > 0
        ? new Date(Math.max(...sessions.map(s => new Date(s.get('scheduledAt')).getTime())))
        : null;
    return {
        studentId,
        totalSessions,
        completedSessions,
        noShowSessions,
        attendanceRate: totalSessions > 0
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
function identifyInterventionNeeded(students, daysSinceLastSession = 45) {
    return students
        .filter((student) => {
        if (!student.lastSessionDate)
            return true;
        const daysSince = Math.floor((Date.now() - student.lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
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
function generateGraduationProgressReport(plan) {
    const totalCredits = plan.get('totalCreditsRequired');
    const completed = plan.get('creditsCompleted');
    const inProgress = plan.get('creditsInProgress');
    const remaining = plan.get('creditsRemaining');
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
function calculateAdvisorPerformanceMetrics(advisorId, workloadData) {
    const utilization = calculateAdvisorUtilization(workloadData.totalAdvisees, workloadData.maxAdvisees);
    const sessionCompletionRate = workloadData.totalSessions > 0
        ? Math.round((workloadData.completedSessions / workloadData.totalSessions) * 100)
        : 0;
    return {
        advisorId,
        utilization,
        sessionCompletionRate,
        avgSessionDuration: workloadData.avgSessionDuration,
        studentSuccessRate: workloadData.studentSuccessRate,
        overallScore: Math.round((sessionCompletionRate * 0.4 + workloadData.studentSuccessRate * 0.6)),
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
function createAdvisorModelProvider(sequelize) {
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
function createAdvisingModelProviders(sequelize) {
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
function createAdvisingModuleConfig(sequelize) {
    const modelProviders = createAdvisingModelProviders(sequelize);
    const serviceProviders = [
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
function createAdvisingManagementModule(sequelize, options = {}) {
    const config = createAdvisingModuleConfig(sequelize);
    return {
        module: class AdvisingManagementModule {
        },
        global: options.isGlobal ?? false,
        providers: config.providers,
        exports: config.exports,
    };
}
//# sourceMappingURL=advising-management-kit.js.map