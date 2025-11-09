"use strict";
/**
 * LOC: EDU-LO-KIT-001
 * File: /reuse/education/learning-outcomes-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - rxjs (v7.x) for reactive state management
 *
 * DOWNSTREAM (imported by):
 *   - Assessment modules
 *   - Accreditation reporting
 *   - Program evaluation systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutcomeStateStore = exports.AccreditationReport = exports.AssessmentPlan = exports.AssessmentRubric = exports.CourseOutcome = exports.ProgramOutcome = exports.OutcomeAssessment = exports.LearningOutcome = exports.OutcomeEventType = exports.AccreditationType = exports.BloomLevel = exports.ProficiencyLevel = exports.AssessmentMethod = exports.AssessmentStatus = exports.OutcomeStatus = exports.OutcomeLevel = void 0;
exports.initLearningOutcomeModel = initLearningOutcomeModel;
exports.initOutcomeAssessmentModel = initOutcomeAssessmentModel;
exports.initProgramOutcomeModel = initProgramOutcomeModel;
exports.initCourseOutcomeModel = initCourseOutcomeModel;
exports.initAssessmentRubricModel = initAssessmentRubricModel;
exports.initAssessmentPlanModel = initAssessmentPlanModel;
exports.initAccreditationReportModel = initAccreditationReportModel;
exports.createLearningOutcome = createLearningOutcome;
exports.generateOutcomeCode = generateOutcomeCode;
exports.updateLearningOutcome = updateLearningOutcome;
exports.versionLearningOutcome = versionLearningOutcome;
exports.getOutcomesByLevel = getOutcomesByLevel;
exports.getOutcomesByProgram = getOutcomesByProgram;
exports.createOutcomeAssessment = createOutcomeAssessment;
exports.completeAssessment = completeAssessment;
exports.analyzeAssessment = analyzeAssessment;
exports.getAssessmentsByYear = getAssessmentsByYear;
exports.mapCourseToProgram = mapCourseToProgram;
exports.addProgramOutcome = addProgramOutcome;
exports.getCourseOutcomeMappings = getCourseOutcomeMappings;
exports.generateCurriculumMap = generateCurriculumMap;
exports.createAssessmentRubric = createAssessmentRubric;
exports.getRubricsByOutcome = getRubricsByOutcome;
exports.createAssessmentPlan = createAssessmentPlan;
exports.approveAssessmentPlan = approveAssessmentPlan;
exports.getAssessmentPlan = getAssessmentPlan;
exports.generateAccreditationReport = generateAccreditationReport;
exports.submitAccreditationReport = submitAccreditationReport;
exports.getAccreditationReports = getAccreditationReports;
exports.createOutcomeEventStream = createOutcomeEventStream;
exports.createAssessmentCompletionObservable = createAssessmentCompletionObservable;
exports.createAchievementTrendObservable = createAchievementTrendObservable;
exports.initAllOutcomeModels = initAllOutcomeModels;
/**
 * File: /reuse/education/learning-outcomes-kit.ts
 * Locator: WC-EDU-LO-KIT-001
 * Purpose: Learning Outcomes Kit - Comprehensive outcome definition, assessment, mapping, and accreditation reporting
 *
 * Upstream: sequelize v6.x, rxjs v7.x, validator v13.x
 * Downstream: ../backend/education/*, assessment modules, accreditation systems, program evaluation
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, RxJS 7.x
 * Exports: 45 functions for learning outcomes, assessments, mapping, reporting, accreditation, state management
 *
 * LLM Context: Production-grade learning outcomes toolkit for education SIS. Provides comprehensive tools for
 * learning outcome definition, outcome assessment with rubrics, course-to-program outcome mapping, outcome
 * reporting and analytics, accreditation compliance reporting, assessment planning and cycles, and reactive
 * state management with observable patterns. Supports regional accreditation standards and program-specific
 * accreditation requirements (ABET, AACSB, ACEN, etc.).
 */
const sequelize_1 = require("sequelize");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Outcome level enumeration
 */
var OutcomeLevel;
(function (OutcomeLevel) {
    OutcomeLevel["INSTITUTIONAL"] = "INSTITUTIONAL";
    OutcomeLevel["PROGRAM"] = "PROGRAM";
    OutcomeLevel["COURSE"] = "COURSE";
    OutcomeLevel["MODULE"] = "MODULE";
    OutcomeLevel["ASSIGNMENT"] = "ASSIGNMENT";
})(OutcomeLevel || (exports.OutcomeLevel = OutcomeLevel = {}));
/**
 * Outcome status enumeration
 */
