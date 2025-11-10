"use strict";
/**
 * LOC: EDUCREGIST001
 * File: /reuse/education/course-registration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *   - ./course-catalog-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Registration controllers
 *   - Student services systems
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
exports.EnrollmentStatisticsController = exports.WaitlistController = exports.TimeTicketsController = exports.RegistrationHoldsController = exports.RegistrationsController = exports.RegistrationPeriodsController = exports.RegistrationValidationDto = exports.AddToWaitlistDto = exports.CreateTimeTicketDto = exports.ReleaseHoldDto = exports.CreateRegistrationHoldDto = exports.WithdrawFromCourseDto = exports.SwapCourseDto = exports.DropCourseDto = exports.RegisterForCourseDto = exports.CreateRegistrationPeriodDto = exports.ConcurrentEnrollmentAgreement = exports.RegistrationHistory = exports.WaitlistEntry = exports.RegistrationTimeTicket = exports.RegistrationHold = exports.Registration = exports.RegistrationPeriod = exports.PriorityGroup = exports.RegistrationErrorCode = exports.WaitlistStatus = exports.RegistrationPeriodType = exports.HoldSeverity = exports.HoldType = exports.RegistrationAction = exports.RegistrationStatus = void 0;
exports.createRegistrationPeriod = createRegistrationPeriod;
exports.getActiveRegistrationPeriod = getActiveRegistrationPeriod;
exports.isRegistrationOpen = isRegistrationOpen;
exports.validateRegistration = validateRegistration;
exports.registerForCourse = registerForCourse;
exports.dropCourse = dropCourse;
exports.swapCourse = swapCourse;
exports.withdrawFromCourse = withdrawFromCourse;
exports.addToWaitlist = addToWaitlist;
exports.processWaitlist = processWaitlist;
exports.registerFromWaitlist = registerFromWaitlist;
exports.createRegistrationHold = createRegistrationHold;
exports.releaseHold = releaseHold;
exports.getActiveHoldsForStudent = getActiveHoldsForStudent;
exports.createTimeTicket = createTimeTicket;
exports.calculateTimeTicketsForTerm = calculateTimeTicketsForTerm;
exports.getStudentTimeTicket = getStudentTimeTicket;
exports.overrideTimeTicket = overrideTimeTicket;
exports.getStudentRegistrations = getStudentRegistrations;
exports.getTotalRegisteredCredits = getTotalRegisteredCredits;
exports.checkTimeConflicts = checkTimeConflicts;
exports.getRegistrationHistory = getRegistrationHistory;
exports.getWaitlistPosition = getWaitlistPosition;
exports.removeFromWaitlist = removeFromWaitlist;
exports.createConcurrentEnrollmentAgreement = createConcurrentEnrollmentAgreement;
exports.validateConcurrentEnrollment = validateConcurrentEnrollment;
exports.approveRegistrationByAdvisor = approveRegistrationByAdvisor;
exports.changeGradingBasis = changeGradingBasis;
exports.changeCreditHours = changeCreditHours;
exports.getTermEnrollmentStats = getTermEnrollmentStats;
exports.getSectionEnrollmentDetails = getSectionEnrollmentDetails;
exports.validateRegistrationCart = validateRegistrationCart;
exports.processRegistrationCart = processRegistrationCart;
/**
 * File: /reuse/education/course-registration-kit.ts
 * Locator: WC-EDU-REGI-001
 * Purpose: Comprehensive Course Registration Management - Ellucian Banner/Colleague-level SIS functionality
 *
 * Upstream: Error handling, validation, auditing utilities, course catalog
 * Downstream: ../backend/*, Education controllers, registration services, student enrollment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 45+ utility functions for registration, add/drop/swap, time tickets, holds, validation
 *
 * LLM Context: Enterprise-grade course registration system competing with Ellucian Banner/Colleague.
 * Provides complete registration lifecycle management, time tickets, registration periods, holds,
 * add/drop/swap functionality, concurrent enrollment, cross-registration, waitlist management,
 * registration errors and validation, prerequisites validation, capacity enforcement, registration
 * priority, degree audit integration, tuition calculation, registration permissions.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const course_catalog_kit_1 = require("./course-catalog-kit");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["DRAFT"] = "DRAFT";
    RegistrationStatus["PENDING"] = "PENDING";
    RegistrationStatus["REGISTERED"] = "REGISTERED";
    RegistrationStatus["WAITLISTED"] = "WAITLISTED";
    RegistrationStatus["DROPPED"] = "DROPPED";
    RegistrationStatus["WITHDRAWN"] = "WITHDRAWN";
    RegistrationStatus["CANCELLED"] = "CANCELLED";
    RegistrationStatus["SWAPPED"] = "SWAPPED";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
var RegistrationAction;
(function (RegistrationAction) {
    RegistrationAction["ADD"] = "ADD";
    RegistrationAction["DROP"] = "DROP";
    RegistrationAction["SWAP"] = "SWAP";
    RegistrationAction["WITHDRAW"] = "WITHDRAW";
    RegistrationAction["CHANGE_GRADING_BASIS"] = "CHANGE_GRADING_BASIS";
    RegistrationAction["CHANGE_CREDIT_HOURS"] = "CHANGE_CREDIT_HOURS";
})(RegistrationAction || (exports.RegistrationAction = RegistrationAction = {}));
var HoldType;
(function (HoldType) {
    HoldType["ACADEMIC"] = "ACADEMIC";
    HoldType["FINANCIAL"] = "FINANCIAL";
    HoldType["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    HoldType["DISCIPLINARY"] = "DISCIPLINARY";
    HoldType["ADVISING"] = "ADVISING";
    HoldType["HEALTH"] = "HEALTH";
    HoldType["LIBRARY"] = "LIBRARY";
})(HoldType || (exports.HoldType = HoldType = {}));
var HoldSeverity;
(function (HoldSeverity) {
    HoldSeverity["INFORMATIONAL"] = "INFORMATIONAL";
    HoldSeverity["WARNING"] = "WARNING";
    HoldSeverity["REGISTRATION_BLOCK"] = "REGISTRATION_BLOCK";
    HoldSeverity["TRANSCRIPT_HOLD"] = "TRANSCRIPT_HOLD";
    HoldSeverity["DEGREE_HOLD"] = "DEGREE_HOLD";
})(HoldSeverity || (exports.HoldSeverity = HoldSeverity = {}));
var RegistrationPeriodType;
(function (RegistrationPeriodType) {
    RegistrationPeriodType["EARLY_REGISTRATION"] = "EARLY_REGISTRATION";
    RegistrationPeriodType["PRIORITY_REGISTRATION"] = "PRIORITY_REGISTRATION";
    RegistrationPeriodType["OPEN_REGISTRATION"] = "OPEN_REGISTRATION";
    RegistrationPeriodType["LATE_REGISTRATION"] = "LATE_REGISTRATION";
    RegistrationPeriodType["ADD_DROP"] = "ADD_DROP";
    RegistrationPeriodType["CLOSED"] = "CLOSED";
})(RegistrationPeriodType || (exports.RegistrationPeriodType = RegistrationPeriodType = {}));
var WaitlistStatus;
(function (WaitlistStatus) {
    WaitlistStatus["ACTIVE"] = "ACTIVE";
    WaitlistStatus["PENDING_NOTIFICATION"] = "PENDING_NOTIFICATION";
    WaitlistStatus["NOTIFIED"] = "NOTIFIED";
    WaitlistStatus["EXPIRED"] = "EXPIRED";
    WaitlistStatus["REGISTERED"] = "REGISTERED";
    WaitlistStatus["REMOVED"] = "REMOVED";
})(WaitlistStatus || (exports.WaitlistStatus = WaitlistStatus = {}));
var RegistrationErrorCode;
(function (RegistrationErrorCode) {
    RegistrationErrorCode["PREREQUISITE_NOT_MET"] = "PREREQUISITE_NOT_MET";
    RegistrationErrorCode["COREQUISITE_NOT_MET"] = "COREQUISITE_NOT_MET";
    RegistrationErrorCode["SECTION_FULL"] = "SECTION_FULL";
    RegistrationErrorCode["TIME_CONFLICT"] = "TIME_CONFLICT";
    RegistrationErrorCode["DUPLICATE_COURSE"] = "DUPLICATE_COURSE";
    RegistrationErrorCode["CREDIT_LIMIT_EXCEEDED"] = "CREDIT_LIMIT_EXCEEDED";
    RegistrationErrorCode["REGISTRATION_HOLD"] = "REGISTRATION_HOLD";
    RegistrationErrorCode["OUTSIDE_TIME_TICKET"] = "OUTSIDE_TIME_TICKET";
    RegistrationErrorCode["ENROLLMENT_STATUS_INVALID"] = "ENROLLMENT_STATUS_INVALID";
    RegistrationErrorCode["RESTRICTION_NOT_MET"] = "RESTRICTION_NOT_MET";
    RegistrationErrorCode["CONCURRENT_ENROLLMENT_LIMIT"] = "CONCURRENT_ENROLLMENT_LIMIT";
})(RegistrationErrorCode || (exports.RegistrationErrorCode = RegistrationErrorCode = {}));
var PriorityGroup;
(function (PriorityGroup) {
    PriorityGroup["ATHLETES"] = "ATHLETES";
    PriorityGroup["HONORS"] = "HONORS";
    PriorityGroup["SENIORS"] = "SENIORS";
    PriorityGroup["JUNIORS"] = "JUNIORS";
    PriorityGroup["SOPHOMORES"] = "SOPHOMORES";
    PriorityGroup["FRESHMEN"] = "FRESHMEN";
    PriorityGroup["SPECIAL_PROGRAMS"] = "SPECIAL_PROGRAMS";
    PriorityGroup["DISABILITIES"] = "DISABILITIES";
    PriorityGroup["VETERANS"] = "VETERANS";
    PriorityGroup["GRADUATE"] = "GRADUATE";
})(PriorityGroup || (exports.PriorityGroup = PriorityGroup = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
class RegistrationPeriod extends sequelize_1.Model {
    static initModel(sequelize) {
        RegistrationPeriod.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            termCode: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: false,
            },
            periodType: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationPeriodType)),
                allowNull: false,
            },
            periodName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            allowedStudentTypes: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            allowedClassLevels: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            allowedPrograms: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
            },
            maxCreditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            minCreditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            allowWaitlist: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            allowSwap: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            requireAdvisorApproval: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'registration_periods',
            timestamps: true,
            indexes: [
                { fields: ['termId'] },
                { fields: ['termCode'] },
                { fields: ['periodType'] },
                { fields: ['startDate', 'endDate'] },
            ],
        });
        return RegistrationPeriod;
    }
}
exports.RegistrationPeriod = RegistrationPeriod;
class Registration extends sequelize_1.Model {
    static initModel(sequelize) {
        Registration.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            sectionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'course_sections',
                    key: 'id',
                },
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            registrationStatus: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationStatus)),
                allowNull: false,
            },
            registrationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            droppedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            withdrawnDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            creditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: false,
            },
            gradingBasis: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            registrationAction: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationAction)),
                allowNull: false,
            },
            registeredBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            advisorApproved: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            advisorApprovedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            advisorApprovedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            lastAttendanceDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            grade: {
                type: sequelize_1.DataTypes.STRING(5),
                allowNull: true,
            },
            gradePoints: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            repeatCourse: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            repeatNumber: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            auditCourse: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            concurrentEnrollment: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            crossRegistration: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            registrationFees: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            tuitionAmount: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            feesAmount: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'registrations',
            timestamps: true,
            indexes: [
                { fields: ['studentId'] },
                { fields: ['sectionId'] },
                { fields: ['termId'] },
                { fields: ['registrationStatus'] },
                { fields: ['studentId', 'termId'] },
                { fields: ['studentId', 'sectionId'], unique: true },
            ],
        });
        return Registration;
    }
}
exports.Registration = Registration;
class RegistrationHold extends sequelize_1.Model {
    static initModel(sequelize) {
        RegistrationHold.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            holdType: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(HoldType)),
                allowNull: false,
            },
            holdSeverity: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(HoldSeverity)),
                allowNull: false,
            },
            holdReason: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            holdDescription: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            releasedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            releasedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            releasedReason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            blocksRegistration: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blocksTranscripts: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blocksDegree: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            departmentCode: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: true,
            },
            amountOwed: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            contactInfo: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'registration_holds',
            timestamps: true,
            indexes: [
                { fields: ['studentId'] },
                { fields: ['holdType'] },
                { fields: ['holdSeverity'] },
                { fields: ['effectiveDate'] },
                { fields: ['blocksRegistration'] },
            ],
        });
        return RegistrationHold;
    }
}
exports.RegistrationHold = RegistrationHold;
class RegistrationTimeTicket extends sequelize_1.Model {
    static initModel(sequelize) {
        RegistrationTimeTicket.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            priorityGroup: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriorityGroup)),
                allowNull: false,
            },
            priorityScore: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            registrationStart: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            registrationEnd: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            calculatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            calculatedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            overrideReason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            overrideBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'registration_time_tickets',
            timestamps: true,
            indexes: [
                { fields: ['studentId', 'termId'], unique: true },
                { fields: ['termId'] },
                { fields: ['priorityGroup'] },
                { fields: ['registrationStart', 'registrationEnd'] },
            ],
        });
        return RegistrationTimeTicket;
    }
}
exports.RegistrationTimeTicket = RegistrationTimeTicket;
class WaitlistEntry extends sequelize_1.Model {
    static initModel(sequelize) {
        WaitlistEntry.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            sectionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'course_sections',
                    key: 'id',
                },
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            position: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            addedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(WaitlistStatus)),
                allowNull: false,
                defaultValue: WaitlistStatus.ACTIVE,
            },
            notificationSentDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            notificationExpiresDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            registeredDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            removedDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            removedReason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            creditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: false,
            },
            gradingBasis: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'waitlist_entries',
            timestamps: true,
            indexes: [
                { fields: ['studentId'] },
                { fields: ['sectionId'] },
                { fields: ['termId'] },
                { fields: ['status'] },
                { fields: ['sectionId', 'position'] },
                { fields: ['studentId', 'sectionId'], unique: true },
            ],
        });
        return WaitlistEntry;
    }
}
exports.WaitlistEntry = WaitlistEntry;
class RegistrationHistory extends sequelize_1.Model {
    static initModel(sequelize) {
        RegistrationHistory.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            registrationId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'registrations',
                    key: 'id',
                },
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            sectionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            action: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationAction)),
                allowNull: false,
            },
            actionDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            actionBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            previousStatus: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationStatus)),
                allowNull: true,
            },
            newStatus: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(RegistrationStatus)),
                allowNull: false,
            },
            reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'registration_history',
            timestamps: true,
            updatedAt: false,
            indexes: [
                { fields: ['registrationId'] },
                { fields: ['studentId'] },
                { fields: ['sectionId'] },
                { fields: ['action'] },
                { fields: ['actionDate'] },
            ],
        });
        return RegistrationHistory;
    }
}
exports.RegistrationHistory = RegistrationHistory;
class ConcurrentEnrollmentAgreement extends sequelize_1.Model {
    static initModel(sequelize) {
        ConcurrentEnrollmentAgreement.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            homeInstitutionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            hostInstitutionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            termId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            maxCreditHours: {
                type: sequelize_1.DataTypes.DECIMAL(4, 2),
                allowNull: false,
            },
            agreementStartDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            agreementEndDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            approvedBy: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true,
            },
            approvalDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'concurrent_enrollment_agreements',
            timestamps: true,
            indexes: [
                { fields: ['studentId'] },
                { fields: ['homeInstitutionId'] },
                { fields: ['hostInstitutionId'] },
                { fields: ['termId'] },
                { fields: ['status'] },
            ],
        });
        return ConcurrentEnrollmentAgreement;
    }
}
exports.ConcurrentEnrollmentAgreement = ConcurrentEnrollmentAgreement;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreateRegistrationPeriodDto = (() => {
    var _a;
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _termCode_decorators;
    let _termCode_initializers = [];
    let _termCode_extraInitializers = [];
    let _periodType_decorators;
    let _periodType_initializers = [];
    let _periodType_extraInitializers = [];
    let _periodName_decorators;
    let _periodName_initializers = [];
    let _periodName_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _maxCreditHours_decorators;
    let _maxCreditHours_initializers = [];
    let _maxCreditHours_extraInitializers = [];
    let _minCreditHours_decorators;
    let _minCreditHours_initializers = [];
    let _minCreditHours_extraInitializers = [];
    let _allowWaitlist_decorators;
    let _allowWaitlist_initializers = [];
    let _allowWaitlist_extraInitializers = [];
    let _allowSwap_decorators;
    let _allowSwap_initializers = [];
    let _allowSwap_extraInitializers = [];
    let _requireAdvisorApproval_decorators;
    let _requireAdvisorApproval_initializers = [];
    let _requireAdvisorApproval_extraInitializers = [];
    return _a = class CreateRegistrationPeriodDto {
            constructor() {
                this.termId = __runInitializers(this, _termId_initializers, void 0);
                this.termCode = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _termCode_initializers, void 0));
                this.periodType = (__runInitializers(this, _termCode_extraInitializers), __runInitializers(this, _periodType_initializers, void 0));
                this.periodName = (__runInitializers(this, _periodType_extraInitializers), __runInitializers(this, _periodName_initializers, void 0));
                this.startDate = (__runInitializers(this, _periodName_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.maxCreditHours = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _maxCreditHours_initializers, void 0));
                this.minCreditHours = (__runInitializers(this, _maxCreditHours_extraInitializers), __runInitializers(this, _minCreditHours_initializers, void 0));
                this.allowWaitlist = (__runInitializers(this, _minCreditHours_extraInitializers), __runInitializers(this, _allowWaitlist_initializers, void 0));
                this.allowSwap = (__runInitializers(this, _allowWaitlist_extraInitializers), __runInitializers(this, _allowSwap_initializers, void 0));
                this.requireAdvisorApproval = (__runInitializers(this, _allowSwap_extraInitializers), __runInitializers(this, _requireAdvisorApproval_initializers, void 0));
                __runInitializers(this, _requireAdvisorApproval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _termCode_decorators = [(0, class_validator_1.IsString)()];
            _periodType_decorators = [(0, class_validator_1.IsEnum)(RegistrationPeriodType)];
            _periodName_decorators = [(0, class_validator_1.IsString)()];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _maxCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _minCreditHours_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _allowWaitlist_decorators = [(0, class_validator_1.IsBoolean)()];
            _allowSwap_decorators = [(0, class_validator_1.IsBoolean)()];
            _requireAdvisorApproval_decorators = [(0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _termCode_decorators, { kind: "field", name: "termCode", static: false, private: false, access: { has: obj => "termCode" in obj, get: obj => obj.termCode, set: (obj, value) => { obj.termCode = value; } }, metadata: _metadata }, _termCode_initializers, _termCode_extraInitializers);
            __esDecorate(null, null, _periodType_decorators, { kind: "field", name: "periodType", static: false, private: false, access: { has: obj => "periodType" in obj, get: obj => obj.periodType, set: (obj, value) => { obj.periodType = value; } }, metadata: _metadata }, _periodType_initializers, _periodType_extraInitializers);
            __esDecorate(null, null, _periodName_decorators, { kind: "field", name: "periodName", static: false, private: false, access: { has: obj => "periodName" in obj, get: obj => obj.periodName, set: (obj, value) => { obj.periodName = value; } }, metadata: _metadata }, _periodName_initializers, _periodName_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _maxCreditHours_decorators, { kind: "field", name: "maxCreditHours", static: false, private: false, access: { has: obj => "maxCreditHours" in obj, get: obj => obj.maxCreditHours, set: (obj, value) => { obj.maxCreditHours = value; } }, metadata: _metadata }, _maxCreditHours_initializers, _maxCreditHours_extraInitializers);
            __esDecorate(null, null, _minCreditHours_decorators, { kind: "field", name: "minCreditHours", static: false, private: false, access: { has: obj => "minCreditHours" in obj, get: obj => obj.minCreditHours, set: (obj, value) => { obj.minCreditHours = value; } }, metadata: _metadata }, _minCreditHours_initializers, _minCreditHours_extraInitializers);
            __esDecorate(null, null, _allowWaitlist_decorators, { kind: "field", name: "allowWaitlist", static: false, private: false, access: { has: obj => "allowWaitlist" in obj, get: obj => obj.allowWaitlist, set: (obj, value) => { obj.allowWaitlist = value; } }, metadata: _metadata }, _allowWaitlist_initializers, _allowWaitlist_extraInitializers);
            __esDecorate(null, null, _allowSwap_decorators, { kind: "field", name: "allowSwap", static: false, private: false, access: { has: obj => "allowSwap" in obj, get: obj => obj.allowSwap, set: (obj, value) => { obj.allowSwap = value; } }, metadata: _metadata }, _allowSwap_initializers, _allowSwap_extraInitializers);
            __esDecorate(null, null, _requireAdvisorApproval_decorators, { kind: "field", name: "requireAdvisorApproval", static: false, private: false, access: { has: obj => "requireAdvisorApproval" in obj, get: obj => obj.requireAdvisorApproval, set: (obj, value) => { obj.requireAdvisorApproval = value; } }, metadata: _metadata }, _requireAdvisorApproval_initializers, _requireAdvisorApproval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRegistrationPeriodDto = CreateRegistrationPeriodDto;
let RegisterForCourseDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _sectionId_decorators;
    let _sectionId_initializers = [];
    let _sectionId_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _gradingBasis_decorators;
    let _gradingBasis_initializers = [];
    let _gradingBasis_extraInitializers = [];
    let _registeredBy_decorators;
    let _registeredBy_initializers = [];
    let _registeredBy_extraInitializers = [];
    let _auditCourse_decorators;
    let _auditCourse_initializers = [];
    let _auditCourse_extraInitializers = [];
    let _repeatCourse_decorators;
    let _repeatCourse_initializers = [];
    let _repeatCourse_extraInitializers = [];
    return _a = class RegisterForCourseDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.sectionId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _sectionId_initializers, void 0));
                this.termId = (__runInitializers(this, _sectionId_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.creditHours = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.gradingBasis = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _gradingBasis_initializers, void 0));
                this.registeredBy = (__runInitializers(this, _gradingBasis_extraInitializers), __runInitializers(this, _registeredBy_initializers, void 0));
                this.auditCourse = (__runInitializers(this, _registeredBy_extraInitializers), __runInitializers(this, _auditCourse_initializers, void 0));
                this.repeatCourse = (__runInitializers(this, _auditCourse_extraInitializers), __runInitializers(this, _repeatCourse_initializers, void 0));
                __runInitializers(this, _repeatCourse_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _sectionId_decorators = [(0, class_validator_1.IsNumber)()];
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _gradingBasis_decorators = [(0, class_validator_1.IsString)()];
            _registeredBy_decorators = [(0, class_validator_1.IsString)()];
            _auditCourse_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _repeatCourse_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _sectionId_decorators, { kind: "field", name: "sectionId", static: false, private: false, access: { has: obj => "sectionId" in obj, get: obj => obj.sectionId, set: (obj, value) => { obj.sectionId = value; } }, metadata: _metadata }, _sectionId_initializers, _sectionId_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _gradingBasis_decorators, { kind: "field", name: "gradingBasis", static: false, private: false, access: { has: obj => "gradingBasis" in obj, get: obj => obj.gradingBasis, set: (obj, value) => { obj.gradingBasis = value; } }, metadata: _metadata }, _gradingBasis_initializers, _gradingBasis_extraInitializers);
            __esDecorate(null, null, _registeredBy_decorators, { kind: "field", name: "registeredBy", static: false, private: false, access: { has: obj => "registeredBy" in obj, get: obj => obj.registeredBy, set: (obj, value) => { obj.registeredBy = value; } }, metadata: _metadata }, _registeredBy_initializers, _registeredBy_extraInitializers);
            __esDecorate(null, null, _auditCourse_decorators, { kind: "field", name: "auditCourse", static: false, private: false, access: { has: obj => "auditCourse" in obj, get: obj => obj.auditCourse, set: (obj, value) => { obj.auditCourse = value; } }, metadata: _metadata }, _auditCourse_initializers, _auditCourse_extraInitializers);
            __esDecorate(null, null, _repeatCourse_decorators, { kind: "field", name: "repeatCourse", static: false, private: false, access: { has: obj => "repeatCourse" in obj, get: obj => obj.repeatCourse, set: (obj, value) => { obj.repeatCourse = value; } }, metadata: _metadata }, _repeatCourse_initializers, _repeatCourse_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RegisterForCourseDto = RegisterForCourseDto;
let DropCourseDto = (() => {
    var _a;
    let _registrationId_decorators;
    let _registrationId_initializers = [];
    let _registrationId_extraInitializers = [];
    let _droppedBy_decorators;
    let _droppedBy_initializers = [];
    let _droppedBy_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class DropCourseDto {
            constructor() {
                this.registrationId = __runInitializers(this, _registrationId_initializers, void 0);
                this.droppedBy = (__runInitializers(this, _registrationId_extraInitializers), __runInitializers(this, _droppedBy_initializers, void 0));
                this.reason = (__runInitializers(this, _droppedBy_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _registrationId_decorators = [(0, class_validator_1.IsNumber)()];
            _droppedBy_decorators = [(0, class_validator_1.IsString)()];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _registrationId_decorators, { kind: "field", name: "registrationId", static: false, private: false, access: { has: obj => "registrationId" in obj, get: obj => obj.registrationId, set: (obj, value) => { obj.registrationId = value; } }, metadata: _metadata }, _registrationId_initializers, _registrationId_extraInitializers);
            __esDecorate(null, null, _droppedBy_decorators, { kind: "field", name: "droppedBy", static: false, private: false, access: { has: obj => "droppedBy" in obj, get: obj => obj.droppedBy, set: (obj, value) => { obj.droppedBy = value; } }, metadata: _metadata }, _droppedBy_initializers, _droppedBy_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DropCourseDto = DropCourseDto;
let SwapCourseDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _dropRegistrationId_decorators;
    let _dropRegistrationId_initializers = [];
    let _dropRegistrationId_extraInitializers = [];
    let _addSectionId_decorators;
    let _addSectionId_initializers = [];
    let _addSectionId_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _gradingBasis_decorators;
    let _gradingBasis_initializers = [];
    let _gradingBasis_extraInitializers = [];
    let _swappedBy_decorators;
    let _swappedBy_initializers = [];
    let _swappedBy_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class SwapCourseDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.dropRegistrationId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _dropRegistrationId_initializers, void 0));
                this.addSectionId = (__runInitializers(this, _dropRegistrationId_extraInitializers), __runInitializers(this, _addSectionId_initializers, void 0));
                this.creditHours = (__runInitializers(this, _addSectionId_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.gradingBasis = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _gradingBasis_initializers, void 0));
                this.swappedBy = (__runInitializers(this, _gradingBasis_extraInitializers), __runInitializers(this, _swappedBy_initializers, void 0));
                this.reason = (__runInitializers(this, _swappedBy_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _dropRegistrationId_decorators = [(0, class_validator_1.IsNumber)()];
            _addSectionId_decorators = [(0, class_validator_1.IsNumber)()];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)()];
            _gradingBasis_decorators = [(0, class_validator_1.IsString)()];
            _swappedBy_decorators = [(0, class_validator_1.IsString)()];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _dropRegistrationId_decorators, { kind: "field", name: "dropRegistrationId", static: false, private: false, access: { has: obj => "dropRegistrationId" in obj, get: obj => obj.dropRegistrationId, set: (obj, value) => { obj.dropRegistrationId = value; } }, metadata: _metadata }, _dropRegistrationId_initializers, _dropRegistrationId_extraInitializers);
            __esDecorate(null, null, _addSectionId_decorators, { kind: "field", name: "addSectionId", static: false, private: false, access: { has: obj => "addSectionId" in obj, get: obj => obj.addSectionId, set: (obj, value) => { obj.addSectionId = value; } }, metadata: _metadata }, _addSectionId_initializers, _addSectionId_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _gradingBasis_decorators, { kind: "field", name: "gradingBasis", static: false, private: false, access: { has: obj => "gradingBasis" in obj, get: obj => obj.gradingBasis, set: (obj, value) => { obj.gradingBasis = value; } }, metadata: _metadata }, _gradingBasis_initializers, _gradingBasis_extraInitializers);
            __esDecorate(null, null, _swappedBy_decorators, { kind: "field", name: "swappedBy", static: false, private: false, access: { has: obj => "swappedBy" in obj, get: obj => obj.swappedBy, set: (obj, value) => { obj.swappedBy = value; } }, metadata: _metadata }, _swappedBy_initializers, _swappedBy_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SwapCourseDto = SwapCourseDto;
let WithdrawFromCourseDto = (() => {
    var _a;
    let _registrationId_decorators;
    let _registrationId_initializers = [];
    let _registrationId_extraInitializers = [];
    let _withdrawnBy_decorators;
    let _withdrawnBy_initializers = [];
    let _withdrawnBy_extraInitializers = [];
    let _lastAttendanceDate_decorators;
    let _lastAttendanceDate_initializers = [];
    let _lastAttendanceDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class WithdrawFromCourseDto {
            constructor() {
                this.registrationId = __runInitializers(this, _registrationId_initializers, void 0);
                this.withdrawnBy = (__runInitializers(this, _registrationId_extraInitializers), __runInitializers(this, _withdrawnBy_initializers, void 0));
                this.lastAttendanceDate = (__runInitializers(this, _withdrawnBy_extraInitializers), __runInitializers(this, _lastAttendanceDate_initializers, void 0));
                this.reason = (__runInitializers(this, _lastAttendanceDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _registrationId_decorators = [(0, class_validator_1.IsNumber)()];
            _withdrawnBy_decorators = [(0, class_validator_1.IsString)()];
            _lastAttendanceDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _registrationId_decorators, { kind: "field", name: "registrationId", static: false, private: false, access: { has: obj => "registrationId" in obj, get: obj => obj.registrationId, set: (obj, value) => { obj.registrationId = value; } }, metadata: _metadata }, _registrationId_initializers, _registrationId_extraInitializers);
            __esDecorate(null, null, _withdrawnBy_decorators, { kind: "field", name: "withdrawnBy", static: false, private: false, access: { has: obj => "withdrawnBy" in obj, get: obj => obj.withdrawnBy, set: (obj, value) => { obj.withdrawnBy = value; } }, metadata: _metadata }, _withdrawnBy_initializers, _withdrawnBy_extraInitializers);
            __esDecorate(null, null, _lastAttendanceDate_decorators, { kind: "field", name: "lastAttendanceDate", static: false, private: false, access: { has: obj => "lastAttendanceDate" in obj, get: obj => obj.lastAttendanceDate, set: (obj, value) => { obj.lastAttendanceDate = value; } }, metadata: _metadata }, _lastAttendanceDate_initializers, _lastAttendanceDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.WithdrawFromCourseDto = WithdrawFromCourseDto;
let CreateRegistrationHoldDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _holdType_decorators;
    let _holdType_initializers = [];
    let _holdType_extraInitializers = [];
    let _holdSeverity_decorators;
    let _holdSeverity_initializers = [];
    let _holdSeverity_extraInitializers = [];
    let _holdReason_decorators;
    let _holdReason_initializers = [];
    let _holdReason_extraInitializers = [];
    let _holdDescription_decorators;
    let _holdDescription_initializers = [];
    let _holdDescription_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _blocksRegistration_decorators;
    let _blocksRegistration_initializers = [];
    let _blocksRegistration_extraInitializers = [];
    let _blocksTranscripts_decorators;
    let _blocksTranscripts_initializers = [];
    let _blocksTranscripts_extraInitializers = [];
    let _blocksDegree_decorators;
    let _blocksDegree_initializers = [];
    let _blocksDegree_extraInitializers = [];
    let _amountOwed_decorators;
    let _amountOwed_initializers = [];
    let _amountOwed_extraInitializers = [];
    return _a = class CreateRegistrationHoldDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.holdType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _holdType_initializers, void 0));
                this.holdSeverity = (__runInitializers(this, _holdType_extraInitializers), __runInitializers(this, _holdSeverity_initializers, void 0));
                this.holdReason = (__runInitializers(this, _holdSeverity_extraInitializers), __runInitializers(this, _holdReason_initializers, void 0));
                this.holdDescription = (__runInitializers(this, _holdReason_extraInitializers), __runInitializers(this, _holdDescription_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _holdDescription_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.blocksRegistration = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _blocksRegistration_initializers, void 0));
                this.blocksTranscripts = (__runInitializers(this, _blocksRegistration_extraInitializers), __runInitializers(this, _blocksTranscripts_initializers, void 0));
                this.blocksDegree = (__runInitializers(this, _blocksTranscripts_extraInitializers), __runInitializers(this, _blocksDegree_initializers, void 0));
                this.amountOwed = (__runInitializers(this, _blocksDegree_extraInitializers), __runInitializers(this, _amountOwed_initializers, void 0));
                __runInitializers(this, _amountOwed_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _holdType_decorators = [(0, class_validator_1.IsEnum)(HoldType)];
            _holdSeverity_decorators = [(0, class_validator_1.IsEnum)(HoldSeverity)];
            _holdReason_decorators = [(0, class_validator_1.IsString)()];
            _holdDescription_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _blocksRegistration_decorators = [(0, class_validator_1.IsBoolean)()];
            _blocksTranscripts_decorators = [(0, class_validator_1.IsBoolean)()];
            _blocksDegree_decorators = [(0, class_validator_1.IsBoolean)()];
            _amountOwed_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _holdType_decorators, { kind: "field", name: "holdType", static: false, private: false, access: { has: obj => "holdType" in obj, get: obj => obj.holdType, set: (obj, value) => { obj.holdType = value; } }, metadata: _metadata }, _holdType_initializers, _holdType_extraInitializers);
            __esDecorate(null, null, _holdSeverity_decorators, { kind: "field", name: "holdSeverity", static: false, private: false, access: { has: obj => "holdSeverity" in obj, get: obj => obj.holdSeverity, set: (obj, value) => { obj.holdSeverity = value; } }, metadata: _metadata }, _holdSeverity_initializers, _holdSeverity_extraInitializers);
            __esDecorate(null, null, _holdReason_decorators, { kind: "field", name: "holdReason", static: false, private: false, access: { has: obj => "holdReason" in obj, get: obj => obj.holdReason, set: (obj, value) => { obj.holdReason = value; } }, metadata: _metadata }, _holdReason_initializers, _holdReason_extraInitializers);
            __esDecorate(null, null, _holdDescription_decorators, { kind: "field", name: "holdDescription", static: false, private: false, access: { has: obj => "holdDescription" in obj, get: obj => obj.holdDescription, set: (obj, value) => { obj.holdDescription = value; } }, metadata: _metadata }, _holdDescription_initializers, _holdDescription_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _blocksRegistration_decorators, { kind: "field", name: "blocksRegistration", static: false, private: false, access: { has: obj => "blocksRegistration" in obj, get: obj => obj.blocksRegistration, set: (obj, value) => { obj.blocksRegistration = value; } }, metadata: _metadata }, _blocksRegistration_initializers, _blocksRegistration_extraInitializers);
            __esDecorate(null, null, _blocksTranscripts_decorators, { kind: "field", name: "blocksTranscripts", static: false, private: false, access: { has: obj => "blocksTranscripts" in obj, get: obj => obj.blocksTranscripts, set: (obj, value) => { obj.blocksTranscripts = value; } }, metadata: _metadata }, _blocksTranscripts_initializers, _blocksTranscripts_extraInitializers);
            __esDecorate(null, null, _blocksDegree_decorators, { kind: "field", name: "blocksDegree", static: false, private: false, access: { has: obj => "blocksDegree" in obj, get: obj => obj.blocksDegree, set: (obj, value) => { obj.blocksDegree = value; } }, metadata: _metadata }, _blocksDegree_initializers, _blocksDegree_extraInitializers);
            __esDecorate(null, null, _amountOwed_decorators, { kind: "field", name: "amountOwed", static: false, private: false, access: { has: obj => "amountOwed" in obj, get: obj => obj.amountOwed, set: (obj, value) => { obj.amountOwed = value; } }, metadata: _metadata }, _amountOwed_initializers, _amountOwed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRegistrationHoldDto = CreateRegistrationHoldDto;
let ReleaseHoldDto = (() => {
    var _a;
    let _holdId_decorators;
    let _holdId_initializers = [];
    let _holdId_extraInitializers = [];
    let _releasedBy_decorators;
    let _releasedBy_initializers = [];
    let _releasedBy_extraInitializers = [];
    let _releasedReason_decorators;
    let _releasedReason_initializers = [];
    let _releasedReason_extraInitializers = [];
    return _a = class ReleaseHoldDto {
            constructor() {
                this.holdId = __runInitializers(this, _holdId_initializers, void 0);
                this.releasedBy = (__runInitializers(this, _holdId_extraInitializers), __runInitializers(this, _releasedBy_initializers, void 0));
                this.releasedReason = (__runInitializers(this, _releasedBy_extraInitializers), __runInitializers(this, _releasedReason_initializers, void 0));
                __runInitializers(this, _releasedReason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _holdId_decorators = [(0, class_validator_1.IsNumber)()];
            _releasedBy_decorators = [(0, class_validator_1.IsString)()];
            _releasedReason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _holdId_decorators, { kind: "field", name: "holdId", static: false, private: false, access: { has: obj => "holdId" in obj, get: obj => obj.holdId, set: (obj, value) => { obj.holdId = value; } }, metadata: _metadata }, _holdId_initializers, _holdId_extraInitializers);
            __esDecorate(null, null, _releasedBy_decorators, { kind: "field", name: "releasedBy", static: false, private: false, access: { has: obj => "releasedBy" in obj, get: obj => obj.releasedBy, set: (obj, value) => { obj.releasedBy = value; } }, metadata: _metadata }, _releasedBy_initializers, _releasedBy_extraInitializers);
            __esDecorate(null, null, _releasedReason_decorators, { kind: "field", name: "releasedReason", static: false, private: false, access: { has: obj => "releasedReason" in obj, get: obj => obj.releasedReason, set: (obj, value) => { obj.releasedReason = value; } }, metadata: _metadata }, _releasedReason_initializers, _releasedReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReleaseHoldDto = ReleaseHoldDto;
let CreateTimeTicketDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _priorityGroup_decorators;
    let _priorityGroup_initializers = [];
    let _priorityGroup_extraInitializers = [];
    let _priorityScore_decorators;
    let _priorityScore_initializers = [];
    let _priorityScore_extraInitializers = [];
    let _registrationStart_decorators;
    let _registrationStart_initializers = [];
    let _registrationStart_extraInitializers = [];
    let _registrationEnd_decorators;
    let _registrationEnd_initializers = [];
    let _registrationEnd_extraInitializers = [];
    let _calculatedBy_decorators;
    let _calculatedBy_initializers = [];
    let _calculatedBy_extraInitializers = [];
    return _a = class CreateTimeTicketDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.termId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.priorityGroup = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _priorityGroup_initializers, void 0));
                this.priorityScore = (__runInitializers(this, _priorityGroup_extraInitializers), __runInitializers(this, _priorityScore_initializers, void 0));
                this.registrationStart = (__runInitializers(this, _priorityScore_extraInitializers), __runInitializers(this, _registrationStart_initializers, void 0));
                this.registrationEnd = (__runInitializers(this, _registrationStart_extraInitializers), __runInitializers(this, _registrationEnd_initializers, void 0));
                this.calculatedBy = (__runInitializers(this, _registrationEnd_extraInitializers), __runInitializers(this, _calculatedBy_initializers, void 0));
                __runInitializers(this, _calculatedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _priorityGroup_decorators = [(0, class_validator_1.IsEnum)(PriorityGroup)];
            _priorityScore_decorators = [(0, class_validator_1.IsNumber)()];
            _registrationStart_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _registrationEnd_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _calculatedBy_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _priorityGroup_decorators, { kind: "field", name: "priorityGroup", static: false, private: false, access: { has: obj => "priorityGroup" in obj, get: obj => obj.priorityGroup, set: (obj, value) => { obj.priorityGroup = value; } }, metadata: _metadata }, _priorityGroup_initializers, _priorityGroup_extraInitializers);
            __esDecorate(null, null, _priorityScore_decorators, { kind: "field", name: "priorityScore", static: false, private: false, access: { has: obj => "priorityScore" in obj, get: obj => obj.priorityScore, set: (obj, value) => { obj.priorityScore = value; } }, metadata: _metadata }, _priorityScore_initializers, _priorityScore_extraInitializers);
            __esDecorate(null, null, _registrationStart_decorators, { kind: "field", name: "registrationStart", static: false, private: false, access: { has: obj => "registrationStart" in obj, get: obj => obj.registrationStart, set: (obj, value) => { obj.registrationStart = value; } }, metadata: _metadata }, _registrationStart_initializers, _registrationStart_extraInitializers);
            __esDecorate(null, null, _registrationEnd_decorators, { kind: "field", name: "registrationEnd", static: false, private: false, access: { has: obj => "registrationEnd" in obj, get: obj => obj.registrationEnd, set: (obj, value) => { obj.registrationEnd = value; } }, metadata: _metadata }, _registrationEnd_initializers, _registrationEnd_extraInitializers);
            __esDecorate(null, null, _calculatedBy_decorators, { kind: "field", name: "calculatedBy", static: false, private: false, access: { has: obj => "calculatedBy" in obj, get: obj => obj.calculatedBy, set: (obj, value) => { obj.calculatedBy = value; } }, metadata: _metadata }, _calculatedBy_initializers, _calculatedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTimeTicketDto = CreateTimeTicketDto;
let AddToWaitlistDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _sectionId_decorators;
    let _sectionId_initializers = [];
    let _sectionId_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    let _gradingBasis_decorators;
    let _gradingBasis_initializers = [];
    let _gradingBasis_extraInitializers = [];
    return _a = class AddToWaitlistDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.sectionId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _sectionId_initializers, void 0));
                this.termId = (__runInitializers(this, _sectionId_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.creditHours = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                this.gradingBasis = (__runInitializers(this, _creditHours_extraInitializers), __runInitializers(this, _gradingBasis_initializers, void 0));
                __runInitializers(this, _gradingBasis_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _sectionId_decorators = [(0, class_validator_1.IsNumber)()];
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)()];
            _gradingBasis_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _sectionId_decorators, { kind: "field", name: "sectionId", static: false, private: false, access: { has: obj => "sectionId" in obj, get: obj => obj.sectionId, set: (obj, value) => { obj.sectionId = value; } }, metadata: _metadata }, _sectionId_initializers, _sectionId_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            __esDecorate(null, null, _gradingBasis_decorators, { kind: "field", name: "gradingBasis", static: false, private: false, access: { has: obj => "gradingBasis" in obj, get: obj => obj.gradingBasis, set: (obj, value) => { obj.gradingBasis = value; } }, metadata: _metadata }, _gradingBasis_initializers, _gradingBasis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddToWaitlistDto = AddToWaitlistDto;
let RegistrationValidationDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _sectionId_decorators;
    let _sectionId_initializers = [];
    let _sectionId_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _creditHours_decorators;
    let _creditHours_initializers = [];
    let _creditHours_extraInitializers = [];
    return _a = class RegistrationValidationDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.sectionId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _sectionId_initializers, void 0));
                this.termId = (__runInitializers(this, _sectionId_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.creditHours = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _creditHours_initializers, void 0));
                __runInitializers(this, _creditHours_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, class_validator_1.IsNumber)()];
            _sectionId_decorators = [(0, class_validator_1.IsNumber)()];
            _termId_decorators = [(0, class_validator_1.IsNumber)()];
            _creditHours_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _sectionId_decorators, { kind: "field", name: "sectionId", static: false, private: false, access: { has: obj => "sectionId" in obj, get: obj => obj.sectionId, set: (obj, value) => { obj.sectionId = value; } }, metadata: _metadata }, _sectionId_initializers, _sectionId_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _creditHours_decorators, { kind: "field", name: "creditHours", static: false, private: false, access: { has: obj => "creditHours" in obj, get: obj => obj.creditHours, set: (obj, value) => { obj.creditHours = value; } }, metadata: _metadata }, _creditHours_initializers, _creditHours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RegistrationValidationDto = RegistrationValidationDto;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Creates a registration period
 */
