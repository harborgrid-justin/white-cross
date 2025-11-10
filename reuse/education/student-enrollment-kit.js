"use strict";
/**
 * LOC: EDU-ENROLL-001
 * File: /reuse/education/student-enrollment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Student information services
 *   - Registration services
 *   - Academic advising modules
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentPlan = exports.calculateRefundPercentage = exports.processEnrollmentRefund = exports.applyLateFee = exports.getOutstandingFees = exports.processFeePayment = exports.createFeeAssessment = exports.calculateEnrollmentFees = exports.getSectionEnrollmentStats = exports.releaseReservedSeats = exports.setReservedSeats = exports.expireWaitlistEntries = exports.reorderWaitlist = exports.getWaitlistPosition = exports.processWaitlist = exports.removeFromWaitlist = exports.addToWaitlist = exports.checkEnrollmentCapacity = exports.validateEnrollmentPermission = exports.createEnrollmentRestriction = exports.checkEnrollmentHolds = exports.releaseEnrollmentHold = exports.placeEnrollmentHold = exports.validateArticulationAgreement = exports.updateSEVISStatus = exports.createInternationalStudentRecord = exports.evaluateTransferCredit = exports.createTransferCredit = exports.checkInternationalStudentCompliance = exports.validateFinancialAidEligibility = exports.generateVerificationLetter = exports.verifyEnrollmentStatus = exports.createEnrollmentVerification = exports.changeGradingOption = exports.getEnrollmentMetrics = exports.updateAcademicLevel = exports.isFullTimeStudent = exports.calculateEnrolledCredits = exports.getStudentEnrollments = exports.withdrawFromCourse = exports.dropCourse = exports.enrollStudentInCourse = exports.createStudent = exports.createEnrollmentStatusModel = exports.createEnrollmentModel = exports.createStudentModel = exports.TransferCreditDto = exports.EnrollmentVerificationDto = exports.CreateEnrollmentDto = exports.CreateStudentDto = void 0;
exports.generateFeeStatement = exports.waiveFee = void 0;
/**
 * File: /reuse/education/student-enrollment-kit.ts
 * Locator: WC-EDU-ENROLL-001
 * Purpose: Comprehensive Student Enrollment Management - Ellucian SIS-level enrollment processing, verification, capacity management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Student Services, Registration, Academic Advising
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for enrollment management, verification, transfer/international students, holds, capacity, waitlist, fees
 *
 * LLM Context: Enterprise-grade student enrollment management for higher education SIS.
 * Provides comprehensive enrollment processing, enrollment verification, transfer student handling,
 * international student enrollment, enrollment holds and restrictions, capacity management,
 * waitlist processing, enrollment fee calculation, SEVIS compliance, enrollment status tracking,
 * and full integration with academic calendar and course registration systems.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateStudentDto = (() => {
    var _a;
    let _studentNumber_decorators;
    let _studentNumber_initializers = [];
    let _studentNumber_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _middleName_decorators;
    let _middleName_initializers = [];
    let _middleName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _admissionDate_decorators;
    let _admissionDate_initializers = [];
    let _admissionDate_extraInitializers = [];
    let _studentType_decorators;
    let _studentType_initializers = [];
    let _studentType_extraInitializers = [];
    let _academicLevel_decorators;
    let _academicLevel_initializers = [];
    let _academicLevel_extraInitializers = [];
    return _a = class CreateStudentDto {
            constructor() {
                this.studentNumber = __runInitializers(this, _studentNumber_initializers, void 0);
                this.firstName = (__runInitializers(this, _studentNumber_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.middleName = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _middleName_initializers, void 0));
                this.email = (__runInitializers(this, _middleName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.dateOfBirth = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
                this.admissionDate = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _admissionDate_initializers, void 0));
                this.studentType = (__runInitializers(this, _admissionDate_extraInitializers), __runInitializers(this, _studentType_initializers, void 0));
                this.academicLevel = (__runInitializers(this, _studentType_extraInitializers), __runInitializers(this, _academicLevel_initializers, void 0));
                __runInitializers(this, _academicLevel_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID number', example: 'S-2024-001234' })];
            _firstName_decorators = [(0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' })];
            _lastName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' })];
            _middleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Middle name', required: false })];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address', example: 'john.doe@university.edu' })];
            _dateOfBirth_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date of birth' })];
            _admissionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Admission date' })];
            _studentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student type', enum: ['new', 'transfer', 'returning', 'international'] })];
            _academicLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Academic level', enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate'] })];
            __esDecorate(null, null, _studentNumber_decorators, { kind: "field", name: "studentNumber", static: false, private: false, access: { has: obj => "studentNumber" in obj, get: obj => obj.studentNumber, set: (obj, value) => { obj.studentNumber = value; } }, metadata: _metadata }, _studentNumber_initializers, _studentNumber_extraInitializers);
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _middleName_decorators, { kind: "field", name: "middleName", static: false, private: false, access: { has: obj => "middleName" in obj, get: obj => obj.middleName, set: (obj, value) => { obj.middleName = value; } }, metadata: _metadata }, _middleName_initializers, _middleName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
            __esDecorate(null, null, _admissionDate_decorators, { kind: "field", name: "admissionDate", static: false, private: false, access: { has: obj => "admissionDate" in obj, get: obj => obj.admissionDate, set: (obj, value) => { obj.admissionDate = value; } }, metadata: _metadata }, _admissionDate_initializers, _admissionDate_extraInitializers);
            __esDecorate(null, null, _studentType_decorators, { kind: "field", name: "studentType", static: false, private: false, access: { has: obj => "studentType" in obj, get: obj => obj.studentType, set: (obj, value) => { obj.studentType = value; } }, metadata: _metadata }, _studentType_initializers, _studentType_extraInitializers);
            __esDecorate(null, null, _academicLevel_decorators, { kind: "field", name: "academicLevel", static: false, private: false, access: { has: obj => "academicLevel" in obj, get: obj => obj.academicLevel, set: (obj, value) => { obj.academicLevel = value; } }, metadata: _metadata }, _academicLevel_initializers, _academicLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStudentDto = CreateStudentDto;
let CreateEnrollmentDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _sectionId_decorators;
    let _sectionId_initializers = [];
    let _sectionId_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _enrollmentDate_decorators;
    let _enrollmentDate_initializers = [];
    let _enrollmentDate_extraInitializers = [];
    let _enrollmentStatus_decorators;
    let _enrollmentStatus_initializers = [];
    let _enrollmentStatus_extraInitializers = [];
    let _credits_decorators;
    let _credits_initializers = [];
    let _credits_extraInitializers = [];
    let _gradingOption_decorators;
    let _gradingOption_initializers = [];
    let _gradingOption_extraInitializers = [];
    return _a = class CreateEnrollmentDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.courseId = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _courseId_initializers, void 0));
                this.sectionId = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _sectionId_initializers, void 0));
                this.termId = (__runInitializers(this, _sectionId_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.enrollmentDate = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _enrollmentDate_initializers, void 0));
                this.enrollmentStatus = (__runInitializers(this, _enrollmentDate_extraInitializers), __runInitializers(this, _enrollmentStatus_initializers, void 0));
                this.credits = (__runInitializers(this, _enrollmentStatus_extraInitializers), __runInitializers(this, _credits_initializers, void 0));
                this.gradingOption = (__runInitializers(this, _credits_extraInitializers), __runInitializers(this, _gradingOption_initializers, void 0));
                __runInitializers(this, _gradingOption_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _courseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' })];
            _sectionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Section ID' })];
            _termId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Term ID' })];
            _enrollmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enrollment date' })];
            _enrollmentStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enrollment status', enum: ['enrolled', 'dropped', 'withdrawn', 'completed'] })];
            _credits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credits', example: 3 })];
            _gradingOption_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grading option', enum: ['letter', 'pass-fail', 'audit'] })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _sectionId_decorators, { kind: "field", name: "sectionId", static: false, private: false, access: { has: obj => "sectionId" in obj, get: obj => obj.sectionId, set: (obj, value) => { obj.sectionId = value; } }, metadata: _metadata }, _sectionId_initializers, _sectionId_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _enrollmentDate_decorators, { kind: "field", name: "enrollmentDate", static: false, private: false, access: { has: obj => "enrollmentDate" in obj, get: obj => obj.enrollmentDate, set: (obj, value) => { obj.enrollmentDate = value; } }, metadata: _metadata }, _enrollmentDate_initializers, _enrollmentDate_extraInitializers);
            __esDecorate(null, null, _enrollmentStatus_decorators, { kind: "field", name: "enrollmentStatus", static: false, private: false, access: { has: obj => "enrollmentStatus" in obj, get: obj => obj.enrollmentStatus, set: (obj, value) => { obj.enrollmentStatus = value; } }, metadata: _metadata }, _enrollmentStatus_initializers, _enrollmentStatus_extraInitializers);
            __esDecorate(null, null, _credits_decorators, { kind: "field", name: "credits", static: false, private: false, access: { has: obj => "credits" in obj, get: obj => obj.credits, set: (obj, value) => { obj.credits = value; } }, metadata: _metadata }, _credits_initializers, _credits_extraInitializers);
            __esDecorate(null, null, _gradingOption_decorators, { kind: "field", name: "gradingOption", static: false, private: false, access: { has: obj => "gradingOption" in obj, get: obj => obj.gradingOption, set: (obj, value) => { obj.gradingOption = value; } }, metadata: _metadata }, _gradingOption_initializers, _gradingOption_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEnrollmentDto = CreateEnrollmentDto;
let EnrollmentVerificationDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _verificationType_decorators;
    let _verificationType_initializers = [];
    let _verificationType_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    let _creditsEnrolled_decorators;
    let _creditsEnrolled_initializers = [];
    let _creditsEnrolled_extraInitializers = [];
    return _a = class EnrollmentVerificationDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.verificationType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _verificationType_initializers, void 0));
                this.termId = (__runInitializers(this, _verificationType_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                this.creditsEnrolled = (__runInitializers(this, _termId_extraInitializers), __runInitializers(this, _creditsEnrolled_initializers, void 0));
                __runInitializers(this, _creditsEnrolled_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _verificationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Verification type', enum: ['full-time', 'part-time', 'graduated', 'withdrawn', 'on-leave'] })];
            _termId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Term ID' })];
            _creditsEnrolled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credits enrolled' })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _verificationType_decorators, { kind: "field", name: "verificationType", static: false, private: false, access: { has: obj => "verificationType" in obj, get: obj => obj.verificationType, set: (obj, value) => { obj.verificationType = value; } }, metadata: _metadata }, _verificationType_initializers, _verificationType_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            __esDecorate(null, null, _creditsEnrolled_decorators, { kind: "field", name: "creditsEnrolled", static: false, private: false, access: { has: obj => "creditsEnrolled" in obj, get: obj => obj.creditsEnrolled, set: (obj, value) => { obj.creditsEnrolled = value; } }, metadata: _metadata }, _creditsEnrolled_initializers, _creditsEnrolled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EnrollmentVerificationDto = EnrollmentVerificationDto;
let TransferCreditDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _institutionName_decorators;
    let _institutionName_initializers = [];
    let _institutionName_extraInitializers = [];
    let _courseTitle_decorators;
    let _courseTitle_initializers = [];
    let _courseTitle_extraInitializers = [];
    let _credits_decorators;
    let _credits_initializers = [];
    let _credits_extraInitializers = [];
    let _grade_decorators;
    let _grade_initializers = [];
    let _grade_extraInitializers = [];
    return _a = class TransferCreditDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.institutionName = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _institutionName_initializers, void 0));
                this.courseTitle = (__runInitializers(this, _institutionName_extraInitializers), __runInitializers(this, _courseTitle_initializers, void 0));
                this.credits = (__runInitializers(this, _courseTitle_extraInitializers), __runInitializers(this, _credits_initializers, void 0));
                this.grade = (__runInitializers(this, _credits_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
                __runInitializers(this, _grade_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _institutionName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Institution name' })];
            _courseTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course title' })];
            _credits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credits' })];
            _grade_decorators = [(0, swagger_1.ApiProperty)({ description: 'Grade received' })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _institutionName_decorators, { kind: "field", name: "institutionName", static: false, private: false, access: { has: obj => "institutionName" in obj, get: obj => obj.institutionName, set: (obj, value) => { obj.institutionName = value; } }, metadata: _metadata }, _institutionName_initializers, _institutionName_extraInitializers);
            __esDecorate(null, null, _courseTitle_decorators, { kind: "field", name: "courseTitle", static: false, private: false, access: { has: obj => "courseTitle" in obj, get: obj => obj.courseTitle, set: (obj, value) => { obj.courseTitle = value; } }, metadata: _metadata }, _courseTitle_initializers, _courseTitle_extraInitializers);
            __esDecorate(null, null, _credits_decorators, { kind: "field", name: "credits", static: false, private: false, access: { has: obj => "credits" in obj, get: obj => obj.credits, set: (obj, value) => { obj.credits = value; } }, metadata: _metadata }, _credits_initializers, _credits_extraInitializers);
            __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: obj => "grade" in obj, get: obj => obj.grade, set: (obj, value) => { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TransferCreditDto = TransferCreditDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Student with comprehensive academic tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Student model
 *
 * @example
 * ```typescript
 * const Student = createStudentModel(sequelize);
 * const student = await Student.create({
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * });
 * ```
 */
