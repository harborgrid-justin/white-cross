"use strict";
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
exports.CourseEquivalenciesController = exports.CoursePrerequisitesController = exports.CourseSectionsController = exports.CoursesController = exports.CourseCatalogsController = exports.CourseSearchQueryDto = exports.CreateCourseEquivalencyDto = exports.CreateCoursePrerequisiteDto = exports.UpdateCourseSectionDto = exports.CreateCourseSectionDto = exports.UpdateCourseDto = exports.CreateCourseDto = exports.UpdateCourseCatalogDto = exports.CreateCourseCatalogDto = exports.CourseApprovalWorkflow = exports.CourseEquivalency = exports.CoursePrerequisite = exports.CourseSection = exports.Course = exports.CourseCatalog = exports.ApprovalStatus = exports.PrerequisiteType = exports.SectionStatus = exports.GradingBasis = exports.InstructionMethod = exports.CourseLevel = exports.CourseStatus = void 0;
exports.createCourseCatalog = createCourseCatalog;
exports.updateCourseCatalog = updateCourseCatalog;
exports.publishCourseCatalog = publishCourseCatalog;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.getCourseByCode = getCourseByCode;
exports.searchCourses = searchCourses;
exports.createCourseSection = createCourseSection;
exports.updateCourseSection = updateCourseSection;
exports.getAvailableSections = getAvailableSections;
exports.checkSectionCapacity = checkSectionCapacity;
exports.incrementSectionEnrollment = incrementSectionEnrollment;
exports.decrementSectionEnrollment = decrementSectionEnrollment;
exports.addCoursePrerequisite = addCoursePrerequisite;
exports.validatePrerequisites = validatePrerequisites;
exports.getCoursePrerequisites = getCoursePrerequisites;
exports.addCourseEquivalency = addCourseEquivalency;
exports.getCourseEquivalencies = getCourseEquivalencies;
exports.findTransferEquivalency = findTransferEquivalency;
exports.addCourseAttributes = addCourseAttributes;
exports.updateCourseFees = updateCourseFees;
exports.addLearningOutcomes = addLearningOutcomes;
exports.updateCourseDescription = updateCourseDescription;
exports.updateCourseSyllabus = updateCourseSyllabus;
exports.crossListCourses = crossListCourses;
exports.approveCourse = approveCourse;
exports.activateCourse = activateCourse;
exports.discontinueCourse = discontinueCourse;
exports.createCourseApprovalWorkflow = createCourseApprovalWorkflow;
exports.advanceApprovalWorkflow = advanceApprovalWorkflow;
exports.getPendingApprovalsForUser = getPendingApprovalsForUser;
exports.getCoursesByDepartment = getCoursesByDepartment;
exports.getCoursesByCollege = getCoursesByCollege;
exports.getSectionsByInstructor = getSectionsByInstructor;
exports.getSectionEnrollmentStats = getSectionEnrollmentStats;
exports.validateSchedulingRules = validateSchedulingRules;
exports.cloneCourseForNewCatalog = cloneCourseForNewCatalog;
exports.getCourseHistory = getCourseHistory;
exports.validateCourseCapacity = validateCourseCapacity;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "DRAFT";
    CourseStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    CourseStatus["APPROVED"] = "APPROVED";
    CourseStatus["ACTIVE"] = "ACTIVE";
    CourseStatus["INACTIVE"] = "INACTIVE";
    CourseStatus["ARCHIVED"] = "ARCHIVED";
    CourseStatus["DISCONTINUED"] = "DISCONTINUED";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["UNDERGRADUATE"] = "UNDERGRADUATE";
    CourseLevel["GRADUATE"] = "GRADUATE";
    CourseLevel["DOCTORAL"] = "DOCTORAL";
    CourseLevel["PROFESSIONAL"] = "PROFESSIONAL";
    CourseLevel["CONTINUING_EDUCATION"] = "CONTINUING_EDUCATION";
    CourseLevel["NON_CREDIT"] = "NON_CREDIT";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var InstructionMethod;