var OutcomeStatus;
(function (OutcomeStatus) {
    OutcomeStatus["DRAFT"] = "DRAFT";
    OutcomeStatus["ACTIVE"] = "ACTIVE";
    OutcomeStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    OutcomeStatus["ARCHIVED"] = "ARCHIVED";
    OutcomeStatus["DEPRECATED"] = "DEPRECATED";
})(OutcomeStatus || (exports.OutcomeStatus = OutcomeStatus = {}));
/**
 * Assessment status enumeration
 */
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["PLANNED"] = "PLANNED";
    AssessmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AssessmentStatus["COMPLETED"] = "COMPLETED";
    AssessmentStatus["ANALYZED"] = "ANALYZED";
    AssessmentStatus["REPORTED"] = "REPORTED";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
/**
 * Assessment method enumeration
 */
var AssessmentMethod;
(function (AssessmentMethod) {
    AssessmentMethod["DIRECT_EXAM"] = "DIRECT_EXAM";
    AssessmentMethod["DIRECT_PROJECT"] = "DIRECT_PROJECT";
    AssessmentMethod["DIRECT_PORTFOLIO"] = "DIRECT_PORTFOLIO";
    AssessmentMethod["DIRECT_PERFORMANCE"] = "DIRECT_PERFORMANCE";
    AssessmentMethod["DIRECT_CAPSTONE"] = "DIRECT_CAPSTONE";
    AssessmentMethod["INDIRECT_SURVEY"] = "INDIRECT_SURVEY";
    AssessmentMethod["INDIRECT_INTERVIEW"] = "INDIRECT_INTERVIEW";
    AssessmentMethod["INDIRECT_FOCUS_GROUP"] = "INDIRECT_FOCUS_GROUP";
    AssessmentMethod["EMBEDDED"] = "EMBEDDED";
    AssessmentMethod["OTHER"] = "OTHER";
})(AssessmentMethod || (exports.AssessmentMethod = AssessmentMethod = {}));
/**
 * Proficiency level enumeration
 */
var ProficiencyLevel;
(function (ProficiencyLevel) {
    ProficiencyLevel["EXCEEDS"] = "EXCEEDS";
    ProficiencyLevel["MEETS"] = "MEETS";
    ProficiencyLevel["APPROACHES"] = "APPROACHES";
    ProficiencyLevel["DEVELOPING"] = "DEVELOPING";
    ProficiencyLevel["UNSATISFACTORY"] = "UNSATISFACTORY";
})(ProficiencyLevel || (exports.ProficiencyLevel = ProficiencyLevel = {}));
/**
 * Bloom's taxonomy level
 */
var BloomLevel;
(function (BloomLevel) {
    BloomLevel["REMEMBER"] = "REMEMBER";
    BloomLevel["UNDERSTAND"] = "UNDERSTAND";
    BloomLevel["APPLY"] = "APPLY";
    BloomLevel["ANALYZE"] = "ANALYZE";
    BloomLevel["EVALUATE"] = "EVALUATE";
    BloomLevel["CREATE"] = "CREATE";
})(BloomLevel || (exports.BloomLevel = BloomLevel = {}));
/**
 * Accreditation standard type
 */
var AccreditationType;
(function (AccreditationType) {
    AccreditationType["REGIONAL"] = "REGIONAL";
    AccreditationType["ABET"] = "ABET";
    AccreditationType["AACSB"] = "AACSB";
    AccreditationType["ACEN"] = "ACEN";
    AccreditationType["ABA"] = "ABA";
    AccreditationType["CAEP"] = "CAEP";
    AccreditationType["CCNE"] = "CCNE";
    AccreditationType["OTHER"] = "OTHER";
})(AccreditationType || (exports.AccreditationType = AccreditationType = {}));
/**
 * Outcome event types
 */
