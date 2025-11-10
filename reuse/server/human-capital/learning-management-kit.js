"use strict";
/**
 * LOC: HCMLRN12345
 * File: /reuse/server/human-capital/learning-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Learning management controllers
 *   - Training administration services
 *   - Compliance training services
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
exports.cancelEnrollment = exports.enrollFromWaitlist = exports.addToWaitlist = exports.enrollUserInCourse = exports.getProgramEnrollmentStats = exports.calculateProgramCompletion = exports.publishProgram = exports.removeCoursesFromProgram = exports.addCoursesToProgram = exports.createTrainingProgram = exports.updateCourse = exports.getCourseById = exports.searchCourses = exports.versionCourse = exports.retireCourse = exports.archiveCourse = exports.publishCourse = exports.createLearningCourse = exports.createCertificationModel = exports.createTrainingSessionModel = exports.createCourseEnrollmentModel = exports.createTrainingProgramModel = exports.createLearningCourseModel = exports.TrainingFeedbackSchema = exports.AttendanceRecordSchema = exports.AssessmentCreateSchema = exports.LearningPathCreateSchema = exports.TrainingSessionCreateSchema = exports.EnrollUserSchema = exports.TrainingProgramCreateSchema = exports.LearningCourseCreateSchema = exports.SubmitTrainingFeedbackDto = exports.RecordAttendanceDto = exports.CreateAssessmentDto = exports.CreateLearningPathDto = exports.CreateTrainingSessionDto = exports.EnrollUserDto = exports.CreateTrainingProgramDto = exports.CreateLearningCourseDto = exports.QuestionType = exports.ComplianceType = exports.ScormVersion = exports.CertificationStatus = exports.AssessmentStatus = exports.AttendanceStatus = exports.SessionStatus = exports.EnrollmentStatus = exports.CourseStatus = exports.DeliveryMethod = exports.LearningItemType = void 0;
exports.LearningManagementController = exports.generateLearningTranscript = exports.getLearningAnalytics = exports.getCourseFeedbackSummary = exports.submitTrainingFeedback = exports.getUserAssessmentAttempts = exports.submitAssessmentAttempt = exports.startAssessmentAttempt = exports.createAssessment = exports.updateCourseProgress = exports.markEnrollmentCompleted = exports.bulkRecordAttendance = exports.recordAttendance = exports.getUserCertificates = exports.renewCertificate = exports.revokeCertificate = exports.verifyCertificate = exports.issueCertificate = exports.publishLearningPath = exports.calculateLearningPathProgress = exports.removeItemsFromLearningPath = exports.addItemsToLearningPath = exports.createLearningPath = exports.completeTrainingSession = exports.startTrainingSession = exports.rescheduleTrainingSession = exports.cancelTrainingSession = exports.updateTrainingSession = exports.createTrainingSession = exports.getCourseEnrollmentStats = exports.getUserEnrollments = exports.bulkEnrollUsers = exports.withdrawFromCourse = void 0;
/**
 * File: /reuse/server/human-capital/learning-management-kit.ts
 * Locator: WC-HCM-LRN-001
 * Purpose: Comprehensive Learning Management System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, learning services, training administration, compliance management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 50+ utility functions for learning catalog, course management, training programs, enrollment,
 * ILT/VILT management, e-learning, SCORM, certifications, compliance training, assessments, analytics
 *
 * LLM Context: Enterprise-grade Learning Management System competing with SAP SuccessFactors Learning.
 * Provides complete learning catalog management, course creation and delivery, training program scheduling,
 * enrollment and waitlist management, instructor-led training (ILT), virtual instructor-led training (VILT),
 * e-learning content management, SCORM compliance, learning paths and curricula, certification tracking,
 * accreditation management, compliance training automation, attendance tracking, completion tracking,
 * learning assessments and quizzes, training feedback and evaluations, comprehensive learning analytics,
 * reporting dashboards, integration with HRIS and performance management systems.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Learning item types
 */
var LearningItemType;
(function (LearningItemType) {
    LearningItemType["COURSE"] = "course";
    LearningItemType["CURRICULUM"] = "curriculum";
    LearningItemType["LEARNING_PATH"] = "learning_path";
    LearningItemType["PROGRAM"] = "program";
    LearningItemType["CERTIFICATION"] = "certification";
    LearningItemType["ASSESSMENT"] = "assessment";
})(LearningItemType || (exports.LearningItemType = LearningItemType = {}));
/**
 * Course delivery methods
 */
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["ILT"] = "ilt";
    DeliveryMethod["VILT"] = "vilt";
    DeliveryMethod["ELEARNING"] = "elearning";
    DeliveryMethod["BLENDED"] = "blended";
    DeliveryMethod["ON_THE_JOB"] = "on_the_job";
    DeliveryMethod["SELF_PACED"] = "self_paced";
    DeliveryMethod["WEBINAR"] = "webinar";
    DeliveryMethod["WORKSHOP"] = "workshop";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
/**
 * Course status values
 */
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "draft";
    CourseStatus["PUBLISHED"] = "published";
    CourseStatus["ARCHIVED"] = "archived";
    CourseStatus["UNDER_REVIEW"] = "under_review";
    CourseStatus["RETIRED"] = "retired";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
/**
 * Enrollment status values
 */
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["WAITLISTED"] = "waitlisted";
    EnrollmentStatus["ENROLLED"] = "enrolled";
    EnrollmentStatus["IN_PROGRESS"] = "in_progress";
    EnrollmentStatus["COMPLETED"] = "completed";
    EnrollmentStatus["FAILED"] = "failed";
    EnrollmentStatus["CANCELLED"] = "cancelled";
    EnrollmentStatus["NO_SHOW"] = "no_show";
    EnrollmentStatus["WITHDRAWN"] = "withdrawn";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
/**
 * Training session status
 */
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["SCHEDULED"] = "scheduled";
    SessionStatus["IN_PROGRESS"] = "in_progress";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["CANCELLED"] = "cancelled";
    SessionStatus["RESCHEDULED"] = "rescheduled";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
/**
 * Attendance status
 */
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["EXCUSED"] = "excused";
    AttendanceStatus["PARTIAL"] = "partial";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
/**
 * Assessment status
 */
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["NOT_STARTED"] = "not_started";
    AssessmentStatus["IN_PROGRESS"] = "in_progress";
    AssessmentStatus["COMPLETED"] = "completed";
    AssessmentStatus["PASSED"] = "passed";
    AssessmentStatus["FAILED"] = "failed";
    AssessmentStatus["EXPIRED"] = "expired";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
/**
 * Certification status
 */
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["ACTIVE"] = "active";
    CertificationStatus["EXPIRED"] = "expired";
    CertificationStatus["REVOKED"] = "revoked";
    CertificationStatus["SUSPENDED"] = "suspended";
    CertificationStatus["PENDING"] = "pending";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
/**
 * SCORM version
 */
var ScormVersion;
(function (ScormVersion) {
    ScormVersion["SCORM_1_2"] = "scorm_1_2";
    ScormVersion["SCORM_2004"] = "scorm_2004";
    ScormVersion["XAPI"] = "xapi";
    ScormVersion["AICC"] = "aicc";
})(ScormVersion || (exports.ScormVersion = ScormVersion = {}));
/**
 * Compliance training type
 */
var ComplianceType;
(function (ComplianceType) {
    ComplianceType["MANDATORY"] = "mandatory";
    ComplianceType["RECOMMENDED"] = "recommended";
    ComplianceType["OPTIONAL"] = "optional";
    ComplianceType["REGULATORY"] = "regulatory";
})(ComplianceType || (exports.ComplianceType = ComplianceType = {}));
/**
 * Question types for assessments
 */
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["ESSAY"] = "essay";
    QuestionType["MATCHING"] = "matching";
    QuestionType["FILL_IN_BLANK"] = "fill_in_blank";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create learning course DTO
 */