(function (InstructionMethod) {
    InstructionMethod["IN_PERSON"] = "IN_PERSON";
    InstructionMethod["ONLINE"] = "ONLINE";
    InstructionMethod["HYBRID"] = "HYBRID";
    InstructionMethod["HYFLEX"] = "HYFLEX";
    InstructionMethod["ASYNCHRONOUS"] = "ASYNCHRONOUS";
    InstructionMethod["SYNCHRONOUS"] = "SYNCHRONOUS";
})(InstructionMethod || (exports.InstructionMethod = InstructionMethod = {}));
var GradingBasis;
(function (GradingBasis) {
    GradingBasis["LETTER_GRADE"] = "LETTER_GRADE";
    GradingBasis["PASS_FAIL"] = "PASS_FAIL";
    GradingBasis["SATISFACTORY_UNSATISFACTORY"] = "SATISFACTORY_UNSATISFACTORY";
    GradingBasis["AUDIT"] = "AUDIT";
    GradingBasis["HONORS"] = "HONORS";
    GradingBasis["CREDIT_NO_CREDIT"] = "CREDIT_NO_CREDIT";
})(GradingBasis || (exports.GradingBasis = GradingBasis = {}));
var SectionStatus;
(function (SectionStatus) {
    SectionStatus["PLANNING"] = "PLANNING";
    SectionStatus["OPEN"] = "OPEN";
    SectionStatus["CLOSED"] = "CLOSED";
    SectionStatus["CANCELLED"] = "CANCELLED";
    SectionStatus["FULL"] = "FULL";
    SectionStatus["WAITLIST"] = "WAITLIST";
})(SectionStatus || (exports.SectionStatus = SectionStatus = {}));
var PrerequisiteType;
(function (PrerequisiteType) {
    PrerequisiteType["PREREQUISITE"] = "PREREQUISITE";
    PrerequisiteType["COREQUISITE"] = "COREQUISITE";
    PrerequisiteType["CONCURRENT"] = "CONCURRENT";
    PrerequisiteType["RECOMMENDED"] = "RECOMMENDED";
    PrerequisiteType["RESTRICTED"] = "RESTRICTED";
})(PrerequisiteType || (exports.PrerequisiteType = PrerequisiteType = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["DRAFT"] = "DRAFT";
    ApprovalStatus["SUBMITTED"] = "SUBMITTED";
    ApprovalStatus["IN_REVIEW"] = "IN_REVIEW";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["REVISION_REQUESTED"] = "REVISION_REQUESTED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
class CourseCatalog extends sequelize_1.Model {
    static initModel(sequelize) {
        CourseCatalog.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            catalogYear: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1900,
                    max: 2100,
                },
            },
            catalogTerm: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            catalogName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(CourseStatus)),
                allowNull: false,
                defaultValue: CourseStatus.DRAFT,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            publishedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            publishedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            version: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'course_catalogs',
            timestamps: true,
            indexes: [
                { fields: ['catalogYear', 'catalogTerm'] },
                { fields: ['status'] },
                { fields: ['effectiveDate'] },
            ],
        });
        return CourseCatalog;
    }
}
exports.CourseCatalog = CourseCatalog;
class Course extends sequelize_1.Model {
    static initModel(sequelize) {
        Course.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            courseCode: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            subjectCode: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false,
            },
            courseNumber: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false,
            },
            courseTitle: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            longTitle: {
                type: sequelize_1.DataTypes.STRING(500),
                allowNull: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            creditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: false,
                validate: {
                    min: 0,
                    max: 99.99,
                },
            },
            minCreditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            maxCreditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            contactHours: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            },
            lectureHours: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            labHours: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            clinicalHours: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            courseLevel: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(CourseLevel)),
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(CourseStatus)),
                allowNull: false,
                defaultValue: CourseStatus.DRAFT,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            catalogId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'course_catalogs',
                    key: 'id',
                },
            },
            departmentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            collegeId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            instructionMethod: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(InstructionMethod)),
                allowNull: false,
                defaultValue: InstructionMethod.IN_PERSON,
            },
            gradingBasis: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(GradingBasis)),
                allowNull: false,
                defaultValue: GradingBasis.LETTER_GRADE,
            },
            repeatableForCredit: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            maxRepetitions: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            crossListedWith: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            attributes: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            fees: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            learningOutcomes: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            syllabus: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            prerequisites: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            corequisites: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            restrictedTo: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            approvalWorkflowId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            approvedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            approvedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            version: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
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
        });
        return Course;
    }
}
exports.Course = Course;
class CourseSection extends sequelize_1.Model {
    static initModel(sequelize) {
        CourseSection.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            courseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            sectionNumber: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false,
            },
            sectionCode: {
                type: sequelize_1.DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            termCode: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            academicYear: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(SectionStatus)),
                allowNull: false,
                defaultValue: SectionStatus.PLANNING,
            },
            enrollmentCapacity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            enrollmentCurrent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            waitlistCapacity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            waitlistCurrent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            instructionMethod: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(InstructionMethod)),
                allowNull: false,
            },
            meetingPatterns: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            instructorIds: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
                allowNull: true,
            },
            roomIds: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
                allowNull: true,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            censusDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            withdrawalDeadline: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            gradingBasis: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(GradingBasis)),
                allowNull: false,
            },
            crossListedWith: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
                allowNull: true,
            },
            combinedWith: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
                allowNull: true,
            },
            fees: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            schedulingRules: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
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
        });
        return CourseSection;
    }
}
exports.CourseSection = CourseSection;
class CoursePrerequisite extends sequelize_1.Model {
    static initModel(sequelize) {
        CoursePrerequisite.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            courseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            prerequisiteType: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PrerequisiteType)),
                allowNull: false,
            },
            prerequisiteCourseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            prerequisiteExpression: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            minimumGrade: {
                type: sequelize_1.DataTypes.STRING(5),
                allowNull: true,
            },
            testScore: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            enforced: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'course_prerequisites',
            timestamps: true,
            indexes: [
                { fields: ['courseId'] },
                { fields: ['prerequisiteCourseId'] },
                { fields: ['prerequisiteType'] },
            ],
        });
        return CoursePrerequisite;
    }
}
exports.CoursePrerequisite = CoursePrerequisite;
class CourseEquivalency extends sequelize_1.Model {
    static initModel(sequelize) {
        CourseEquivalency.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            courseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            equivalentCourseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            transferEquivalency: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            equivalencyType: {
                type: sequelize_1.DataTypes.ENUM('INTERNAL', 'TRANSFER', 'EXAM', 'PORTFOLIO'),
                allowNull: false,
            },
            creditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: false,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            approvedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            approvedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'course_equivalencies',
            timestamps: true,
            indexes: [
                { fields: ['courseId'] },
                { fields: ['equivalentCourseId'] },
                { fields: ['equivalencyType'] },
            ],
        });
        return CourseEquivalency;
    }
}
exports.CourseEquivalency = CourseEquivalency;
class CourseApprovalWorkflow extends sequelize_1.Model {
    static initModel(sequelize) {
        CourseApprovalWorkflow.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            courseId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
            },
            workflowType: {
                type: sequelize_1.DataTypes.ENUM('NEW_COURSE', 'MODIFICATION', 'DISCONTINUATION'),
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(ApprovalStatus)),
                allowNull: false,
                defaultValue: ApprovalStatus.DRAFT,
            },
            currentStepId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            submittedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            submittedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            approvalSteps: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            completedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'course_approval_workflows',
            timestamps: true,
            indexes: [
                { fields: ['courseId'] },
                { fields: ['status'] },
                { fields: ['workflowType'] },
            ],
        });
        return CourseApprovalWorkflow;
    }
}
exports.CourseApprovalWorkflow = CourseApprovalWorkflow;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreateCourseCatalogDto = (() => {
    var _a;
    let _catalogYear_decorators;
    let _catalogYear_initializers = [];
    let _catalogYear_extraInitializers = [];
    let _catalogTerm_decorators;
    let _catalogTerm_initializers = [];
    let _catalogTerm_extraInitializers = [];
    let _catalogName_decorators;
    let _catalogName_initializers = [];
    let _catalogName_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class CreateCourseCatalogDto {
            constructor() {
                this.catalogYear = __runInitializers(this, _catalogYear_initializers, void 0);
                this.catalogTerm = (__runInitializers(this, _catalogYear_extraInitializers), __runInitializers(this, _catalogTerm_initializers, void 0));
                this.catalogName = (__runInitializers(this, _catalogTerm_extraInitializers), __runInitializers(this, _catalogName_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _catalogName_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.description = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _catalogYear_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1900), (0, class_validator_1.Max)(2100)];
            _catalogTerm_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 20)];
            _catalogName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255)];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _catalogYear_decorators, { kind: "field", name: "catalogYear", static: false, private: false, access: { has: obj => "catalogYear" in obj, get: obj => obj.catalogYear, set: (obj, value) => { obj.catalogYear = value; } }, metadata: _metadata }, _catalogYear_initializers, _catalogYear_extraInitializers);
            __esDecorate(null, null, _catalogTerm_decorators, { kind: "field", name: "catalogTerm", static: false, private: false, access: { has: obj => "catalogTerm" in obj, get: obj => obj.catalogTerm, set: (obj, value) => { obj.catalogTerm = value; } }, metadata: _metadata }, _catalogTerm_initializers, _catalogTerm_extraInitializers);
            __esDecorate(null, null, _catalogName_decorators, { kind: "field", name: "catalogName", static: false, private: false, access: { has: obj => "catalogName" in obj, get: obj => obj.catalogName, set: (obj, value) => { obj.catalogName = value; } }, metadata: _metadata }, _catalogName_initializers, _catalogName_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCourseCatalogDto = CreateCourseCatalogDto;
let UpdateCourseCatalogDto = (() => {
    var _a;
    let _catalogName_decorators;
    let _catalogName_initializers = [];
    let _catalogName_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class UpdateCourseCatalogDto {
            constructor() {
                this.catalogName = __runInitializers(this, _catalogName_initializers, void 0);
                this.effectiveDate = (__runInitializers(this, _catalogName_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.status = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.description = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _catalogName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255)];
            _effectiveDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(CourseStatus)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _catalogName_decorators, { kind: "field", name: "catalogName", static: false, private: false, access: { has: obj => "catalogName" in obj, get: obj => obj.catalogName, set: (obj, value) => { obj.catalogName = value; } }, metadata: _metadata }, _catalogName_initializers, _catalogName_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCourseCatalogDto = UpdateCourseCatalogDto;
let CreateCourseDto = (() => {
    var _a;
    let _courseCode_decorators;
    let _courseCode_initializers = [];
    let _courseCode_extraInitializers = [];
    let _subjectCode_decorators;
    let _subjectCode_initializers = [];
    let _subjectCode_extraInitializers = [];
    let _courseNumber_decorators;
    let _courseNumber_initializers = [];
    let _courseNumber_extraInitializers = [];
    let _courseTitle_decorators;
    let _courseTitle_initializers = [];
    let _courseTitle_extraInitializers = [];
    let _longTitle_decorators;
    let _longTitle_initializers = [];
    let _longTitle_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _minCreditHours_decorators;
    let _minCreditHours_initializers = [];
    let _minCreditHours_extraInitializers = [];
    let _maxCreditHours_decorators;
    let _maxCreditHours_initializers = [];
    let _maxCreditHours_extraInitializers = [];
    let _contactHours_decorators;
    let _contactHours_initializers = [];
    let _contactHours_extraInitializers = [];
    let _lectureHours_decorators;
    let _lectureHours_initializers = [];
    let _lectureHours_extraInitializers = [];
    let _labHours_decorators;
    let _labHours_initializers = [];
    let _labHours_extraInitializers = [];
    let _clinicalHours_decorators;
    let _clinicalHours_initializers = [];
    let _clinicalHours_extraInitializers = [];
    let _courseLevel_decorators;
    let _courseLevel_initializers = [];
    let _courseLevel_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _catalogId_decorators;
    let _catalogId_initializers = [];
    let _catalogId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _collegeId_decorators;
    let _collegeId_initializers = [];
    let _collegeId_extraInitializers = [];
    let _instructionMethod_decorators;
    let _instructionMethod_initializers = [];
    let _instructionMethod_extraInitializers = [];
    let _gradingBasis_decorators;
    let _gradingBasis_initializers = [];
    let _gradingBasis_extraInitializers = [];
    let _repeatableForCredit_decorators;
    let _repeatableForCredit_initializers = [];
    let _repeatableForCredit_extraInitializers = [];
    let _maxRepetitions_decorators;
    let _maxRepetitions_initializers = [];
    let _maxRepetitions_extraInitializers = [];
    let _crossListedWith_decorators;
    let _crossListedWith_initializers = [];
    let _crossListedWith_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    let _fees_decorators;
    let _fees_initializers = [];
    let _fees_extraInitializers = [];
    let _learningOutcomes_decorators;
    let _learningOutcomes_initializers = [];
    let _learningOutcomes_extraInitializers = [];
    let _syllabus_decorators;
    let _syllabus_initializers = [];
    let _syllabus_extraInitializers = [];
    let _prerequisites_decorators;
    let _prerequisites_initializers = [];
    let _prerequisites_extraInitializers = [];
    let _corequisites_decorators;
    let _corequisites_initializers = [];
    let _corequisites_extraInitializers = [];
    let _restrictedTo_decorators;
    let _restrictedTo_initializers = [];
    let _restrictedTo_extraInitializers = [];
    return _a = class CreateCourseDto {
            constructor() {
                this.courseCode = __runInitializers(this, _courseCode_initializers, void 0);
                this.subjectCode = (__runInitializers(this, _courseCode_extraInitializers), __runInitializers(this, _subjectCode_initializers, void 0));
                this.courseNumber = (__runInitializers(this, _subjectCode_extraInitializers), __runInitializers(this, _courseNumber_initializers, void 0));
                this.courseTitle = (__runInitializers(this, _courseNumber_extraInitializers), __runInitializers(this, _courseTitle_initializers, void 0));
                this.longTitle = (__runInitializers(this, _courseTitle_extraInitializers), __runInitializers(this, _longTitle_initializers, void 0));
                this.description = (__runInitializers(this, _longTitle_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.creditHours = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.minCreditHours = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _minCreditHours_initializers, void 0));
                this.maxCreditHours = (__runInitializers(this, _minCreditHours_extraInitializers), __runInitializers(this, _maxCreditHours_initializers, void 0));
                this.contactHours = (__runInitializers(this, _maxCreditHours_extraInitializers), __runInitializers(this, _contactHours_initializers, void 0));
                this.lectureHours = (__runInitializers(this, _contactHours_extraInitializers), __runInitializers(this, _lectureHours_initializers, void 0));
                this.labHours = (__runInitializers(this, _lectureHours_extraInitializers), __runInitializers(this, _labHours_initializers, void 0));
                this.clinicalHours = (__runInitializers(this, _labHours_extraInitializers), __runInitializers(this, _clinicalHours_initializers, void 0));
                this.courseLevel = (__runInitializers(this, _clinicalHours_extraInitializers), __runInitializers(this, _courseLevel_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _courseLevel_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.catalogId = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _catalogId_initializers, void 0));
                this.departmentId = (__runInitializers(this, _catalogId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.collegeId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _collegeId_initializers, void 0));
                this.instructionMethod = (__runInitializers(this, _collegeId_extraInitializers), __runInitializers(this, _instructionMethod_initializers, void 0));
                this.gradingBasis = (__runInitializers(this, _instructionMethod_extraInitializers), __runInitializers(this, _gradingBasis_initializers, void 0));
                this.repeatableForCredit = (__runInitializers(this, _gradingBasis_extraInitializers), __runInitializers(this, _repeatableForCredit_initializers, void 0));
                this.maxRepetitions = (__runInitializers(this, _repeatableForCredit_extraInitializers), __runInitializers(this, _maxRepetitions_initializers, void 0));
                this.crossListedWith = (__runInitializers(this, _maxRepetitions_extraInitializers), __runInitializers(this, _crossListedWith_initializers, void 0));
                this.attributes = (__runInitializers(this, _crossListedWith_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
                this.fees = (__runInitializers(this, _attributes_extraInitializers), __runInitializers(this, _fees_initializers, void 0));
                this.learningOutcomes = (__runInitializers(this, _fees_extraInitializers), __runInitializers(this, _learningOutcomes_initializers, void 0));
                this.syllabus = (__runInitializers(this, _learningOutcomes_extraInitializers), __runInitializers(this, _syllabus_initializers, void 0));
                this.prerequisites = (__runInitializers(this, _syllabus_extraInitializers), __runInitializers(this, _prerequisites_initializers, void 0));
                this.corequisites = (__runInitializers(this, _prerequisites_extraInitializers), __runInitializers(this, _corequisites_initializers, void 0));
                this.restrictedTo = (__runInitializers(this, _corequisites_extraInitializers), __runInitializers(this, _restrictedTo_initializers, void 0));
                __runInitializers(this, _restrictedTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseCode_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 20), (0, class_validator_1.Matches)(/^[A-Z]{3,4}\s?\d{3,4}[A-Z]?$/, {
                    message: 'Course code must follow pattern: ABC 1234 or ABCD1234',
                })];
            _subjectCode_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 10)];
            _courseNumber_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 10)];
            _courseTitle_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255)];
            _longTitle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 500)];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(99.99)];
            _minCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _maxCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _contactHours_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lectureHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _labHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _clinicalHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _courseLevel_decorators = [(0, class_validator_1.IsEnum)(CourseLevel)];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _catalogId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _departmentId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _collegeId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _instructionMethod_decorators = [(0, class_validator_1.IsEnum)(InstructionMethod)];
            _gradingBasis_decorators = [(0, class_validator_1.IsEnum)(GradingBasis)];
            _repeatableForCredit_decorators = [(0, class_validator_1.IsBoolean)()];
            _maxRepetitions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _crossListedWith_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _attributes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _fees_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _learningOutcomes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _syllabus_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _prerequisites_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _corequisites_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _restrictedTo_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _courseCode_decorators, { kind: "field", name: "courseCode", static: false, private: false, access: { has: obj => "courseCode" in obj, get: obj => obj.courseCode, set: (obj, value) => { obj.courseCode = value; } }, metadata: _metadata }, _courseCode_initializers, _courseCode_extraInitializers);
            __esDecorate(null, null, _subjectCode_decorators, { kind: "field", name: "subjectCode", static: false, private: false, access: { has: obj => "subjectCode" in obj, get: obj => obj.subjectCode, set: (obj, value) => { obj.subjectCode = value; } }, metadata: _metadata }, _subjectCode_initializers, _subjectCode_extraInitializers);
            __esDecorate(null, null, _courseNumber_decorators, { kind: "field", name: "courseNumber", static: false, private: false, access: { has: obj => "courseNumber" in obj, get: obj => obj.courseNumber, set: (obj, value) => { obj.courseNumber = value; } }, metadata: _metadata }, _courseNumber_initializers, _courseNumber_extraInitializers);
            __esDecorate(null, null, _courseTitle_decorators, { kind: "field", name: "courseTitle", static: false, private: false, access: { has: obj => "courseTitle" in obj, get: obj => obj.courseTitle, set: (obj, value) => { obj.courseTitle = value; } }, metadata: _metadata }, _courseTitle_initializers, _courseTitle_extraInitializers);
            __esDecorate(null, null, _longTitle_decorators, { kind: "field", name: "longTitle", static: false, private: false, access: { has: obj => "longTitle" in obj, get: obj => obj.longTitle, set: (obj, value) => { obj.longTitle = value; } }, metadata: _metadata }, _longTitle_initializers, _longTitle_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _minCreditHours_decorators, { kind: "field", name: "minCreditHours", static: false, private: false, access: { has: obj => "minCreditHours" in obj, get: obj => obj.minCreditHours, set: (obj, value) => { obj.minCreditHours = value; } }, metadata: _metadata }, _minCreditHours_initializers, _minCreditHours_extraInitializers);
            __esDecorate(null, null, _maxCreditHours_decorators, { kind: "field", name: "maxCreditHours", static: false, private: false, access: { has: obj => "maxCreditHours" in obj, get: obj => obj.maxCreditHours, set: (obj, value) => { obj.maxCreditHours = value; } }, metadata: _metadata }, _maxCreditHours_initializers, _maxCreditHours_extraInitializers);
            __esDecorate(null, null, _contactHours_decorators, { kind: "field", name: "contactHours", static: false, private: false, access: { has: obj => "contactHours" in obj, get: obj => obj.contactHours, set: (obj, value) => { obj.contactHours = value; } }, metadata: _metadata }, _contactHours_initializers, _contactHours_extraInitializers);
            __esDecorate(null, null, _lectureHours_decorators, { kind: "field", name: "lectureHours", static: false, private: false, access: { has: obj => "lectureHours" in obj, get: obj => obj.lectureHours, set: (obj, value) => { obj.lectureHours = value; } }, metadata: _metadata }, _lectureHours_initializers, _lectureHours_extraInitializers);
            __esDecorate(null, null, _labHours_decorators, { kind: "field", name: "labHours", static: false, private: false, access: { has: obj => "labHours" in obj, get: obj => obj.labHours, set: (obj, value) => { obj.labHours = value; } }, metadata: _metadata }, _labHours_initializers, _labHours_extraInitializers);
            __esDecorate(null, null, _clinicalHours_decorators, { kind: "field", name: "clinicalHours", static: false, private: false, access: { has: obj => "clinicalHours" in obj, get: obj => obj.clinicalHours, set: (obj, value) => { obj.clinicalHours = value; } }, metadata: _metadata }, _clinicalHours_initializers, _clinicalHours_extraInitializers);
            __esDecorate(null, null, _courseLevel_decorators, { kind: "field", name: "courseLevel", static: false, private: false, access: { has: obj => "courseLevel" in obj, get: obj => obj.courseLevel, set: (obj, value) => { obj.courseLevel = value; } }, metadata: _metadata }, _courseLevel_initializers, _courseLevel_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _catalogId_decorators, { kind: "field", name: "catalogId", static: false, private: false, access: { has: obj => "catalogId" in obj, get: obj => obj.catalogId, set: (obj, value) => { obj.catalogId = value; } }, metadata: _metadata }, _catalogId_initializers, _catalogId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _collegeId_decorators, { kind: "field", name: "collegeId", static: false, private: false, access: { has: obj => "collegeId" in obj, get: obj => obj.collegeId, set: (obj, value) => { obj.collegeId = value; } }, metadata: _metadata }, _collegeId_initializers, _collegeId_extraInitializers);
            __esDecorate(null, null, _instructionMethod_decorators, { kind: "field", name: "instructionMethod", static: false, private: false, access: { has: obj => "instructionMethod" in obj, get: obj => obj.instructionMethod, set: (obj, value) => { obj.instructionMethod = value; } }, metadata: _metadata }, _instructionMethod_initializers, _instructionMethod_extraInitializers);
            __esDecorate(null, null, _gradingBasis_decorators, { kind: "field", name: "gradingBasis", static: false, private: false, access: { has: obj => "gradingBasis" in obj, get: obj => obj.gradingBasis, set: (obj, value) => { obj.gradingBasis = value; } }, metadata: _metadata }, _gradingBasis_initializers, _gradingBasis_extraInitializers);
            __esDecorate(null, null, _repeatableForCredit_decorators, { kind: "field", name: "repeatableForCredit", static: false, private: false, access: { has: obj => "repeatableForCredit" in obj, get: obj => obj.repeatableForCredit, set: (obj, value) => { obj.repeatableForCredit = value; } }, metadata: _metadata }, _repeatableForCredit_initializers, _repeatableForCredit_extraInitializers);
            __esDecorate(null, null, _maxRepetitions_decorators, { kind: "field", name: "maxRepetitions", static: false, private: false, access: { has: obj => "maxRepetitions" in obj, get: obj => obj.maxRepetitions, set: (obj, value) => { obj.maxRepetitions = value; } }, metadata: _metadata }, _maxRepetitions_initializers, _maxRepetitions_extraInitializers);
            __esDecorate(null, null, _crossListedWith_decorators, { kind: "field", name: "crossListedWith", static: false, private: false, access: { has: obj => "crossListedWith" in obj, get: obj => obj.crossListedWith, set: (obj, value) => { obj.crossListedWith = value; } }, metadata: _metadata }, _crossListedWith_initializers, _crossListedWith_extraInitializers);
            __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
            __esDecorate(null, null, _fees_decorators, { kind: "field", name: "fees", static: false, private: false, access: { has: obj => "fees" in obj, get: obj => obj.fees, set: (obj, value) => { obj.fees = value; } }, metadata: _metadata }, _fees_initializers, _fees_extraInitializers);
            __esDecorate(null, null, _learningOutcomes_decorators, { kind: "field", name: "learningOutcomes", static: false, private: false, access: { has: obj => "learningOutcomes" in obj, get: obj => obj.learningOutcomes, set: (obj, value) => { obj.learningOutcomes = value; } }, metadata: _metadata }, _learningOutcomes_initializers, _learningOutcomes_extraInitializers);
            __esDecorate(null, null, _syllabus_decorators, { kind: "field", name: "syllabus", static: false, private: false, access: { has: obj => "syllabus" in obj, get: obj => obj.syllabus, set: (obj, value) => { obj.syllabus = value; } }, metadata: _metadata }, _syllabus_initializers, _syllabus_extraInitializers);
            __esDecorate(null, null, _prerequisites_decorators, { kind: "field", name: "prerequisites", static: false, private: false, access: { has: obj => "prerequisites" in obj, get: obj => obj.prerequisites, set: (obj, value) => { obj.prerequisites = value; } }, metadata: _metadata }, _prerequisites_initializers, _prerequisites_extraInitializers);
            __esDecorate(null, null, _corequisites_decorators, { kind: "field", name: "corequisites", static: false, private: false, access: { has: obj => "corequisites" in obj, get: obj => obj.corequisites, set: (obj, value) => { obj.corequisites = value; } }, metadata: _metadata }, _corequisites_initializers, _corequisites_extraInitializers);
            __esDecorate(null, null, _restrictedTo_decorators, { kind: "field", name: "restrictedTo", static: false, private: false, access: { has: obj => "restrictedTo" in obj, get: obj => obj.restrictedTo, set: (obj, value) => { obj.restrictedTo = value; } }, metadata: _metadata }, _restrictedTo_initializers, _restrictedTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCourseDto = CreateCourseDto;
let UpdateCourseDto = (() => {
    var _a;
    let _courseTitle_decorators;
    let _courseTitle_initializers = [];
    let _courseTitle_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _instructionMethod_decorators;
    let _instructionMethod_initializers = [];
    let _instructionMethod_extraInitializers = [];
    let _fees_decorators;
    let _fees_initializers = [];
    let _fees_extraInitializers = [];
    let _syllabus_decorators;
    let _syllabus_initializers = [];
    let _syllabus_extraInitializers = [];
    return _a = class UpdateCourseDto {
            constructor() {
                this.courseTitle = __runInitializers(this, _courseTitle_initializers, void 0);
                this.description = (__runInitializers(this, _courseTitle_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.creditHours = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.status = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.instructionMethod = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _instructionMethod_initializers, void 0));
                this.fees = (__runInitializers(this, _instructionMethod_extraInitializers), __runInitializers(this, _fees_initializers, void 0));
                this.syllabus = (__runInitializers(this, _fees_extraInitializers), __runInitializers(this, _syllabus_initializers, void 0));
                __runInitializers(this, _syllabus_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseTitle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 255)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _creditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(CourseStatus)];
            _instructionMethod_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(InstructionMethod)];
            _fees_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true })];
            _syllabus_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _courseTitle_decorators, { kind: "field", name: "courseTitle", static: false, private: false, access: { has: obj => "courseTitle" in obj, get: obj => obj.courseTitle, set: (obj, value) => { obj.courseTitle = value; } }, metadata: _metadata }, _courseTitle_initializers, _courseTitle_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _instructionMethod_decorators, { kind: "field", name: "instructionMethod", static: false, private: false, access: { has: obj => "instructionMethod" in obj, get: obj => obj.instructionMethod, set: (obj, value) => { obj.instructionMethod = value; } }, metadata: _metadata }, _instructionMethod_initializers, _instructionMethod_extraInitializers);
            __esDecorate(null, null, _fees_decorators, { kind: "field", name: "fees", static: false, private: false, access: { has: obj => "fees" in obj, get: obj => obj.fees, set: (obj, value) => { obj.fees = value; } }, metadata: _metadata }, _fees_initializers, _fees_extraInitializers);
            __esDecorate(null, null, _syllabus_decorators, { kind: "field", name: "syllabus", static: false, private: false, access: { has: obj => "syllabus" in obj, get: obj => obj.syllabus, set: (obj, value) => { obj.syllabus = value; } }, metadata: _metadata }, _syllabus_initializers, _syllabus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCourseDto = UpdateCourseDto;
let CreateCourseSectionDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _sectionNumber_decorators;
    let _sectionNumber_initializers = [];
    let _sectionNumber_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _termCode_decorators;
    let _termCode_initializers = [];
    let _termCode_extraInitializers = [];
    let _academicYear_decorators;
    let _academicYear_initializers = [];
    let _academicYear_extraInitializers = [];
    let _enrollmentCapacity_decorators;
    let _enrollmentCapacity_initializers = [];
    let _enrollmentCapacity_extraInitializers = [];
    let _waitlistCapacity_decorators;
    let _waitlistCapacity_initializers = [];
    let _waitlistCapacity_extraInitializers = [];
    let _instructionMethod_decorators;
    let _instructionMethod_initializers = [];
    let _instructionMethod_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _gradingBasis_decorators;
    let _gradingBasis_initializers = [];
    let _gradingBasis_extraInitializers = [];
    let _instructorIds_decorators;
    let _instructorIds_initializers = [];
    let _instructorIds_extraInitializers = [];
    let _roomIds_decorators;
    let _roomIds_initializers = [];
    let _roomIds_extraInitializers = [];
    return _a = class CreateCourseSectionDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.sectionNumber = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _sectionNumber_initializers, void 0));
                this.termId = (__runInitializers(this, _sectionNumber_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.termCode = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _termCode_initializers, void 0));
                this.academicYear = (__runInitializers(this, _termCode_extraInitializers), __runInitializers(this, _academicYear_initializers, void 0));
                this.enrollmentCapacity = (__runInitializers(this, _academicYear_extraInitializers), __runInitializers(this, _enrollmentCapacity_initializers, void 0));
                this.waitlistCapacity = (__runInitializers(this, _enrollmentCapacity_extraInitializers), __runInitializers(this, _waitlistCapacity_initializers, void 0));
                this.instructionMethod = (__runInitializers(this, _waitlistCapacity_extraInitializers), __runInitializers(this, _instructionMethod_initializers, void 0));
                this.startDate = (__runInitializers(this, _instructionMethod_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.gradingBasis = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _gradingBasis_initializers, void 0));
                this.instructorIds = (__runInitializers(this, _gradingBasis_extraInitializers), __runInitializers(this, _instructorIds_initializers, void 0));
                this.roomIds = (__runInitializers(this, _instructorIds_extraInitializers), __runInitializers(this, _roomIds_initializers, void 0));
                __runInitializers(this, _roomIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, class_validator_1.IsNumber)()];
            _sectionNumber_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 10)];
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _termCode_decorators = [(0, class_validator_1.IsString)()];
            _academicYear_decorators = [(0, class_validator_1.IsNumber)()];
            _enrollmentCapacity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _waitlistCapacity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _instructionMethod_decorators = [(0, class_validator_1.IsEnum)(InstructionMethod)];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _gradingBasis_decorators = [(0, class_validator_1.IsEnum)(GradingBasis)];
            _instructorIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            _roomIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _sectionNumber_decorators, { kind: "field", name: "sectionNumber", static: false, private: false, access: { has: obj => "sectionNumber" in obj, get: obj => obj.sectionNumber, set: (obj, value) => { obj.sectionNumber = value; } }, metadata: _metadata }, _sectionNumber_initializers, _sectionNumber_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _termCode_decorators, { kind: "field", name: "termCode", static: false, private: false, access: { has: obj => "termCode" in obj, get: obj => obj.termCode, set: (obj, value) => { obj.termCode = value; } }, metadata: _metadata }, _termCode_initializers, _termCode_extraInitializers);
            __esDecorate(null, null, _academicYear_decorators, { kind: "field", name: "academicYear", static: false, private: false, access: { has: obj => "academicYear" in obj, get: obj => obj.academicYear, set: (obj, value) => { obj.academicYear = value; } }, metadata: _metadata }, _academicYear_initializers, _academicYear_extraInitializers);
            __esDecorate(null, null, _enrollmentCapacity_decorators, { kind: "field", name: "enrollmentCapacity", static: false, private: false, access: { has: obj => "enrollmentCapacity" in obj, get: obj => obj.enrollmentCapacity, set: (obj, value) => { obj.enrollmentCapacity = value; } }, metadata: _metadata }, _enrollmentCapacity_initializers, _enrollmentCapacity_extraInitializers);
            __esDecorate(null, null, _waitlistCapacity_decorators, { kind: "field", name: "waitlistCapacity", static: false, private: false, access: { has: obj => "waitlistCapacity" in obj, get: obj => obj.waitlistCapacity, set: (obj, value) => { obj.waitlistCapacity = value; } }, metadata: _metadata }, _waitlistCapacity_initializers, _waitlistCapacity_extraInitializers);
            __esDecorate(null, null, _instructionMethod_decorators, { kind: "field", name: "instructionMethod", static: false, private: false, access: { has: obj => "instructionMethod" in obj, get: obj => obj.instructionMethod, set: (obj, value) => { obj.instructionMethod = value; } }, metadata: _metadata }, _instructionMethod_initializers, _instructionMethod_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _gradingBasis_decorators, { kind: "field", name: "gradingBasis", static: false, private: false, access: { has: obj => "gradingBasis" in obj, get: obj => obj.gradingBasis, set: (obj, value) => { obj.gradingBasis = value; } }, metadata: _metadata }, _gradingBasis_initializers, _gradingBasis_extraInitializers);
            __esDecorate(null, null, _instructorIds_decorators, { kind: "field", name: "instructorIds", static: false, private: false, access: { has: obj => "instructorIds" in obj, get: obj => obj.instructorIds, set: (obj, value) => { obj.instructorIds = value; } }, metadata: _metadata }, _instructorIds_initializers, _instructorIds_extraInitializers);
            __esDecorate(null, null, _roomIds_decorators, { kind: "field", name: "roomIds", static: false, private: false, access: { has: obj => "roomIds" in obj, get: obj => obj.roomIds, set: (obj, value) => { obj.roomIds = value; } }, metadata: _metadata }, _roomIds_initializers, _roomIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCourseSectionDto = CreateCourseSectionDto;
let UpdateCourseSectionDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _enrollmentCapacity_decorators;
    let _enrollmentCapacity_initializers = [];
    let _enrollmentCapacity_extraInitializers = [];
    let _waitlistCapacity_decorators;
    let _waitlistCapacity_initializers = [];
    let _waitlistCapacity_extraInitializers = [];
    let _instructorIds_decorators;
    let _instructorIds_initializers = [];
    let _instructorIds_extraInitializers = [];
    let _roomIds_decorators;
    let _roomIds_initializers = [];
    let _roomIds_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateCourseSectionDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.enrollmentCapacity = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _enrollmentCapacity_initializers, void 0));
                this.waitlistCapacity = (__runInitializers(this, _enrollmentCapacity_extraInitializers), __runInitializers(this, _waitlistCapacity_initializers, void 0));
                this.instructorIds = (__runInitializers(this, _waitlistCapacity_extraInitializers), __runInitializers(this, _instructorIds_initializers, void 0));
                this.roomIds = (__runInitializers(this, _instructorIds_extraInitializers), __runInitializers(this, _roomIds_initializers, void 0));
                this.notes = (__runInitializers(this, _roomIds_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(SectionStatus)];
            _enrollmentCapacity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _waitlistCapacity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _instructorIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            _roomIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _enrollmentCapacity_decorators, { kind: "field", name: "enrollmentCapacity", static: false, private: false, access: { has: obj => "enrollmentCapacity" in obj, get: obj => obj.enrollmentCapacity, set: (obj, value) => { obj.enrollmentCapacity = value; } }, metadata: _metadata }, _enrollmentCapacity_initializers, _enrollmentCapacity_extraInitializers);
            __esDecorate(null, null, _waitlistCapacity_decorators, { kind: "field", name: "waitlistCapacity", static: false, private: false, access: { has: obj => "waitlistCapacity" in obj, get: obj => obj.waitlistCapacity, set: (obj, value) => { obj.waitlistCapacity = value; } }, metadata: _metadata }, _waitlistCapacity_initializers, _waitlistCapacity_extraInitializers);
            __esDecorate(null, null, _instructorIds_decorators, { kind: "field", name: "instructorIds", static: false, private: false, access: { has: obj => "instructorIds" in obj, get: obj => obj.instructorIds, set: (obj, value) => { obj.instructorIds = value; } }, metadata: _metadata }, _instructorIds_initializers, _instructorIds_extraInitializers);
            __esDecorate(null, null, _roomIds_decorators, { kind: "field", name: "roomIds", static: false, private: false, access: { has: obj => "roomIds" in obj, get: obj => obj.roomIds, set: (obj, value) => { obj.roomIds = value; } }, metadata: _metadata }, _roomIds_initializers, _roomIds_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCourseSectionDto = UpdateCourseSectionDto;
let CreateCoursePrerequisiteDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _prerequisiteType_decorators;
    let _prerequisiteType_initializers = [];
    let _prerequisiteType_extraInitializers = [];
    let _prerequisiteCourseId_decorators;
    let _prerequisiteCourseId_initializers = [];
    let _prerequisiteCourseId_extraInitializers = [];
    let _prerequisiteExpression_decorators;
    let _prerequisiteExpression_initializers = [];
    let _prerequisiteExpression_extraInitializers = [];
    let _minimumGrade_decorators;
    let _minimumGrade_initializers = [];
    let _minimumGrade_extraInitializers = [];
    let _enforced_decorators;
    let _enforced_initializers = [];
    let _enforced_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class CreateCoursePrerequisiteDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.prerequisiteType = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _prerequisiteType_initializers, void 0));
                this.prerequisiteCourseId = (__runInitializers(this, _prerequisiteType_extraInitializers), __runInitializers(this, _prerequisiteCourseId_initializers, void 0));
                this.prerequisiteExpression = (__runInitializers(this, _prerequisiteCourseId_extraInitializers), __runInitializers(this, _prerequisiteExpression_initializers, void 0));
                this.minimumGrade = (__runInitializers(this, _prerequisiteExpression_extraInitializers), __runInitializers(this, _minimumGrade_initializers, void 0));
                this.enforced = (__runInitializers(this, _minimumGrade_extraInitializers), __runInitializers(this, _enforced_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _enforced_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, class_validator_1.IsNumber)()];
            _prerequisiteType_decorators = [(0, class_validator_1.IsEnum)(PrerequisiteType)];
            _prerequisiteCourseId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _prerequisiteExpression_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _minimumGrade_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _enforced_decorators = [(0, class_validator_1.IsBoolean)()];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _prerequisiteType_decorators, { kind: "field", name: "prerequisiteType", static: false, private: false, access: { has: obj => "prerequisiteType" in obj, get: obj => obj.prerequisiteType, set: (obj, value) => { obj.prerequisiteType = value; } }, metadata: _metadata }, _prerequisiteType_initializers, _prerequisiteType_extraInitializers);
            __esDecorate(null, null, _prerequisiteCourseId_decorators, { kind: "field", name: "prerequisiteCourseId", static: false, private: false, access: { has: obj => "prerequisiteCourseId" in obj, get: obj => obj.prerequisiteCourseId, set: (obj, value) => { obj.prerequisiteCourseId = value; } }, metadata: _metadata }, _prerequisiteCourseId_initializers, _prerequisiteCourseId_extraInitializers);
            __esDecorate(null, null, _prerequisiteExpression_decorators, { kind: "field", name: "prerequisiteExpression", static: false, private: false, access: { has: obj => "prerequisiteExpression" in obj, get: obj => obj.prerequisiteExpression, set: (obj, value) => { obj.prerequisiteExpression = value; } }, metadata: _metadata }, _prerequisiteExpression_initializers, _prerequisiteExpression_extraInitializers);
            __esDecorate(null, null, _minimumGrade_decorators, { kind: "field", name: "minimumGrade", static: false, private: false, access: { has: obj => "minimumGrade" in obj, get: obj => obj.minimumGrade, set: (obj, value) => { obj.minimumGrade = value; } }, metadata: _metadata }, _minimumGrade_initializers, _minimumGrade_extraInitializers);
            __esDecorate(null, null, _enforced_decorators, { kind: "field", name: "enforced", static: false, private: false, access: { has: obj => "enforced" in obj, get: obj => obj.enforced, set: (obj, value) => { obj.enforced = value; } }, metadata: _metadata }, _enforced_initializers, _enforced_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCoursePrerequisiteDto = CreateCoursePrerequisiteDto;
let CreateCourseEquivalencyDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _equivalentCourseId_decorators;
    let _equivalentCourseId_initializers = [];
    let _equivalentCourseId_extraInitializers = [];
    let _transferEquivalency_decorators;
    let _transferEquivalency_initializers = [];
    let _transferEquivalency_extraInitializers = [];
    let _equivalencyType_decorators;
    let _equivalencyType_initializers = [];
    let _equivalencyType_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class CreateCourseEquivalencyDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.equivalentCourseId = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _equivalentCourseId_initializers, void 0));
                this.transferEquivalency = (__runInitializers(this, _equivalentCourseId_extraInitializers), __runInitializers(this, _transferEquivalency_initializers, void 0));
                this.equivalencyType = (__runInitializers(this, _transferEquivalency_extraInitializers), __runInitializers(this, _equivalencyType_initializers, void 0));
                this.creditHours = (__runInitializers(this, _equivalencyType_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, class_validator_1.IsNumber)()];
            _equivalentCourseId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _transferEquivalency_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _equivalencyType_decorators = [(0, class_validator_1.IsEnum)(['INTERNAL', 'TRANSFER', 'EXAM', 'PORTFOLIO'])];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)()];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _equivalentCourseId_decorators, { kind: "field", name: "equivalentCourseId", static: false, private: false, access: { has: obj => "equivalentCourseId" in obj, get: obj => obj.equivalentCourseId, set: (obj, value) => { obj.equivalentCourseId = value; } }, metadata: _metadata }, _equivalentCourseId_initializers, _equivalentCourseId_extraInitializers);
            __esDecorate(null, null, _transferEquivalency_decorators, { kind: "field", name: "transferEquivalency", static: false, private: false, access: { has: obj => "transferEquivalency" in obj, get: obj => obj.transferEquivalency, set: (obj, value) => { obj.transferEquivalency = value; } }, metadata: _metadata }, _transferEquivalency_initializers, _transferEquivalency_extraInitializers);
            __esDecorate(null, null, _equivalencyType_decorators, { kind: "field", name: "equivalencyType", static: false, private: false, access: { has: obj => "equivalencyType" in obj, get: obj => obj.equivalencyType, set: (obj, value) => { obj.equivalencyType = value; } }, metadata: _metadata }, _equivalencyType_initializers, _equivalencyType_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCourseEquivalencyDto = CreateCourseEquivalencyDto;
let CourseSearchQueryDto = (() => {
    var _a;
    let _subjectCode_decorators;
    let _subjectCode_initializers = [];
    let _subjectCode_extraInitializers = [];
    let _courseNumber_decorators;
    let _courseNumber_initializers = [];
    let _courseNumber_extraInitializers = [];
    let _keyword_decorators;
    let _keyword_initializers = [];
    let _keyword_extraInitializers = [];
    let _courseLevel_decorators;
    let _courseLevel_initializers = [];
    let _courseLevel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _catalogId_decorators;
    let _catalogId_initializers = [];
    let _catalogId_extraInitializers = [];
    let _minCreditHours_decorators;
    let _minCreditHours_initializers = [];
    let _minCreditHours_extraInitializers = [];
    let _maxCreditHours_decorators;
    let _maxCreditHours_initializers = [];
    let _maxCreditHours_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    return _a = class CourseSearchQueryDto {
            constructor() {
                this.subjectCode = __runInitializers(this, _subjectCode_initializers, void 0);
                this.courseNumber = (__runInitializers(this, _subjectCode_extraInitializers), __runInitializers(this, _courseNumber_initializers, void 0));
                this.keyword = (__runInitializers(this, _courseNumber_extraInitializers), __runInitializers(this, _keyword_initializers, void 0));
                this.courseLevel = (__runInitializers(this, _keyword_extraInitializers), __runInitializers(this, _courseLevel_initializers, void 0));
                this.status = (__runInitializers(this, _courseLevel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.catalogId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _catalogId_initializers, void 0));
                this.minCreditHours = (__runInitializers(this, _catalogId_extraInitializers), __runInitializers(this, _minCreditHours_initializers, void 0));
                this.maxCreditHours = (__runInitializers(this, _minCreditHours_extraInitializers), __runInitializers(this, _maxCreditHours_initializers, void 0));
                this.page = (__runInitializers(this, _maxCreditHours_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                __runInitializers(this, _limit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subjectCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _courseNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _keyword_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _courseLevel_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(CourseLevel)];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(CourseStatus)];
            _catalogId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(() => Number)];
            _minCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(() => Number)];
            _maxCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(() => Number)];
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _subjectCode_decorators, { kind: "field", name: "subjectCode", static: false, private: false, access: { has: obj => "subjectCode" in obj, get: obj => obj.subjectCode, set: (obj, value) => { obj.subjectCode = value; } }, metadata: _metadata }, _subjectCode_initializers, _subjectCode_extraInitializers);
            __esDecorate(null, null, _courseNumber_decorators, { kind: "field", name: "courseNumber", static: false, private: false, access: { has: obj => "courseNumber" in obj, get: obj => obj.courseNumber, set: (obj, value) => { obj.courseNumber = value; } }, metadata: _metadata }, _courseNumber_initializers, _courseNumber_extraInitializers);
            __esDecorate(null, null, _keyword_decorators, { kind: "field", name: "keyword", static: false, private: false, access: { has: obj => "keyword" in obj, get: obj => obj.keyword, set: (obj, value) => { obj.keyword = value; } }, metadata: _metadata }, _keyword_initializers, _keyword_extraInitializers);
            __esDecorate(null, null, _courseLevel_decorators, { kind: "field", name: "courseLevel", static: false, private: false, access: { has: obj => "courseLevel" in obj, get: obj => obj.courseLevel, set: (obj, value) => { obj.courseLevel = value; } }, metadata: _metadata }, _courseLevel_initializers, _courseLevel_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _catalogId_decorators, { kind: "field", name: "catalogId", static: false, private: false, access: { has: obj => "catalogId" in obj, get: obj => obj.catalogId, set: (obj, value) => { obj.catalogId = value; } }, metadata: _metadata }, _catalogId_initializers, _catalogId_extraInitializers);
            __esDecorate(null, null, _minCreditHours_decorators, { kind: "field", name: "minCreditHours", static: false, private: false, access: { has: obj => "minCreditHours" in obj, get: obj => obj.minCreditHours, set: (obj, value) => { obj.minCreditHours = value; } }, metadata: _metadata }, _minCreditHours_initializers, _minCreditHours_extraInitializers);
            __esDecorate(null, null, _maxCreditHours_decorators, { kind: "field", name: "maxCreditHours", static: false, private: false, access: { has: obj => "maxCreditHours" in obj, get: obj => obj.maxCreditHours, set: (obj, value) => { obj.maxCreditHours = value; } }, metadata: _metadata }, _maxCreditHours_initializers, _maxCreditHours_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CourseSearchQueryDto = CourseSearchQueryDto;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Creates a new course catalog
 */
async function createCourseCatalog(data, sequelize, transaction) {
    return CourseCatalog.create({
        ...data,
        status: CourseStatus.DRAFT,
        version: 1,
    }, { transaction });
}
/**
 * Updates an existing course catalog
 */
async function updateCourseCatalog(catalogId, data, sequelize, transaction) {
    const catalog = await CourseCatalog.findByPk(catalogId, { transaction });
    if (!catalog) {
        throw new Error(`Course catalog with ID ${catalogId} not found`);
    }
    return catalog.update(data, { transaction });
}
/**
 * Publishes a course catalog
 */
async function publishCourseCatalog(catalogId, publishedBy, sequelize, transaction) {
    const catalog = await CourseCatalog.findByPk(catalogId, { transaction });
    if (!catalog) {
        throw new Error(`Course catalog with ID ${catalogId} not found`);
    }
    return catalog.update({
        status: CourseStatus.ACTIVE,
        publishedDate: new Date(),
        publishedBy,
    }, { transaction });
}
/**
 * Creates a new course
 */
async function createCourse(data, sequelize, transaction) {
    return Course.create({
        ...data,
        status: CourseStatus.DRAFT,
        version: 1,
    }, { transaction });
}
/**
 * Updates an existing course
 */
async function updateCourse(courseId, data, sequelize, transaction) {
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
async function getCourseByCode(courseCode, sequelize) {
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
async function searchCourses(query, sequelize) {
    const where = {};
    if (query.subjectCode) {
        where.subjectCode = query.subjectCode;
    }
    if (query.courseNumber) {
        where.courseNumber = query.courseNumber;
    }
    if (query.keyword) {
        where[sequelize_1.Op.or] = [
            { courseTitle: { [sequelize_1.Op.iLike]: `%${query.keyword}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${query.keyword}%` } },
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
            where.creditHours[sequelize_1.Op.gte] = query.minCreditHours;
        }
        if (query.maxCreditHours !== undefined) {
            where.creditHours[sequelize_1.Op.lte] = query.maxCreditHours;
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
async function createCourseSection(data, sequelize, transaction) {
    const course = await Course.findByPk(data.courseId, { transaction });
    if (!course) {
        throw new Error(`Course with ID ${data.courseId} not found`);
    }
    const sectionCode = `${course.courseCode}-${data.sectionNumber}-${data.termCode}`;
    return CourseSection.create({
        ...data,
        sectionCode,
        status: SectionStatus.PLANNING,
        enrollmentCurrent: 0,
        waitlistCurrent: 0,
    }, { transaction });
}
/**
 * Updates a course section
 */
async function updateCourseSection(sectionId, data, sequelize, transaction) {
    const section = await CourseSection.findByPk(sectionId, { transaction });
    if (!section) {
        throw new Error(`Course section with ID ${sectionId} not found`);
    }
    return section.update(data, { transaction });
}
/**
 * Gets available sections for a course in a term
 */
async function getAvailableSections(courseId, termId, sequelize) {
    return CourseSection.findAll({
        where: {
            courseId,
            termId,
            status: {
                [sequelize_1.Op.in]: [SectionStatus.OPEN, SectionStatus.WAITLIST],
            },
        },
        include: [{ model: Course, as: 'course' }],
    });
}
/**
 * Checks section capacity availability
 */
async function checkSectionCapacity(sectionId, sequelize) {
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
async function incrementSectionEnrollment(sectionId, sequelize, transaction) {
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
        }
        else {
            await section.update({ status: SectionStatus.FULL }, { transaction });
        }
    }
    return section;
}
/**
 * Decrements section enrollment
 */
async function decrementSectionEnrollment(sectionId, sequelize, transaction) {
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
async function addCoursePrerequisite(data, sequelize, transaction) {
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
async function validatePrerequisites(courseId, studentId, studentTranscript, sequelize) {
    const prerequisites = await CoursePrerequisite.findAll({
        where: {
            courseId,
            enforced: true,
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
        },
    });
    const missingPrerequisites = [];
    for (const prereq of prerequisites) {
        if (prereq.prerequisiteCourseId) {
            const completed = studentTranscript.some((record) => record.courseId === prereq.prerequisiteCourseId &&
                record.grade &&
                (!prereq.minimumGrade || record.grade >= prereq.minimumGrade));
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
async function getCoursePrerequisites(courseId, sequelize) {
    return CoursePrerequisite.findAll({
        where: { courseId },
        order: [['prerequisiteType', 'ASC']],
    });
}
/**
 * Adds a course equivalency
 */
async function addCourseEquivalency(data, sequelize, transaction) {
    return CourseEquivalency.create(data, { transaction });
}
/**
 * Gets course equivalencies
 */
async function getCourseEquivalencies(courseId, sequelize) {
    return CourseEquivalency.findAll({
        where: { courseId },
        order: [['equivalencyType', 'ASC']],
    });
}
/**
 * Finds transfer equivalency for a course
 */
async function findTransferEquivalency(institutionId, externalCourseCode, sequelize) {
    return CourseEquivalency.findOne({
        where: {
            equivalencyType: 'TRANSFER',
            transferEquivalency: {
                institutionId,
                externalCourseCode,
            },
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
        },
    });
}
/**
 * Adds course attributes
 */
async function addCourseAttributes(courseId, attributes, sequelize, transaction) {
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
async function updateCourseFees(courseId, fees, sequelize, transaction) {
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
    }
    return course.update({ fees }, { transaction });
}
/**
 * Adds learning outcomes to a course
 */
async function addLearningOutcomes(courseId, outcomes, sequelize, transaction) {
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
async function updateCourseDescription(courseId, description, sequelize, transaction) {
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
async function updateCourseSyllabus(courseId, syllabus, sequelize, transaction) {
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
    }
    return course.update({ syllabus }, { transaction });
}
/**
 * Cross-lists courses
 */
async function crossListCourses(courseIds, sequelize, transaction) {
    if (courseIds.length < 2) {
        throw new Error('At least two courses required for cross-listing');
    }
    const courses = await Course.findAll({
        where: { id: { [sequelize_1.Op.in]: courseIds } },
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
async function approveCourse(courseId, approvedBy, sequelize, transaction) {
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
    }
    return course.update({
        status: CourseStatus.APPROVED,
        approvedBy,
        approvedDate: new Date(),
    }, { transaction });
}
/**
 * Activates a course
 */
async function activateCourse(courseId, sequelize, transaction) {
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
async function discontinueCourse(courseId, expirationDate, sequelize, transaction) {
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
    }
    return course.update({
        status: CourseStatus.DISCONTINUED,
        expirationDate,
    }, { transaction });
}
/**
 * Creates a course approval workflow
 */
async function createCourseApprovalWorkflow(courseId, workflowType, submittedBy, approvalSteps, sequelize, transaction) {
    return CourseApprovalWorkflow.create({
        courseId,
        workflowType,
        status: ApprovalStatus.SUBMITTED,
        currentStepId: 1,
        submittedBy,
        submittedDate: new Date(),
        approvalSteps,
    }, { transaction });
}
/**
 * Advances approval workflow to next step
 */
async function advanceApprovalWorkflow(workflowId, approverId, approved, comments, sequelize, transaction) {
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
    }
    else if (workflow.currentStepId === approvalSteps.length) {
        newStatus = ApprovalStatus.APPROVED;
    }
    else {
        newCurrentStepId = (workflow.currentStepId || 0) + 1;
        newStatus = ApprovalStatus.IN_REVIEW;
    }
    return workflow.update({
        approvalSteps,
        status: newStatus,
        currentStepId: newCurrentStepId,
        completedDate: newStatus === ApprovalStatus.APPROVED || newStatus === ApprovalStatus.REJECTED
            ? new Date()
            : null,
    }, { transaction });
}
/**
 * Gets pending approvals for a user
 */
async function getPendingApprovalsForUser(userRole, sequelize) {
    return CourseApprovalWorkflow.findAll({
        where: {
            status: ApprovalStatus.IN_REVIEW,
        },
    }).then((workflows) => workflows.filter((workflow) => {
        const currentStep = (workflow.approvalSteps || []).find((step) => step.stepId === workflow.currentStepId);
        return currentStep && currentStep.approverRole === userRole;
    }));
}
/**
 * Gets courses by department
 */
async function getCoursesByDepartment(departmentId, sequelize) {
    return Course.findAll({
        where: { departmentId },
        order: [['subjectCode', 'ASC'], ['courseNumber', 'ASC']],
    });
}
/**
 * Gets courses by college
 */
async function getCoursesByCollege(collegeId, sequelize) {
    return Course.findAll({
        where: { collegeId },
        order: [['subjectCode', 'ASC'], ['courseNumber', 'ASC']],
    });
}
/**
 * Gets sections by instructor
 */
async function getSectionsByInstructor(instructorId, termId, sequelize) {
    return CourseSection.findAll({
        where: {
            termId,
            instructorIds: {
                [sequelize_1.Op.contains]: [instructorId],
            },
        },
        include: [{ model: Course, as: 'course' }],
    });
}
/**
 * Gets section enrollment statistics
 */
async function getSectionEnrollmentStats(sectionId, sequelize) {
    const section = await CourseSection.findByPk(sectionId);
    if (!section) {
        throw new Error(`Section with ID ${sectionId} not found`);
    }
    const enrollmentPercent = section.enrollmentCapacity > 0
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
async function validateSchedulingRules(sectionId, proposedSchedule, sequelize) {
    const section = await CourseSection.findByPk(sectionId);
    if (!section) {
        throw new Error(`Section with ID ${sectionId} not found`);
    }
    const violations = [];
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
async function cloneCourseForNewCatalog(courseId, newCatalogId, sequelize, transaction) {
    const originalCourse = await Course.findByPk(courseId, { transaction });
    if (!originalCourse) {
        throw new Error(`Course with ID ${courseId} not found`);
    }
    const courseData = originalCourse.toJSON();
    delete courseData.id;
    delete courseData.createdAt;
    delete courseData.updatedAt;
    return Course.create({
        ...courseData,
        catalogId: newCatalogId,
        version: 1,
        status: CourseStatus.DRAFT,
    }, { transaction });
}
/**
 * Gets course history/versions
 */
async function getCourseHistory(courseCode, sequelize) {
    return Course.findAll({
        where: { courseCode },
        order: [['version', 'DESC']],
    });
}
/**
 * Validates course capacity settings
 */
async function validateCourseCapacity(capacity, waitlistCapacity, roomCapacity) {
    const errors = [];
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
let CourseCatalogsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('course-catalogs'), (0, common_1.Controller)('api/v1/course-catalogs'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _publish_decorators;
    var CourseCatalogsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createCourseCatalog(createDto, this.sequelize);
        }
        async findAll() {
            return CourseCatalog.findAll({
                order: [['catalogYear', 'DESC'], ['catalogTerm', 'ASC']],
            });
        }
        async findOne(id) {
            const catalog = await CourseCatalog.findByPk(id, {
                include: [{ model: Course, as: 'courses' }],
            });
            if (!catalog) {
                throw new Error('Catalog not found');
            }
            return catalog;
        }
        async update(id, updateDto) {
            return updateCourseCatalog(id, updateDto, this.sequelize);
        }
        async publish(id, publishedBy) {
            return publishCourseCatalog(id, publishedBy, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "CourseCatalogsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a new course catalog' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Catalog created successfully' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all course catalogs' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalogs retrieved successfully' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a course catalog by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalog found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Catalog not found' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a course catalog' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalog updated successfully' })];
        _publish_decorators = [(0, common_1.Post)(':id/publish'), (0, swagger_1.ApiOperation)({ summary: 'Publish a course catalog' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalog published successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _publish_decorators, { kind: "method", name: "publish", static: false, private: false, access: { has: obj => "publish" in obj, get: obj => obj.publish }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CourseCatalogsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CourseCatalogsController = _classThis;
})();
exports.CourseCatalogsController = CourseCatalogsController;
let CoursesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('courses'), (0, common_1.Controller)('api/v1/courses'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _search_decorators;
    let _findOne_decorators;
    let _findByCode_decorators;
    let _update_decorators;
    let _approve_decorators;
    let _activate_decorators;
    let _discontinue_decorators;
    let _addAttributes_decorators;
    let _updateFees_decorators;
    let _addOutcomes_decorators;
    let _updateDescription_decorators;
    let _updateSyllabus_decorators;
    let _crossList_decorators;
    let _getHistory_decorators;
    var CoursesController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createCourse(createDto, this.sequelize);
        }
        async search(query) {
            return searchCourses(query, this.sequelize);
        }
        async findOne(id) {
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
        async findByCode(courseCode) {
            return getCourseByCode(courseCode, this.sequelize);
        }
        async update(id, updateDto) {
            return updateCourse(id, updateDto, this.sequelize);
        }
        async approve(id, approvedBy) {
            return approveCourse(id, approvedBy, this.sequelize);
        }
        async activate(id) {
            return activateCourse(id, this.sequelize);
        }
        async discontinue(id, expirationDate) {
            return discontinueCourse(id, expirationDate, this.sequelize);
        }
        async addAttributes(id, attributes) {
            return addCourseAttributes(id, attributes, this.sequelize);
        }
        async updateFees(id, fees) {
            return updateCourseFees(id, fees, this.sequelize);
        }
        async addOutcomes(id, outcomes) {
            return addLearningOutcomes(id, outcomes, this.sequelize);
        }
        async updateDescription(id, description) {
            return updateCourseDescription(id, description, this.sequelize);
        }
        async updateSyllabus(id, syllabus) {
            return updateCourseSyllabus(id, syllabus, this.sequelize);
        }
        async crossList(courseIds) {
            return crossListCourses(courseIds, this.sequelize);
        }
        async getHistory(id) {
            const course = await Course.findByPk(id);
            if (!course) {
                throw new Error('Course not found');
            }
            return getCourseHistory(course.courseCode, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "CoursesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a new course' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created successfully' })];
        _search_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Search courses with filters' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Courses retrieved successfully' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a course by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' })];
        _findByCode_decorators = [(0, common_1.Get)('code/:courseCode'), (0, swagger_1.ApiOperation)({ summary: 'Get a course by course code' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course found' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course updated successfully' })];
        _approve_decorators = [(0, common_1.Post)(':id/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course approved successfully' })];
        _activate_decorators = [(0, common_1.Post)(':id/activate'), (0, swagger_1.ApiOperation)({ summary: 'Activate a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course activated successfully' })];
        _discontinue_decorators = [(0, common_1.Post)(':id/discontinue'), (0, swagger_1.ApiOperation)({ summary: 'Discontinue a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course discontinued successfully' })];
        _addAttributes_decorators = [(0, common_1.Post)(':id/attributes'), (0, swagger_1.ApiOperation)({ summary: 'Add attributes to a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Attributes added successfully' })];
        _updateFees_decorators = [(0, common_1.Put)(':id/fees'), (0, swagger_1.ApiOperation)({ summary: 'Update course fees' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Fees updated successfully' })];
        _addOutcomes_decorators = [(0, common_1.Post)(':id/outcomes'), (0, swagger_1.ApiOperation)({ summary: 'Add learning outcomes to a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Outcomes added successfully' })];
        _updateDescription_decorators = [(0, common_1.Put)(':id/description'), (0, swagger_1.ApiOperation)({ summary: 'Update course description' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Description updated successfully' })];
        _updateSyllabus_decorators = [(0, common_1.Put)(':id/syllabus'), (0, swagger_1.ApiOperation)({ summary: 'Update course syllabus' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Syllabus updated successfully' })];
        _crossList_decorators = [(0, common_1.Post)('cross-list'), (0, swagger_1.ApiOperation)({ summary: 'Cross-list courses' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Courses cross-listed successfully' })];
        _getHistory_decorators = [(0, common_1.Get)(':id/history'), (0, swagger_1.ApiOperation)({ summary: 'Get course history' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course history retrieved' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCode_decorators, { kind: "method", name: "findByCode", static: false, private: false, access: { has: obj => "findByCode" in obj, get: obj => obj.findByCode }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activate_decorators, { kind: "method", name: "activate", static: false, private: false, access: { has: obj => "activate" in obj, get: obj => obj.activate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _discontinue_decorators, { kind: "method", name: "discontinue", static: false, private: false, access: { has: obj => "discontinue" in obj, get: obj => obj.discontinue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addAttributes_decorators, { kind: "method", name: "addAttributes", static: false, private: false, access: { has: obj => "addAttributes" in obj, get: obj => obj.addAttributes }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFees_decorators, { kind: "method", name: "updateFees", static: false, private: false, access: { has: obj => "updateFees" in obj, get: obj => obj.updateFees }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addOutcomes_decorators, { kind: "method", name: "addOutcomes", static: false, private: false, access: { has: obj => "addOutcomes" in obj, get: obj => obj.addOutcomes }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDescription_decorators, { kind: "method", name: "updateDescription", static: false, private: false, access: { has: obj => "updateDescription" in obj, get: obj => obj.updateDescription }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSyllabus_decorators, { kind: "method", name: "updateSyllabus", static: false, private: false, access: { has: obj => "updateSyllabus" in obj, get: obj => obj.updateSyllabus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _crossList_decorators, { kind: "method", name: "crossList", static: false, private: false, access: { has: obj => "crossList" in obj, get: obj => obj.crossList }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CoursesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CoursesController = _classThis;
})();
exports.CoursesController = CoursesController;
let CourseSectionsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('course-sections'), (0, common_1.Controller)('api/v1/course-sections'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _checkCapacity_decorators;
    let _getEnrollmentStats_decorators;
    var CourseSectionsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createCourseSection(createDto, this.sequelize);
        }
        async findAll(termId, courseId) {
            const where = {};
            if (termId)
                where.termId = termId;
            if (courseId)
                where.courseId = courseId;
            return CourseSection.findAll({
                where,
                include: [{ model: Course, as: 'course' }],
                order: [['sectionCode', 'ASC']],
            });
        }
        async findOne(id) {
            const section = await CourseSection.findByPk(id, {
                include: [{ model: Course, as: 'course' }],
            });
            if (!section) {
                throw new Error('Section not found');
            }
            return section;
        }
        async update(id, updateDto) {
            return updateCourseSection(id, updateDto, this.sequelize);
        }
        async checkCapacity(id) {
            return checkSectionCapacity(id, this.sequelize);
        }
        async getEnrollmentStats(id) {
            return getSectionEnrollmentStats(id, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "CourseSectionsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a new course section' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all course sections' }), (0, swagger_1.ApiQuery)({ name: 'termId', required: false }), (0, swagger_1.ApiQuery)({ name: 'courseId', required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Sections retrieved successfully' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a course section by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Section found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a course section' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Section updated successfully' })];
        _checkCapacity_decorators = [(0, common_1.Get)(':id/capacity'), (0, swagger_1.ApiOperation)({ summary: 'Check section capacity' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Capacity information retrieved' })];
        _getEnrollmentStats_decorators = [(0, common_1.Get)(':id/enrollment-stats'), (0, swagger_1.ApiOperation)({ summary: 'Get section enrollment statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkCapacity_decorators, { kind: "method", name: "checkCapacity", static: false, private: false, access: { has: obj => "checkCapacity" in obj, get: obj => obj.checkCapacity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEnrollmentStats_decorators, { kind: "method", name: "getEnrollmentStats", static: false, private: false, access: { has: obj => "getEnrollmentStats" in obj, get: obj => obj.getEnrollmentStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CourseSectionsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CourseSectionsController = _classThis;
})();
exports.CourseSectionsController = CourseSectionsController;
let CoursePrerequisitesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('course-prerequisites'), (0, common_1.Controller)('api/v1/course-prerequisites'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findByCourse_decorators;
    let _validate_decorators;
    var CoursePrerequisitesController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return addCoursePrerequisite(createDto, this.sequelize);
        }
        async findByCourse(courseId) {
            return getCoursePrerequisites(courseId, this.sequelize);
        }
        async validate(courseId, studentId, studentTranscript) {
            return validatePrerequisites(courseId, studentId, studentTranscript, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "CoursePrerequisitesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Add a course prerequisite' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Prerequisite added successfully' })];
        _findByCourse_decorators = [(0, common_1.Get)('course/:courseId'), (0, swagger_1.ApiOperation)({ summary: 'Get all prerequisites for a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Prerequisites retrieved successfully' })];
        _validate_decorators = [(0, common_1.Post)('validate'), (0, swagger_1.ApiOperation)({ summary: 'Validate prerequisites for a student' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation completed' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCourse_decorators, { kind: "method", name: "findByCourse", static: false, private: false, access: { has: obj => "findByCourse" in obj, get: obj => obj.findByCourse }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: obj => "validate" in obj, get: obj => obj.validate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CoursePrerequisitesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CoursePrerequisitesController = _classThis;
})();
exports.CoursePrerequisitesController = CoursePrerequisitesController;
let CourseEquivalenciesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('course-equivalencies'), (0, common_1.Controller)('api/v1/course-equivalencies'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findByCourse_decorators;
    let _findTransfer_decorators;
    var CourseEquivalenciesController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return addCourseEquivalency(createDto, this.sequelize);
        }
        async findByCourse(courseId) {
            return getCourseEquivalencies(courseId, this.sequelize);
        }
        async findTransfer(institutionId, externalCourseCode) {
            return findTransferEquivalency(institutionId, externalCourseCode, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "CourseEquivalenciesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Add a course equivalency' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Equivalency added successfully' })];
        _findByCourse_decorators = [(0, common_1.Get)('course/:courseId'), (0, swagger_1.ApiOperation)({ summary: 'Get all equivalencies for a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Equivalencies retrieved successfully' })];
        _findTransfer_decorators = [(0, common_1.Get)('transfer'), (0, swagger_1.ApiOperation)({ summary: 'Find transfer equivalency' }), (0, swagger_1.ApiQuery)({ name: 'institutionId', required: true }), (0, swagger_1.ApiQuery)({ name: 'externalCourseCode', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Equivalency found' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCourse_decorators, { kind: "method", name: "findByCourse", static: false, private: false, access: { has: obj => "findByCourse" in obj, get: obj => obj.findByCourse }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findTransfer_decorators, { kind: "method", name: "findTransfer", static: false, private: false, access: { has: obj => "findTransfer" in obj, get: obj => obj.findTransfer }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CourseEquivalenciesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CourseEquivalenciesController = _classThis;
})();
exports.CourseEquivalenciesController = CourseEquivalenciesController;
//# sourceMappingURL=course-catalog-kit.js.map