async function createRegistrationPeriod(data, sequelize, transaction) {
    return RegistrationPeriod.create(data, { transaction });
}
/**
 * Gets active registration period for a term
 */
async function getActiveRegistrationPeriod(termId, currentDate, sequelize) {
    return RegistrationPeriod.findOne({
        where: {
            termId,
            startDate: { [sequelize_1.Op.lte]: currentDate },
            endDate: { [sequelize_1.Op.gte]: currentDate },
        },
        order: [['periodType', 'ASC']],
    });
}
/**
 * Checks if registration is open for a student
 */
async function isRegistrationOpen(studentId, termId, sequelize) {
    const now = new Date();
    // Check for active registration period
    const period = await getActiveRegistrationPeriod(termId, now, sequelize);
    if (!period) {
        return { open: false, reason: 'No active registration period' };
    }
    // Check time ticket
    const timeTicket = await RegistrationTimeTicket.findOne({
        where: { studentId, termId },
    });
    if (!timeTicket) {
        return { open: false, reason: 'No time ticket assigned' };
    }
    if (now < timeTicket.registrationStart) {
        return {
            open: false,
            reason: `Registration opens on ${timeTicket.registrationStart.toISOString()}`,
            timeTicket,
        };
    }
    if (now > timeTicket.registrationEnd) {
        return { open: false, reason: 'Time ticket expired', timeTicket };
    }
    return { open: true, timeTicket };
}
/**
 * Validates registration prerequisites
 */