const createStudentModel = (sequelize) => {
    class Student extends sequelize_1.Model {
    }
    Student.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique student identification number',
            validate: {
                notEmpty: true,
                len: [5, 50],
            },
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Student first name',
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Student last name',
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        middleName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Student middle name',
        },
        preferredName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Student preferred name',
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Primary email address',
            validate: {
                isEmail: true,
            },
        },
        alternateEmail: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Alternate email address',
            validate: {
                isEmail: true,
            },
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date of birth',
        },
        ssn: {
            type: sequelize_1.DataTypes.STRING(11),
            allowNull: true,
            comment: 'Social Security Number (encrypted)',
        },
        gender: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Gender identity',
        },
        ethnicity: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Ethnicity/race',
        },
        citizenship: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'US',
            comment: 'Citizenship status',
        },
        admissionDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date of admission',
        },
        studentType: {
            type: sequelize_1.DataTypes.ENUM('new', 'transfer', 'returning', 'international', 'visiting', 'non-degree'),
            allowNull: false,
            comment: 'Type of student',
        },
        academicLevel: {
            type: sequelize_1.DataTypes.ENUM('freshman', 'sophomore', 'junior', 'senior', 'graduate', 'post-graduate', 'doctorate'),
            allowNull: false,
            comment: 'Current academic level',
        },
        majorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Primary major program ID',
        },
        minorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Minor program ID',
        },
        advisorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Academic advisor ID',
        },
        enrollmentStatus: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'withdrawn', 'graduated', 'suspended', 'on-leave'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Current enrollment status',
        },
        gpa: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: 'Cumulative GPA',
            validate: {
                min: 0.00,
                max: 4.00,
            },
        },
        creditsEarned: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total credits earned',
            validate: {
                min: 0,
            },
        },
        creditsAttempted: {
            type: sequelize_1.DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total credits attempted',
            validate: {
                min: 0,
            },
        },
        expectedGraduationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Expected graduation date',
        },
        actualGraduationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Actual graduation date',
        },
        isInternational: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is international student',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Student active status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'students',
        timestamps: true,
        indexes: [
            { fields: ['studentNumber'], unique: true },
            { fields: ['email'], unique: true },
            { fields: ['studentType'] },
            { fields: ['academicLevel'] },
            { fields: ['enrollmentStatus'] },
            { fields: ['isInternational'] },
            { fields: ['advisorId'] },
            { fields: ['majorId'] },
        ],
        hooks: {
            beforeCreate: (student) => {
                if (!student.createdBy) {
                    throw new Error('createdBy is required');
                }
                student.updatedBy = student.createdBy;
            },
            beforeUpdate: (student) => {
                if (!student.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
    });
    return Student;
};
exports.createStudentModel = createStudentModel;
/**
 * Sequelize model for Enrollment with status tracking and capacity management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Enrollment model
 *
 * @example
 * ```typescript
 * const Enrollment = createEnrollmentModel(sequelize);
 * const enrollment = await Enrollment.create({
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3
 * });
 * ```
 */