var OutcomeEventType;
(function (OutcomeEventType) {
    OutcomeEventType["OUTCOME_CREATED"] = "OUTCOME_CREATED";
    OutcomeEventType["OUTCOME_UPDATED"] = "OUTCOME_UPDATED";
    OutcomeEventType["ASSESSMENT_PLANNED"] = "ASSESSMENT_PLANNED";
    OutcomeEventType["ASSESSMENT_COMPLETED"] = "ASSESSMENT_COMPLETED";
    OutcomeEventType["ASSESSMENT_ANALYZED"] = "ASSESSMENT_ANALYZED";
    OutcomeEventType["MAPPING_CREATED"] = "MAPPING_CREATED";
    OutcomeEventType["REPORT_GENERATED"] = "REPORT_GENERATED";
    OutcomeEventType["PLAN_APPROVED"] = "PLAN_APPROVED";
})(OutcomeEventType || (exports.OutcomeEventType = OutcomeEventType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * LearningOutcome model class
 */
class LearningOutcome extends sequelize_1.Model {
}
exports.LearningOutcome = LearningOutcome;
/**
 * OutcomeAssessment model class
 */
class OutcomeAssessment extends sequelize_1.Model {
}
exports.OutcomeAssessment = OutcomeAssessment;
/**
 * ProgramOutcome model class
 */
class ProgramOutcome extends sequelize_1.Model {
}
exports.ProgramOutcome = ProgramOutcome;
/**
 * CourseOutcome model class
 */
class CourseOutcome extends sequelize_1.Model {
}
exports.CourseOutcome = CourseOutcome;
/**
 * AssessmentRubric model class
 */
class AssessmentRubric extends sequelize_1.Model {
}
exports.AssessmentRubric = AssessmentRubric;
/**
 * AssessmentPlan model class
 */
class AssessmentPlan extends sequelize_1.Model {
}
exports.AssessmentPlan = AssessmentPlan;
/**
 * AccreditationReport model class
 */
class AccreditationReport extends sequelize_1.Model {
}
exports.AccreditationReport = AccreditationReport;
// ============================================================================
// MODEL INITIALIZATION
// ============================================================================
/**
 * Initialize LearningOutcome model
 */
function initLearningOutcomeModel(sequelize) {
    LearningOutcome.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        level: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(OutcomeLevel)),
            allowNull: false,
        },
        bloomLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BloomLevel)),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(OutcomeStatus)),
            allowNull: false,
            defaultValue: OutcomeStatus.DRAFT,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        parentOutcomeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'learning_outcomes',
                key: 'id',
            },
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        departmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        accreditationStandards: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        updatedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'learning_outcomes',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['code'] },
            { fields: ['level'] },
            { fields: ['status'] },
            { fields: ['programId'] },
            { fields: ['departmentId'] },
        ],
    });
    return LearningOutcome;
}
/**
 * Initialize OutcomeAssessment model
 */
function initOutcomeAssessmentModel(sequelize) {
    OutcomeAssessment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        outcomeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'learning_outcomes',
                key: 'id',
            },
        },
        assessmentName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        assessmentMethod: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AssessmentMethod)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AssessmentStatus)),
            allowNull: false,
            defaultValue: AssessmentStatus.PLANNED,
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        assignmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        plannedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        sampleSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        targetProficiency: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ProficiencyLevel)),
            allowNull: false,
        },
        targetPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        actualPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        exceeds: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        meets: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        approaches: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        developing: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        unsatisfactory: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        meanScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        medianScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        rubricId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        findings: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        actionItems: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        closingTheLoop: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        assessedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'outcome_assessments',
        timestamps: true,
        indexes: [
            { fields: ['outcomeId'] },
            { fields: ['status'] },
            { fields: ['academicYear'] },
            { fields: ['courseId'] },
            { fields: ['assessmentMethod'] },
        ],
    });
    return OutcomeAssessment;
}
/**
 * Initialize ProgramOutcome model
 */
function initProgramOutcomeModel(sequelize) {
    ProgramOutcome.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        outcomeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'learning_outcomes',
                key: 'id',
            },
        },
        sequenceNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        isRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        weight: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        accreditationMappings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        assessmentCycle: {
            type: sequelize_1.DataTypes.ENUM('ANNUAL', 'BIENNIAL', 'CUSTOM'),
            allowNull: false,
            defaultValue: 'ANNUAL',
        },
        lastAssessedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        nextAssessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(OutcomeStatus)),
            allowNull: false,
            defaultValue: OutcomeStatus.ACTIVE,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'program_outcomes',
        timestamps: true,
        indexes: [
            { fields: ['programId'] },
            { fields: ['outcomeId'] },
            { fields: ['programId', 'sequenceNumber'] },
            { unique: true, fields: ['programId', 'outcomeId'] },
        ],
    });
    return ProgramOutcome;
}
/**
 * Initialize CourseOutcome model
 */