let CreateLearningCourseDto = (() => {
    var _a;
    let _courseName_decorators;
    let _courseName_initializers = [];
    let _courseName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _credits_decorators;
    let _credits_initializers = [];
    let _credits_extraInitializers = [];
    let _passingScore_decorators;
    let _passingScore_initializers = [];
    let _passingScore_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _isComplianceTraining_decorators;
    let _isComplianceTraining_initializers = [];
    let _isComplianceTraining_extraInitializers = [];
    let _complianceType_decorators;
    let _complianceType_initializers = [];
    let _complianceType_extraInitializers = [];
    let _scormCompliant_decorators;
    let _scormCompliant_initializers = [];
    let _scormCompliant_extraInitializers = [];
    let _scormVersion_decorators;
    let _scormVersion_initializers = [];
    let _scormVersion_extraInitializers = [];
    let _contentUrl_decorators;
    let _contentUrl_initializers = [];
    let _contentUrl_extraInitializers = [];
    let _language_decorators;
    let _language_initializers = [];
    let _language_extraInitializers = [];
    let _targetAudience_decorators;
    let _targetAudience_initializers = [];
    let _targetAudience_extraInitializers = [];
    let _learningObjectives_decorators;
    let _learningObjectives_initializers = [];
    let _learningObjectives_extraInitializers = [];
    return _a = class CreateLearningCourseDto {
            constructor() {
                this.courseName = __runInitializers(this, _courseName_initializers, void 0);
                this.description = (__runInitializers(this, _courseName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.duration = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.credits = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _credits_initializers, void 0));
                this.passingScore = (__runInitializers(this, _credits_extraInitializers), __runInitializers(this, _passingScore_initializers, void 0));
                this.ownerId = (__runInitializers(this, _passingScore_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                this.isComplianceTraining = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _isComplianceTraining_initializers, void 0));
                this.complianceType = (__runInitializers(this, _isComplianceTraining_extraInitializers), __runInitializers(this, _complianceType_initializers, void 0));
                this.scormCompliant = (__runInitializers(this, _complianceType_extraInitializers), __runInitializers(this, _scormCompliant_initializers, void 0));
                this.scormVersion = (__runInitializers(this, _scormCompliant_extraInitializers), __runInitializers(this, _scormVersion_initializers, void 0));
                this.contentUrl = (__runInitializers(this, _scormVersion_extraInitializers), __runInitializers(this, _contentUrl_initializers, void 0));
                this.language = (__runInitializers(this, _contentUrl_extraInitializers), __runInitializers(this, _language_initializers, void 0));
                this.targetAudience = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _targetAudience_initializers, void 0));
                this.learningObjectives = (__runInitializers(this, _targetAudience_extraInitializers), __runInitializers(this, _learningObjectives_initializers, void 0));
                __runInitializers(this, _learningObjectives_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: LearningItemType }), (0, class_validator_1.IsEnum)(LearningItemType)];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryMethod }), (0, class_validator_1.IsEnum)(DeliveryMethod)];
            _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _credits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credits awarded' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _passingScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Passing score percentage', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner user ID' }), (0, class_validator_1.IsUUID)()];
            _isComplianceTraining_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is compliance training', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _complianceType_decorators = [(0, swagger_1.ApiProperty)({ enum: ComplianceType, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ComplianceType)];
            _scormCompliant_decorators = [(0, swagger_1.ApiProperty)({ description: 'SCORM compliant', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _scormVersion_decorators = [(0, swagger_1.ApiProperty)({ enum: ScormVersion, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ScormVersion)];
            _contentUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Content URL', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _language_decorators = [(0, swagger_1.ApiProperty)({ description: 'Language code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetAudience_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target audience', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _learningObjectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Learning objectives', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _courseName_decorators, { kind: "field", name: "courseName", static: false, private: false, access: { has: obj => "courseName" in obj, get: obj => obj.courseName, set: (obj, value) => { obj.courseName = value; } }, metadata: _metadata }, _courseName_initializers, _courseName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _credits_decorators, { kind: "field", name: "credits", static: false, private: false, access: { has: obj => "credits" in obj, get: obj => obj.credits, set: (obj, value) => { obj.credits = value; } }, metadata: _metadata }, _credits_initializers, _credits_extraInitializers);
            __esDecorate(null, null, _passingScore_decorators, { kind: "field", name: "passingScore", static: false, private: false, access: { has: obj => "passingScore" in obj, get: obj => obj.passingScore, set: (obj, value) => { obj.passingScore = value; } }, metadata: _metadata }, _passingScore_initializers, _passingScore_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            __esDecorate(null, null, _isComplianceTraining_decorators, { kind: "field", name: "isComplianceTraining", static: false, private: false, access: { has: obj => "isComplianceTraining" in obj, get: obj => obj.isComplianceTraining, set: (obj, value) => { obj.isComplianceTraining = value; } }, metadata: _metadata }, _isComplianceTraining_initializers, _isComplianceTraining_extraInitializers);
            __esDecorate(null, null, _complianceType_decorators, { kind: "field", name: "complianceType", static: false, private: false, access: { has: obj => "complianceType" in obj, get: obj => obj.complianceType, set: (obj, value) => { obj.complianceType = value; } }, metadata: _metadata }, _complianceType_initializers, _complianceType_extraInitializers);
            __esDecorate(null, null, _scormCompliant_decorators, { kind: "field", name: "scormCompliant", static: false, private: false, access: { has: obj => "scormCompliant" in obj, get: obj => obj.scormCompliant, set: (obj, value) => { obj.scormCompliant = value; } }, metadata: _metadata }, _scormCompliant_initializers, _scormCompliant_extraInitializers);
            __esDecorate(null, null, _scormVersion_decorators, { kind: "field", name: "scormVersion", static: false, private: false, access: { has: obj => "scormVersion" in obj, get: obj => obj.scormVersion, set: (obj, value) => { obj.scormVersion = value; } }, metadata: _metadata }, _scormVersion_initializers, _scormVersion_extraInitializers);
            __esDecorate(null, null, _contentUrl_decorators, { kind: "field", name: "contentUrl", static: false, private: false, access: { has: obj => "contentUrl" in obj, get: obj => obj.contentUrl, set: (obj, value) => { obj.contentUrl = value; } }, metadata: _metadata }, _contentUrl_initializers, _contentUrl_extraInitializers);
            __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: obj => "language" in obj, get: obj => obj.language, set: (obj, value) => { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
            __esDecorate(null, null, _targetAudience_decorators, { kind: "field", name: "targetAudience", static: false, private: false, access: { has: obj => "targetAudience" in obj, get: obj => obj.targetAudience, set: (obj, value) => { obj.targetAudience = value; } }, metadata: _metadata }, _targetAudience_initializers, _targetAudience_extraInitializers);
            __esDecorate(null, null, _learningObjectives_decorators, { kind: "field", name: "learningObjectives", static: false, private: false, access: { has: obj => "learningObjectives" in obj, get: obj => obj.learningObjectives, set: (obj, value) => { obj.learningObjectives = value; } }, metadata: _metadata }, _learningObjectives_initializers, _learningObjectives_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLearningCourseDto = CreateLearningCourseDto;
/**
 * Create training program DTO
 */
let CreateTrainingProgramDto = (() => {
    var _a;
    let _programName_decorators;
    let _programName_initializers = [];
    let _programName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _programType_decorators;
    let _programType_initializers = [];
    let _programType_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _courseIds_decorators;
    let _courseIds_initializers = [];
    let _courseIds_extraInitializers = [];
    let _requiredCompletionRate_decorators;
    let _requiredCompletionRate_initializers = [];
    let _requiredCompletionRate_extraInitializers = [];
    let _coordinatorId_decorators;
    let _coordinatorId_initializers = [];
    let _coordinatorId_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    return _a = class CreateTrainingProgramDto {
            constructor() {
                this.programName = __runInitializers(this, _programName_initializers, void 0);
                this.description = (__runInitializers(this, _programName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.programType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _programType_initializers, void 0));
                this.startDate = (__runInitializers(this, _programType_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.capacity = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
                this.courseIds = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _courseIds_initializers, void 0));
                this.requiredCompletionRate = (__runInitializers(this, _courseIds_extraInitializers), __runInitializers(this, _requiredCompletionRate_initializers, void 0));
                this.coordinatorId = (__runInitializers(this, _requiredCompletionRate_extraInitializers), __runInitializers(this, _coordinatorId_initializers, void 0));
                this.budget = (__runInitializers(this, _coordinatorId_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                __runInitializers(this, _budget_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _programName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _programType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'] }), (0, class_validator_1.IsEnum)(['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'])];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program end date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _capacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum capacity', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _courseIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            _requiredCompletionRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required completion rate percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _coordinatorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program coordinator user ID' }), (0, class_validator_1.IsUUID)()];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _programName_decorators, { kind: "field", name: "programName", static: false, private: false, access: { has: obj => "programName" in obj, get: obj => obj.programName, set: (obj, value) => { obj.programName = value; } }, metadata: _metadata }, _programName_initializers, _programName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _programType_decorators, { kind: "field", name: "programType", static: false, private: false, access: { has: obj => "programType" in obj, get: obj => obj.programType, set: (obj, value) => { obj.programType = value; } }, metadata: _metadata }, _programType_initializers, _programType_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            __esDecorate(null, null, _courseIds_decorators, { kind: "field", name: "courseIds", static: false, private: false, access: { has: obj => "courseIds" in obj, get: obj => obj.courseIds, set: (obj, value) => { obj.courseIds = value; } }, metadata: _metadata }, _courseIds_initializers, _courseIds_extraInitializers);
            __esDecorate(null, null, _requiredCompletionRate_decorators, { kind: "field", name: "requiredCompletionRate", static: false, private: false, access: { has: obj => "requiredCompletionRate" in obj, get: obj => obj.requiredCompletionRate, set: (obj, value) => { obj.requiredCompletionRate = value; } }, metadata: _metadata }, _requiredCompletionRate_initializers, _requiredCompletionRate_extraInitializers);
            __esDecorate(null, null, _coordinatorId_decorators, { kind: "field", name: "coordinatorId", static: false, private: false, access: { has: obj => "coordinatorId" in obj, get: obj => obj.coordinatorId, set: (obj, value) => { obj.coordinatorId = value; } }, metadata: _metadata }, _coordinatorId_initializers, _coordinatorId_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTrainingProgramDto = CreateTrainingProgramDto;
/**
 * Enroll user in course DTO
 */
let EnrollUserDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _enrolledBy_decorators;
    let _enrolledBy_initializers = [];
    let _enrolledBy_extraInitializers = [];
    let _autoEnrollFromWaitlist_decorators;
    let _autoEnrollFromWaitlist_initializers = [];
    let _autoEnrollFromWaitlist_extraInitializers = [];
    return _a = class EnrollUserDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.courseId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _courseId_initializers, void 0));
                this.sessionId = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
                this.dueDate = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.enrolledBy = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _enrolledBy_initializers, void 0));
                this.autoEnrollFromWaitlist = (__runInitializers(this, _enrolledBy_extraInitializers), __runInitializers(this, _autoEnrollFromWaitlist_initializers, void 0));
                __runInitializers(this, _autoEnrollFromWaitlist_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _courseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' }), (0, class_validator_1.IsUUID)()];
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _enrolledBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enrolled by user ID' }), (0, class_validator_1.IsUUID)()];
            _autoEnrollFromWaitlist_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-enroll if waitlisted', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _enrolledBy_decorators, { kind: "field", name: "enrolledBy", static: false, private: false, access: { has: obj => "enrolledBy" in obj, get: obj => obj.enrolledBy, set: (obj, value) => { obj.enrolledBy = value; } }, metadata: _metadata }, _enrolledBy_initializers, _enrolledBy_extraInitializers);
            __esDecorate(null, null, _autoEnrollFromWaitlist_decorators, { kind: "field", name: "autoEnrollFromWaitlist", static: false, private: false, access: { has: obj => "autoEnrollFromWaitlist" in obj, get: obj => obj.autoEnrollFromWaitlist, set: (obj, value) => { obj.autoEnrollFromWaitlist = value; } }, metadata: _metadata }, _autoEnrollFromWaitlist_initializers, _autoEnrollFromWaitlist_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EnrollUserDto = EnrollUserDto;
/**
 * Create training session DTO
 */
let CreateTrainingSessionDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _sessionName_decorators;
    let _sessionName_initializers = [];
    let _sessionName_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _startDateTime_decorators;
    let _startDateTime_initializers = [];
    let _startDateTime_extraInitializers = [];
    let _endDateTime_decorators;
    let _endDateTime_initializers = [];
    let _endDateTime_extraInitializers = [];
    let _instructorId_decorators;
    let _instructorId_initializers = [];
    let _instructorId_extraInitializers = [];
    let _coInstructorIds_decorators;
    let _coInstructorIds_initializers = [];
    let _coInstructorIds_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _virtualLink_decorators;
    let _virtualLink_initializers = [];
    let _virtualLink_extraInitializers = [];
    let _virtualPlatform_decorators;
    let _virtualPlatform_initializers = [];
    let _virtualPlatform_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    return _a = class CreateTrainingSessionDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.sessionName = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _sessionName_initializers, void 0));
                this.deliveryMethod = (__runInitializers(this, _sessionName_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
                this.startDateTime = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _startDateTime_initializers, void 0));
                this.endDateTime = (__runInitializers(this, _startDateTime_extraInitializers), __runInitializers(this, _endDateTime_initializers, void 0));
                this.instructorId = (__runInitializers(this, _endDateTime_extraInitializers), __runInitializers(this, _instructorId_initializers, void 0));
                this.coInstructorIds = (__runInitializers(this, _instructorId_extraInitializers), __runInitializers(this, _coInstructorIds_initializers, void 0));
                this.location = (__runInitializers(this, _coInstructorIds_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.virtualLink = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _virtualLink_initializers, void 0));
                this.virtualPlatform = (__runInitializers(this, _virtualLink_extraInitializers), __runInitializers(this, _virtualPlatform_initializers, void 0));
                this.capacity = (__runInitializers(this, _virtualPlatform_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
                __runInitializers(this, _capacity_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' }), (0, class_validator_1.IsUUID)()];
            _sessionName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _deliveryMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryMethod }), (0, class_validator_1.IsEnum)(DeliveryMethod)];
            _startDateTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session start date and time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDateTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session end date and time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _instructorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructor user ID' }), (0, class_validator_1.IsUUID)()];
            _coInstructorIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Co-instructor IDs', type: [String], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _virtualLink_decorators = [(0, swagger_1.ApiProperty)({ description: 'Virtual meeting link', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _virtualPlatform_decorators = [(0, swagger_1.ApiProperty)({ description: 'Virtual platform name', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _capacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session capacity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _sessionName_decorators, { kind: "field", name: "sessionName", static: false, private: false, access: { has: obj => "sessionName" in obj, get: obj => obj.sessionName, set: (obj, value) => { obj.sessionName = value; } }, metadata: _metadata }, _sessionName_initializers, _sessionName_extraInitializers);
            __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
            __esDecorate(null, null, _startDateTime_decorators, { kind: "field", name: "startDateTime", static: false, private: false, access: { has: obj => "startDateTime" in obj, get: obj => obj.startDateTime, set: (obj, value) => { obj.startDateTime = value; } }, metadata: _metadata }, _startDateTime_initializers, _startDateTime_extraInitializers);
            __esDecorate(null, null, _endDateTime_decorators, { kind: "field", name: "endDateTime", static: false, private: false, access: { has: obj => "endDateTime" in obj, get: obj => obj.endDateTime, set: (obj, value) => { obj.endDateTime = value; } }, metadata: _metadata }, _endDateTime_initializers, _endDateTime_extraInitializers);
            __esDecorate(null, null, _instructorId_decorators, { kind: "field", name: "instructorId", static: false, private: false, access: { has: obj => "instructorId" in obj, get: obj => obj.instructorId, set: (obj, value) => { obj.instructorId = value; } }, metadata: _metadata }, _instructorId_initializers, _instructorId_extraInitializers);
            __esDecorate(null, null, _coInstructorIds_decorators, { kind: "field", name: "coInstructorIds", static: false, private: false, access: { has: obj => "coInstructorIds" in obj, get: obj => obj.coInstructorIds, set: (obj, value) => { obj.coInstructorIds = value; } }, metadata: _metadata }, _coInstructorIds_initializers, _coInstructorIds_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _virtualLink_decorators, { kind: "field", name: "virtualLink", static: false, private: false, access: { has: obj => "virtualLink" in obj, get: obj => obj.virtualLink, set: (obj, value) => { obj.virtualLink = value; } }, metadata: _metadata }, _virtualLink_initializers, _virtualLink_extraInitializers);
            __esDecorate(null, null, _virtualPlatform_decorators, { kind: "field", name: "virtualPlatform", static: false, private: false, access: { has: obj => "virtualPlatform" in obj, get: obj => obj.virtualPlatform, set: (obj, value) => { obj.virtualPlatform = value; } }, metadata: _metadata }, _virtualPlatform_initializers, _virtualPlatform_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTrainingSessionDto = CreateTrainingSessionDto;
/**
 * Create learning path DTO
 */
let CreateLearningPathDto = (() => {
    var _a;
    let _pathName_decorators;
    let _pathName_initializers = [];
    let _pathName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _targetRoles_decorators;
    let _targetRoles_initializers = [];
    let _targetRoles_extraInitializers = [];
    let _targetJobLevels_decorators;
    let _targetJobLevels_initializers = [];
    let _targetJobLevels_extraInitializers = [];
    let _certificateAwarded_decorators;
    let _certificateAwarded_initializers = [];
    let _certificateAwarded_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    return _a = class CreateLearningPathDto {
            constructor() {
                this.pathName = __runInitializers(this, _pathName_initializers, void 0);
                this.description = (__runInitializers(this, _pathName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.targetRoles = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _targetRoles_initializers, void 0));
                this.targetJobLevels = (__runInitializers(this, _targetRoles_extraInitializers), __runInitializers(this, _targetJobLevels_initializers, void 0));
                this.certificateAwarded = (__runInitializers(this, _targetJobLevels_extraInitializers), __runInitializers(this, _certificateAwarded_initializers, void 0));
                this.ownerId = (__runInitializers(this, _certificateAwarded_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pathName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Learning path name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _targetRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target roles', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _targetJobLevels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target job levels', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _certificateAwarded_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate awarded', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _pathName_decorators, { kind: "field", name: "pathName", static: false, private: false, access: { has: obj => "pathName" in obj, get: obj => obj.pathName, set: (obj, value) => { obj.pathName = value; } }, metadata: _metadata }, _pathName_initializers, _pathName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _targetRoles_decorators, { kind: "field", name: "targetRoles", static: false, private: false, access: { has: obj => "targetRoles" in obj, get: obj => obj.targetRoles, set: (obj, value) => { obj.targetRoles = value; } }, metadata: _metadata }, _targetRoles_initializers, _targetRoles_extraInitializers);
            __esDecorate(null, null, _targetJobLevels_decorators, { kind: "field", name: "targetJobLevels", static: false, private: false, access: { has: obj => "targetJobLevels" in obj, get: obj => obj.targetJobLevels, set: (obj, value) => { obj.targetJobLevels = value; } }, metadata: _metadata }, _targetJobLevels_initializers, _targetJobLevels_extraInitializers);
            __esDecorate(null, null, _certificateAwarded_decorators, { kind: "field", name: "certificateAwarded", static: false, private: false, access: { has: obj => "certificateAwarded" in obj, get: obj => obj.certificateAwarded, set: (obj, value) => { obj.certificateAwarded = value; } }, metadata: _metadata }, _certificateAwarded_initializers, _certificateAwarded_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLearningPathDto = CreateLearningPathDto;
/**
 * Create assessment DTO
 */
let CreateAssessmentDto = (() => {
    var _a;
    let _assessmentName_decorators;
    let _assessmentName_initializers = [];
    let _assessmentName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _passingScore_decorators;
    let _passingScore_initializers = [];
    let _passingScore_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _maxAttempts_decorators;
    let _maxAttempts_initializers = [];
    let _maxAttempts_extraInitializers = [];
    return _a = class CreateAssessmentDto {
            constructor() {
                this.assessmentName = __runInitializers(this, _assessmentName_initializers, void 0);
                this.description = (__runInitializers(this, _assessmentName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.courseId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _courseId_initializers, void 0));
                this.type = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.passingScore = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _passingScore_initializers, void 0));
                this.duration = (__runInitializers(this, _passingScore_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.maxAttempts = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _maxAttempts_initializers, void 0));
                __runInitializers(this, _maxAttempts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assessmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _courseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST'] }), (0, class_validator_1.IsEnum)(['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST'])];
            _passingScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Passing score percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _maxAttempts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum attempts' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _assessmentName_decorators, { kind: "field", name: "assessmentName", static: false, private: false, access: { has: obj => "assessmentName" in obj, get: obj => obj.assessmentName, set: (obj, value) => { obj.assessmentName = value; } }, metadata: _metadata }, _assessmentName_initializers, _assessmentName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _passingScore_decorators, { kind: "field", name: "passingScore", static: false, private: false, access: { has: obj => "passingScore" in obj, get: obj => obj.passingScore, set: (obj, value) => { obj.passingScore = value; } }, metadata: _metadata }, _passingScore_initializers, _passingScore_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _maxAttempts_decorators, { kind: "field", name: "maxAttempts", static: false, private: false, access: { has: obj => "maxAttempts" in obj, get: obj => obj.maxAttempts, set: (obj, value) => { obj.maxAttempts = value; } }, metadata: _metadata }, _maxAttempts_initializers, _maxAttempts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAssessmentDto = CreateAssessmentDto;
/**
 * Record attendance DTO
 */
let RecordAttendanceDto = (() => {
    var _a;
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _checkInTime_decorators;
    let _checkInTime_initializers = [];
    let _checkInTime_extraInitializers = [];
    let _checkOutTime_decorators;
    let _checkOutTime_initializers = [];
    let _checkOutTime_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class RecordAttendanceDto {
            constructor() {
                this.sessionId = __runInitializers(this, _sessionId_initializers, void 0);
                this.userId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.status = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.checkInTime = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _checkInTime_initializers, void 0));
                this.checkOutTime = (__runInitializers(this, _checkInTime_extraInitializers), __runInitializers(this, _checkOutTime_initializers, void 0));
                this.notes = (__runInitializers(this, _checkOutTime_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session ID' }), (0, class_validator_1.IsUUID)()];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: AttendanceStatus }), (0, class_validator_1.IsEnum)(AttendanceStatus)];
            _checkInTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-in time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _checkOutTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check-out time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _checkInTime_decorators, { kind: "field", name: "checkInTime", static: false, private: false, access: { has: obj => "checkInTime" in obj, get: obj => obj.checkInTime, set: (obj, value) => { obj.checkInTime = value; } }, metadata: _metadata }, _checkInTime_initializers, _checkInTime_extraInitializers);
            __esDecorate(null, null, _checkOutTime_decorators, { kind: "field", name: "checkOutTime", static: false, private: false, access: { has: obj => "checkOutTime" in obj, get: obj => obj.checkOutTime, set: (obj, value) => { obj.checkOutTime = value; } }, metadata: _metadata }, _checkOutTime_initializers, _checkOutTime_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordAttendanceDto = RecordAttendanceDto;
/**
 * Submit training feedback DTO
 */
let SubmitTrainingFeedbackDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _enrollmentId_decorators;
    let _enrollmentId_initializers = [];
    let _enrollmentId_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _contentRating_decorators;
    let _contentRating_initializers = [];
    let _contentRating_extraInitializers = [];
    let _instructorRating_decorators;
    let _instructorRating_initializers = [];
    let _instructorRating_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _wouldRecommend_decorators;
    let _wouldRecommend_initializers = [];
    let _wouldRecommend_extraInitializers = [];
    return _a = class SubmitTrainingFeedbackDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.sessionId = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
                this.enrollmentId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _enrollmentId_initializers, void 0));
                this.rating = (__runInitializers(this, _enrollmentId_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.contentRating = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _contentRating_initializers, void 0));
                this.instructorRating = (__runInitializers(this, _contentRating_extraInitializers), __runInitializers(this, _instructorRating_initializers, void 0));
                this.comments = (__runInitializers(this, _instructorRating_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.wouldRecommend = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _wouldRecommend_initializers, void 0));
                __runInitializers(this, _wouldRecommend_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' }), (0, class_validator_1.IsUUID)()];
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _enrollmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enrollment ID' }), (0, class_validator_1.IsUUID)()];
            _rating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall rating (1-5)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _contentRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Content rating', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _instructorRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructor rating', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5000)];
            _wouldRecommend_decorators = [(0, swagger_1.ApiProperty)({ description: 'Would recommend' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _enrollmentId_decorators, { kind: "field", name: "enrollmentId", static: false, private: false, access: { has: obj => "enrollmentId" in obj, get: obj => obj.enrollmentId, set: (obj, value) => { obj.enrollmentId = value; } }, metadata: _metadata }, _enrollmentId_initializers, _enrollmentId_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _contentRating_decorators, { kind: "field", name: "contentRating", static: false, private: false, access: { has: obj => "contentRating" in obj, get: obj => obj.contentRating, set: (obj, value) => { obj.contentRating = value; } }, metadata: _metadata }, _contentRating_initializers, _contentRating_extraInitializers);
            __esDecorate(null, null, _instructorRating_decorators, { kind: "field", name: "instructorRating", static: false, private: false, access: { has: obj => "instructorRating" in obj, get: obj => obj.instructorRating, set: (obj, value) => { obj.instructorRating = value; } }, metadata: _metadata }, _instructorRating_initializers, _instructorRating_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _wouldRecommend_decorators, { kind: "field", name: "wouldRecommend", static: false, private: false, access: { has: obj => "wouldRecommend" in obj, get: obj => obj.wouldRecommend, set: (obj, value) => { obj.wouldRecommend = value; } }, metadata: _metadata }, _wouldRecommend_initializers, _wouldRecommend_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitTrainingFeedbackDto = SubmitTrainingFeedbackDto;
// ============================================================================
// ZOD SCHEMAS
// ============================================================================
exports.LearningCourseCreateSchema = zod_1.z.object({
    courseName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(5000),
    type: zod_1.z.nativeEnum(LearningItemType),
    deliveryMethod: zod_1.z.nativeEnum(DeliveryMethod),
    duration: zod_1.z.number().min(1),
    credits: zod_1.z.number().min(0),
    passingScore: zod_1.z.number().min(0).max(100).optional(),
    ownerId: zod_1.z.string().uuid(),
    isComplianceTraining: zod_1.z.boolean().optional(),
    complianceType: zod_1.z.nativeEnum(ComplianceType).optional(),
    scormCompliant: zod_1.z.boolean().optional(),
    scormVersion: zod_1.z.nativeEnum(ScormVersion).optional(),
    contentUrl: zod_1.z.string().url().optional(),
    language: zod_1.z.string().min(2).max(10),
    targetAudience: zod_1.z.array(zod_1.z.string()),
    learningObjectives: zod_1.z.array(zod_1.z.string()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.TrainingProgramCreateSchema = zod_1.z.object({
    programName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(5000),
    programType: zod_1.z.enum(['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS']),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    capacity: zod_1.z.number().min(1).optional(),
    courseIds: zod_1.z.array(zod_1.z.string().uuid()),
    requiredCompletionRate: zod_1.z.number().min(0).max(100),
    coordinatorId: zod_1.z.string().uuid(),
    budget: zod_1.z.number().min(0).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.EnrollUserSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    courseId: zod_1.z.string().uuid(),
    sessionId: zod_1.z.string().uuid().optional(),
    dueDate: zod_1.z.date().optional(),
    enrolledBy: zod_1.z.string().uuid(),
    autoEnrollFromWaitlist: zod_1.z.boolean().optional(),
});
exports.TrainingSessionCreateSchema = zod_1.z.object({
    courseId: zod_1.z.string().uuid(),
    sessionName: zod_1.z.string().min(1).max(255),
    deliveryMethod: zod_1.z.nativeEnum(DeliveryMethod),
    startDateTime: zod_1.z.date(),
    endDateTime: zod_1.z.date(),
    instructorId: zod_1.z.string().uuid(),
    coInstructorIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    location: zod_1.z.string().max(500).optional(),
    virtualLink: zod_1.z.string().url().optional(),
    virtualPlatform: zod_1.z.string().max(100).optional(),
    capacity: zod_1.z.number().min(1),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.LearningPathCreateSchema = zod_1.z.object({
    pathName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(5000),
    targetRoles: zod_1.z.array(zod_1.z.string()),
    targetJobLevels: zod_1.z.array(zod_1.z.string()),
    certificateAwarded: zod_1.z.boolean().optional(),
    ownerId: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.AssessmentCreateSchema = zod_1.z.object({
    assessmentName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(2000),
    courseId: zod_1.z.string().uuid().optional(),
    type: zod_1.z.enum(['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST']),
    passingScore: zod_1.z.number().min(0).max(100),
    duration: zod_1.z.number().min(1).optional(),
    maxAttempts: zod_1.z.number().min(1),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.AttendanceRecordSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(AttendanceStatus),
    checkInTime: zod_1.z.date().optional(),
    checkOutTime: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.TrainingFeedbackSchema = zod_1.z.object({
    courseId: zod_1.z.string().uuid(),
    sessionId: zod_1.z.string().uuid().optional(),
    enrollmentId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().min(1).max(5),
    contentRating: zod_1.z.number().min(1).max(5).optional(),
    instructorRating: zod_1.z.number().min(1).max(5).optional(),
    comments: zod_1.z.string().max(5000).optional(),
    wouldRecommend: zod_1.z.boolean(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Learning Course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LearningCourse model
 *
 * @example
 * ```typescript
 * const LearningCourse = createLearningCourseModel(sequelize);
 * const course = await LearningCourse.create({
 *   courseName: 'Leadership Excellence',
 *   deliveryMethod: 'blended',
 *   duration: 480
 * });
 * ```
 */
const createLearningCourseModel = (sequelize) => {
    class LearningCourse extends sequelize_1.Model {
    }
    LearningCourse.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique course code',
        },
        courseName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Course name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Course description',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('course', 'curriculum', 'learning_path', 'program', 'certification', 'assessment'),
            allowNull: false,
            defaultValue: 'course',
            comment: 'Learning item type',
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.ENUM('ilt', 'vilt', 'elearning', 'blended', 'on_the_job', 'self_paced', 'webinar', 'workshop'),
            allowNull: false,
            comment: 'Course delivery method',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'published', 'archived', 'under_review', 'retired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Course status',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '1.0',
            comment: 'Course version',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Duration in minutes',
        },
        credits: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credits awarded upon completion',
        },
        passingScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Passing score percentage',
        },
        maxAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum number of attempts allowed',
        },
        validityPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Certificate validity period in days',
        },
        ownerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Course owner/creator user ID',
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Course category ID',
        },
        competencyIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Related competency IDs',
        },
        prerequisites: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Prerequisite course IDs',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Course tags for search and categorization',
        },
        isComplianceTraining: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is compliance training',
        },
        complianceType: {
            type: sequelize_1.DataTypes.ENUM('mandatory', 'recommended', 'optional', 'regulatory'),
            allowNull: true,
            comment: 'Compliance training type',
        },
        scormCompliant: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'SCORM compliance flag',
        },
        scormVersion: {
            type: sequelize_1.DataTypes.ENUM('scorm_1_2', 'scorm_2004', 'xapi', 'aicc'),
            allowNull: true,
            comment: 'SCORM version',
        },
        contentUrl: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Course content URL',
        },
        thumbnailUrl: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Course thumbnail image URL',
        },
        language: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'en',
            comment: 'Course language code',
        },
        targetAudience: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Target audience roles/departments',
        },
        learningObjectives: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Course learning objectives',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional course metadata',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Course published timestamp',
        },
        retiredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Course retired timestamp',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the course',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who last updated the course',
        },
    }, {
        sequelize,
        tableName: 'learning_courses',
        timestamps: true,
        indexes: [
            { fields: ['courseCode'], unique: true },
            { fields: ['status'] },
            { fields: ['deliveryMethod'] },
            { fields: ['type'] },
            { fields: ['isComplianceTraining'] },
            { fields: ['ownerId'] },
            { fields: ['categoryId'] },
            { fields: ['language'] },
        ],
    });
    return LearningCourse;
};
exports.createLearningCourseModel = createLearningCourseModel;
/**
 * Sequelize model for Training Program.
 */
const createTrainingProgramModel = (sequelize) => {
    class TrainingProgram extends sequelize_1.Model {
    }
    TrainingProgram.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique program code',
        },
        programName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Program name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Program description',
        },
        programType: {
            type: sequelize_1.DataTypes.ENUM('ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'),
            allowNull: false,
            comment: 'Program type',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'published', 'archived', 'under_review', 'retired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Program status',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Program duration in days',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Program start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Program end date',
        },
        capacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum program capacity',
        },
        enrolledCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of enrolled participants',
        },
        waitlistedCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of waitlisted participants',
        },
        courseIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Course IDs in this program',
        },
        requiredCompletionRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 100,
            comment: 'Required completion rate percentage',
        },
        coordinatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Program coordinator user ID',
        },
        departmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Department ID',
        },
        budget: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Program budget',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            defaultValue: 0,
            comment: 'Actual program cost',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Program tags',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional program metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the program',
        },
    }, {
        sequelize,
        tableName: 'training_programs',
        timestamps: true,
        indexes: [
            { fields: ['programCode'], unique: true },
            { fields: ['programType'] },
            { fields: ['status'] },
            { fields: ['coordinatorId'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return TrainingProgram;
};
exports.createTrainingProgramModel = createTrainingProgramModel;
/**
 * Sequelize model for Course Enrollment.
 */
const createCourseEnrollmentModel = (sequelize) => {
    class CourseEnrollment extends sequelize_1.Model {
    }
    CourseEnrollment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related course ID',
            references: {
                model: 'learning_courses',
                key: 'id',
            },
        },
        sessionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related training session ID (for ILT/VILT)',
        },
        learningItemId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Learning item ID (course, path, program)',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Enrolled user ID',
        },
        enrollmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Enrollment date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('waitlisted', 'enrolled', 'in_progress', 'completed', 'failed', 'cancelled', 'no_show', 'withdrawn'),
            allowNull: false,
            defaultValue: 'enrolled',
            comment: 'Enrollment status',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Course start date',
        },
        completionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Course completion date',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Course due date',
        },
        progress: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Progress percentage',
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of attempts',
        },
        lastAttemptDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last attempt date',
        },
        bestScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Best score achieved',
        },
        passingStatus: {
            type: sequelize_1.DataTypes.ENUM('passed', 'failed', 'pending'),
            allowNull: true,
            comment: 'Passing status',
        },
        certificateIssued: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether certificate was issued',
        },
        certificateId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related certificate ID',
        },
        enrolledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who enrolled the learner',
        },
        completedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who marked completion',
        },
        feedback: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Learner feedback',
        },
        rating: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
            comment: 'Course rating (1-5)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional enrollment metadata',
        },
    }, {
        sequelize,
        tableName: 'course_enrollments',
        timestamps: true,
        indexes: [
            { fields: ['courseId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['sessionId'] },
            { fields: ['enrollmentDate'] },
            { fields: ['completionDate'] },
            { fields: ['dueDate'] },
            { fields: ['userId', 'courseId'], unique: false },
        ],
    });
    return CourseEnrollment;
};
exports.createCourseEnrollmentModel = createCourseEnrollmentModel;
/**
 * Sequelize model for Training Session.
 */