const createEnrollmentModel = (sequelize) => {
    class Enrollment extends sequelize_1.Model {
    }
    Enrollment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student',
            references: {
                model: 'students',
                key: 'id',
            },
        },
        courseId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to course',
        },
        sectionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to course section',
        },
        termId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to academic term',
        },
        enrollmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date enrolled',
        },
        enrollmentStatus: {
            type: sequelize_1.DataTypes.ENUM('enrolled', 'dropped', 'withdrawn', 'completed', 'in-progress', 'failed'),
            allowNull: false,
            defaultValue: 'enrolled',
            comment: 'Current enrollment status',
        },
        credits: {
            type: sequelize_1.DataTypes.DECIMAL(4, 2),
            allowNull: false,
            comment: 'Credit hours',
            validate: {
                min: 0,
                max: 20,
            },
        },
        gradingOption: {
            type: sequelize_1.DataTypes.ENUM('letter', 'pass-fail', 'audit', 'credit-no-credit'),
            allowNull: false,
            defaultValue: 'letter',
            comment: 'Grading option selected',
        },
        grade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
            comment: 'Final grade',
        },
        gradePoints: {
            type: sequelize_1.DataTypes.DECIMAL(4, 2),
            allowNull: true,
            comment: 'Grade points earned',
        },
        midtermGrade: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
            comment: 'Midterm grade',
        },
        attendancePercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 100,
            comment: 'Attendance percentage',
            validate: {
                min: 0,
                max: 100,
            },
        },
        dropDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date course was dropped',
        },
        withdrawalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date course was withdrawn',
        },
        withdrawalReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for withdrawal',
        },
        lastAttendanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last date of attendance',
        },
        isAudit: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is audit enrollment',
        },
        repeatCourse: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is repeat of previous course',
        },
        repeatCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times course repeated',
        },
        tuitionCharged: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tuition amount charged',
        },
        feesPaid: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Fees paid status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        enrolledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who enrolled student',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'enrollments',
        timestamps: true,
        indexes: [
            { fields: ['studentId', 'termId'] },
            { fields: ['courseId', 'sectionId', 'termId'] },
            { fields: ['enrollmentStatus'] },
            { fields: ['termId'] },
            { fields: ['enrollmentDate'] },
        ],
        hooks: {
            beforeCreate: (enrollment) => {
                if (!enrollment.enrolledBy) {
                    throw new Error('enrolledBy is required');
                }
                enrollment.updatedBy = enrollment.enrolledBy;
            },
            beforeUpdate: (enrollment) => {
                if (!enrollment.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
    });
    return Enrollment;
};
exports.createEnrollmentModel = createEnrollmentModel;
/**
 * Sequelize model for EnrollmentStatus tracking and history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EnrollmentStatus model
 */
const createEnrollmentStatusModel = (sequelize) => {
    class EnrollmentStatus extends sequelize_1.Model {
    }
    EnrollmentStatus.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to student',
            references: {
                model: 'students',
                key: 'id',
            },
        },
        termId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to academic term',
        },
        statusType: {
            type: sequelize_1.DataTypes.ENUM('full-time', 'part-time', 'less-than-half-time', 'withdrawn', 'graduated', 'on-leave'),
            allowNull: false,
            comment: 'Enrollment status type',
        },
        statusDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Date status became effective',
        },
        fullTimeStatus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is full-time student',
        },
        creditsEnrolled: {
            type: sequelize_1.DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credits enrolled for term',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Status effective date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Status end date',
        },
        verifiedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who verified status',
        },
        verificationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date status was verified',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes',
        },
    }, {
        sequelize,
        tableName: 'enrollment_statuses',
        timestamps: true,
        indexes: [
            { fields: ['studentId', 'termId'] },
            { fields: ['statusType'] },
            { fields: ['statusDate'] },
            { fields: ['effectiveDate', 'endDate'] },
        ],
    });
    return EnrollmentStatus;
};
exports.createEnrollmentStatusModel = createEnrollmentStatusModel;
// ============================================================================
// ENROLLMENT MANAGEMENT FUNCTIONS (1-10)
// ============================================================================
/**
 * Creates a new student record in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateStudentDto} studentData - Student creation data
 * @param {string} userId - User creating the student
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created student
 *
 * @example
 * ```typescript
 * const student = await createStudent(sequelize, {
 *   studentNumber: 'S-2024-001234',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@university.edu',
 *   dateOfBirth: new Date('2000-01-15'),
 *   admissionDate: new Date(),
 *   studentType: 'new',
 *   academicLevel: 'freshman'
 * }, 'admin123');
 * ```
 */
const createStudent = async (sequelize, studentData, userId, transaction) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    // Check for existing student number
    const existing = await Student.findOne({
        where: { studentNumber: studentData.studentNumber },
        transaction,
    });
    if (existing) {
        throw new Error(`Student number ${studentData.studentNumber} already exists`);
    }
    // Check for existing email
    const existingEmail = await Student.findOne({
        where: { email: studentData.email },
        transaction,
    });
    if (existingEmail) {
        throw new Error(`Email ${studentData.email} already exists`);
    }
    const student = await Student.create({
        ...studentData,
        enrollmentStatus: 'active',
        gpa: 0.00,
        creditsEarned: 0,
        creditsAttempted: 0,
        isInternational: studentData.studentType === 'international',
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return student;
};
exports.createStudent = createStudent;
/**
 * Enrolls a student in a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEnrollmentDto} enrollmentData - Enrollment data
 * @param {string} userId - User creating the enrollment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollStudentInCourse(sequelize, {
 *   studentId: 1,
 *   courseId: 101,
 *   sectionId: 1,
 *   termId: 202401,
 *   enrollmentDate: new Date(),
 *   enrollmentStatus: 'enrolled',
 *   credits: 3,
 *   gradingOption: 'letter'
 * }, 'registrar123');
 * ```
 */
const enrollStudentInCourse = async (sequelize, enrollmentData, userId, transaction) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const Student = (0, exports.createStudentModel)(sequelize);
    // Verify student exists and is active
    const student = await Student.findByPk(enrollmentData.studentId, { transaction });
    if (!student) {
        throw new Error('Student not found');
    }
    if (student.enrollmentStatus !== 'active') {
        throw new Error('Student is not in active enrollment status');
    }
    // Check for existing enrollment
    const existing = await Enrollment.findOne({
        where: {
            studentId: enrollmentData.studentId,
            courseId: enrollmentData.courseId,
            sectionId: enrollmentData.sectionId,
            termId: enrollmentData.termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
        transaction,
    });
    if (existing) {
        throw new Error('Student is already enrolled in this course section');
    }
    // Check enrollment capacity
    const capacityCheck = await (0, exports.checkEnrollmentCapacity)(sequelize, enrollmentData.courseId, enrollmentData.sectionId, enrollmentData.termId);
    if (!capacityCheck.hasCapacity) {
        throw new Error('Course section is at full capacity');
    }
    const enrollment = await Enrollment.create({
        ...enrollmentData,
        enrolledBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Update student credits attempted
    await student.update({
        creditsAttempted: Number(student.creditsAttempted) + Number(enrollmentData.credits),
        updatedBy: userId,
    }, { transaction });
    return enrollment;
};
exports.enrollStudentInCourse = enrollStudentInCourse;
/**
 * Drops a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} userId - User dropping the course
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropCourse(sequelize, 123, 'student123');
 * ```
 */
const dropCourse = async (sequelize, enrollmentId, userId, transaction) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const Student = (0, exports.createStudentModel)(sequelize);
    const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
    if (!enrollment) {
        throw new Error('Enrollment not found');
    }
    if (enrollment.enrollmentStatus === 'dropped') {
        throw new Error('Course already dropped');
    }
    const student = await Student.findByPk(enrollment.studentId, { transaction });
    await enrollment.update({
        enrollmentStatus: 'dropped',
        dropDate: new Date(),
        updatedBy: userId,
    }, { transaction });
    // Update student credits attempted
    if (student) {
        await student.update({
            creditsAttempted: Number(student.creditsAttempted) - Number(enrollment.credits),
            updatedBy: userId,
        }, { transaction });
    }
};
exports.dropCourse = dropCourse;
/**
 * Withdraws a student from a course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} reason - Withdrawal reason
 * @param {string} userId - User processing withdrawal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await withdrawFromCourse(sequelize, 123, 'Medical reasons', 'advisor123');
 * ```
 */
const withdrawFromCourse = async (sequelize, enrollmentId, reason, userId, transaction) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
    if (!enrollment) {
        throw new Error('Enrollment not found');
    }
    if (enrollment.enrollmentStatus === 'withdrawn') {
        throw new Error('Course already withdrawn');
    }
    await enrollment.update({
        enrollmentStatus: 'withdrawn',
        withdrawalDate: new Date(),
        withdrawalReason: reason,
        grade: 'W',
        updatedBy: userId,
    }, { transaction });
};
exports.withdrawFromCourse = withdrawFromCourse;
/**
 * Retrieves all enrollments for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any[]>} Array of enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await getStudentEnrollments(sequelize, 1, 202401);
 * ```
 */
const getStudentEnrollments = async (sequelize, studentId, termId) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    return await Enrollment.findAll({
        where: {
            studentId,
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
        order: [['enrollmentDate', 'ASC']],
    });
};
exports.getStudentEnrollments = getStudentEnrollments;
/**
 * Calculates total credits enrolled for a student in a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Total credits enrolled
 *
 * @example
 * ```typescript
 * const credits = await calculateEnrolledCredits(sequelize, 1, 202401);
 * ```
 */
const calculateEnrolledCredits = async (sequelize, studentId, termId) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const result = await Enrollment.findAll({
        where: {
            studentId,
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
        attributes: [[sequelize.fn('SUM', sequelize.col('credits')), 'totalCredits']],
        raw: true,
    });
    return Number(result[0].totalCredits || 0);
};
exports.calculateEnrolledCredits = calculateEnrolledCredits;
/**
 * Determines if student is full-time based on credits enrolled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} fullTimeThreshold - Full-time credit threshold (default 12)
 * @returns {Promise<boolean>} Whether student is full-time
 *
 * @example
 * ```typescript
 * const isFullTime = await isFullTimeStudent(sequelize, 1, 202401, 12);
 * ```
 */
const isFullTimeStudent = async (sequelize, studentId, termId, fullTimeThreshold = 12) => {
    const credits = await (0, exports.calculateEnrolledCredits)(sequelize, studentId, termId);
    return credits >= fullTimeThreshold;
};
exports.isFullTimeStudent = isFullTimeStudent;
/**
 * Updates student academic level based on credits earned.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} userId - User updating the level
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} New academic level
 *
 * @example
 * ```typescript
 * const newLevel = await updateAcademicLevel(sequelize, 1, 'registrar123');
 * ```
 */
const updateAcademicLevel = async (sequelize, studentId, userId, transaction) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId, { transaction });
    if (!student) {
        throw new Error('Student not found');
    }
    const credits = Number(student.creditsEarned);
    let newLevel = student.academicLevel;
    // Undergraduate level progression
    if (credits >= 90) {
        newLevel = 'senior';
    }
    else if (credits >= 60) {
        newLevel = 'junior';
    }
    else if (credits >= 30) {
        newLevel = 'sophomore';
    }
    else {
        newLevel = 'freshman';
    }
    if (newLevel !== student.academicLevel) {
        await student.update({ academicLevel: newLevel, updatedBy: userId }, { transaction });
    }
    return newLevel;
};
exports.updateAcademicLevel = updateAcademicLevel;
/**
 * Retrieves enrollment metrics for a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentMetrics>} Enrollment metrics
 *
 * @example
 * ```typescript
 * const metrics = await getEnrollmentMetrics(sequelize, 202401);
 * ```
 */