function initCourseOutcomeModel(sequelize) {
    CourseOutcome.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        outcomeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'learning_outcomes',
                key: 'id',
            },
        },
        programOutcomeIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        sequenceNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        alignmentLevel: {
            type: sequelize_1.DataTypes.ENUM('INTRODUCED', 'REINFORCED', 'MASTERED'),
            allowNull: false,
            defaultValue: 'INTRODUCED',
        },
        assessmentMethods: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        weight: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        isRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        syllabusMapped: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'course_outcomes',
        timestamps: true,
        indexes: [
            { fields: ['courseId'] },
            { fields: ['outcomeId'] },
            { fields: ['courseId', 'sequenceNumber'] },
            { unique: true, fields: ['courseId', 'outcomeId'] },
        ],
    });
    return CourseOutcome;
}
/**
 * Initialize AssessmentRubric model
 */
function initAssessmentRubricModel(sequelize) {
    AssessmentRubric.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        outcomeIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        criteria: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        scoringGuide: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        maxPoints: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        passingThreshold: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'assessment_rubrics',
        timestamps: true,
        indexes: [
            { fields: ['isActive'] },
            { fields: ['createdBy'] },
        ],
    });
    return AssessmentRubric;
}
/**
 * Initialize AssessmentPlan model
 */
function initAssessmentPlanModel(sequelize) {
    AssessmentPlan.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        planName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        outcomeIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        plannedAssessments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        approvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'assessment_plans',
        timestamps: true,
        indexes: [
            { fields: ['programId'] },
            { fields: ['academicYear'] },
            { fields: ['status'] },
            { unique: true, fields: ['programId', 'academicYear'] },
        ],
    });
    return AssessmentPlan;
}
/**
 * Initialize AccreditationReport model
 */
function initAccreditationReportModel(sequelize) {
    AccreditationReport.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        accreditationType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AccreditationType)),
            allowNull: false,
        },
        reportingPeriodStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        reportingPeriodEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        reportTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        outcomeIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        assessmentIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        findings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        improvements: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        generatedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        submittedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        preparedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'accreditation_reports',
        timestamps: true,
        indexes: [
            { fields: ['programId'] },
            { fields: ['accreditationType'] },
            { fields: ['status'] },
            { fields: ['reportingPeriodStart', 'reportingPeriodEnd'] },
        ],
    });
    return AccreditationReport;
}
// ============================================================================
// STATE MANAGEMENT - REACTIVE STORE
// ============================================================================
/**
 * Outcome state store with reactive observables
 */
class OutcomeStateStore {
    constructor() {
        this.state = new rxjs_1.BehaviorSubject({
            outcomes: new Map(),
            assessments: new Map(),
            programOutcomes: new Map(),
            courseOutcomes: new Map(),
            rubrics: new Map(),
            plans: new Map(),
            reports: new Map(),
        });
        this.events = new rxjs_1.Subject();
    }
    /**
     * Get observable of current state
     */
    getState$() {
        return this.state.asObservable();
    }
    /**
     * Get observable of events
     */
    getEvents$() {
        return this.events.asObservable();
    }
    /**
     * Update outcome in state
     */
    updateOutcome(outcome) {
        const currentState = this.state.value;
        currentState.outcomes.set(outcome.id, outcome);
        this.state.next({ ...currentState });
    }
    /**
     * Update assessment in state
     */
    updateAssessment(assessment) {
        const currentState = this.state.value;
        currentState.assessments.set(assessment.id, assessment);
        this.state.next({ ...currentState });
    }
    /**
     * Emit outcome event
     */
    emitEvent(event) {
        this.events.next(event);
    }
    /**
     * Get outcome observable by ID
     */
    getOutcome$(outcomeId) {
        return this.state.pipe((0, operators_1.map)(state => state.outcomes.get(outcomeId)), (0, operators_1.distinctUntilChanged)());
    }
    /**
     * Get assessments observable by outcome ID
     */
    getAssessmentsByOutcome$(outcomeId) {
        return this.state.pipe((0, operators_1.map)(state => Array.from(state.assessments.values()).filter(a => a.outcomeId === outcomeId)), (0, operators_1.shareReplay)(1));
    }
    /**
     * Get program outcomes observable by program ID
     */
    getProgramOutcomes$(programId) {
        return this.state.pipe((0, operators_1.map)(state => Array.from(state.programOutcomes.values()).filter(po => po.programId === programId)), (0, operators_1.shareReplay)(1));
    }
}
exports.OutcomeStateStore = OutcomeStateStore;
// ============================================================================
// LEARNING OUTCOME FUNCTIONS
// ============================================================================
/**
 * Create learning outcome
 */