const createTrainingSessionModel = (sequelize) => {
    class TrainingSession extends sequelize_1.Model {
    }
    TrainingSession.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related course ID',
            references: {
                model: 'learning_courses',
                key: 'id',
            },
        },
        sessionCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique session code',
        },
        sessionName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Session name',
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.ENUM('ilt', 'vilt', 'elearning', 'blended', 'on_the_job', 'self_paced', 'webinar', 'workshop'),
            allowNull: false,
            comment: 'Session delivery method',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'),
            allowNull: false,
            defaultValue: 'scheduled',
            comment: 'Session status',
        },
        startDateTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Session start date and time',
        },
        endDateTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Session end date and time',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Session duration in minutes',
        },
        instructorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Primary instructor user ID',
        },
        coInstructorIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Co-instructor user IDs',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Physical location',
        },
        virtualLink: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Virtual meeting link',
        },
        virtualPlatform: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Virtual platform (Zoom, Teams, etc.)',
        },
        capacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Session capacity',
        },
        enrolledCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of enrolled participants',
        },
        waitlistedCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of waitlisted participants',
        },
        attendedCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of attendees',
        },
        roomId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Room/facility ID',
        },
        facilityId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Facility ID',
        },
        equipmentRequired: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Required equipment',
        },
        materialsRequired: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Required materials',
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Session cost',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Session notes',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional session metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the session',
        },
    }, {
        sequelize,
        tableName: 'training_sessions',
        timestamps: true,
        indexes: [
            { fields: ['courseId'] },
            { fields: ['sessionCode'], unique: true },
            { fields: ['status'] },
            { fields: ['instructorId'] },
            { fields: ['startDateTime'] },
            { fields: ['endDateTime'] },
        ],
    });
    return TrainingSession;
};
exports.createTrainingSessionModel = createTrainingSessionModel;
/**
 * Sequelize model for Certification.
 */