const getEnrollmentMetrics = async (sequelize, termId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    // Get all students enrolled in term
    const enrolledStudents = await Enrollment.findAll({
        where: {
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
        attributes: ['studentId'],
        group: ['studentId'],
    });
    const studentIds = enrolledStudents.map((e) => e.studentId);
    const students = await Student.findAll({
        where: {
            id: { [sequelize_1.Op.in]: studentIds },
        },
    });
    let fullTimeCount = 0;
    let partTimeCount = 0;
    for (const studentId of studentIds) {
        const isFullTime = await (0, exports.isFullTimeStudent)(sequelize, studentId, termId);
        if (isFullTime) {
            fullTimeCount++;
        }
        else {
            partTimeCount++;
        }
    }
    return {
        totalEnrollment: studentIds.length,
        fullTimeCount,
        partTimeCount,
        newStudentsCount: students.filter((s) => s.studentType === 'new').length,
        returningStudentsCount: students.filter((s) => s.studentType === 'returning').length,
        transferStudentsCount: students.filter((s) => s.studentType === 'transfer').length,
        internationalStudentsCount: students.filter((s) => s.isInternational).length,
    };
};
exports.getEnrollmentMetrics = getEnrollmentMetrics;
/**
 * Changes grading option for an enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} newGradingOption - New grading option
 * @param {string} userId - User making the change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeGradingOption(sequelize, 123, 'pass-fail', 'student123');
 * ```
 */
const changeGradingOption = async (sequelize, enrollmentId, newGradingOption, userId, transaction) => {
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const enrollment = await Enrollment.findByPk(enrollmentId, { transaction });
    if (!enrollment) {
        throw new Error('Enrollment not found');
    }
    if (enrollment.enrollmentStatus !== 'enrolled' && enrollment.enrollmentStatus !== 'in-progress') {
        throw new Error('Cannot change grading option for non-active enrollment');
    }
    await enrollment.update({
        gradingOption: newGradingOption,
        isAudit: newGradingOption === 'audit',
        updatedBy: userId,
    }, { transaction });
};
exports.changeGradingOption = changeGradingOption;
// ============================================================================
// ENROLLMENT VERIFICATION FUNCTIONS (11-15)
// ============================================================================
/**
 * Creates enrollment verification record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentVerification} verificationData - Verification data
 * @param {string} userId - User creating verification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Verification record
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerification(sequelize, {
 *   studentId: 1,
 *   enrollmentId: 123,
 *   verificationDate: new Date(),
 *   verificationType: 'full-time',
 *   creditsEnrolled: 15,
 *   verifiedBy: 'registrar123',
 *   verificationDocument: 'DOC-2024-001',
 *   expirationDate: new Date('2024-12-31')
 * }, 'registrar123');
 * ```
 */
const createEnrollmentVerification = async (sequelize, verificationData, userId, transaction) => {
    const EnrollmentStatus = (0, exports.createEnrollmentStatusModel)(sequelize);
    const verification = await EnrollmentStatus.create({
        studentId: verificationData.studentId,
        termId: 0, // Would be passed in real implementation
        statusType: verificationData.verificationType,
        statusDate: verificationData.verificationDate,
        fullTimeStatus: verificationData.verificationType === 'full-time',
        creditsEnrolled: verificationData.creditsEnrolled,
        effectiveDate: verificationData.verificationDate,
        endDate: verificationData.expirationDate,
        verifiedBy: verificationData.verifiedBy,
        verificationDate: verificationData.verificationDate,
        notes: `Document: ${verificationData.verificationDocument}`,
    }, { transaction });
    return verification;
};
exports.createEnrollmentVerification = createEnrollmentVerification;
/**
 * Verifies student enrollment status for external requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Verification details
 *
 * @example
 * ```typescript
 * const verification = await verifyEnrollmentStatus(sequelize, 1, 202401);
 * ```
 */
const verifyEnrollmentStatus = async (sequelize, studentId, termId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    if (!student) {
        throw new Error('Student not found');
    }
    const credits = await (0, exports.calculateEnrolledCredits)(sequelize, studentId, termId);
    const isFullTime = await (0, exports.isFullTimeStudent)(sequelize, studentId, termId);
    const enrollments = await Enrollment.findAll({
        where: {
            studentId,
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
    });
    return {
        studentId,
        studentNumber: student.studentNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        termId,
        enrollmentStatus: student.enrollmentStatus,
        creditsEnrolled: credits,
        fullTimeStatus: isFullTime,
        academicLevel: student.academicLevel,
        courseCount: enrollments.length,
        verificationDate: new Date(),
    };
};
exports.verifyEnrollmentStatus = verifyEnrollmentStatus;
/**
 * Generates enrollment verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} purpose - Purpose of verification
 * @returns {Promise<any>} Verification letter data
 *
 * @example
 * ```typescript
 * const letter = await generateVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
const generateVerificationLetter = async (sequelize, studentId, termId, purpose) => {
    const verification = await (0, exports.verifyEnrollmentStatus)(sequelize, studentId, termId);
    return {
        letterType: 'Enrollment Verification',
        issuedDate: new Date(),
        purpose,
        student: {
            studentNumber: verification.studentNumber,
            name: verification.studentName,
        },
        enrollmentDetails: {
            academicLevel: verification.academicLevel,
            enrollmentStatus: verification.enrollmentStatus,
            creditsEnrolled: verification.creditsEnrolled,
            fullTimeStatus: verification.fullTimeStatus ? 'Full-Time' : 'Part-Time',
            numberOfCourses: verification.courseCount,
        },
        termId: verification.termId,
        validThrough: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        officialSeal: true,
    };
};
exports.generateVerificationLetter = generateVerificationLetter;
/**
 * Validates enrollment for financial aid eligibility.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ eligible: boolean; reason?: string }>} Eligibility status
 *
 * @example
 * ```typescript
 * const eligibility = await validateFinancialAidEligibility(sequelize, 1, 202401);
 * ```
 */
const validateFinancialAidEligibility = async (sequelize, studentId, termId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    if (!student) {
        return { eligible: false, reason: 'Student not found' };
    }
    if (student.enrollmentStatus !== 'active') {
        return { eligible: false, reason: 'Student not in active status' };
    }
    const credits = await (0, exports.calculateEnrolledCredits)(sequelize, studentId, termId);
    // Financial aid typically requires at least 6 credits (half-time)
    if (credits < 6) {
        return { eligible: false, reason: 'Not enrolled in minimum credits for financial aid (6 credits)' };
    }
    // Check academic progress (SAP)
    if (Number(student.gpa) < 2.0) {
        return { eligible: false, reason: 'GPA below Satisfactory Academic Progress requirement (2.0)' };
    }
    return { eligible: true };
};
exports.validateFinancialAidEligibility = validateFinancialAidEligibility;
/**
 * Checks enrollment compliance for international students (SEVIS).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkInternationalStudentCompliance(sequelize, 1, 202401);
 * ```
 */
const checkInternationalStudentCompliance = async (sequelize, studentId, termId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    const issues = [];
    if (!student) {
        return { compliant: false, issues: ['Student not found'] };
    }
    if (!student.isInternational) {
        return { compliant: true, issues: [] };
    }
    const credits = await (0, exports.calculateEnrolledCredits)(sequelize, studentId, termId);
    // F-1 students must be enrolled full-time (typically 12 credits for undergraduate)
    const requiredCredits = student.academicLevel === 'graduate' ? 9 : 12;
    if (credits < requiredCredits) {
        issues.push(`Not enrolled in required full-time credits (${requiredCredits} required, ${credits} enrolled)`);
    }
    if (student.enrollmentStatus !== 'active') {
        issues.push('Student not in active enrollment status');
    }
    return {
        compliant: issues.length === 0,
        issues,
    };
};
exports.checkInternationalStudentCompliance = checkInternationalStudentCompliance;
// ============================================================================
// TRANSFER AND INTERNATIONAL STUDENT ENROLLMENT (16-20)
// ============================================================================
/**
 * Creates transfer credit record for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransferCredit} transferData - Transfer credit data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer credit record
 *
 * @example
 * ```typescript
 * const transfer = await createTransferCredit(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionCode: 'PREV-001',
 *   courseTitle: 'Introduction to Psychology',
 *   courseNumber: 'PSY-101',
 *   credits: 3,
 *   grade: 'B',
 *   transferStatus: 'pending'
 * }, 'registrar123');
 * ```
 */
const createTransferCredit = async (sequelize, transferData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO transfer_credits
     (student_id, institution_name, institution_code, course_title, course_number, credits, grade, transfer_status, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [
            transferData.studentId,
            transferData.institutionName,
            transferData.institutionCode,
            transferData.courseTitle,
            transferData.courseNumber,
            transferData.credits,
            transferData.grade,
            transferData.transferStatus,
            userId,
        ],
        transaction,
    });
    return result;
};
exports.createTransferCredit = createTransferCredit;
/**
 * Evaluates and approves transfer credits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferCreditId - Transfer credit ID
 * @param {number} equivalentCourseId - Equivalent course ID
 * @param {string} userId - User approving transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await evaluateTransferCredit(sequelize, 1, 101, 'evaluator123');
 * ```
 */
const evaluateTransferCredit = async (sequelize, transferCreditId, equivalentCourseId, userId, transaction) => {
    await sequelize.query(`UPDATE transfer_credits
     SET transfer_status = 'approved', equivalent_course_id = ?, evaluated_by = ?, evaluation_date = NOW()
     WHERE id = ?`, {
        replacements: [equivalentCourseId, userId, transferCreditId],
        transaction,
    });
    // Update student credits earned
    const [credits] = await sequelize.query(`SELECT credits, student_id FROM transfer_credits WHERE id = ?`, {
        replacements: [transferCreditId],
        transaction,
    });
    if (credits && credits.length > 0) {
        const creditData = credits[0];
        const Student = (0, exports.createStudentModel)(sequelize);
        const student = await Student.findByPk(creditData.student_id, { transaction });
        if (student) {
            await student.update({
                creditsEarned: Number(student.creditsEarned) + Number(creditData.credits),
                updatedBy: userId,
            }, { transaction });
        }
    }
};
exports.evaluateTransferCredit = evaluateTransferCredit;
/**
 * Creates international student record with SEVIS information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {InternationalStudentData} internationalData - International student data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} International student record
 *
 * @example
 * ```typescript
 * const intlStudent = await createInternationalStudentRecord(sequelize, {
 *   studentId: 1,
 *   sevisId: 'N0012345678',
 *   visaType: 'F-1',
 *   visaExpirationDate: new Date('2025-12-31'),
 *   i20IssueDate: new Date(),
 *   programStartDate: new Date('2024-08-15'),
 *   programEndDate: new Date('2028-05-15'),
 *   fullTimeRequirement: 12,
 *   countryOfOrigin: 'China',
 *   financialDocumentDate: new Date()
 * }, 'iso123');
 * ```
 */
const createInternationalStudentRecord = async (sequelize, internationalData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO international_students
     (student_id, sevis_id, visa_type, visa_expiration_date, i20_issue_date, program_start_date, program_end_date,
      full_time_requirement, country_of_origin, sponsor_name, financial_document_date, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [
            internationalData.studentId,
            internationalData.sevisId,
            internationalData.visaType,
            internationalData.visaExpirationDate,
            internationalData.i20IssueDate,
            internationalData.programStartDate,
            internationalData.programEndDate,
            internationalData.fullTimeRequirement,
            internationalData.countryOfOrigin,
            internationalData.sponsorName || null,
            internationalData.financialDocumentDate,
            userId,
        ],
        transaction,
    });
    return result;
};
exports.createInternationalStudentRecord = createInternationalStudentRecord;
/**
 * Updates SEVIS status for international student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} sevisStatus - New SEVIS status
 * @param {string} userId - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSEVISStatus(sequelize, 1, 'Active', 'iso123');
 * ```
 */