async function createLearningOutcome(data, userId, transaction) {
    const code = data.code || await generateOutcomeCode(data.level, data.programId);
    const outcome = await LearningOutcome.create({
        ...data,
        code,
        status: data.status || OutcomeStatus.DRAFT,
        version: 1,
        tags: data.tags || [],
        accreditationStandards: data.accreditationStandards || [],
        metadata: data.metadata || {},
        createdBy: userId,
    }, { transaction });
    return outcome;
}
/**
 * Generate outcome code
 */
async function generateOutcomeCode(level, programId) {
    const levelPrefix = level.substring(0, 3);
    const programPrefix = programId ? programId.substring(0, 4).toUpperCase() : 'GEN';
    const timestamp = Date.now().toString(36);
    return `${levelPrefix}-${programPrefix}-${timestamp}`.toUpperCase();
}
/**
 * Update learning outcome
 */
async function updateLearningOutcome(outcomeId, data, userId, transaction) {
    const outcome = await LearningOutcome.findByPk(outcomeId, { transaction });
    if (!outcome) {
        throw new Error(`Learning outcome not found: ${outcomeId}`);
    }
    await outcome.update({
        ...data,
        updatedBy: userId,
    }, { transaction });
    return outcome;
}
/**
 * Version learning outcome
 */
async function versionLearningOutcome(outcomeId, userId, transaction) {
    const originalOutcome = await LearningOutcome.findByPk(outcomeId, { transaction });
    if (!originalOutcome) {
        throw new Error(`Learning outcome not found: ${outcomeId}`);
    }
    // Archive the original
    originalOutcome.status = OutcomeStatus.ARCHIVED;
    originalOutcome.expirationDate = new Date();
    await originalOutcome.save({ transaction });
    // Create new version
    const newOutcome = await LearningOutcome.create({
        code: originalOutcome.code,
        title: originalOutcome.title,
        description: originalOutcome.description,
        level: originalOutcome.level,
        bloomLevel: originalOutcome.bloomLevel,
        status: OutcomeStatus.DRAFT,
        version: originalOutcome.version + 1,
        effectiveDate: new Date(),
        parentOutcomeId: originalOutcome.parentOutcomeId,
        programId: originalOutcome.programId,
        departmentId: originalOutcome.departmentId,
        tags: originalOutcome.tags,
        accreditationStandards: originalOutcome.accreditationStandards,
        metadata: { ...originalOutcome.metadata, previousVersionId: outcomeId },
        createdBy: userId,
    }, { transaction });
    return newOutcome;
}
/**
 * Get outcomes by level
 */
async function getOutcomesByLevel(level, options) {
    return LearningOutcome.findAll({
        where: { level, status: OutcomeStatus.ACTIVE },
        order: [['code', 'ASC']],
        ...options,
    });
}
/**
 * Get outcomes by program
 */
async function getOutcomesByProgram(programId, options) {
    return LearningOutcome.findAll({
        where: { programId, status: { [sequelize_1.Op.ne]: OutcomeStatus.DEPRECATED } },
        order: [['code', 'ASC']],
        ...options,
    });
}
// ============================================================================
// ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Create outcome assessment
 */
async function createOutcomeAssessment(data, userId, transaction) {
    const assessment = await OutcomeAssessment.create({
        ...data,
        status: data.status || AssessmentStatus.PLANNED,
        findings: data.findings || '',
        actionItems: data.actionItems || [],
        metadata: data.metadata || {},
        assessedBy: userId,
    }, { transaction });
    return assessment;
}
/**
 * Complete assessment with results
 */