const createCertificationModel = (sequelize) => {
    class Certification extends sequelize_1.Model {
    }
    Certification.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        certificateNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique certificate number',
        },
        certificateName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Certificate name',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Certificate holder user ID',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related course ID',
        },
        learningPathId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related learning path ID',
        },
        issueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Certificate issue date',
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Certificate expiry date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expired', 'revoked', 'suspended', 'pending'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Certificate status',
        },
        score: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Final score/grade',
        },
        creditsEarned: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credits earned',
        },
        certificateUrl: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Certificate document URL',
        },
        verificationCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Verification code for authenticity',
        },
        issuedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Issuing authority',
        },
        accreditationBody: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'External accreditation body',
        },
        renewalRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether renewal is required',
        },
        renewalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Renewal period in months',
        },
        lastRenewalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last renewal date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional certificate metadata',
        },
    }, {
        sequelize,
        tableName: 'certifications',
        timestamps: true,
        indexes: [
            { fields: ['certificateNumber'], unique: true },
            { fields: ['verificationCode'], unique: true },
            { fields: ['userId'] },
            { fields: ['courseId'] },
            { fields: ['status'] },
            { fields: ['issueDate'] },
            { fields: ['expiryDate'] },
        ],
    });
    return Certification;
};
exports.createCertificationModel = createCertificationModel;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates unique course code.
 */