async function validateRegistration(studentId, sectionId, termId, creditHours, sequelize) {
    const errors = [];
    const warnings = [];
    // Check registration holds
    const holds = await getActiveHoldsForStudent(studentId, sequelize);
    const blockingHolds = holds.filter((h) => h.blocksRegistration);
    if (blockingHolds.length > 0) {
        errors.push({
            code: RegistrationErrorCode.REGISTRATION_HOLD,
            message: 'Student has active registration holds',
            severity: 'ERROR',
            details: blockingHolds,
        });
    }
    // Check time ticket
    const timeTicketCheck = await isRegistrationOpen(studentId, termId, sequelize);
    if (!timeTicketCheck.open) {
        errors.push({
            code: RegistrationErrorCode.OUTSIDE_TIME_TICKET,
            message: timeTicketCheck.reason || 'Registration not open',
            severity: 'ERROR',
        });
    }
    // Check section capacity
    const section = await course_catalog_kit_1.CourseSection.findByPk(sectionId);
    if (!section) {
        errors.push({
            code: RegistrationErrorCode.SECTION_FULL,
            message: 'Section not found',
            severity: 'ERROR',
        });
        return { valid: false, errors, warnings };
    }
    if (section.enrollmentCurrent >= section.enrollmentCapacity) {
        errors.push({
            code: RegistrationErrorCode.SECTION_FULL,
            message: 'Section is full',
            severity: 'ERROR',
            details: {
                capacity: section.enrollmentCapacity,
                current: section.enrollmentCurrent,
                waitlistAvailable: section.waitlistCapacity > section.waitlistCurrent,
            },
        });
    }
    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({
        where: {
            studentId,
            sectionId,
            registrationStatus: {
                [sequelize_1.Op.in]: [RegistrationStatus.REGISTERED, RegistrationStatus.WAITLISTED],
            },
        },
    });
    if (existingRegistration) {
        errors.push({
            code: RegistrationErrorCode.DUPLICATE_COURSE,
            message: 'Already registered for this section',
            severity: 'ERROR',
        });
    }
    // Check time conflicts
    const timeConflict = await checkTimeConflicts(studentId, sectionId, termId, sequelize);
    if (timeConflict.hasConflict) {
        errors.push({
            code: RegistrationErrorCode.TIME_CONFLICT,
            message: 'Schedule conflict detected',
            severity: 'ERROR',
            details: timeConflict.conflictingSections,
        });
    }
    // Check credit limit
    const currentCredits = await getTotalRegisteredCredits(studentId, termId, sequelize);
    const period = await getActiveRegistrationPeriod(termId, new Date(), sequelize);
    if (period?.maxCreditHours && currentCredits + creditHours > Number(period.maxCreditHours)) {
        errors.push({
            code: RegistrationErrorCode.CREDIT_LIMIT_EXCEEDED,
            message: 'Credit limit exceeded',
            severity: 'ERROR',
            details: {
                currentCredits,
                requestedCredits: creditHours,
                maxCredits: period.maxCreditHours,
            },
        });
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Registers a student for a course
 */
async function registerForCourse(data, sequelize, transaction) {
    // Validate registration
    const validation = await validateRegistration(data.studentId, data.sectionId, data.termId, data.creditHours, sequelize);
    if (!validation.valid) {
        throw new Error(`Registration validation failed: ${validation.errors.map((e) => e.message).join(', ')}`);
    }
    // Create registration
    const registration = await Registration.create({
        studentId: data.studentId,
        sectionId: data.sectionId,
        termId: data.termId,
        registrationStatus: RegistrationStatus.REGISTERED,
        registrationDate: new Date(),
        creditHours: data.creditHours,
        gradingBasis: data.gradingBasis,
        registrationAction: RegistrationAction.ADD,
        registeredBy: data.registeredBy,
        advisorApproved: false,
        repeatCourse: data.repeatCourse || false,
        auditCourse: data.auditCourse || false,
        concurrentEnrollment: false,
        crossRegistration: false,
    }, { transaction });
    // Increment section enrollment
    await course_catalog_kit_1.CourseSection.increment('enrollmentCurrent', {
        by: 1,
        where: { id: data.sectionId },
        transaction,
    });
    // Create history record
    await RegistrationHistory.create({
        registrationId: registration.id,
        studentId: data.studentId,
        sectionId: data.sectionId,
        action: RegistrationAction.ADD,
        actionDate: new Date(),
        actionBy: data.registeredBy,
        newStatus: RegistrationStatus.REGISTERED,
    }, { transaction });
    return registration;
}
/**
 * Drops a course registration
 */
async function dropCourse(data, sequelize, transaction) {
    const registration = await Registration.findByPk(data.registrationId, { transaction });
    if (!registration) {
        throw new Error('Registration not found');
    }
    if (registration.registrationStatus === RegistrationStatus.DROPPED) {
        throw new Error('Course already dropped');
    }
    // Update registration
    const previousStatus = registration.registrationStatus;
    await registration.update({
        registrationStatus: RegistrationStatus.DROPPED,
        droppedDate: new Date(),
    }, { transaction });
    // Decrement section enrollment
    await course_catalog_kit_1.CourseSection.decrement('enrollmentCurrent', {
        by: 1,
        where: { id: registration.sectionId },
        transaction,
    });
    // Create history record
    await RegistrationHistory.create({
        registrationId: registration.id,
        studentId: registration.studentId,
        sectionId: registration.sectionId,
        action: RegistrationAction.DROP,
        actionDate: new Date(),
        actionBy: data.droppedBy,
        previousStatus,
        newStatus: RegistrationStatus.DROPPED,
        reason: data.reason,
    }, { transaction });
    // Process waitlist
    await processWaitlist(registration.sectionId, sequelize, transaction);
    return registration;
}
/**
 * Swaps one course for another
 */
async function swapCourse(data, sequelize, transaction) {
    // Drop the old course
    const dropped = await dropCourse({
        registrationId: data.dropRegistrationId,
        droppedBy: data.swappedBy,
        reason: data.reason || 'Course swap',
    }, sequelize, transaction);
    // Add the new course
    const added = await registerForCourse({
        studentId: data.studentId,
        sectionId: data.addSectionId,
        termId: dropped.termId,
        creditHours: data.creditHours,
        gradingBasis: data.gradingBasis,
        registeredBy: data.swappedBy,
    }, sequelize, transaction);
    // Update registration action to SWAP
    await added.update({ registrationAction: RegistrationAction.SWAP }, { transaction });
    return { dropped, added };
}
/**
 * Withdraws a student from a course
 */
async function withdrawFromCourse(data, sequelize, transaction) {
    const registration = await Registration.findByPk(data.registrationId, { transaction });
    if (!registration) {
        throw new Error('Registration not found');
    }
    const previousStatus = registration.registrationStatus;
    await registration.update({
        registrationStatus: RegistrationStatus.WITHDRAWN,
        withdrawnDate: new Date(),
        lastAttendanceDate: data.lastAttendanceDate,
    }, { transaction });
    // Decrement section enrollment
    await course_catalog_kit_1.CourseSection.decrement('enrollmentCurrent', {
        by: 1,
        where: { id: registration.sectionId },
        transaction,
    });
    // Create history record
    await RegistrationHistory.create({
        registrationId: registration.id,
        studentId: registration.studentId,
        sectionId: registration.sectionId,
        action: RegistrationAction.WITHDRAW,
        actionDate: new Date(),
        actionBy: data.withdrawnBy,
        previousStatus,
        newStatus: RegistrationStatus.WITHDRAWN,
        reason: data.reason,
    }, { transaction });
    return registration;
}
/**
 * Adds a student to a waitlist
 */
async function addToWaitlist(data, sequelize, transaction) {
    // Check if already on waitlist
    const existing = await WaitlistEntry.findOne({
        where: {
            studentId: data.studentId,
            sectionId: data.sectionId,
            status: WaitlistStatus.ACTIVE,
        },
        transaction,
    });
    if (existing) {
        throw new Error('Student already on waitlist for this section');
    }
    // Get next position
    const maxPosition = await WaitlistEntry.max('position', {
        where: { sectionId: data.sectionId, status: WaitlistStatus.ACTIVE },
        transaction,
    });
    const position = (maxPosition || 0) + 1;
    return WaitlistEntry.create({
        studentId: data.studentId,
        sectionId: data.sectionId,
        termId: data.termId,
        position,
        addedDate: new Date(),
        status: WaitlistStatus.ACTIVE,
        creditHours: data.creditHours,
        gradingBasis: data.gradingBasis,
    }, { transaction });
}
/**
 * Processes waitlist when a seat becomes available
 */
async function processWaitlist(sectionId, sequelize, transaction) {
    const section = await course_catalog_kit_1.CourseSection.findByPk(sectionId, { transaction });
    if (!section)
        return;
    // Check if seats are available
    const availableSeats = section.enrollmentCapacity - section.enrollmentCurrent;
    if (availableSeats <= 0)
        return;
    // Get next student on waitlist
    const nextEntry = await WaitlistEntry.findOne({
        where: {
            sectionId,
            status: WaitlistStatus.ACTIVE,
        },
        order: [['position', 'ASC']],
        transaction,
    });
    if (!nextEntry)
        return;
    // Notify student
    const expirationHours = 24;
    await nextEntry.update({
        status: WaitlistStatus.NOTIFIED,
        notificationSentDate: new Date(),
        notificationExpiresDate: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
    }, { transaction });
}
/**
 * Registers from waitlist
 */
async function registerFromWaitlist(waitlistEntryId, registeredBy, sequelize, transaction) {
    const waitlistEntry = await WaitlistEntry.findByPk(waitlistEntryId, { transaction });
    if (!waitlistEntry) {
        throw new Error('Waitlist entry not found');
    }
    if (waitlistEntry.status !== WaitlistStatus.NOTIFIED) {
        throw new Error('Student has not been notified or notification expired');
    }
    // Register for course
    const registration = await registerForCourse({
        studentId: waitlistEntry.studentId,
        sectionId: waitlistEntry.sectionId,
        termId: waitlistEntry.termId,
        creditHours: waitlistEntry.creditHours,
        gradingBasis: waitlistEntry.gradingBasis,
        registeredBy,
    }, sequelize, transaction);
    // Update waitlist entry
    await waitlistEntry.update({
        status: WaitlistStatus.REGISTERED,
        registeredDate: new Date(),
    }, { transaction });
    return registration;
}
/**
 * Creates a registration hold
 */
async function createRegistrationHold(data, sequelize, transaction) {
    return RegistrationHold.create(data, { transaction });
}
/**
 * Releases a registration hold
 */
async function releaseHold(data, sequelize, transaction) {
    const hold = await RegistrationHold.findByPk(data.holdId, { transaction });
    if (!hold) {
        throw new Error('Hold not found');
    }
    return hold.update({
        releasedDate: new Date(),
        releasedBy: data.releasedBy,
        releasedReason: data.releasedReason,
    }, { transaction });
}
/**
 * Gets active holds for a student
 */
async function getActiveHoldsForStudent(studentId, sequelize) {
    return RegistrationHold.findAll({
        where: {
            studentId,
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
            releasedDate: null,
        },
        order: [['holdSeverity', 'DESC']],
    });
}
/**
 * Creates a registration time ticket
 */
async function createTimeTicket(data, sequelize, transaction) {
    return RegistrationTimeTicket.create({
        ...data,
        calculatedAt: new Date(),
    }, { transaction });
}
/**
 * Calculates time tickets for all students in a term
 */
async function calculateTimeTicketsForTerm(termId, calculatedBy, sequelize) {
    // This is a simplified version - actual implementation would fetch student data
    // and calculate based on priority rules
    const tickets = [];
    // Example: Create tickets based on class level and priority groups
    // In production, this would query student records and apply complex business rules
    return tickets;
}
/**
 * Gets student's time ticket
 */
async function getStudentTimeTicket(studentId, termId, sequelize) {
    return RegistrationTimeTicket.findOne({
        where: { studentId, termId },
    });
}
/**
 * Overrides a time ticket
 */
async function overrideTimeTicket(timeTicketId, newStart, newEnd, overrideReason, overrideBy, sequelize, transaction) {
    const ticket = await RegistrationTimeTicket.findByPk(timeTicketId, { transaction });
    if (!ticket) {
        throw new Error('Time ticket not found');
    }
    return ticket.update({
        registrationStart: newStart,
        registrationEnd: newEnd,
        overrideReason,
        overrideBy,
    }, { transaction });
}
/**
 * Gets student's current registrations for a term
 */
async function getStudentRegistrations(studentId, termId, sequelize) {
    return Registration.findAll({
        where: {
            studentId,
            termId,
            registrationStatus: {
                [sequelize_1.Op.in]: [RegistrationStatus.REGISTERED, RegistrationStatus.WAITLISTED],
            },
        },
        include: [
            {
                model: course_catalog_kit_1.CourseSection,
                as: 'section',
                include: [{ model: course_catalog_kit_1.Course, as: 'course' }],
            },
        ],
        order: [['registrationDate', 'ASC']],
    });
}
/**
 * Gets total registered credits for a student in a term
 */
async function getTotalRegisteredCredits(studentId, termId, sequelize) {
    const result = await Registration.sum('creditHours', {
        where: {
            studentId,
            termId,
            registrationStatus: RegistrationStatus.REGISTERED,
        },
    });
    return result || 0;
}
/**
 * Checks for time conflicts in a student's schedule
 */
async function checkTimeConflicts(studentId, newSectionId, termId, sequelize) {
    const registrations = await getStudentRegistrations(studentId, termId, sequelize);
    const newSection = await course_catalog_kit_1.CourseSection.findByPk(newSectionId);
    if (!newSection || !newSection.meetingPatterns) {
        return { hasConflict: false, conflictingSections: [] };
    }
    const conflictingSections = [];
    for (const registration of registrations) {
        const section = await course_catalog_kit_1.CourseSection.findByPk(registration.sectionId);
        if (!section || !section.meetingPatterns)
            continue;
        // Compare meeting patterns for conflicts
        const hasTimeConflict = checkMeetingPatternConflict(newSection.meetingPatterns, section.meetingPatterns);
        if (hasTimeConflict) {
            conflictingSections.push(section);
        }
    }
    return {
        hasConflict: conflictingSections.length > 0,
        conflictingSections,
    };
}
/**
 * Helper function to check meeting pattern conflicts
 */
function checkMeetingPatternConflict(pattern1, pattern2) {
    for (const p1 of pattern1) {
        for (const p2 of pattern2) {
            // Check if days overlap
            const daysOverlap = p1.days?.some((day) => p2.days?.includes(day));
            if (!daysOverlap)
                continue;
            // Check if times overlap
            const start1 = new Date(`1970-01-01T${p1.startTime}`);
            const end1 = new Date(`1970-01-01T${p1.endTime}`);
            const start2 = new Date(`1970-01-01T${p2.startTime}`);
            const end2 = new Date(`1970-01-01T${p2.endTime}`);
            if (start1 < end2 && end1 > start2) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Gets registration history for a student
 */
async function getRegistrationHistory(studentId, termId, sequelize) {
    const where = { studentId };
    if (termId) {
        const registrations = await Registration.findAll({
            where: { studentId, termId },
            attributes: ['id'],
        });
        const registrationIds = registrations.map((r) => r.id);
        where.registrationId = { [sequelize_1.Op.in]: registrationIds };
    }
    return RegistrationHistory.findAll({
        where,
        order: [['actionDate', 'DESC']],
    });
}
/**
 * Gets waitlist position for a student
 */
async function getWaitlistPosition(studentId, sectionId, sequelize) {
    const entry = await WaitlistEntry.findOne({
        where: {
            studentId,
            sectionId,
            status: WaitlistStatus.ACTIVE,
        },
    });
    if (!entry)
        return null;
    const total = await WaitlistEntry.count({
        where: {
            sectionId,
            status: WaitlistStatus.ACTIVE,
        },
    });
    return {
        position: entry.position,
        total,
    };
}
/**
 * Removes student from waitlist
 */
async function removeFromWaitlist(waitlistEntryId, removedReason, sequelize, transaction) {
    const entry = await WaitlistEntry.findByPk(waitlistEntryId, { transaction });
    if (!entry) {
        throw new Error('Waitlist entry not found');
    }
    return entry.update({
        status: WaitlistStatus.REMOVED,
        removedDate: new Date(),
        removedReason,
    }, { transaction });
}
/**
 * Creates a concurrent enrollment agreement
 */
async function createConcurrentEnrollmentAgreement(studentId, homeInstitutionId, hostInstitutionId, termId, maxCreditHours, agreementStartDate, agreementEndDate, approvedBy, sequelize, transaction) {
    return ConcurrentEnrollmentAgreement.create({
        studentId,
        homeInstitutionId,
        hostInstitutionId,
        termId,
        maxCreditHours,
        agreementStartDate,
        agreementEndDate,
        approvedBy,
        approvalDate: new Date(),
        status: 'ACTIVE',
    }, { transaction });
}
/**
 * Validates concurrent enrollment
 */
async function validateConcurrentEnrollment(studentId, termId, additionalCredits, sequelize) {
    const agreement = await ConcurrentEnrollmentAgreement.findOne({
        where: {
            studentId,
            termId,
            status: 'ACTIVE',
        },
    });
    if (!agreement) {
        return { valid: false, reason: 'No active concurrent enrollment agreement' };
    }
    const currentCredits = await getTotalRegisteredCredits(studentId, termId, sequelize);
    if (currentCredits + additionalCredits > Number(agreement.maxCreditHours)) {
        return {
            valid: false,
            reason: `Exceeds concurrent enrollment limit of ${agreement.maxCreditHours} credits`,
        };
    }
    return { valid: true };
}
/**
 * Approves registration by advisor
 */
async function approveRegistrationByAdvisor(registrationId, advisorId, sequelize, transaction) {
    const registration = await Registration.findByPk(registrationId, { transaction });
    if (!registration) {
        throw new Error('Registration not found');
    }
    return registration.update({
        advisorApproved: true,
        advisorApprovedBy: advisorId,
        advisorApprovedDate: new Date(),
    }, { transaction });
}
/**
 * Changes grading basis for a registration
 */
async function changeGradingBasis(registrationId, newGradingBasis, changedBy, sequelize, transaction) {
    const registration = await Registration.findByPk(registrationId, { transaction });
    if (!registration) {
        throw new Error('Registration not found');
    }
    const previousStatus = registration.registrationStatus;
    await registration.update({ gradingBasis: newGradingBasis }, { transaction });
    await RegistrationHistory.create({
        registrationId: registration.id,
        studentId: registration.studentId,
        sectionId: registration.sectionId,
        action: RegistrationAction.CHANGE_GRADING_BASIS,
        actionDate: new Date(),
        actionBy: changedBy,
        previousStatus,
        newStatus: registration.registrationStatus,
    }, { transaction });
    return registration;
}
/**
 * Changes credit hours for a variable credit course
 */
async function changeCreditHours(registrationId, newCreditHours, changedBy, sequelize, transaction) {
    const registration = await Registration.findByPk(registrationId, { transaction });
    if (!registration) {
        throw new Error('Registration not found');
    }
    const previousStatus = registration.registrationStatus;
    await registration.update({ creditHours: newCreditHours }, { transaction });
    await RegistrationHistory.create({
        registrationId: registration.id,
        studentId: registration.studentId,
        sectionId: registration.sectionId,
        action: RegistrationAction.CHANGE_CREDIT_HOURS,
        actionDate: new Date(),
        actionBy: changedBy,
        previousStatus,
        newStatus: registration.registrationStatus,
    }, { transaction });
    return registration;
}
/**
 * Gets enrollment statistics for a term
 */
async function getTermEnrollmentStats(termId, sequelize) {
    const registrations = await Registration.findAll({
        where: {
            termId,
            registrationStatus: RegistrationStatus.REGISTERED,
        },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'totalRegistrations'],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('studentId'))), 'totalStudents'],
            [sequelize.fn('SUM', sequelize.col('creditHours')), 'totalCredits'],
        ],
        raw: true,
    });
    const stats = registrations[0];
    const totalRegistrations = parseInt(stats.totalRegistrations) || 0;
    const totalStudents = parseInt(stats.totalStudents) || 0;
    const totalCredits = parseFloat(stats.totalCredits) || 0;
    const averageCreditsPerStudent = totalStudents > 0 ? totalCredits / totalStudents : 0;
    return {
        totalRegistrations,
        totalStudents,
        totalCredits,
        averageCreditsPerStudent: Math.round(averageCreditsPerStudent * 100) / 100,
    };
}
/**
 * Gets section enrollment details
 */