const updateSEVISStatus = async (sequelize, studentId, sevisStatus, userId, transaction) => {
    await sequelize.query(`UPDATE international_students
     SET sevis_status = ?, sevis_status_date = NOW(), updated_by = ?, updated_at = NOW()
     WHERE student_id = ?`, {
        replacements: [sevisStatus, userId, studentId],
        transaction,
    });
};
exports.updateSEVISStatus = updateSEVISStatus;
/**
 * Validates transfer student articulation agreements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} institutionCode - Institution code
 * @param {string} courseNumber - Course number
 * @returns {Promise<{ hasAgreement: boolean; equivalentCourse?: any }>} Articulation validation
 *
 * @example
 * ```typescript
 * const validation = await validateArticulationAgreement(sequelize, 'PREV-001', 'PSY-101');
 * ```
 */
const validateArticulationAgreement = async (sequelize, institutionCode, courseNumber) => {
    const [results] = await sequelize.query(`SELECT * FROM articulation_agreements
     WHERE institution_code = ? AND external_course_number = ? AND is_active = true`, {
        replacements: [institutionCode, courseNumber],
    });
    if (results && results.length > 0) {
        return {
            hasAgreement: true,
            equivalentCourse: results[0],
        };
    }
    return { hasAgreement: false };
};
exports.validateArticulationAgreement = validateArticulationAgreement;
// ============================================================================
// ENROLLMENT HOLDS AND RESTRICTIONS (21-25)
// ============================================================================
/**
 * Places enrollment hold on student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeEnrollmentHold(sequelize, {
 *   holdId: 'HOLD-2024-001',
 *   studentId: 1,
 *   holdType: 'financial',
 *   holdReason: 'Unpaid tuition balance',
 *   placedBy: 'bursar123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   blockEnrollment: true,
 *   blockTranscripts: true,
 *   blockGraduation: false
 * }, 'bursar123');
 * ```
 */
const placeEnrollmentHold = async (sequelize, holdData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO enrollment_holds
     (hold_id, student_id, hold_type, hold_reason, placed_by, placed_date, is_active,
      block_enrollment, block_transcripts, block_graduation, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            holdData.holdId,
            holdData.studentId,
            holdData.holdType,
            holdData.holdReason,
            holdData.placedBy,
            holdData.placedDate,
            holdData.isActive,
            holdData.blockEnrollment,
            holdData.blockTranscripts,
            holdData.blockGraduation,
        ],
        transaction,
    });
    return result;
};
exports.placeEnrollmentHold = placeEnrollmentHold;
/**
 * Releases enrollment hold from student account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseEnrollmentHold(sequelize, 'HOLD-2024-001', 'bursar123');
 * ```
 */
const releaseEnrollmentHold = async (sequelize, holdId, userId, transaction) => {
    await sequelize.query(`UPDATE enrollment_holds
     SET is_active = false, released_by = ?, released_date = NOW(), updated_at = NOW()
     WHERE hold_id = ?`, {
        replacements: [userId, holdId],
        transaction,
    });
};
exports.releaseEnrollmentHold = releaseEnrollmentHold;
/**
 * Checks if student has any active enrollment holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkEnrollmentHolds(sequelize, 1);
 * ```
 */
const checkEnrollmentHolds = async (sequelize, studentId) => {
    const [holds] = await sequelize.query(`SELECT * FROM enrollment_holds
     WHERE student_id = ? AND is_active = true
     ORDER BY placed_date DESC`, {
        replacements: [studentId],
    });
    return {
        hasHolds: holds.length > 0,
        holds: holds,
    };
};
exports.checkEnrollmentHolds = checkEnrollmentHolds;
/**
 * Creates enrollment restriction for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentRestriction} restrictionData - Restriction data
 * @param {string} userId - User creating restriction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Restriction record
 *
 * @example
 * ```typescript
 * const restriction = await createEnrollmentRestriction(sequelize, {
 *   restrictionId: 'REST-2024-001',
 *   studentId: 1,
 *   restrictionType: 'probation',
 *   restrictionReason: 'Academic probation - GPA below 2.0',
 *   effectiveDate: new Date(),
 *   isActive: true,
 *   allowedOverride: false
 * }, 'dean123');
 * ```
 */