const generateCourseCode = (prefix = 'CRS') => {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${prefix}-${year}-${sequence}`;
};
/**
 * Generates unique program code.
 */
const generateProgramCode = (prefix = 'PGM') => {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${sequence}`;
};
/**
 * Generates unique session code.
 */
const generateSessionCode = (courseCode) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${courseCode}-S-${timestamp}${random}`.toUpperCase();
};
/**
 * Generates unique certificate number.
 */
const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CERT-${year}${month}-${sequence}`;
};
/**
 * Generates verification code for certificates.
 */
const generateVerificationCode = () => {
    return `VC-${Date.now()}-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
};
/**
 * Generates UUID v4.
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
/**
 * Calculates completion percentage.
 */
const calculateProgress = (completed, total) => {
    if (total === 0)
        return 0;
    return Math.round((completed / total) * 100 * 100) / 100;
};
// ============================================================================
// LEARNING CATALOG & COURSE MANAGEMENT (Functions 1-8)
// ============================================================================
/**
 * Creates a new learning course with auto-generated course code.
 *
 * @param {object} courseData - Course creation data
 * @param {string} userId - User creating the course
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<LearningCourse>} Created course
 *
 * @example
 * ```typescript
 * const course = await createLearningCourse({
 *   courseName: 'Leadership Excellence Program',
 *   description: 'Comprehensive leadership training',
 *   deliveryMethod: DeliveryMethod.BLENDED,
 *   duration: 480,
 *   credits: 8,
 *   ownerId: 'user-123'
 * }, 'admin-456');
 * ```
 */
const createLearningCourse = async (courseData, userId, transaction) => {
    const courseCode = generateCourseCode();
    const course = {
        id: generateUUID(),
        courseCode,
        courseName: courseData.courseName,
        description: courseData.description,
        type: courseData.type || LearningItemType.COURSE,
        deliveryMethod: courseData.deliveryMethod,
        status: CourseStatus.DRAFT,
        version: '1.0',
        duration: courseData.duration,
        credits: courseData.credits,
        passingScore: courseData.passingScore,
        maxAttempts: courseData.maxAttempts,
        validityPeriod: courseData.validityPeriod,
        ownerId: courseData.ownerId,
        categoryId: courseData.categoryId,
        competencyIds: courseData.competencyIds || [],
        prerequisites: courseData.prerequisites || [],
        tags: courseData.tags || [],
        isComplianceTraining: courseData.isComplianceTraining || false,
        complianceType: courseData.complianceType,
        scormCompliant: courseData.scormCompliant || false,
        scormVersion: courseData.scormVersion,
        contentUrl: courseData.contentUrl,
        thumbnailUrl: courseData.thumbnailUrl,
        language: courseData.language || 'en',
        targetAudience: courseData.targetAudience || [],
        learningObjectives: courseData.learningObjectives || [],
        metadata: {
            ...courseData.metadata,
            createdDate: new Date().toISOString(),
        },
        publishedAt: undefined,
        retiredAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
    return course;
};
exports.createLearningCourse = createLearningCourse;
/**
 * Publishes a course, making it available for enrollment.
 *
 * @param {string} courseId - Course ID to publish
 * @param {string} userId - User publishing the course
 * @returns {Promise<LearningCourse>} Updated course
 */
const publishCourse = async (courseId, userId, transaction) => {
    return {
        id: courseId,
        status: CourseStatus.PUBLISHED,
        publishedAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.publishCourse = publishCourse;
/**
 * Archives a course, removing it from active catalog.
 *
 * @param {string} courseId - Course ID to archive
 * @param {string} userId - User archiving the course
 * @returns {Promise<LearningCourse>} Updated course
 */
const archiveCourse = async (courseId, userId, transaction) => {
    return {
        id: courseId,
        status: CourseStatus.ARCHIVED,
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.archiveCourse = archiveCourse;
/**
 * Retires a course, preventing new enrollments.
 *
 * @param {string} courseId - Course ID to retire
 * @param {string} userId - User retiring the course
 * @returns {Promise<LearningCourse>} Updated course
 */
const retireCourse = async (courseId, userId, transaction) => {
    return {
        id: courseId,
        status: CourseStatus.RETIRED,
        retiredAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.retireCourse = retireCourse;
/**
 * Versions a course, creating a new version.
 *
 * @param {string} courseId - Original course ID
 * @param {string} newVersion - New version number
 * @param {string} userId - User creating new version
 * @returns {Promise<LearningCourse>} New course version
 */
const versionCourse = async (courseId, newVersion, userId, transaction) => {
    return {
        id: generateUUID(),
        courseCode: generateCourseCode(),
        version: newVersion,
        status: CourseStatus.DRAFT,
        createdBy: userId,
        createdAt: new Date(),
        metadata: {
            previousVersionId: courseId,
            versionHistory: [courseId],
        },
    };
};
exports.versionCourse = versionCourse;
/**
 * Searches courses by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningCourse[]>} Matching courses
 */
const searchCourses = async (filters) => {
    // Implementation would query database with filters
    return {
        courses: [],
        total: 0,
    };
};
exports.searchCourses = searchCourses;
/**
 * Gets course details by ID.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<LearningCourse>} Course details
 */
const getCourseById = async (courseId) => {
    // Implementation would fetch from database
    return null;
};
exports.getCourseById = getCourseById;
/**
 * Updates course content and metadata.
 *
 * @param {string} courseId - Course ID
 * @param {object} updates - Course updates
 * @param {string} userId - User updating the course
 * @returns {Promise<LearningCourse>} Updated course
 */
const updateCourse = async (courseId, updates, userId, transaction) => {
    return {
        id: courseId,
        ...updates,
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.updateCourse = updateCourse;
// ============================================================================
// TRAINING PROGRAM MANAGEMENT (Functions 9-14)
// ============================================================================
/**
 * Creates a new training program.
 *
 * @param {object} programData - Program creation data
 * @param {string} userId - User creating the program
 * @returns {Promise<TrainingProgram>} Created program
 */
const createTrainingProgram = async (programData, userId, transaction) => {
    const programCode = generateProgramCode();
    const program = {
        id: generateUUID(),
        programCode,
        programName: programData.programName,
        description: programData.description,
        programType: programData.programType,
        status: CourseStatus.DRAFT,
        duration: programData.duration,
        startDate: programData.startDate,
        endDate: programData.endDate,
        capacity: programData.capacity,
        enrolledCount: 0,
        waitlistedCount: 0,
        courseIds: programData.courseIds || [],
        requiredCompletionRate: programData.requiredCompletionRate || 100,
        coordinatorId: programData.coordinatorId,
        departmentId: programData.departmentId,
        budget: programData.budget,
        actualCost: 0,
        tags: programData.tags || [],
        metadata: {
            ...programData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return program;
};
exports.createTrainingProgram = createTrainingProgram;
/**
 * Adds courses to a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to add
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
const addCoursesToProgram = async (programId, courseIds, userId, transaction) => {
    return {
        id: programId,
        courseIds: [...courseIds],
        updatedAt: new Date(),
    };
};
exports.addCoursesToProgram = addCoursesToProgram;
/**
 * Removes courses from a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to remove
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
const removeCoursesFromProgram = async (programId, courseIds, userId, transaction) => {
    return {
        id: programId,
        updatedAt: new Date(),
    };
};
exports.removeCoursesFromProgram = removeCoursesFromProgram;
/**
 * Publishes a training program.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User publishing the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
const publishProgram = async (programId, userId, transaction) => {
    return {
        id: programId,
        status: CourseStatus.PUBLISHED,
        updatedAt: new Date(),
    };
};
exports.publishProgram = publishProgram;
/**
 * Calculates program completion for a user.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Completion statistics
 */
const calculateProgramCompletion = async (programId, userId) => {
    // Implementation would fetch enrollments and calculate
    return {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        completionPercentage: 0,
        isProgramCompleted: false,
    };
};
exports.calculateProgramCompletion = calculateProgramCompletion;
/**
 * Gets program enrollment statistics.
 *
 * @param {string} programId - Program ID
 * @returns {Promise<object>} Enrollment statistics
 */
const getProgramEnrollmentStats = async (programId) => {
    return {
        enrolledCount: 0,
        waitlistedCount: 0,
        completedCount: 0,
        averageProgress: 0,
        averageCompletionTime: 0,
    };
};
exports.getProgramEnrollmentStats = getProgramEnrollmentStats;
// ============================================================================
// ENROLLMENT & WAITLIST MANAGEMENT (Functions 15-22)
// ============================================================================
/**
 * Enrolls a user in a course.
 *
 * @param {object} enrollmentData - Enrollment data
 * @param {string} enrolledByUserId - User performing enrollment
 * @returns {Promise<CourseEnrollment>} Created enrollment
 */
const enrollUserInCourse = async (enrollmentData, enrolledByUserId, transaction) => {
    const enrollment = {
        id: generateUUID(),
        courseId: enrollmentData.courseId,
        sessionId: enrollmentData.sessionId,
        learningItemId: enrollmentData.courseId,
        userId: enrollmentData.userId,
        enrollmentDate: new Date(),
        status: EnrollmentStatus.ENROLLED,
        startDate: undefined,
        completionDate: undefined,
        dueDate: enrollmentData.dueDate,
        progress: 0,
        attempts: 0,
        lastAttemptDate: undefined,
        bestScore: undefined,
        passingStatus: undefined,
        certificateIssued: false,
        certificateId: undefined,
        enrolledBy: enrolledByUserId,
        completedBy: undefined,
        feedback: undefined,
        rating: undefined,
        metadata: {
            enrollmentSource: 'manual',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return enrollment;
};
exports.enrollUserInCourse = enrollUserInCourse;
/**
 * Adds a user to course waitlist.
 *
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} sessionId - Session ID
 * @param {string} enrolledByUserId - User adding to waitlist
 * @returns {Promise<CourseEnrollment>} Waitlist enrollment
 */
const addToWaitlist = async (userId, courseId, sessionId, enrolledByUserId, transaction) => {
    const enrollment = {
        id: generateUUID(),
        courseId,
        sessionId,
        learningItemId: courseId,
        userId,
        enrollmentDate: new Date(),
        status: EnrollmentStatus.WAITLISTED,
        startDate: undefined,
        completionDate: undefined,
        dueDate: undefined,
        progress: 0,
        attempts: 0,
        lastAttemptDate: undefined,
        bestScore: undefined,
        passingStatus: undefined,
        certificateIssued: false,
        certificateId: undefined,
        enrolledBy: enrolledByUserId,
        completedBy: undefined,
        feedback: undefined,
        rating: undefined,
        metadata: {
            waitlistPosition: 1,
            waitlistDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return enrollment;
};
exports.addToWaitlist = addToWaitlist;
/**
 * Removes user from waitlist and enrolls them.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User processing enrollment
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
const enrollFromWaitlist = async (enrollmentId, userId, transaction) => {
    return {
        id: enrollmentId,
        status: EnrollmentStatus.ENROLLED,
        updatedAt: new Date(),
        metadata: {
            enrolledFromWaitlist: true,
            enrolledFromWaitlistDate: new Date().toISOString(),
        },
    };
};
exports.enrollFromWaitlist = enrollFromWaitlist;
/**
 * Cancels an enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User canceling enrollment
 * @param {string} reason - Cancellation reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
const cancelEnrollment = async (enrollmentId, userId, reason, transaction) => {
    return {
        id: enrollmentId,
        status: EnrollmentStatus.CANCELLED,
        updatedAt: new Date(),
        metadata: {
            cancellationReason: reason,
            cancelledDate: new Date().toISOString(),
            cancelledBy: userId,
        },
    };
};
exports.cancelEnrollment = cancelEnrollment;
/**
 * Withdraws a user from a course.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User withdrawing
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
const withdrawFromCourse = async (enrollmentId, userId, reason, transaction) => {
    return {
        id: enrollmentId,
        status: EnrollmentStatus.WITHDRAWN,
        updatedAt: new Date(),
        metadata: {
            withdrawalReason: reason,
            withdrawalDate: new Date().toISOString(),
        },
    };
};
exports.withdrawFromCourse = withdrawFromCourse;
/**
 * Bulk enrolls users in a course.
 *
 * @param {string} courseId - Course ID
 * @param {string[]} userIds - User IDs to enroll
 * @param {string} enrolledByUserId - User performing bulk enrollment
 * @returns {Promise<CourseEnrollment[]>} Created enrollments
 */
const bulkEnrollUsers = async (courseId, userIds, enrolledByUserId, options, transaction) => {
    const enrollments = [];
    for (const userId of userIds) {
        const enrollment = await (0, exports.enrollUserInCourse)({
            userId,
            courseId,
            sessionId: options?.sessionId,
            dueDate: options?.dueDate,
        }, enrolledByUserId, transaction);
        enrollments.push(enrollment);
    }
    return enrollments;
};
exports.bulkEnrollUsers = bulkEnrollUsers;
/**
 * Gets user enrollments with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<CourseEnrollment[]>} User enrollments
 */
const getUserEnrollments = async (userId, filters) => {
    // Implementation would fetch from database
    return [];
};
exports.getUserEnrollments = getUserEnrollments;
/**
 * Gets course enrollment statistics.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Enrollment statistics
 */
const getCourseEnrollmentStats = async (courseId) => {
    return {
        totalEnrollments: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
        waitlistedCount: 0,
        completionRate: 0,
        averageProgress: 0,
        averageScore: 0,
    };
};
exports.getCourseEnrollmentStats = getCourseEnrollmentStats;
// ============================================================================
// TRAINING SESSION MANAGEMENT (Functions 23-28)
// ============================================================================
/**
 * Creates a new training session (ILT/VILT).
 *
 * @param {object} sessionData - Session creation data
 * @param {string} userId - User creating the session
 * @returns {Promise<TrainingSession>} Created session
 */
const createTrainingSession = async (sessionData, userId, transaction) => {
    const sessionCode = generateSessionCode(sessionData.courseId || 'CRS');
    const session = {
        id: generateUUID(),
        courseId: sessionData.courseId,
        sessionCode,
        sessionName: sessionData.sessionName,
        deliveryMethod: sessionData.deliveryMethod,
        status: SessionStatus.SCHEDULED,
        startDateTime: sessionData.startDateTime,
        endDateTime: sessionData.endDateTime,
        duration: Math.floor((sessionData.endDateTime.getTime() - sessionData.startDateTime.getTime()) / (1000 * 60)),
        instructorId: sessionData.instructorId,
        coInstructorIds: sessionData.coInstructorIds || [],
        location: sessionData.location,
        virtualLink: sessionData.virtualLink,
        virtualPlatform: sessionData.virtualPlatform,
        capacity: sessionData.capacity,
        enrolledCount: 0,
        waitlistedCount: 0,
        attendedCount: 0,
        roomId: sessionData.roomId,
        facilityId: sessionData.facilityId,
        equipmentRequired: sessionData.equipmentRequired || [],
        materialsRequired: sessionData.materialsRequired || [],
        cost: sessionData.cost,
        notes: sessionData.notes,
        metadata: {
            ...sessionData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return session;
};
exports.createTrainingSession = createTrainingSession;
/**
 * Updates a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {object} updates - Session updates
 * @param {string} userId - User updating the session
 * @returns {Promise<TrainingSession>} Updated session
 */
const updateTrainingSession = async (sessionId, updates, userId, transaction) => {
    return {
        id: sessionId,
        ...updates,
        updatedAt: new Date(),
    };
};
exports.updateTrainingSession = updateTrainingSession;
/**
 * Cancels a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User canceling the session
 * @param {string} reason - Cancellation reason
 * @returns {Promise<TrainingSession>} Updated session
 */
const cancelTrainingSession = async (sessionId, userId, reason, transaction) => {
    return {
        id: sessionId,
        status: SessionStatus.CANCELLED,
        updatedAt: new Date(),
        metadata: {
            cancellationReason: reason,
            cancelledDate: new Date().toISOString(),
            cancelledBy: userId,
        },
    };
};
exports.cancelTrainingSession = cancelTrainingSession;
/**
 * Reschedules a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {Date} newStartDateTime - New start date/time
 * @param {Date} newEndDateTime - New end date/time
 * @param {string} userId - User rescheduling
 * @returns {Promise<TrainingSession>} Updated session
 */
const rescheduleTrainingSession = async (sessionId, newStartDateTime, newEndDateTime, userId, transaction) => {
    return {
        id: sessionId,
        status: SessionStatus.RESCHEDULED,
        startDateTime: newStartDateTime,
        endDateTime: newEndDateTime,
        duration: Math.floor((newEndDateTime.getTime() - newStartDateTime.getTime()) / (1000 * 60)),
        updatedAt: new Date(),
        metadata: {
            rescheduledDate: new Date().toISOString(),
            rescheduledBy: userId,
        },
    };
};
exports.rescheduleTrainingSession = rescheduleTrainingSession;
/**
 * Starts a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User starting the session
 * @returns {Promise<TrainingSession>} Updated session
 */
const startTrainingSession = async (sessionId, userId, transaction) => {
    return {
        id: sessionId,
        status: SessionStatus.IN_PROGRESS,
        updatedAt: new Date(),
        metadata: {
            actualStartTime: new Date().toISOString(),
        },
    };
};
exports.startTrainingSession = startTrainingSession;
/**
 * Completes a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User completing the session
 * @returns {Promise<TrainingSession>} Updated session
 */
const completeTrainingSession = async (sessionId, userId, transaction) => {
    return {
        id: sessionId,
        status: SessionStatus.COMPLETED,
        updatedAt: new Date(),
        metadata: {
            actualEndTime: new Date().toISOString(),
        },
    };
};
exports.completeTrainingSession = completeTrainingSession;
// ============================================================================
// LEARNING PATHS & CURRICULA (Functions 29-33)
// ============================================================================
/**
 * Creates a new learning path.
 *
 * @param {object} pathData - Learning path creation data
 * @param {string} userId - User creating the path
 * @returns {Promise<LearningPath>} Created learning path
 */
const createLearningPath = async (pathData, userId, transaction) => {
    const pathCode = `LP-${Date.now().toString(36).toUpperCase()}`;
    const learningPath = {
        id: generateUUID(),
        pathCode,
        pathName: pathData.pathName,
        description: pathData.description,
        status: CourseStatus.DRAFT,
        items: pathData.items || [],
        totalDuration: 0,
        totalCredits: 0,
        targetRoles: pathData.targetRoles || [],
        targetJobLevels: pathData.targetJobLevels || [],
        completionCriteria: pathData.completionCriteria || 'All required items must be completed',
        certificateAwarded: pathData.certificateAwarded || false,
        certificateTemplateId: pathData.certificateTemplateId,
        ownerId: pathData.ownerId,
        metadata: {
            ...pathData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return learningPath;
};
exports.createLearningPath = createLearningPath;
/**
 * Adds items to a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {array} items - Items to add
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
const addItemsToLearningPath = async (pathId, items, userId, transaction) => {
    return {
        id: pathId,
        items: [...items],
        updatedAt: new Date(),
    };
};
exports.addItemsToLearningPath = addItemsToLearningPath;
/**
 * Removes items from a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string[]} itemIds - Item IDs to remove
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
const removeItemsFromLearningPath = async (pathId, itemIds, userId, transaction) => {
    return {
        id: pathId,
        updatedAt: new Date(),
    };
};
exports.removeItemsFromLearningPath = removeItemsFromLearningPath;
/**
 * Calculates learning path progress for a user.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Progress statistics
 */
const calculateLearningPathProgress = async (pathId, userId) => {
    return {
        totalItems: 0,
        completedItems: 0,
        requiredItems: 0,
        completedRequiredItems: 0,
        progressPercentage: 0,
        isCompleted: false,
    };
};
exports.calculateLearningPathProgress = calculateLearningPathProgress;
/**
 * Publishes a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User publishing the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
const publishLearningPath = async (pathId, userId, transaction) => {
    return {
        id: pathId,
        status: CourseStatus.PUBLISHED,
        updatedAt: new Date(),
    };
};
exports.publishLearningPath = publishLearningPath;
// ============================================================================
// CERTIFICATION & ACCREDITATION (Functions 34-38)
// ============================================================================
/**
 * Issues a certificate to a user.
 *
 * @param {object} certData - Certificate data
 * @param {string} issuedByUserId - User issuing the certificate
 * @returns {Promise<Certification>} Created certificate
 */
const issueCertificate = async (certData, issuedByUserId, transaction) => {
    const certificateNumber = generateCertificateNumber();
    const verificationCode = generateVerificationCode();
    const certificate = {
        id: generateUUID(),
        certificateNumber,
        certificateName: certData.certificateName,
        userId: certData.userId,
        courseId: certData.courseId,
        learningPathId: certData.learningPathId,
        issueDate: new Date(),
        expiryDate: certData.expiryDate,
        status: CertificationStatus.ACTIVE,
        score: certData.score,
        creditsEarned: certData.creditsEarned,
        certificateUrl: undefined,
        verificationCode,
        issuedBy: issuedByUserId,
        accreditationBody: certData.accreditationBody,
        renewalRequired: certData.renewalRequired || false,
        renewalPeriod: certData.renewalPeriod,
        lastRenewalDate: undefined,
        metadata: {
            issueDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return certificate;
};
exports.issueCertificate = issueCertificate;
/**
 * Verifies a certificate by verification code.
 *
 * @param {string} verificationCode - Verification code
 * @returns {Promise<Certification>} Certificate details if valid
 */
const verifyCertificate = async (verificationCode) => {
    // Implementation would fetch from database
    return null;
};
exports.verifyCertificate = verifyCertificate;
/**
 * Revokes a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {string} userId - User revoking the certificate
 * @param {string} reason - Revocation reason
 * @returns {Promise<Certification>} Updated certificate
 */
const revokeCertificate = async (certificateId, userId, reason, transaction) => {
    return {
        id: certificateId,
        status: CertificationStatus.REVOKED,
        updatedAt: new Date(),
        metadata: {
            revokedDate: new Date().toISOString(),
            revokedBy: userId,
            revocationReason: reason,
        },
    };
};
exports.revokeCertificate = revokeCertificate;
/**
 * Renews a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {number} renewalMonths - Renewal period in months
 * @param {string} userId - User renewing the certificate
 * @returns {Promise<Certification>} Updated certificate
 */
const renewCertificate = async (certificateId, renewalMonths, userId, transaction) => {
    const newExpiryDate = new Date();
    newExpiryDate.setMonth(newExpiryDate.getMonth() + renewalMonths);
    return {
        id: certificateId,
        expiryDate: newExpiryDate,
        lastRenewalDate: new Date(),
        status: CertificationStatus.ACTIVE,
        updatedAt: new Date(),
        metadata: {
            renewalDate: new Date().toISOString(),
            renewedBy: userId,
        },
    };
};
exports.renewCertificate = renewCertificate;
/**
 * Gets user certificates.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Certification[]>} User certificates
 */
const getUserCertificates = async (userId, filters) => {
    // Implementation would fetch from database
    return [];
};
exports.getUserCertificates = getUserCertificates;
// ============================================================================
// ATTENDANCE & COMPLETION TRACKING (Functions 39-42)
// ============================================================================
/**
 * Records attendance for a training session.
 *
 * @param {object} attendanceData - Attendance data
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord>} Created attendance record
 */
const recordAttendance = async (attendanceData, recordedByUserId, transaction) => {
    const duration = attendanceData.checkInTime && attendanceData.checkOutTime
        ? Math.floor((attendanceData.checkOutTime.getTime() - attendanceData.checkInTime.getTime()) / (1000 * 60))
        : undefined;
    const attendance = {
        id: generateUUID(),
        sessionId: attendanceData.sessionId,
        enrollmentId: attendanceData.enrollmentId,
        userId: attendanceData.userId,
        status: attendanceData.status,
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        duration,
        notes: attendanceData.notes,
        recordedBy: recordedByUserId,
        metadata: {
            recordedDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return attendance;
};
exports.recordAttendance = recordAttendance;
/**
 * Bulk records attendance for multiple users.
 *
 * @param {string} sessionId - Session ID
 * @param {array} attendances - Attendance records
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord[]>} Created attendance records
 */
const bulkRecordAttendance = async (sessionId, attendances, recordedByUserId, transaction) => {
    const records = [];
    for (const attendance of attendances) {
        const record = await (0, exports.recordAttendance)({
            sessionId,
            ...attendance,
        }, recordedByUserId, transaction);
        records.push(record);
    }
    return records;
};
exports.bulkRecordAttendance = bulkRecordAttendance;
/**
 * Marks course enrollment as completed.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User marking completion
 * @param {object} completionData - Completion data
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
const markEnrollmentCompleted = async (enrollmentId, userId, completionData, transaction) => {
    return {
        id: enrollmentId,
        status: EnrollmentStatus.COMPLETED,
        completionDate: new Date(),
        progress: 100,
        bestScore: completionData.score,
        passingStatus: completionData.passed ? 'passed' : 'failed',
        certificateIssued: completionData.certificateIssued || false,
        certificateId: completionData.certificateId,
        completedBy: userId,
        updatedAt: new Date(),
    };
};
exports.markEnrollmentCompleted = markEnrollmentCompleted;
/**
 * Updates course progress for a user.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {number} progress - Progress percentage
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
const updateCourseProgress = async (enrollmentId, progress, transaction) => {
    const status = progress === 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.IN_PROGRESS;
    return {
        id: enrollmentId,
        progress,
        status,
        startDate: new Date(),
        updatedAt: new Date(),
    };
};
exports.updateCourseProgress = updateCourseProgress;
// ============================================================================
// ASSESSMENTS & QUIZZES (Functions 43-46)
// ============================================================================
/**
 * Creates a new assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating the assessment
 * @returns {Promise<Assessment>} Created assessment
 */
const createAssessment = async (assessmentData, userId, transaction) => {
    const assessmentCode = `ASMT-${Date.now().toString(36).toUpperCase()}`;
    const assessment = {
        id: generateUUID(),
        assessmentCode,
        assessmentName: assessmentData.assessmentName,
        description: assessmentData.description,
        courseId: assessmentData.courseId,
        type: assessmentData.type,
        totalQuestions: assessmentData.totalQuestions || 0,
        totalPoints: assessmentData.totalPoints || 0,
        passingScore: assessmentData.passingScore,
        duration: assessmentData.duration,
        maxAttempts: assessmentData.maxAttempts,
        randomizeQuestions: assessmentData.randomizeQuestions || false,
        showCorrectAnswers: assessmentData.showCorrectAnswers || true,
        showResultsImmediately: assessmentData.showResultsImmediately || true,
        allowReview: assessmentData.allowReview || true,
        questions: assessmentData.questions || [],
        metadata: {
            ...assessmentData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return assessment;
};
exports.createAssessment = createAssessment;
/**
 * Starts an assessment attempt.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User taking assessment
 * @param {string} enrollmentId - Enrollment ID
 * @returns {Promise<AssessmentAttempt>} Created attempt
 */
const startAssessmentAttempt = async (assessmentId, userId, enrollmentId, transaction) => {
    const attempt = {
        id: generateUUID(),
        assessmentId,
        userId,
        enrollmentId,
        attemptNumber: 1,
        startTime: new Date(),
        endTime: undefined,
        status: AssessmentStatus.IN_PROGRESS,
        score: undefined,
        percentage: undefined,
        passed: false,
        answers: [],
        timeTaken: undefined,
        metadata: {
            startedDate: new Date().toISOString(),
        },
        createdAt: new Date(),
    };
    return attempt;
};
exports.startAssessmentAttempt = startAssessmentAttempt;
/**
 * Submits an assessment attempt.
 *
 * @param {string} attemptId - Attempt ID
 * @param {array} answers - User answers
 * @returns {Promise<AssessmentAttempt>} Graded attempt
 */
const submitAssessmentAttempt = async (attemptId, answers, transaction) => {
    const endTime = new Date();
    // Implementation would calculate score and grade answers
    return {
        id: attemptId,
        endTime,
        status: AssessmentStatus.COMPLETED,
        answers: answers.map((a) => ({
            ...a,
            isCorrect: false, // Would be calculated
            pointsAwarded: 0, // Would be calculated
        })),
        score: 0, // Would be calculated
        percentage: 0, // Would be calculated
        passed: false, // Would be determined
    };
};
exports.submitAssessmentAttempt = submitAssessmentAttempt;
/**
 * Gets assessment attempts for a user.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User ID
 * @returns {Promise<AssessmentAttempt[]>} Assessment attempts
 */
const getUserAssessmentAttempts = async (assessmentId, userId) => {
    // Implementation would fetch from database
    return [];
};
exports.getUserAssessmentAttempts = getUserAssessmentAttempts;
// ============================================================================
// TRAINING FEEDBACK & EVALUATIONS (Functions 47-48)
// ============================================================================
/**
 * Submits training feedback.
 *
 * @param {object} feedbackData - Feedback data
 * @param {string} userId - User submitting feedback
 * @returns {Promise<TrainingFeedback>} Created feedback
 */
const submitTrainingFeedback = async (feedbackData, userId, transaction) => {
    const feedback = {
        id: generateUUID(),
        courseId: feedbackData.courseId,
        sessionId: feedbackData.sessionId,
        enrollmentId: feedbackData.enrollmentId,
        userId,
        rating: feedbackData.rating,
        contentRating: feedbackData.contentRating,
        instructorRating: feedbackData.instructorRating,
        facilityRating: feedbackData.facilityRating,
        relevanceRating: feedbackData.relevanceRating,
        comments: feedbackData.comments,
        wouldRecommend: feedbackData.wouldRecommend,
        strengths: feedbackData.strengths,
        improvements: feedbackData.improvements,
        submittedAt: new Date(),
        metadata: {
            submittedDate: new Date().toISOString(),
        },
        createdAt: new Date(),
    };
    return feedback;
};
exports.submitTrainingFeedback = submitTrainingFeedback;
/**
 * Gets course feedback summary.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Feedback summary
 */
const getCourseFeedbackSummary = async (courseId) => {
    return {
        totalResponses: 0,
        averageRating: 0,
        averageContentRating: 0,
        averageInstructorRating: 0,
        recommendationRate: 0,
        commonStrengths: [],
        commonImprovements: [],
    };
};
exports.getCourseFeedbackSummary = getCourseFeedbackSummary;
// ============================================================================
// LEARNING ANALYTICS & REPORTING (Functions 49-50)
// ============================================================================
/**
 * Gets comprehensive learning analytics.
 *
 * @param {object} filters - Analytics filters
 * @returns {Promise<LearningAnalytics>} Learning analytics
 */
const getLearningAnalytics = async (filters) => {
    const analytics = {
        organizationId: filters.organizationId,
        departmentId: filters.departmentId,
        period: {
            startDate: filters.startDate,
            endDate: filters.endDate,
        },
        totalEnrollments: 0,
        completedEnrollments: 0,
        inProgressEnrollments: 0,
        completionRate: 0,
        averageCompletionTime: 0,
        averageScore: 0,
        totalHoursLearned: 0,
        totalCertificatesIssued: 0,
        complianceRate: 0,
        topCourses: [],
        topPerformers: [],
        metadata: {},
    };
    return analytics;
};
exports.getLearningAnalytics = getLearningAnalytics;
/**
 * Generates learning transcript for a user.
 *
 * @param {string} userId - User ID
 * @param {object} options - Transcript options
 * @returns {Promise<object>} Learning transcript
 */
const generateLearningTranscript = async (userId, options) => {
    return {
        userId,
        userName: '',
        totalCoursesCompleted: 0,
        totalCreditsEarned: 0,
        totalHoursLearned: 0,
        certificates: [],
        courseHistory: [],
        generatedAt: new Date(),
    };
};
exports.generateLearningTranscript = generateLearningTranscript;
// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================
/**
 * Example NestJS Controller for Learning Management
 */
let LearningManagementController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Learning Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('learning')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createCourse_decorators;
    let _publishCourseEndpoint_decorators;
    let _enrollUser_decorators;
    let _createSession_decorators;
    let _recordSessionAttendance_decorators;
    let _issueCert_decorators;
    let _getAnalytics_decorators;
    let _getTranscript_decorators;
    var LearningManagementController = _classThis = class {
        async createCourse(dto) {
            return await (0, exports.createLearningCourse)(dto, 'system-user');
        }
        async publishCourseEndpoint(courseId) {
            return await (0, exports.publishCourse)(courseId, 'system-user');
        }
        async enrollUser(dto) {
            return await (0, exports.enrollUserInCourse)(dto, dto.enrolledBy);
        }
        async createSession(dto) {
            return await (0, exports.createTrainingSession)(dto, 'system-user');
        }
        async recordSessionAttendance(dto) {
            return await (0, exports.recordAttendance)(dto, 'system-user');
        }
        async issueCert(certData) {
            return await (0, exports.issueCertificate)(certData, 'system-user');
        }
        async getAnalytics(startDate, endDate) {
            return await (0, exports.getLearningAnalytics)({
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        async getTranscript(userId) {
            return await (0, exports.generateLearningTranscript)(userId);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "LearningManagementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createCourse_decorators = [(0, common_1.Post)('courses'), (0, swagger_1.ApiOperation)({ summary: 'Create a new learning course' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created successfully' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true }))];
        _publishCourseEndpoint_decorators = [(0, common_1.Post)('courses/:id/publish'), (0, swagger_1.ApiOperation)({ summary: 'Publish a course' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Course ID' })];
        _enrollUser_decorators = [(0, common_1.Post)('enrollments'), (0, swagger_1.ApiOperation)({ summary: 'Enroll user in course' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'User enrolled successfully' })];
        _createSession_decorators = [(0, common_1.Post)('sessions'), (0, swagger_1.ApiOperation)({ summary: 'Create training session' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created successfully' })];
        _recordSessionAttendance_decorators = [(0, common_1.Post)('attendance'), (0, swagger_1.ApiOperation)({ summary: 'Record attendance' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance recorded successfully' })];
        _issueCert_decorators = [(0, common_1.Post)('certificates'), (0, swagger_1.ApiOperation)({ summary: 'Issue certificate' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Certificate issued successfully' })];
        _getAnalytics_decorators = [(0, common_1.Get)('analytics'), (0, swagger_1.ApiOperation)({ summary: 'Get learning analytics' }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: true })];
        _getTranscript_decorators = [(0, common_1.Get)('users/:userId/transcript'), (0, swagger_1.ApiOperation)({ summary: 'Generate user learning transcript' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' })];
        __esDecorate(_classThis, null, _createCourse_decorators, { kind: "method", name: "createCourse", static: false, private: false, access: { has: obj => "createCourse" in obj, get: obj => obj.createCourse }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _publishCourseEndpoint_decorators, { kind: "method", name: "publishCourseEndpoint", static: false, private: false, access: { has: obj => "publishCourseEndpoint" in obj, get: obj => obj.publishCourseEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enrollUser_decorators, { kind: "method", name: "enrollUser", static: false, private: false, access: { has: obj => "enrollUser" in obj, get: obj => obj.enrollUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSession_decorators, { kind: "method", name: "createSession", static: false, private: false, access: { has: obj => "createSession" in obj, get: obj => obj.createSession }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordSessionAttendance_decorators, { kind: "method", name: "recordSessionAttendance", static: false, private: false, access: { has: obj => "recordSessionAttendance" in obj, get: obj => obj.recordSessionAttendance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _issueCert_decorators, { kind: "method", name: "issueCert", static: false, private: false, access: { has: obj => "issueCert" in obj, get: obj => obj.issueCert }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTranscript_decorators, { kind: "method", name: "getTranscript", static: false, private: false, access: { has: obj => "getTranscript" in obj, get: obj => obj.getTranscript }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LearningManagementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LearningManagementController = _classThis;
})();
exports.LearningManagementController = LearningManagementController;
//# sourceMappingURL=learning-management-kit.js.map