async function completeAssessment(assessmentId, results, transaction) {
    const assessment = await OutcomeAssessment.findByPk(assessmentId, { transaction });
    if (!assessment) {
        throw new Error(`Assessment not found: ${assessmentId}`);
    }
    const total = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;
    const meetsOrExceeds = results.exceeds + results.meets;
    const actualPercentage = total > 0 ? (meetsOrExceeds / total) * 100 : 0;
    const meanScore = calculateMeanScore(results);
    const medianScore = calculateMedianScore(results);
    await assessment.update({
        ...results,
        actualPercentage,
        meanScore,
        medianScore,
        completedDate: new Date(),
        status: AssessmentStatus.COMPLETED,
    }, { transaction });
    return assessment;
}
/**
 * Calculate mean score from proficiency distribution
 */
function calculateMeanScore(results) {
    const proficiencyPoints = {
        exceeds: 5,
        meets: 4,
        approaches: 3,
        developing: 2,
        unsatisfactory: 1,
    };
    const totalPoints = results.exceeds * proficiencyPoints.exceeds +
        results.meets * proficiencyPoints.meets +
        results.approaches * proficiencyPoints.approaches +
        results.developing * proficiencyPoints.developing +
        results.unsatisfactory * proficiencyPoints.unsatisfactory;
    const totalStudents = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;
    return totalStudents > 0 ? totalPoints / totalStudents : 0;
}
/**
 * Calculate median score (approximation)
 */
function calculateMedianScore(results) {
    const total = results.exceeds + results.meets + results.approaches + results.developing + results.unsatisfactory;
    const midpoint = total / 2;
    let cumulative = 0;
    cumulative += results.unsatisfactory;
    if (cumulative >= midpoint)
        return 1;
    cumulative += results.developing;
    if (cumulative >= midpoint)
        return 2;
    cumulative += results.approaches;
    if (cumulative >= midpoint)
        return 3;
    cumulative += results.meets;
    if (cumulative >= midpoint)
        return 4;
    return 5;
}
/**
 * Analyze assessment results
 */
async function analyzeAssessment(assessmentId, transaction) {
    const assessment = await OutcomeAssessment.findByPk(assessmentId, { transaction });
    if (!assessment) {
        throw new Error(`Assessment not found: ${assessmentId}`);
    }
    if (assessment.status !== AssessmentStatus.COMPLETED) {
        throw new Error('Assessment must be completed before analysis');
    }
    assessment.status = AssessmentStatus.ANALYZED;
    await assessment.save({ transaction });
    return assessment;
}
/**
 * Get assessments by academic year
 */
async function getAssessmentsByYear(academicYear, programId, options) {
    const whereClause = { academicYear };
    if (programId) {
        // Need to join with outcomes to filter by program
        const outcomes = await LearningOutcome.findAll({
            where: { programId },
            attributes: ['id'],
        });
        const outcomeIds = outcomes.map(o => o.id);
        whereClause.outcomeId = { [sequelize_1.Op.in]: outcomeIds };
    }
    return OutcomeAssessment.findAll({
        where: whereClause,
        order: [['completedDate', 'DESC']],
        ...options,
    });
}
// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================
/**
 * Map course outcome to program outcome
 */
async function mapCourseToProgram(courseId, outcomeId, programOutcomeIds, alignmentLevel, transaction) {
    // Check if mapping already exists
    const existing = await CourseOutcome.findOne({
        where: { courseId, outcomeId },
        transaction,
    });
    if (existing) {
        // Update existing mapping
        await existing.update({ programOutcomeIds, alignmentLevel }, { transaction });
        return existing;
    }
    // Get next sequence number
    const maxSeq = await CourseOutcome.max('sequenceNumber', {
        where: { courseId },
        transaction,
    });
    const courseOutcome = await CourseOutcome.create({
        courseId,
        outcomeId,
        programOutcomeIds,
        sequenceNumber: (maxSeq || 0) + 1,
        alignmentLevel,
        assessmentMethods: [],
        isRequired: true,
        syllabusMapped: false,
        metadata: {},
    }, { transaction });
    return courseOutcome;
}
/**
 * Add program outcome
 */
async function addProgramOutcome(programId, outcomeId, accreditationMappings, transaction) {
    // Get next sequence number
    const maxSeq = await ProgramOutcome.max('sequenceNumber', {
        where: { programId },
        transaction,
    });
    const programOutcome = await ProgramOutcome.create({
        programId,
        outcomeId,
        sequenceNumber: (maxSeq || 0) + 1,
        isRequired: true,
        accreditationMappings,
        assessmentCycle: 'ANNUAL',
        status: OutcomeStatus.ACTIVE,
        metadata: {},
    }, { transaction });
    return programOutcome;
}
/**
 * Get course outcome mappings
 */