const createEnrollmentRestriction = async (sequelize, restrictionData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO enrollment_restrictions
     (restriction_id, student_id, restriction_type, restriction_reason, effective_date,
      expiration_date, is_active, allowed_override, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [
            restrictionData.restrictionId,
            restrictionData.studentId,
            restrictionData.restrictionType,
            restrictionData.restrictionReason,
            restrictionData.effectiveDate,
            restrictionData.expirationDate || null,
            restrictionData.isActive,
            restrictionData.allowedOverride,
            userId,
        ],
        transaction,
    });
    return result;
};
exports.createEnrollmentRestriction = createEnrollmentRestriction;
/**
 * Validates enrollment permissions before registration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ canEnroll: boolean; blocks: string[] }>} Enrollment permission status
 *
 * @example
 * ```typescript
 * const permission = await validateEnrollmentPermission(sequelize, 1);
 * ```
 */
const validateEnrollmentPermission = async (sequelize, studentId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    const blocks = [];
    if (!student) {
        return { canEnroll: false, blocks: ['Student not found'] };
    }
    if (!student.isActive) {
        blocks.push('Student account is inactive');
    }
    if (student.enrollmentStatus === 'suspended') {
        blocks.push('Student is suspended');
    }
    // Check holds
    const holdStatus = await (0, exports.checkEnrollmentHolds)(sequelize, studentId);
    const enrollmentBlocks = holdStatus.holds.filter((h) => h.block_enrollment);
    if (enrollmentBlocks.length > 0) {
        blocks.push(...enrollmentBlocks.map((h) => `Hold: ${h.hold_type} - ${h.hold_reason}`));
    }
    return {
        canEnroll: blocks.length === 0,
        blocks,
    };
};
exports.validateEnrollmentPermission = validateEnrollmentPermission;
// ============================================================================
// CAPACITY AND WAITLIST MANAGEMENT (26-35)
// ============================================================================
/**
 * Checks enrollment capacity for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ hasCapacity: boolean; capacity: EnrollmentCapacity }>} Capacity status
 *
 * @example
 * ```typescript
 * const capacity = await checkEnrollmentCapacity(sequelize, 101, 1, 202401);
 * ```
 */