async function getSectionEnrollmentDetails(sectionId, sequelize) {
    const section = await course_catalog_kit_1.CourseSection.findByPk(sectionId);
    if (!section) {
        throw new Error('Section not found');
    }
    const enrolledStudents = await Registration.count({
        where: {
            sectionId,
            registrationStatus: RegistrationStatus.REGISTERED,
        },
    });
    const waitlistedStudents = await WaitlistEntry.count({
        where: {
            sectionId,
            status: WaitlistStatus.ACTIVE,
        },
    });
    const capacity = section.enrollmentCapacity;
    const availableSeats = Math.max(0, capacity - enrolledStudents);
    const enrollmentPercent = capacity > 0 ? (enrolledStudents / capacity) * 100 : 0;
    return {
        enrolledStudents,
        waitlistedStudents,
        capacity,
        availableSeats,
        enrollmentPercent: Math.round(enrollmentPercent * 100) / 100,
    };
}
/**
 * Validates registration cart
 */
async function validateRegistrationCart(cart, sequelize) {
    const allErrors = [];
    const allWarnings = [];
    for (const item of cart.sections) {
        const validation = await validateRegistration(cart.studentId, item.sectionId, cart.termId, item.creditHours, sequelize);
        allErrors.push(...validation.errors);
        allWarnings.push(...validation.warnings);
    }
    return {
        valid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
    };
}
/**
 * Processes registration cart (registers for multiple courses)
 */