async function getCourseOutcomeMappings(courseId, options) {
    return CourseOutcome.findAll({
        where: { courseId },
        order: [['sequenceNumber', 'ASC']],
        ...options,
    });
}
/**
 * Generate curriculum map
 */
async function generateCurriculumMap(programId) {
    const programOutcomes = await ProgramOutcome.findAll({
        where: { programId, status: OutcomeStatus.ACTIVE },
        order: [['sequenceNumber', 'ASC']],
    });
    const courseMappings = new Map();
    const alignmentMatrix = {};
    for (const po of programOutcomes) {
        const courseOutcomes = await CourseOutcome.findAll({
            where: {
                programOutcomeIds: { [sequelize_1.Op.contains]: [po.outcomeId] },
            },
        });
        for (const co of courseOutcomes) {
            if (!courseMappings.has(co.courseId)) {
                courseMappings.set(co.courseId, []);
            }
            courseMappings.get(co.courseId).push(co);
            if (!alignmentMatrix[co.courseId]) {
                alignmentMatrix[co.courseId] = {};
            }
            alignmentMatrix[co.courseId][po.outcomeId] = co.alignmentLevel;
        }
    }
    return { programOutcomes, courseMappings, alignmentMatrix };
}
// ============================================================================
// RUBRIC FUNCTIONS
// ============================================================================
/**
 * Create assessment rubric
 */
async function createAssessmentRubric(data, userId, transaction) {
    const rubric = await AssessmentRubric.create({
        ...data,
        outcomeIds: data.outcomeIds || [],
        criteria: data.criteria || [],
        scoringGuide: data.scoringGuide || {},
        isActive: true,
        version: 1,
        metadata: data.metadata || {},
        createdBy: userId,
    }, { transaction });
    return rubric;
}
/**
 * Get rubrics by outcome
 */
async function getRubricsByOutcome(outcomeId, options) {
    return AssessmentRubric.findAll({
        where: {
            outcomeIds: { [sequelize_1.Op.contains]: [outcomeId] },
            isActive: true,
        },
        ...options,
    });
}
// ============================================================================
// ASSESSMENT PLANNING FUNCTIONS
// ============================================================================
/**
 * Create assessment plan
 */
async function createAssessmentPlan(data, userId, transaction) {
    const plan = await AssessmentPlan.create({
        ...data,
        outcomeIds: data.outcomeIds || [],
        plannedAssessments: data.plannedAssessments || [],
        status: 'DRAFT',
        metadata: data.metadata || {},
        createdBy: userId,
    }, { transaction });
    return plan;
}
/**
 * Approve assessment plan
 */
async function approveAssessmentPlan(planId, approvedBy, transaction) {
    const plan = await AssessmentPlan.findByPk(planId, { transaction });
    if (!plan) {
        throw new Error(`Assessment plan not found: ${planId}`);
    }
    plan.status = 'APPROVED';
    plan.approvedBy = approvedBy;
    plan.approvedDate = new Date();
    await plan.save({ transaction });
    return plan;
}
/**
 * Get assessment plan for program and year
 */
async function getAssessmentPlan(programId, academicYear, options) {
    return AssessmentPlan.findOne({
        where: { programId, academicYear },
        ...options,
    });
}
// ============================================================================
// ACCREDITATION REPORTING FUNCTIONS
// ============================================================================
/**
 * Generate accreditation report
 */
async function generateAccreditationReport(programId, accreditationType, periodStart, periodEnd, userId, transaction) {
    // Get all program outcomes
    const programOutcomes = await ProgramOutcome.findAll({
        where: { programId },
        transaction,
    });
    const outcomeIds = programOutcomes.map(po => po.outcomeId);
    // Get all assessments in the period
    const assessments = await OutcomeAssessment.findAll({
        where: {
            outcomeId: { [sequelize_1.Op.in]: outcomeIds },
            completedDate: {
                [sequelize_1.Op.between]: [periodStart, periodEnd],
            },
            status: { [sequelize_1.Op.in]: [AssessmentStatus.COMPLETED, AssessmentStatus.ANALYZED, AssessmentStatus.REPORTED] },
        },
        transaction,
    });
    const assessmentIds = assessments.map(a => a.id);
    // Aggregate findings
    const findings = aggregateAssessmentFindings(programOutcomes, assessments);
    const report = await AccreditationReport.create({
        programId,
        accreditationType,
        reportingPeriodStart: periodStart,
        reportingPeriodEnd: periodEnd,
        reportTitle: `${accreditationType} Accreditation Report ${periodStart.getFullYear()}-${periodEnd.getFullYear()}`,
        outcomeIds,
        assessmentIds,
        findings,
        improvements: [],
        status: 'DRAFT',
        generatedDate: new Date(),
        metadata: {},
        preparedBy: userId,
    }, { transaction });
    return report;
}
/**
 * Aggregate assessment findings
 */