const checkEnrollmentCapacity = async (sequelize, courseId, sectionId, termId) => {
    // Get section capacity
    const [sections] = await sequelize.query(`SELECT max_capacity, reserved_seats, waitlist_capacity FROM course_sections
     WHERE course_id = ? AND section_id = ? AND term_id = ?`, {
        replacements: [courseId, sectionId, termId],
    });
    if (!sections || sections.length === 0) {
        throw new Error('Course section not found');
    }
    const section = sections[0];
    // Count current enrollment
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const currentEnrollment = await Enrollment.count({
        where: {
            courseId,
            sectionId,
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
    });
    // Count waitlist
    const [waitlistResult] = await sequelize.query(`SELECT COUNT(*) as count FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`, {
        replacements: [courseId, sectionId, termId],
    });
    const currentWaitlist = waitlistResult[0].count || 0;
    const capacity = {
        courseId,
        sectionId,
        termId,
        maxCapacity: section.max_capacity,
        currentEnrollment,
        waitlistCapacity: section.waitlist_capacity || 0,
        currentWaitlist,
        reservedSeats: section.reserved_seats || 0,
        availableSeats: section.max_capacity - currentEnrollment - (section.reserved_seats || 0),
    };
    return {
        hasCapacity: capacity.availableSeats > 0,
        capacity,
    };
};
exports.checkEnrollmentCapacity = checkEnrollmentCapacity;
/**
 * Adds student to course waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {string} userId - User adding to waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry>} Waitlist entry
 *
 * @example
 * ```typescript
 * const waitlistEntry = await addToWaitlist(sequelize, 1, 101, 1, 202401, 'student123');
 * ```
 */
const addToWaitlist = async (sequelize, studentId, courseId, sectionId, termId, userId, transaction) => {
    // Check if already on waitlist
    const [existing] = await sequelize.query(`SELECT * FROM waitlist_entries
     WHERE student_id = ? AND course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`, {
        replacements: [studentId, courseId, sectionId, termId],
        transaction,
    });
    if (existing && existing.length > 0) {
        throw new Error('Student already on waitlist for this section');
    }
    // Get current max position
    const [maxPos] = await sequelize.query(`SELECT COALESCE(MAX(position), 0) as max_position FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ?`, {
        replacements: [courseId, sectionId, termId],
        transaction,
    });
    const position = (maxPos[0].max_position || 0) + 1;
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // 24-hour expiration
    await sequelize.query(`INSERT INTO waitlist_entries
     (student_id, course_id, section_id, term_id, position, added_date, expiration_date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), ?, 'active', NOW(), NOW())`, {
        replacements: [studentId, courseId, sectionId, termId, position, expirationDate],
        transaction,
    });
    return {
        waitlistId: 0, // Would be returned from insert
        studentId,
        courseId,
        sectionId,
        termId,
        position,
        addedDate: new Date(),
        expirationDate,
        status: 'active',
    };
};
exports.addToWaitlist = addToWaitlist;
/**
 * Removes student from waitlist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} waitlistId - Waitlist entry ID
 * @param {string} userId - User removing from waitlist
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFromWaitlist(sequelize, 123, 'student123');
 * ```
 */
const removeFromWaitlist = async (sequelize, waitlistId, userId, transaction) => {
    await sequelize.query(`UPDATE waitlist_entries
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = ?`, {
        replacements: [waitlistId],
        transaction,
    });
    // Reorder remaining waitlist entries
    const [entry] = await sequelize.query(`SELECT course_id, section_id, term_id FROM waitlist_entries WHERE id = ?`, {
        replacements: [waitlistId],
        transaction,
    });
    if (entry && entry.length > 0) {
        const e = entry[0];
        await (0, exports.reorderWaitlist)(sequelize, e.course_id, e.section_id, e.term_id, transaction);
    }
};
exports.removeFromWaitlist = removeFromWaitlist;
/**
 * Processes waitlist when seat becomes available.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WaitlistEntry | null>} Next waitlist entry or null
 *
 * @example
 * ```typescript
 * const nextStudent = await processWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
const processWaitlist = async (sequelize, courseId, sectionId, termId, transaction) => {
    const [entries] = await sequelize.query(`SELECT * FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'
     ORDER BY position ASC
     LIMIT 1`, {
        replacements: [courseId, sectionId, termId],
        transaction,
    });
    if (!entries || entries.length === 0) {
        return null;
    }
    const entry = entries[0];
    // Mark as notified
    await sequelize.query(`UPDATE waitlist_entries
     SET status = 'notified', notified_date = NOW(), updated_at = NOW()
     WHERE id = ?`, {
        replacements: [entry.id],
        transaction,
    });
    return {
        waitlistId: entry.id,
        studentId: entry.student_id,
        courseId: entry.course_id,
        sectionId: entry.section_id,
        termId: entry.term_id,
        position: entry.position,
        addedDate: entry.added_date,
        notifiedDate: new Date(),
        expirationDate: entry.expiration_date,
        status: 'notified',
    };
};
exports.processWaitlist = processWaitlist;
/**
 * Gets waitlist position for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<number | null>} Waitlist position or null
 *
 * @example
 * ```typescript
 * const position = await getWaitlistPosition(sequelize, 1, 101, 1, 202401);
 * ```
 */
const getWaitlistPosition = async (sequelize, studentId, courseId, sectionId, termId) => {
    const [entries] = await sequelize.query(`SELECT position FROM waitlist_entries
     WHERE student_id = ? AND course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'`, {
        replacements: [studentId, courseId, sectionId, termId],
    });
    if (!entries || entries.length === 0) {
        return null;
    }
    return entries[0].position;
};
exports.getWaitlistPosition = getWaitlistPosition;
/**
 * Reorders waitlist positions after removal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderWaitlist(sequelize, 101, 1, 202401);
 * ```
 */
const reorderWaitlist = async (sequelize, courseId, sectionId, termId, transaction) => {
    const [entries] = await sequelize.query(`SELECT id FROM waitlist_entries
     WHERE course_id = ? AND section_id = ? AND term_id = ? AND status = 'active'
     ORDER BY position ASC`, {
        replacements: [courseId, sectionId, termId],
        transaction,
    });
    let position = 1;
    for (const entry of entries) {
        await sequelize.query(`UPDATE waitlist_entries SET position = ? WHERE id = ?`, {
            replacements: [position, entry.id],
            transaction,
        });
        position++;
    }
};
exports.reorderWaitlist = reorderWaitlist;
/**
 * Expires old waitlist entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of expired entries
 *
 * @example
 * ```typescript
 * const expired = await expireWaitlistEntries(sequelize);
 * ```
 */
const expireWaitlistEntries = async (sequelize, transaction) => {
    const [result] = await sequelize.query(`UPDATE waitlist_entries
     SET status = 'expired', updated_at = NOW()
     WHERE status IN ('active', 'notified') AND expiration_date < NOW()`, { transaction });
    return result.affectedRows || 0;
};
exports.expireWaitlistEntries = expireWaitlistEntries;
/**
 * Sets reserved seats for course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {number} reservedCount - Number of reserved seats
 * @param {string} reservedFor - Who seats are reserved for
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setReservedSeats(sequelize, 1, 5, 'Honors Program Students');
 * ```
 */
const setReservedSeats = async (sequelize, sectionId, reservedCount, reservedFor, transaction) => {
    await sequelize.query(`UPDATE course_sections
     SET reserved_seats = ?, reserved_for = ?, updated_at = NOW()
     WHERE id = ?`, {
        replacements: [reservedCount, reservedFor, sectionId],
        transaction,
    });
};
exports.setReservedSeats = setReservedSeats;
/**
 * Releases reserved seats.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sectionId - Section ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseReservedSeats(sequelize, 1);
 * ```
 */
const releaseReservedSeats = async (sequelize, sectionId, transaction) => {
    await sequelize.query(`UPDATE course_sections
     SET reserved_seats = 0, reserved_for = NULL, updated_at = NOW()
     WHERE id = ?`, {
        replacements: [sectionId],
        transaction,
    });
};
exports.releaseReservedSeats = releaseReservedSeats;
/**
 * Gets enrollment statistics for a course section.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} courseId - Course ID
 * @param {number} sectionId - Section ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Enrollment statistics
 *
 * @example
 * ```typescript
 * const stats = await getSectionEnrollmentStats(sequelize, 101, 1, 202401);
 * ```
 */
const getSectionEnrollmentStats = async (sequelize, courseId, sectionId, termId) => {
    const capacityCheck = await (0, exports.checkEnrollmentCapacity)(sequelize, courseId, sectionId, termId);
    const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
    const enrollments = await Enrollment.findAll({
        where: {
            courseId,
            sectionId,
            termId,
            enrollmentStatus: { [sequelize_1.Op.in]: ['enrolled', 'in-progress'] },
        },
        attributes: ['gradingOption', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['gradingOption'],
        raw: true,
    });
    return {
        capacity: capacityCheck.capacity,
        enrollmentByGradingOption: enrollments,
        utilizationRate: (capacityCheck.capacity.currentEnrollment / capacityCheck.capacity.maxCapacity) * 100,
    };
};
exports.getSectionEnrollmentStats = getSectionEnrollmentStats;
// ============================================================================
// ENROLLMENT FEE PROCESSING (36-45)
// ============================================================================
/**
 * Calculates enrollment fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<EnrollmentFee[]>} Calculated fees
 *
 * @example
 * ```typescript
 * const fees = await calculateEnrollmentFees(sequelize, 1, 202401);
 * ```
 */
const calculateEnrollmentFees = async (sequelize, studentId, termId) => {
    const credits = await (0, exports.calculateEnrolledCredits)(sequelize, studentId, termId);
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    if (!student) {
        throw new Error('Student not found');
    }
    const fees = [];
    // Tuition fee (example rates)
    const tuitionRate = student.academicLevel === 'graduate' ? 750 : 500;
    fees.push({
        feeId: `TUI-${termId}-${studentId}`,
        studentId,
        termId,
        feeType: 'tuition',
        feeAmount: credits * tuitionRate,
        credits,
        feePerCredit: tuitionRate,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        paidAmount: 0,
        isPaid: false,
    });
    // Technology fee
    fees.push({
        feeId: `TECH-${termId}-${studentId}`,
        studentId,
        termId,
        feeType: 'technology',
        feeAmount: 200,
        credits,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        paidAmount: 0,
        isPaid: false,
    });
    // Activity fee for full-time students
    if (credits >= 12) {
        fees.push({
            feeId: `ACT-${termId}-${studentId}`,
            studentId,
            termId,
            feeType: 'activity',
            feeAmount: 150,
            credits,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            paidAmount: 0,
            isPaid: false,
        });
    }
    // International student fee
    if (student.isInternational) {
        fees.push({
            feeId: `INTL-${termId}-${studentId}`,
            studentId,
            termId,
            feeType: 'activity',
            feeAmount: 500,
            credits,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            paidAmount: 0,
            isPaid: false,
        });
    }
    return fees;
};
exports.calculateEnrollmentFees = calculateEnrollmentFees;
/**
 * Creates fee assessment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EnrollmentFee} feeData - Fee data
 * @param {string} userId - User creating assessment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Fee assessment record
 *
 * @example
 * ```typescript
 * const assessment = await createFeeAssessment(sequelize, {
 *   feeId: 'TUI-202401-1',
 *   studentId: 1,
 *   termId: 202401,
 *   feeType: 'tuition',
 *   feeAmount: 6000,
 *   credits: 12,
 *   dueDate: new Date(),
 *   paidAmount: 0,
 *   isPaid: false
 * }, 'bursar123');
 * ```
 */
const createFeeAssessment = async (sequelize, feeData, userId, transaction) => {
    const result = await sequelize.query(`INSERT INTO enrollment_fees
     (fee_id, student_id, term_id, fee_type, fee_amount, credits, fee_per_credit, due_date,
      paid_amount, is_paid, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [
            feeData.feeId,
            feeData.studentId,
            feeData.termId,
            feeData.feeType,
            feeData.feeAmount,
            feeData.credits,
            feeData.feePerCredit || null,
            feeData.dueDate,
            feeData.paidAmount,
            feeData.isPaid,
            userId,
        ],
        transaction,
    });
    return result;
};
exports.createFeeAssessment = createFeeAssessment;
/**
 * Processes fee payment for enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processFeePayment(sequelize, 'TUI-202401-1', 6000, 'bursar123');
 * ```
 */
const processFeePayment = async (sequelize, feeId, paymentAmount, userId, transaction) => {
    const [fees] = await sequelize.query(`SELECT fee_amount, paid_amount FROM enrollment_fees WHERE fee_id = ?`, {
        replacements: [feeId],
        transaction,
    });
    if (!fees || fees.length === 0) {
        throw new Error('Fee not found');
    }
    const fee = fees[0];
    const newPaidAmount = Number(fee.paid_amount) + paymentAmount;
    const isPaid = newPaidAmount >= Number(fee.fee_amount);
    await sequelize.query(`UPDATE enrollment_fees
     SET paid_amount = ?, is_paid = ?, payment_date = NOW(), updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`, {
        replacements: [newPaidAmount, isPaid, userId, feeId],
        transaction,
    });
    // If tuition is paid, update enrollment fee status
    if (isPaid) {
        const Enrollment = (0, exports.createEnrollmentModel)(sequelize);
        await Enrollment.update({ feesPaid: true, updatedBy: userId }, {
            where: {
                studentId: fee.student_id,
                termId: fee.term_id,
            },
            transaction,
        });
    }
};
exports.processFeePayment = processFeePayment;
/**
 * Retrieves outstanding fees for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any[]>} Outstanding fees
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingFees(sequelize, 1);
 * ```
 */
const getOutstandingFees = async (sequelize, studentId) => {
    const [fees] = await sequelize.query(`SELECT * FROM enrollment_fees
     WHERE student_id = ? AND is_paid = false
     ORDER BY due_date ASC`, {
        replacements: [studentId],
    });
    return fees;
};
exports.getOutstandingFees = getOutstandingFees;
/**
 * Applies late fee for overdue payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} lateFeeAmount - Late fee amount
 * @param {string} userId - User applying late fee
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyLateFee(sequelize, 1, 202401, 50, 'bursar123');
 * ```
 */
const applyLateFee = async (sequelize, studentId, termId, lateFeeAmount, userId, transaction) => {
    const feeId = `LATE-${termId}-${studentId}-${Date.now()}`;
    await sequelize.query(`INSERT INTO enrollment_fees
     (fee_id, student_id, term_id, fee_type, fee_amount, credits, due_date, paid_amount, is_paid, created_at, updated_at, created_by)
     VALUES (?, ?, ?, 'late_fee', ?, 0, NOW(), 0, false, NOW(), NOW(), ?)`, {
        replacements: [feeId, studentId, termId, lateFeeAmount, userId],
        transaction,
    });
};
exports.applyLateFee = applyLateFee;
/**
 * Processes enrollment fee refund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {number} refundAmount - Refund amount
 * @param {string} reason - Refund reason
 * @param {string} userId - User processing refund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processEnrollmentRefund(sequelize, 'TUI-202401-1', 3000, 'Course withdrawal', 'bursar123');
 * ```
 */
const processEnrollmentRefund = async (sequelize, feeId, refundAmount, reason, userId, transaction) => {
    const [fees] = await sequelize.query(`SELECT paid_amount FROM enrollment_fees WHERE fee_id = ?`, {
        replacements: [feeId],
        transaction,
    });
    if (!fees || fees.length === 0) {
        throw new Error('Fee not found');
    }
    const fee = fees[0];
    if (Number(fee.paid_amount) < refundAmount) {
        throw new Error('Refund amount exceeds paid amount');
    }
    await sequelize.query(`UPDATE enrollment_fees
     SET paid_amount = paid_amount - ?, is_paid = false, updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`, {
        replacements: [refundAmount, userId, feeId],
        transaction,
    });
    // Log refund transaction
    await sequelize.query(`INSERT INTO fee_refunds
     (fee_id, refund_amount, refund_reason, refunded_by, refund_date, created_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [feeId, refundAmount, reason, userId],
        transaction,
    });
};
exports.processEnrollmentRefund = processEnrollmentRefund;
/**
 * Calculates refund percentage based on withdrawal date.
 *
 * @param {Date} enrollmentDate - Enrollment date
 * @param {Date} withdrawalDate - Withdrawal date
 * @param {Date} termStartDate - Term start date
 * @returns {number} Refund percentage (0-100)
 *
 * @example
 * ```typescript
 * const refundPct = calculateRefundPercentage(
 *   new Date('2024-01-10'),
 *   new Date('2024-01-25'),
 *   new Date('2024-01-15')
 * );
 * ```
 */
const calculateRefundPercentage = (enrollmentDate, withdrawalDate, termStartDate) => {
    const daysAfterStart = Math.floor((withdrawalDate.getTime() - termStartDate.getTime()) / (1000 * 60 * 60 * 24));
    // Typical refund schedule
    if (daysAfterStart <= 7) {
        return 100; // 100% refund within first week
    }
    else if (daysAfterStart <= 14) {
        return 75; // 75% refund within second week
    }
    else if (daysAfterStart <= 21) {
        return 50; // 50% refund within third week
    }
    else if (daysAfterStart <= 28) {
        return 25; // 25% refund within fourth week
    }
    else {
        return 0; // No refund after 4 weeks
    }
};
exports.calculateRefundPercentage = calculateRefundPercentage;
/**
 * Creates payment plan for student fees.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {number} totalAmount - Total amount
 * @param {number} installments - Number of installments
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment plan details
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 202401, 12000, 4, 'bursar123');
 * ```
 */
const createPaymentPlan = async (sequelize, studentId, termId, totalAmount, installments, userId, transaction) => {
    const installmentAmount = totalAmount / installments;
    const planId = `PLAN-${termId}-${studentId}`;
    await sequelize.query(`INSERT INTO payment_plans
     (plan_id, student_id, term_id, total_amount, installments, installment_amount,
      created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, {
        replacements: [planId, studentId, termId, totalAmount, installments, installmentAmount, userId],
        transaction,
    });
    // Create installment schedule
    const startDate = new Date();
    for (let i = 1; i <= installments; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i - 1);
        await sequelize.query(`INSERT INTO payment_plan_installments
       (plan_id, installment_number, due_date, amount, is_paid, created_at)
       VALUES (?, ?, ?, ?, false, NOW())`, {
            replacements: [planId, i, dueDate, installmentAmount],
            transaction,
        });
    }
    return {
        planId,
        totalAmount,
        installments,
        installmentAmount,
    };
};
exports.createPaymentPlan = createPaymentPlan;
/**
 * Waives fee for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} feeId - Fee ID
 * @param {string} waiverReason - Waiver reason
 * @param {string} userId - User granting waiver
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await waiveFee(sequelize, 'TECH-202401-1', 'Financial hardship', 'dean123');
 * ```
 */
const waiveFee = async (sequelize, feeId, waiverReason, userId, transaction) => {
    await sequelize.query(`UPDATE enrollment_fees
     SET is_paid = true, paid_amount = fee_amount, payment_date = NOW(),
         updated_at = NOW(), updated_by = ?
     WHERE fee_id = ?`, {
        replacements: [userId, feeId],
        transaction,
    });
    // Log waiver
    await sequelize.query(`INSERT INTO fee_waivers
     (fee_id, waiver_reason, waived_by, waiver_date, created_at)
     VALUES (?, ?, ?, NOW(), NOW())`, {
        replacements: [feeId, waiverReason, userId],
        transaction,
    });
};
exports.waiveFee = waiveFee;
/**
 * Generates fee statement for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<any>} Fee statement
 *
 * @example
 * ```typescript
 * const statement = await generateFeeStatement(sequelize, 1, 202401);
 * ```
 */
const generateFeeStatement = async (sequelize, studentId, termId) => {
    const Student = (0, exports.createStudentModel)(sequelize);
    const student = await Student.findByPk(studentId);
    const [fees] = await sequelize.query(`SELECT * FROM enrollment_fees
     WHERE student_id = ? AND term_id = ?
     ORDER BY fee_type, created_at`, {
        replacements: [studentId, termId],
    });
    let totalCharges = 0;
    let totalPaid = 0;
    for (const fee of fees) {
        totalCharges += Number(fee.fee_amount);
        totalPaid += Number(fee.paid_amount);
    }
    return {
        statementDate: new Date(),
        student: {
            studentNumber: student?.studentNumber,
            name: `${student?.firstName} ${student?.lastName}`,
            email: student?.email,
        },
        termId,
        fees: fees,
        summary: {
            totalCharges,
            totalPaid,
            balance: totalCharges - totalPaid,
        },
    };
};
exports.generateFeeStatement = generateFeeStatement;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createStudentModel: exports.createStudentModel,
    createEnrollmentModel: exports.createEnrollmentModel,
    createEnrollmentStatusModel: exports.createEnrollmentStatusModel,
    // Enrollment Management
    createStudent: exports.createStudent,
    enrollStudentInCourse: exports.enrollStudentInCourse,
    dropCourse: exports.dropCourse,
    withdrawFromCourse: exports.withdrawFromCourse,
    getStudentEnrollments: exports.getStudentEnrollments,
    calculateEnrolledCredits: exports.calculateEnrolledCredits,
    isFullTimeStudent: exports.isFullTimeStudent,
    updateAcademicLevel: exports.updateAcademicLevel,
    getEnrollmentMetrics: exports.getEnrollmentMetrics,
    changeGradingOption: exports.changeGradingOption,
    // Enrollment Verification
    createEnrollmentVerification: exports.createEnrollmentVerification,
    verifyEnrollmentStatus: exports.verifyEnrollmentStatus,
    generateVerificationLetter: exports.generateVerificationLetter,
    validateFinancialAidEligibility: exports.validateFinancialAidEligibility,
    checkInternationalStudentCompliance: exports.checkInternationalStudentCompliance,
    // Transfer and International Students
    createTransferCredit: exports.createTransferCredit,
    evaluateTransferCredit: exports.evaluateTransferCredit,
    createInternationalStudentRecord: exports.createInternationalStudentRecord,
    updateSEVISStatus: exports.updateSEVISStatus,
    validateArticulationAgreement: exports.validateArticulationAgreement,
    // Enrollment Holds and Restrictions
    placeEnrollmentHold: exports.placeEnrollmentHold,
    releaseEnrollmentHold: exports.releaseEnrollmentHold,
    checkEnrollmentHolds: exports.checkEnrollmentHolds,
    createEnrollmentRestriction: exports.createEnrollmentRestriction,
    validateEnrollmentPermission: exports.validateEnrollmentPermission,
    // Capacity and Waitlist Management
    checkEnrollmentCapacity: exports.checkEnrollmentCapacity,
    addToWaitlist: exports.addToWaitlist,
    removeFromWaitlist: exports.removeFromWaitlist,
    processWaitlist: exports.processWaitlist,
    getWaitlistPosition: exports.getWaitlistPosition,
    reorderWaitlist: exports.reorderWaitlist,
    expireWaitlistEntries: exports.expireWaitlistEntries,
    setReservedSeats: exports.setReservedSeats,
    releaseReservedSeats: exports.releaseReservedSeats,
    getSectionEnrollmentStats: exports.getSectionEnrollmentStats,
    // Enrollment Fee Processing
    calculateEnrollmentFees: exports.calculateEnrollmentFees,
    createFeeAssessment: exports.createFeeAssessment,
    processFeePayment: exports.processFeePayment,
    getOutstandingFees: exports.getOutstandingFees,
    applyLateFee: exports.applyLateFee,
    processEnrollmentRefund: exports.processEnrollmentRefund,
    calculateRefundPercentage: exports.calculateRefundPercentage,
    createPaymentPlan: exports.createPaymentPlan,
    waiveFee: exports.waiveFee,
    generateFeeStatement: exports.generateFeeStatement,
};
//# sourceMappingURL=student-enrollment-kit.js.map