async function processRegistrationCart(cart, registeredBy, sequelize) {
    const successful = [];
    const failed = [];
    for (const item of cart.sections) {
        try {
            const registration = await sequelize.transaction(async (transaction) => {
                return registerForCourse({
                    studentId: cart.studentId,
                    sectionId: item.sectionId,
                    termId: cart.termId,
                    creditHours: item.creditHours,
                    gradingBasis: item.gradingBasis,
                    registeredBy,
                }, sequelize, transaction);
            });
            successful.push(registration);
        }
        catch (error) {
            failed.push({
                sectionId: item.sectionId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return { successful, failed };
}
// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================
let RegistrationPeriodsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('registration-periods'), (0, common_1.Controller)('api/v1/registration-periods'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findByTerm_decorators;
    let _getActive_decorators;
    var RegistrationPeriodsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createRegistrationPeriod(createDto, this.sequelize);
        }
        async findByTerm(termId) {
            return RegistrationPeriod.findAll({
                where: { termId },
                order: [['startDate', 'ASC']],
            });
        }
        async getActive(termId) {
            return getActiveRegistrationPeriod(termId, new Date(), this.sequelize);
        }
    };
    __setFunctionName(_classThis, "RegistrationPeriodsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a registration period' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Period created successfully' })];
        _findByTerm_decorators = [(0, common_1.Get)('term/:termId'), (0, swagger_1.ApiOperation)({ summary: 'Get registration periods for a term' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Periods retrieved successfully' })];
        _getActive_decorators = [(0, common_1.Get)('term/:termId/active'), (0, swagger_1.ApiOperation)({ summary: 'Get active registration period for a term' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Period retrieved successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByTerm_decorators, { kind: "method", name: "findByTerm", static: false, private: false, access: { has: obj => "findByTerm" in obj, get: obj => obj.findByTerm }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActive_decorators, { kind: "method", name: "getActive", static: false, private: false, access: { has: obj => "getActive" in obj, get: obj => obj.getActive }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegistrationPeriodsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegistrationPeriodsController = _classThis;
})();
exports.RegistrationPeriodsController = RegistrationPeriodsController;
let RegistrationsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('registrations'), (0, common_1.Controller)('api/v1/registrations'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _register_decorators;
    let _drop_decorators;
    let _swap_decorators;
    let _withdraw_decorators;
    let _getStudentRegistrations_decorators;
    let _getTotalCredits_decorators;
    let _validate_decorators;
    let _getHistory_decorators;
    let _approve_decorators;
    let _changeGradingBasis_decorators;
    let _changeCreditHours_decorators;
    var RegistrationsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async register(registerDto) {
            return sequelize.transaction((transaction) => registerForCourse(registerDto, this.sequelize, transaction));
        }
        async drop(dropDto) {
            return sequelize.transaction((transaction) => dropCourse(dropDto, this.sequelize, transaction));
        }
        async swap(swapDto) {
            return sequelize.transaction((transaction) => swapCourse(swapDto, this.sequelize, transaction));
        }
        async withdraw(withdrawDto) {
            return sequelize.transaction((transaction) => withdrawFromCourse(withdrawDto, this.sequelize, transaction));
        }
        async getStudentRegistrations(studentId, termId) {
            return getStudentRegistrations(studentId, termId, this.sequelize);
        }
        async getTotalCredits(studentId, termId) {
            const totalCredits = await getTotalRegisteredCredits(studentId, termId, this.sequelize);
            return { totalCredits };
        }
        async validate(validationDto) {
            return validateRegistration(validationDto.studentId, validationDto.sectionId, validationDto.termId, validationDto.creditHours, this.sequelize);
        }
        async getHistory(id) {
            const registration = await Registration.findByPk(id);
            if (!registration) {
                throw new Error('Registration not found');
            }
            return getRegistrationHistory(registration.studentId, registration.termId, this.sequelize);
        }
        async approve(id, advisorId) {
            return sequelize.transaction((transaction) => approveRegistrationByAdvisor(id, advisorId, this.sequelize, transaction));
        }
        async changeGradingBasis(id, gradingBasis, changedBy) {
            return sequelize.transaction((transaction) => changeGradingBasis(id, gradingBasis, changedBy, this.sequelize, transaction));
        }
        async changeCreditHours(id, creditHours, changedBy) {
            return sequelize.transaction((transaction) => changeCreditHours(id, creditHours, changedBy, this.sequelize, transaction));
        }
    };
    __setFunctionName(_classThis, "RegistrationsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _register_decorators = [(0, common_1.Post)('register'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register a student for a course' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Registration successful' })];
        _drop_decorators = [(0, common_1.Post)('drop'), (0, swagger_1.ApiOperation)({ summary: 'Drop a course registration' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course dropped successfully' })];
        _swap_decorators = [(0, common_1.Post)('swap'), (0, swagger_1.ApiOperation)({ summary: 'Swap one course for another' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Course swapped successfully' })];
        _withdraw_decorators = [(0, common_1.Post)('withdraw'), (0, swagger_1.ApiOperation)({ summary: 'Withdraw from a course' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal successful' })];
        _getStudentRegistrations_decorators = [(0, common_1.Get)('student/:studentId/term/:termId'), (0, swagger_1.ApiOperation)({ summary: 'Get student registrations for a term' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Registrations retrieved successfully' })];
        _getTotalCredits_decorators = [(0, common_1.Get)('student/:studentId/term/:termId/credits'), (0, swagger_1.ApiOperation)({ summary: 'Get total registered credits for student' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Credits retrieved successfully' })];
        _validate_decorators = [(0, common_1.Post)('validate'), (0, swagger_1.ApiOperation)({ summary: 'Validate a registration' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation completed' })];
        _getHistory_decorators = [(0, common_1.Get)(':id/history'), (0, swagger_1.ApiOperation)({ summary: 'Get registration history' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' })];
        _approve_decorators = [(0, common_1.Post)(':id/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve registration by advisor' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Registration approved' })];
        _changeGradingBasis_decorators = [(0, common_1.Patch)(':id/grading-basis'), (0, swagger_1.ApiOperation)({ summary: 'Change grading basis' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Grading basis updated' })];
        _changeCreditHours_decorators = [(0, common_1.Patch)(':id/credit-hours'), (0, swagger_1.ApiOperation)({ summary: 'Change credit hours' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Credit hours updated' })];
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: obj => "register" in obj, get: obj => obj.register }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _drop_decorators, { kind: "method", name: "drop", static: false, private: false, access: { has: obj => "drop" in obj, get: obj => obj.drop }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _swap_decorators, { kind: "method", name: "swap", static: false, private: false, access: { has: obj => "swap" in obj, get: obj => obj.swap }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _withdraw_decorators, { kind: "method", name: "withdraw", static: false, private: false, access: { has: obj => "withdraw" in obj, get: obj => obj.withdraw }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStudentRegistrations_decorators, { kind: "method", name: "getStudentRegistrations", static: false, private: false, access: { has: obj => "getStudentRegistrations" in obj, get: obj => obj.getStudentRegistrations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTotalCredits_decorators, { kind: "method", name: "getTotalCredits", static: false, private: false, access: { has: obj => "getTotalCredits" in obj, get: obj => obj.getTotalCredits }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: obj => "validate" in obj, get: obj => obj.validate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeGradingBasis_decorators, { kind: "method", name: "changeGradingBasis", static: false, private: false, access: { has: obj => "changeGradingBasis" in obj, get: obj => obj.changeGradingBasis }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeCreditHours_decorators, { kind: "method", name: "changeCreditHours", static: false, private: false, access: { has: obj => "changeCreditHours" in obj, get: obj => obj.changeCreditHours }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegistrationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegistrationsController = _classThis;
})();
exports.RegistrationsController = RegistrationsController;
let RegistrationHoldsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('registration-holds'), (0, common_1.Controller)('api/v1/registration-holds'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _getStudentHolds_decorators;
    let _release_decorators;
    var RegistrationHoldsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createRegistrationHold(createDto, this.sequelize);
        }
        async getStudentHolds(studentId) {
            return getActiveHoldsForStudent(studentId, this.sequelize);
        }
        async release(releaseDto) {
            return sequelize.transaction((transaction) => releaseHold(releaseDto, this.sequelize, transaction));
        }
    };
    __setFunctionName(_classThis, "RegistrationHoldsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a registration hold' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Hold created successfully' })];
        _getStudentHolds_decorators = [(0, common_1.Get)('student/:studentId'), (0, swagger_1.ApiOperation)({ summary: 'Get holds for a student' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Holds retrieved successfully' })];
        _release_decorators = [(0, common_1.Post)('release'), (0, swagger_1.ApiOperation)({ summary: 'Release a hold' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Hold released successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStudentHolds_decorators, { kind: "method", name: "getStudentHolds", static: false, private: false, access: { has: obj => "getStudentHolds" in obj, get: obj => obj.getStudentHolds }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _release_decorators, { kind: "method", name: "release", static: false, private: false, access: { has: obj => "release" in obj, get: obj => obj.release }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegistrationHoldsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegistrationHoldsController = _classThis;
})();
exports.RegistrationHoldsController = RegistrationHoldsController;
let TimeTicketsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('time-tickets'), (0, common_1.Controller)('api/v1/time-tickets'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _getStudentTicket_decorators;
    let _override_decorators;
    var TimeTicketsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto) {
            return createTimeTicket(createDto, this.sequelize);
        }
        async getStudentTicket(studentId, termId) {
            return getStudentTimeTicket(studentId, termId, this.sequelize);
        }
        async override(id, newStart, newEnd, overrideReason, overrideBy) {
            return sequelize.transaction((transaction) => overrideTimeTicket(id, newStart, newEnd, overrideReason, overrideBy, this.sequelize, transaction));
        }
    };
    __setFunctionName(_classThis, "TimeTicketsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a time ticket' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Time ticket created successfully' })];
        _getStudentTicket_decorators = [(0, common_1.Get)('student/:studentId/term/:termId'), (0, swagger_1.ApiOperation)({ summary: 'Get student time ticket' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Time ticket retrieved successfully' })];
        _override_decorators = [(0, common_1.Post)(':id/override'), (0, swagger_1.ApiOperation)({ summary: 'Override a time ticket' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Time ticket overridden successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStudentTicket_decorators, { kind: "method", name: "getStudentTicket", static: false, private: false, access: { has: obj => "getStudentTicket" in obj, get: obj => obj.getStudentTicket }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _override_decorators, { kind: "method", name: "override", static: false, private: false, access: { has: obj => "override" in obj, get: obj => obj.override }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimeTicketsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimeTicketsController = _classThis;
})();
exports.TimeTicketsController = TimeTicketsController;
let WaitlistController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('waitlist'), (0, common_1.Controller)('api/v1/waitlist'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _add_decorators;
    let _getPosition_decorators;
    let _registerFromWaitlist_decorators;
    let _remove_decorators;
    var WaitlistController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async add(addDto) {
            return sequelize.transaction((transaction) => addToWaitlist(addDto, this.sequelize, transaction));
        }
        async getPosition(studentId, sectionId) {
            return getWaitlistPosition(studentId, sectionId, this.sequelize);
        }
        async registerFromWaitlist(id, registeredBy) {
            return sequelize.transaction((transaction) => registerFromWaitlist(id, registeredBy, this.sequelize, transaction));
        }
        async remove(id, removedReason) {
            return sequelize.transaction((transaction) => removeFromWaitlist(id, removedReason, this.sequelize, transaction));
        }
    };
    __setFunctionName(_classThis, "WaitlistController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _add_decorators = [(0, common_1.Post)('add'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Add student to waitlist' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Added to waitlist successfully' })];
        _getPosition_decorators = [(0, common_1.Get)('student/:studentId/section/:sectionId/position'), (0, swagger_1.ApiOperation)({ summary: 'Get waitlist position' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Position retrieved successfully' })];
        _registerFromWaitlist_decorators = [(0, common_1.Post)(':id/register'), (0, swagger_1.ApiOperation)({ summary: 'Register from waitlist' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Registered successfully' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Remove from waitlist' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Removed from waitlist' })];
        __esDecorate(_classThis, null, _add_decorators, { kind: "method", name: "add", static: false, private: false, access: { has: obj => "add" in obj, get: obj => obj.add }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPosition_decorators, { kind: "method", name: "getPosition", static: false, private: false, access: { has: obj => "getPosition" in obj, get: obj => obj.getPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerFromWaitlist_decorators, { kind: "method", name: "registerFromWaitlist", static: false, private: false, access: { has: obj => "registerFromWaitlist" in obj, get: obj => obj.registerFromWaitlist }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaitlistController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaitlistController = _classThis;
})();
exports.WaitlistController = WaitlistController;
let EnrollmentStatisticsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('enrollment-statistics'), (0, common_1.Controller)('api/v1/enrollment-statistics'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getTermStats_decorators;
    let _getSectionDetails_decorators;
    var EnrollmentStatisticsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async getTermStats(termId) {
            return getTermEnrollmentStats(termId, this.sequelize);
        }
        async getSectionDetails(sectionId) {
            return getSectionEnrollmentDetails(sectionId, this.sequelize);
        }
    };
    __setFunctionName(_classThis, "EnrollmentStatisticsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getTermStats_decorators = [(0, common_1.Get)('term/:termId'), (0, swagger_1.ApiOperation)({ summary: 'Get term enrollment statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' })];
        _getSectionDetails_decorators = [(0, common_1.Get)('section/:sectionId'), (0, swagger_1.ApiOperation)({ summary: 'Get section enrollment details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Details retrieved successfully' })];
        __esDecorate(_classThis, null, _getTermStats_decorators, { kind: "method", name: "getTermStats", static: false, private: false, access: { has: obj => "getTermStats" in obj, get: obj => obj.getTermStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSectionDetails_decorators, { kind: "method", name: "getSectionDetails", static: false, private: false, access: { has: obj => "getSectionDetails" in obj, get: obj => obj.getSectionDetails }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnrollmentStatisticsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnrollmentStatisticsController = _classThis;
})();
exports.EnrollmentStatisticsController = EnrollmentStatisticsController;
//# sourceMappingURL=course-registration-kit.js.map