function aggregateAssessmentFindings(programOutcomes, assessments) {
    const findings = {
        totalOutcomes: programOutcomes.length,
        totalAssessments: assessments.length,
        outcomeResults: {},
        overallPerformance: {
            averageAchievement: 0,
            targetsMet: 0,
            targetsNotMet: 0,
        },
    };
    let totalAchievement = 0;
    let targetsMet = 0;
    for (const assessment of assessments) {
        if (assessment.actualPercentage !== null && assessment.actualPercentage !== undefined) {
            totalAchievement += assessment.actualPercentage;
            if (assessment.actualPercentage >= assessment.targetPercentage) {
                targetsMet++;
            }
            findings.outcomeResults[assessment.outcomeId] = {
                targetPercentage: assessment.targetPercentage,
                actualPercentage: assessment.actualPercentage,
                targetMet: assessment.actualPercentage >= assessment.targetPercentage,
                sampleSize: assessment.sampleSize,
            };
        }
    }
    findings.overallPerformance.averageAchievement = assessments.length > 0 ? totalAchievement / assessments.length : 0;
    findings.overallPerformance.targetsMet = targetsMet;
    findings.overallPerformance.targetsNotMet = assessments.length - targetsMet;
    return findings;
}
/**
 * Submit accreditation report
 */
async function submitAccreditationReport(reportId, transaction) {
    const report = await AccreditationReport.findByPk(reportId, { transaction });
    if (!report) {
        throw new Error(`Accreditation report not found: ${reportId}`);
    }
    report.status = 'SUBMITTED';
    report.submittedDate = new Date();
    await report.save({ transaction });
    return report;
}
/**
 * Get accreditation reports by program
 */
async function getAccreditationReports(programId, options) {
    return AccreditationReport.findAll({
        where: { programId },
        order: [['generatedDate', 'DESC']],
        ...options,
    });
}
// ============================================================================
// OBSERVABLE PATTERNS - REACTIVE STATE
// ============================================================================
/**
 * Create observable for outcome events
 */
function createOutcomeEventStream(store, eventTypes) {
    const events$ = store.getEvents$();
    if (eventTypes && eventTypes.length > 0) {
        return events$.pipe((0, operators_1.filter)(event => eventTypes.includes(event.type)));
    }
    return events$;
}
/**
 * Create observable for assessment completion tracking
 */
function createAssessmentCompletionObservable(store, programId) {
    return store.getProgramOutcomes$(programId).pipe((0, operators_1.map)(programOutcomes => {
        const total = programOutcomes.length;
        const completed = programOutcomes.filter(po => po.lastAssessedDate !== null).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return { total, completed, percentage };
    }));
}
/**
 * Create observable for outcome achievement trends
 */
function createAchievementTrendObservable(store, outcomeId) {
    return store.getAssessmentsByOutcome$(outcomeId).pipe((0, operators_1.map)(assessments => assessments
        .filter(a => a.actualPercentage !== null && a.actualPercentage !== undefined)
        .sort((a, b) => new Date(a.completedDate || 0).getTime() - new Date(b.completedDate || 0).getTime())
        .map(a => a.actualPercentage)));
}
/**
 * Initialize all outcome models
 */
function initAllOutcomeModels(sequelize) {
    return {
        LearningOutcome: initLearningOutcomeModel(sequelize),
        OutcomeAssessment: initOutcomeAssessmentModel(sequelize),
        ProgramOutcome: initProgramOutcomeModel(sequelize),
        CourseOutcome: initCourseOutcomeModel(sequelize),
        AssessmentRubric: initAssessmentRubricModel(sequelize),
        AssessmentPlan: initAssessmentPlanModel(sequelize),
        AccreditationReport: initAccreditationReportModel(sequelize),
    };
}
//# sourceMappingURL=learning-outcomes-kit.js.map