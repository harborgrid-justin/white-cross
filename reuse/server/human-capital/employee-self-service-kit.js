"use strict";
/**
 * LOC: HCMESS1234567
 * File: /reuse/server/human-capital/employee-self-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../file-storage-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Employee portal controllers
 *   - Mobile HR applications
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
exports.EmployeeSelfServiceController = exports.UploadDocumentDto = exports.TimesheetEntryDto = exports.CreateTimesheetDto = exports.EnrollLearningCourseDto = exports.GoalMilestoneDto = exports.CreateEmployeeGoalDto = exports.CompetencyRatingDto = exports.SubmitSelfAssessmentDto = exports.BenefitsDependentDto = exports.EnrollBenefitsDto = exports.CreateExpenseItemDto = exports.CreateExpenseReportDto = exports.CreateTimeOffRequestDto = exports.CreateEmergencyContactDto = exports.AddressDto = exports.UpdateEmployeeProfileDto = exports.TimesheetStatus = exports.DocumentSignatureStatus = exports.LearningEnrollmentStatus = exports.GoalStatus = exports.PerformanceReviewStatus = exports.BenefitsPlanType = exports.BenefitsEnrollmentStatus = exports.ExpenseCategory = exports.ExpenseStatus = exports.TimeOffType = exports.TimeOffStatus = exports.EmergencyContactRelationship = exports.Gender = exports.MaritalStatus = exports.EmployeeStatus = void 0;
exports.getEmployeeProfile = getEmployeeProfile;
exports.updateEmployeeProfile = updateEmployeeProfile;
exports.getEmployeeProfilePicture = getEmployeeProfilePicture;
exports.updateEmployeeProfilePicture = updateEmployeeProfilePicture;
exports.getEmployeeWorkHistory = getEmployeeWorkHistory;
exports.createEmergencyContact = createEmergencyContact;
exports.getEmergencyContacts = getEmergencyContacts;
exports.updateEmergencyContact = updateEmergencyContact;
exports.deleteEmergencyContact = deleteEmergencyContact;
exports.setPrimaryEmergencyContact = setPrimaryEmergencyContact;
exports.validateAddress = validateAddress;
exports.getEmployeePayslips = getEmployeePayslips;
exports.getPayslipById = getPayslipById;
exports.downloadPayslip = downloadPayslip;
exports.getEmployeeTaxDocuments = getEmployeeTaxDocuments;
exports.downloadTaxDocument = downloadTaxDocument;
exports.getYearToDateSummary = getYearToDateSummary;
exports.getEmployeeBenefitsEnrollments = getEmployeeBenefitsEnrollments;
exports.getAvailableBenefitsPlans = getAvailableBenefitsPlans;
exports.enrollInBenefitsPlan = enrollInBenefitsPlan;
exports.updateBenefitsEnrollment = updateBenefitsEnrollment;
exports.terminateBenefitsEnrollment = terminateBenefitsEnrollment;
exports.waiveBenefitsPlan = waiveBenefitsPlan;
exports.getBenefitsEnrollmentSummary = getBenefitsEnrollmentSummary;
exports.createTimeOffRequest = createTimeOffRequest;
exports.submitTimeOffRequest = submitTimeOffRequest;
exports.getEmployeeTimeOffRequests = getEmployeeTimeOffRequests;
exports.cancelTimeOffRequest = cancelTimeOffRequest;
exports.getEmployeeTimeOffBalances = getEmployeeTimeOffBalances;
exports.calculateAvailableTimeOff = calculateAvailableTimeOff;
exports.getTimeOffRequestHistory = getTimeOffRequestHistory;
exports.createTimesheet = createTimesheet;
exports.submitTimesheet = submitTimesheet;
exports.getEmployeeTimesheets = getEmployeeTimesheets;
exports.calculateTimesheetTotals = calculateTimesheetTotals;
exports.createExpenseReport = createExpenseReport;
exports.addExpenseItem = addExpenseItem;
exports.submitExpenseReport = submitExpenseReport;
exports.getEmployeeExpenseReports = getEmployeeExpenseReports;
exports.calculateExpenseReportTotal = calculateExpenseReportTotal;
exports.getEmployeeSelfAssessments = getEmployeeSelfAssessments;
exports.createSelfAssessment = createSelfAssessment;
exports.submitSelfAssessment = submitSelfAssessment;
exports.updateCompetencyRating = updateCompetencyRating;
exports.calculateAverageSelfRating = calculateAverageSelfRating;
exports.createEmployeeGoal = createEmployeeGoal;
exports.getEmployeeGoals = getEmployeeGoals;
exports.updateGoalProgress = updateGoalProgress;
exports.completeMilestone = completeMilestone;
exports.completeGoal = completeGoal;
exports.getAvailableLearningCourses = getAvailableLearningCourses;
exports.enrollInLearningCourse = enrollInLearningCourse;
exports.getEmployeeLearningEnrollments = getEmployeeLearningEnrollments;
exports.updateLearningCourseProgress = updateLearningCourseProgress;
exports.getEmployeeDocuments = getEmployeeDocuments;
exports.uploadEmployeeDocument = uploadEmployeeDocument;
exports.signDocument = signDocument;
exports.getDocumentsRequiringSignature = getDocumentsRequiringSignature;
exports.declineDocumentSignature = declineDocumentSignature;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Employee profile status
 */
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "active";
    EmployeeStatus["INACTIVE"] = "inactive";
    EmployeeStatus["ON_LEAVE"] = "on_leave";
    EmployeeStatus["TERMINATED"] = "terminated";
    EmployeeStatus["SUSPENDED"] = "suspended";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
/**
 * Marital status options
 */
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
    MaritalStatus["SEPARATED"] = "separated";
    MaritalStatus["DOMESTIC_PARTNER"] = "domestic_partner";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
/**
 * Gender options
 */
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["NON_BINARY"] = "non_binary";
    Gender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
/**
 * Emergency contact relationship
 */
var EmergencyContactRelationship;
(function (EmergencyContactRelationship) {
    EmergencyContactRelationship["SPOUSE"] = "spouse";
    EmergencyContactRelationship["PARENT"] = "parent";
    EmergencyContactRelationship["CHILD"] = "child";
    EmergencyContactRelationship["SIBLING"] = "sibling";
    EmergencyContactRelationship["FRIEND"] = "friend";
    EmergencyContactRelationship["OTHER"] = "other";
})(EmergencyContactRelationship || (exports.EmergencyContactRelationship = EmergencyContactRelationship = {}));
/**
 * Time off request status
 */
var TimeOffStatus;
(function (TimeOffStatus) {
    TimeOffStatus["DRAFT"] = "draft";
    TimeOffStatus["SUBMITTED"] = "submitted";
    TimeOffStatus["PENDING_APPROVAL"] = "pending_approval";
    TimeOffStatus["APPROVED"] = "approved";
    TimeOffStatus["REJECTED"] = "rejected";
    TimeOffStatus["CANCELLED"] = "cancelled";
    TimeOffStatus["WITHDRAWN"] = "withdrawn";
})(TimeOffStatus || (exports.TimeOffStatus = TimeOffStatus = {}));
/**
 * Time off types
 */
var TimeOffType;
(function (TimeOffType) {
    TimeOffType["VACATION"] = "vacation";
    TimeOffType["SICK_LEAVE"] = "sick_leave";
    TimeOffType["PERSONAL"] = "personal";
    TimeOffType["BEREAVEMENT"] = "bereavement";
    TimeOffType["JURY_DUTY"] = "jury_duty";
    TimeOffType["MATERNITY"] = "maternity";
    TimeOffType["PATERNITY"] = "paternity";
    TimeOffType["PARENTAL"] = "parental";
    TimeOffType["MILITARY"] = "military";
    TimeOffType["UNPAID"] = "unpaid";
    TimeOffType["SABBATICAL"] = "sabbatical";
    TimeOffType["COMPENSATORY"] = "compensatory";
})(TimeOffType || (exports.TimeOffType = TimeOffType = {}));
/**
 * Expense status
 */
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["DRAFT"] = "draft";
    ExpenseStatus["SUBMITTED"] = "submitted";
    ExpenseStatus["PENDING_APPROVAL"] = "pending_approval";
    ExpenseStatus["APPROVED"] = "approved";
    ExpenseStatus["REJECTED"] = "rejected";
    ExpenseStatus["PAID"] = "paid";
    ExpenseStatus["CANCELLED"] = "cancelled";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
/**
 * Expense categories
 */
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["TRAVEL"] = "travel";
    ExpenseCategory["MEALS"] = "meals";
    ExpenseCategory["LODGING"] = "lodging";
    ExpenseCategory["TRANSPORTATION"] = "transportation";
    ExpenseCategory["ENTERTAINMENT"] = "entertainment";
    ExpenseCategory["OFFICE_SUPPLIES"] = "office_supplies";
    ExpenseCategory["TRAINING"] = "training";
    ExpenseCategory["EQUIPMENT"] = "equipment";
    ExpenseCategory["OTHER"] = "other";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
/**
 * Benefits enrollment status
 */
var BenefitsEnrollmentStatus;
(function (BenefitsEnrollmentStatus) {
    BenefitsEnrollmentStatus["NOT_ENROLLED"] = "not_enrolled";
    BenefitsEnrollmentStatus["PENDING"] = "pending";
    BenefitsEnrollmentStatus["ENROLLED"] = "enrolled";
    BenefitsEnrollmentStatus["WAIVED"] = "waived";
    BenefitsEnrollmentStatus["TERMINATED"] = "terminated";
})(BenefitsEnrollmentStatus || (exports.BenefitsEnrollmentStatus = BenefitsEnrollmentStatus = {}));
/**
 * Benefits plan types
 */
var BenefitsPlanType;
(function (BenefitsPlanType) {
    BenefitsPlanType["HEALTH_INSURANCE"] = "health_insurance";
    BenefitsPlanType["DENTAL_INSURANCE"] = "dental_insurance";
    BenefitsPlanType["VISION_INSURANCE"] = "vision_insurance";
    BenefitsPlanType["LIFE_INSURANCE"] = "life_insurance";
    BenefitsPlanType["DISABILITY_INSURANCE"] = "disability_insurance";
    BenefitsPlanType["RETIREMENT_401K"] = "retirement_401k";
    BenefitsPlanType["HSA"] = "hsa";
    BenefitsPlanType["FSA"] = "fsa";
    BenefitsPlanType["COMMUTER"] = "commuter";
    BenefitsPlanType["WELLNESS"] = "wellness";
})(BenefitsPlanType || (exports.BenefitsPlanType = BenefitsPlanType = {}));
/**
 * Performance review status
 */
var PerformanceReviewStatus;
(function (PerformanceReviewStatus) {
    PerformanceReviewStatus["NOT_STARTED"] = "not_started";
    PerformanceReviewStatus["IN_PROGRESS"] = "in_progress";
    PerformanceReviewStatus["SUBMITTED"] = "submitted";
    PerformanceReviewStatus["MANAGER_REVIEW"] = "manager_review";
    PerformanceReviewStatus["CALIBRATION"] = "calibration";
    PerformanceReviewStatus["COMPLETED"] = "completed";
    PerformanceReviewStatus["CLOSED"] = "closed";
})(PerformanceReviewStatus || (exports.PerformanceReviewStatus = PerformanceReviewStatus = {}));
/**
 * Goal status
 */
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DRAFT"] = "draft";
    GoalStatus["ACTIVE"] = "active";
    GoalStatus["ON_TRACK"] = "on_track";
    GoalStatus["AT_RISK"] = "at_risk";
    GoalStatus["BEHIND"] = "behind";
    GoalStatus["COMPLETED"] = "completed";
    GoalStatus["CANCELLED"] = "cancelled";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
/**
 * Learning enrollment status
 */
var LearningEnrollmentStatus;
(function (LearningEnrollmentStatus) {
    LearningEnrollmentStatus["NOT_STARTED"] = "not_started";
    LearningEnrollmentStatus["IN_PROGRESS"] = "in_progress";
    LearningEnrollmentStatus["COMPLETED"] = "completed";
    LearningEnrollmentStatus["FAILED"] = "failed";
    LearningEnrollmentStatus["WITHDRAWN"] = "withdrawn";
    LearningEnrollmentStatus["EXPIRED"] = "expired";
})(LearningEnrollmentStatus || (exports.LearningEnrollmentStatus = LearningEnrollmentStatus = {}));
/**
 * Document signature status
 */
var DocumentSignatureStatus;
(function (DocumentSignatureStatus) {
    DocumentSignatureStatus["PENDING"] = "pending";
    DocumentSignatureStatus["SIGNED"] = "signed";
    DocumentSignatureStatus["DECLINED"] = "declined";
    DocumentSignatureStatus["EXPIRED"] = "expired";
})(DocumentSignatureStatus || (exports.DocumentSignatureStatus = DocumentSignatureStatus = {}));
/**
 * Timesheet status
 */
var TimesheetStatus;
(function (TimesheetStatus) {
    TimesheetStatus["DRAFT"] = "draft";
    TimesheetStatus["SUBMITTED"] = "submitted";
    TimesheetStatus["APPROVED"] = "approved";
    TimesheetStatus["REJECTED"] = "rejected";
    TimesheetStatus["PAID"] = "paid";
})(TimesheetStatus || (exports.TimesheetStatus = TimesheetStatus = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * DTO for updating employee profile
 */
let UpdateEmployeeProfileDto = (() => {
    var _a;
    let _preferredName_decorators;
    let _preferredName_initializers = [];
    let _preferredName_extraInitializers = [];
    let _personalEmail_decorators;
    let _personalEmail_initializers = [];
    let _personalEmail_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _mobilePhone_decorators;
    let _mobilePhone_initializers = [];
    let _mobilePhone_extraInitializers = [];
    let _maritalStatus_decorators;
    let _maritalStatus_initializers = [];
    let _maritalStatus_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _biography_decorators;
    let _biography_initializers = [];
    let _biography_extraInitializers = [];
    let _skills_decorators;
    let _skills_initializers = [];
    let _skills_extraInitializers = [];
    let _languages_decorators;
    let _languages_initializers = [];
    let _languages_extraInitializers = [];
    return _a = class UpdateEmployeeProfileDto {
            constructor() {
                this.preferredName = __runInitializers(this, _preferredName_initializers, void 0);
                this.personalEmail = (__runInitializers(this, _preferredName_extraInitializers), __runInitializers(this, _personalEmail_initializers, void 0));
                this.phone = (__runInitializers(this, _personalEmail_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.mobilePhone = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _mobilePhone_initializers, void 0));
                this.maritalStatus = (__runInitializers(this, _mobilePhone_extraInitializers), __runInitializers(this, _maritalStatus_initializers, void 0));
                this.address = (__runInitializers(this, _maritalStatus_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.biography = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _biography_initializers, void 0));
                this.skills = (__runInitializers(this, _biography_extraInitializers), __runInitializers(this, _skills_initializers, void 0));
                this.languages = (__runInitializers(this, _skills_extraInitializers), __runInitializers(this, _languages_initializers, void 0));
                __runInitializers(this, _languages_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _preferredName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _personalEmail_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsPhoneNumber)()];
            _mobilePhone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsPhoneNumber)()];
            _maritalStatus_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(MaritalStatus)];
            _address_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => AddressDto)];
            _biography_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _skills_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _languages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _preferredName_decorators, { kind: "field", name: "preferredName", static: false, private: false, access: { has: obj => "preferredName" in obj, get: obj => obj.preferredName, set: (obj, value) => { obj.preferredName = value; } }, metadata: _metadata }, _preferredName_initializers, _preferredName_extraInitializers);
            __esDecorate(null, null, _personalEmail_decorators, { kind: "field", name: "personalEmail", static: false, private: false, access: { has: obj => "personalEmail" in obj, get: obj => obj.personalEmail, set: (obj, value) => { obj.personalEmail = value; } }, metadata: _metadata }, _personalEmail_initializers, _personalEmail_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _mobilePhone_decorators, { kind: "field", name: "mobilePhone", static: false, private: false, access: { has: obj => "mobilePhone" in obj, get: obj => obj.mobilePhone, set: (obj, value) => { obj.mobilePhone = value; } }, metadata: _metadata }, _mobilePhone_initializers, _mobilePhone_extraInitializers);
            __esDecorate(null, null, _maritalStatus_decorators, { kind: "field", name: "maritalStatus", static: false, private: false, access: { has: obj => "maritalStatus" in obj, get: obj => obj.maritalStatus, set: (obj, value) => { obj.maritalStatus = value; } }, metadata: _metadata }, _maritalStatus_initializers, _maritalStatus_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _biography_decorators, { kind: "field", name: "biography", static: false, private: false, access: { has: obj => "biography" in obj, get: obj => obj.biography, set: (obj, value) => { obj.biography = value; } }, metadata: _metadata }, _biography_initializers, _biography_extraInitializers);
            __esDecorate(null, null, _skills_decorators, { kind: "field", name: "skills", static: false, private: false, access: { has: obj => "skills" in obj, get: obj => obj.skills, set: (obj, value) => { obj.skills = value; } }, metadata: _metadata }, _skills_initializers, _skills_extraInitializers);
            __esDecorate(null, null, _languages_decorators, { kind: "field", name: "languages", static: false, private: false, access: { has: obj => "languages" in obj, get: obj => obj.languages, set: (obj, value) => { obj.languages = value; } }, metadata: _metadata }, _languages_initializers, _languages_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateEmployeeProfileDto = UpdateEmployeeProfileDto;
/**
 * DTO for address
 */
let AddressDto = (() => {
    var _a;
    let _street1_decorators;
    let _street1_initializers = [];
    let _street1_extraInitializers = [];
    let _street2_decorators;
    let _street2_initializers = [];
    let _street2_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    return _a = class AddressDto {
            constructor() {
                this.street1 = __runInitializers(this, _street1_initializers, void 0);
                this.street2 = (__runInitializers(this, _street1_extraInitializers), __runInitializers(this, _street2_initializers, void 0));
                this.city = (__runInitializers(this, _street2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                __runInitializers(this, _country_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _street1_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _street2_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _city_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _postalCode_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(20)];
            _country_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            __esDecorate(null, null, _street1_decorators, { kind: "field", name: "street1", static: false, private: false, access: { has: obj => "street1" in obj, get: obj => obj.street1, set: (obj, value) => { obj.street1 = value; } }, metadata: _metadata }, _street1_initializers, _street1_extraInitializers);
            __esDecorate(null, null, _street2_decorators, { kind: "field", name: "street2", static: false, private: false, access: { has: obj => "street2" in obj, get: obj => obj.street2, set: (obj, value) => { obj.street2 = value; } }, metadata: _metadata }, _street2_initializers, _street2_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddressDto = AddressDto;
/**
 * DTO for creating emergency contact
 */
let CreateEmergencyContactDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _relationship_decorators;
    let _relationship_initializers = [];
    let _relationship_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _alternatePhone_decorators;
    let _alternatePhone_initializers = [];
    let _alternatePhone_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _isPrimary_decorators;
    let _isPrimary_initializers = [];
    let _isPrimary_extraInitializers = [];
    return _a = class CreateEmergencyContactDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.relationship = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _relationship_initializers, void 0));
                this.phone = (__runInitializers(this, _relationship_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.alternatePhone = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _alternatePhone_initializers, void 0));
                this.email = (__runInitializers(this, _alternatePhone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.address = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.isPrimary = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _isPrimary_initializers, void 0));
                __runInitializers(this, _isPrimary_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _relationship_decorators = [(0, class_validator_1.IsEnum)(EmergencyContactRelationship)];
            _phone_decorators = [(0, class_validator_1.IsPhoneNumber)()];
            _alternatePhone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsPhoneNumber)()];
            _email_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _address_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => AddressDto)];
            _isPrimary_decorators = [(0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _relationship_decorators, { kind: "field", name: "relationship", static: false, private: false, access: { has: obj => "relationship" in obj, get: obj => obj.relationship, set: (obj, value) => { obj.relationship = value; } }, metadata: _metadata }, _relationship_initializers, _relationship_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _alternatePhone_decorators, { kind: "field", name: "alternatePhone", static: false, private: false, access: { has: obj => "alternatePhone" in obj, get: obj => obj.alternatePhone, set: (obj, value) => { obj.alternatePhone = value; } }, metadata: _metadata }, _alternatePhone_initializers, _alternatePhone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _isPrimary_decorators, { kind: "field", name: "isPrimary", static: false, private: false, access: { has: obj => "isPrimary" in obj, get: obj => obj.isPrimary, set: (obj, value) => { obj.isPrimary = value; } }, metadata: _metadata }, _isPrimary_initializers, _isPrimary_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEmergencyContactDto = CreateEmergencyContactDto;
/**
 * DTO for creating time off request
 */
let CreateTimeOffRequestDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    return _a = class CreateTimeOffRequestDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.startDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.reason = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.attachments = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, class_validator_1.IsEnum)(TimeOffType)];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _attachments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTimeOffRequestDto = CreateTimeOffRequestDto;
/**
 * DTO for creating expense report
 */
let CreateExpenseReportDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateExpenseReportDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.currency = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _currency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(3)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpenseReportDto = CreateExpenseReportDto;
/**
 * DTO for creating expense item
 */
let CreateExpenseItemDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _merchant_decorators;
    let _merchant_initializers = [];
    let _merchant_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _receiptUrl_decorators;
    let _receiptUrl_initializers = [];
    let _receiptUrl_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    let _projectCode_decorators;
    let _projectCode_initializers = [];
    let _projectCode_extraInitializers = [];
    return _a = class CreateExpenseItemDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.date = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.merchant = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _merchant_initializers, void 0));
                this.description = (__runInitializers(this, _merchant_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.receiptUrl = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _receiptUrl_initializers, void 0));
                this.billable = (__runInitializers(this, _receiptUrl_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
                this.projectCode = (__runInitializers(this, _billable_extraInitializers), __runInitializers(this, _projectCode_initializers, void 0));
                __runInitializers(this, _projectCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, class_validator_1.IsEnum)(ExpenseCategory)];
            _date_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _merchant_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _amount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            _receiptUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _billable_decorators = [(0, class_validator_1.IsBoolean)()];
            _projectCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _merchant_decorators, { kind: "field", name: "merchant", static: false, private: false, access: { has: obj => "merchant" in obj, get: obj => obj.merchant, set: (obj, value) => { obj.merchant = value; } }, metadata: _metadata }, _merchant_initializers, _merchant_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _receiptUrl_decorators, { kind: "field", name: "receiptUrl", static: false, private: false, access: { has: obj => "receiptUrl" in obj, get: obj => obj.receiptUrl, set: (obj, value) => { obj.receiptUrl = value; } }, metadata: _metadata }, _receiptUrl_initializers, _receiptUrl_extraInitializers);
            __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
            __esDecorate(null, null, _projectCode_decorators, { kind: "field", name: "projectCode", static: false, private: false, access: { has: obj => "projectCode" in obj, get: obj => obj.projectCode, set: (obj, value) => { obj.projectCode = value; } }, metadata: _metadata }, _projectCode_initializers, _projectCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExpenseItemDto = CreateExpenseItemDto;
/**
 * DTO for benefits enrollment
 */
let EnrollBenefitsDto = (() => {
    var _a;
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _planType_decorators;
    let _planType_initializers = [];
    let _planType_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _coverageLevel_decorators;
    let _coverageLevel_initializers = [];
    let _coverageLevel_extraInitializers = [];
    let _dependents_decorators;
    let _dependents_initializers = [];
    let _dependents_extraInitializers = [];
    return _a = class EnrollBenefitsDto {
            constructor() {
                this.planId = __runInitializers(this, _planId_initializers, void 0);
                this.planType = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _planType_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _planType_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.coverageLevel = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _coverageLevel_initializers, void 0));
                this.dependents = (__runInitializers(this, _coverageLevel_extraInitializers), __runInitializers(this, _dependents_initializers, void 0));
                __runInitializers(this, _dependents_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _planId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _planType_decorators = [(0, class_validator_1.IsEnum)(BenefitsPlanType)];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _coverageLevel_decorators = [(0, class_validator_1.IsEnum)(['employee', 'employee_spouse', 'employee_children', 'family'])];
            _dependents_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => BenefitsDependentDto)];
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _planType_decorators, { kind: "field", name: "planType", static: false, private: false, access: { has: obj => "planType" in obj, get: obj => obj.planType, set: (obj, value) => { obj.planType = value; } }, metadata: _metadata }, _planType_initializers, _planType_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _coverageLevel_decorators, { kind: "field", name: "coverageLevel", static: false, private: false, access: { has: obj => "coverageLevel" in obj, get: obj => obj.coverageLevel, set: (obj, value) => { obj.coverageLevel = value; } }, metadata: _metadata }, _coverageLevel_initializers, _coverageLevel_extraInitializers);
            __esDecorate(null, null, _dependents_decorators, { kind: "field", name: "dependents", static: false, private: false, access: { has: obj => "dependents" in obj, get: obj => obj.dependents, set: (obj, value) => { obj.dependents = value; } }, metadata: _metadata }, _dependents_initializers, _dependents_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EnrollBenefitsDto = EnrollBenefitsDto;
/**
 * DTO for benefits dependent
 */
let BenefitsDependentDto = (() => {
    var _a;
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _relationship_decorators;
    let _relationship_initializers = [];
    let _relationship_extraInitializers = [];
    return _a = class BenefitsDependentDto {
            constructor() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.dateOfBirth = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
                this.relationship = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _relationship_initializers, void 0));
                __runInitializers(this, _relationship_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _lastName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _dateOfBirth_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _relationship_decorators = [(0, class_validator_1.IsEnum)(['spouse', 'child', 'domestic_partner'])];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
            __esDecorate(null, null, _relationship_decorators, { kind: "field", name: "relationship", static: false, private: false, access: { has: obj => "relationship" in obj, get: obj => obj.relationship, set: (obj, value) => { obj.relationship = value; } }, metadata: _metadata }, _relationship_initializers, _relationship_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BenefitsDependentDto = BenefitsDependentDto;
/**
 * DTO for performance self-assessment
 */
let SubmitSelfAssessmentDto = (() => {
    var _a;
    let _achievements_decorators;
    let _achievements_initializers = [];
    let _achievements_extraInitializers = [];
    let _challenges_decorators;
    let _challenges_initializers = [];
    let _challenges_extraInitializers = [];
    let _developmentAreas_decorators;
    let _developmentAreas_initializers = [];
    let _developmentAreas_extraInitializers = [];
    let _careerGoals_decorators;
    let _careerGoals_initializers = [];
    let _careerGoals_extraInitializers = [];
    let _competencyRatings_decorators;
    let _competencyRatings_initializers = [];
    let _competencyRatings_extraInitializers = [];
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    return _a = class SubmitSelfAssessmentDto {
            constructor() {
                this.achievements = __runInitializers(this, _achievements_initializers, void 0);
                this.challenges = (__runInitializers(this, _achievements_extraInitializers), __runInitializers(this, _challenges_initializers, void 0));
                this.developmentAreas = (__runInitializers(this, _challenges_extraInitializers), __runInitializers(this, _developmentAreas_initializers, void 0));
                this.careerGoals = (__runInitializers(this, _developmentAreas_extraInitializers), __runInitializers(this, _careerGoals_initializers, void 0));
                this.competencyRatings = (__runInitializers(this, _careerGoals_extraInitializers), __runInitializers(this, _competencyRatings_initializers, void 0));
                this.overallRating = (__runInitializers(this, _competencyRatings_extraInitializers), __runInitializers(this, _overallRating_initializers, void 0));
                __runInitializers(this, _overallRating_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _achievements_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _challenges_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _developmentAreas_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _careerGoals_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _competencyRatings_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => CompetencyRatingDto)];
            _overallRating_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            __esDecorate(null, null, _achievements_decorators, { kind: "field", name: "achievements", static: false, private: false, access: { has: obj => "achievements" in obj, get: obj => obj.achievements, set: (obj, value) => { obj.achievements = value; } }, metadata: _metadata }, _achievements_initializers, _achievements_extraInitializers);
            __esDecorate(null, null, _challenges_decorators, { kind: "field", name: "challenges", static: false, private: false, access: { has: obj => "challenges" in obj, get: obj => obj.challenges, set: (obj, value) => { obj.challenges = value; } }, metadata: _metadata }, _challenges_initializers, _challenges_extraInitializers);
            __esDecorate(null, null, _developmentAreas_decorators, { kind: "field", name: "developmentAreas", static: false, private: false, access: { has: obj => "developmentAreas" in obj, get: obj => obj.developmentAreas, set: (obj, value) => { obj.developmentAreas = value; } }, metadata: _metadata }, _developmentAreas_initializers, _developmentAreas_extraInitializers);
            __esDecorate(null, null, _careerGoals_decorators, { kind: "field", name: "careerGoals", static: false, private: false, access: { has: obj => "careerGoals" in obj, get: obj => obj.careerGoals, set: (obj, value) => { obj.careerGoals = value; } }, metadata: _metadata }, _careerGoals_initializers, _careerGoals_extraInitializers);
            __esDecorate(null, null, _competencyRatings_decorators, { kind: "field", name: "competencyRatings", static: false, private: false, access: { has: obj => "competencyRatings" in obj, get: obj => obj.competencyRatings, set: (obj, value) => { obj.competencyRatings = value; } }, metadata: _metadata }, _competencyRatings_initializers, _competencyRatings_extraInitializers);
            __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitSelfAssessmentDto = SubmitSelfAssessmentDto;
/**
 * DTO for competency rating
 */
let CompetencyRatingDto = (() => {
    var _a;
    let _competencyName_decorators;
    let _competencyName_initializers = [];
    let _competencyName_extraInitializers = [];
    let _selfRating_decorators;
    let _selfRating_initializers = [];
    let _selfRating_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class CompetencyRatingDto {
            constructor() {
                this.competencyName = __runInitializers(this, _competencyName_initializers, void 0);
                this.selfRating = (__runInitializers(this, _competencyName_extraInitializers), __runInitializers(this, _selfRating_initializers, void 0));
                this.comments = (__runInitializers(this, _selfRating_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _competencyName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _selfRating_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _comments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _competencyName_decorators, { kind: "field", name: "competencyName", static: false, private: false, access: { has: obj => "competencyName" in obj, get: obj => obj.competencyName, set: (obj, value) => { obj.competencyName = value; } }, metadata: _metadata }, _competencyName_initializers, _competencyName_extraInitializers);
            __esDecorate(null, null, _selfRating_decorators, { kind: "field", name: "selfRating", static: false, private: false, access: { has: obj => "selfRating" in obj, get: obj => obj.selfRating, set: (obj, value) => { obj.selfRating = value; } }, metadata: _metadata }, _selfRating_initializers, _selfRating_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CompetencyRatingDto = CompetencyRatingDto;
/**
 * DTO for creating employee goal
 */
let CreateEmployeeGoalDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    let _milestones_decorators;
    let _milestones_initializers = [];
    let _milestones_extraInitializers = [];
    return _a = class CreateEmployeeGoalDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.startDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.targetDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.metrics = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
                this.milestones = (__runInitializers(this, _metrics_extraInitializers), __runInitializers(this, _milestones_initializers, void 0));
                __runInitializers(this, _milestones_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _category_decorators = [(0, class_validator_1.IsEnum)(['performance', 'development', 'project', 'stretch'])];
            _priority_decorators = [(0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'])];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _targetDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metrics_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _milestones_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => GoalMilestoneDto)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
            __esDecorate(null, null, _milestones_decorators, { kind: "field", name: "milestones", static: false, private: false, access: { has: obj => "milestones" in obj, get: obj => obj.milestones, set: (obj, value) => { obj.milestones = value; } }, metadata: _metadata }, _milestones_initializers, _milestones_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEmployeeGoalDto = CreateEmployeeGoalDto;
/**
 * DTO for goal milestone
 */
let GoalMilestoneDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    return _a = class GoalMilestoneDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.targetDate = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                __runInitializers(this, _targetDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _targetDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GoalMilestoneDto = GoalMilestoneDto;
/**
 * DTO for enrolling in learning course
 */
let EnrollLearningCourseDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    return _a = class EnrollLearningCourseDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.startDate = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                __runInitializers(this, _startDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _startDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EnrollLearningCourseDto = EnrollLearningCourseDto;
/**
 * DTO for creating timesheet
 */
let CreateTimesheetDto = (() => {
    var _a;
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _entries_decorators;
    let _entries_initializers = [];
    let _entries_extraInitializers = [];
    return _a = class CreateTimesheetDto {
            constructor() {
                this.periodStart = __runInitializers(this, _periodStart_initializers, void 0);
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.entries = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _entries_initializers, void 0));
                __runInitializers(this, _entries_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _periodStart_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _periodEnd_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _entries_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => TimesheetEntryDto)];
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _entries_decorators, { kind: "field", name: "entries", static: false, private: false, access: { has: obj => "entries" in obj, get: obj => obj.entries, set: (obj, value) => { obj.entries = value; } }, metadata: _metadata }, _entries_initializers, _entries_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTimesheetDto = CreateTimesheetDto;
/**
 * DTO for timesheet entry
 */
let TimesheetEntryDto = (() => {
    var _a;
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _projectCode_decorators;
    let _projectCode_initializers = [];
    let _projectCode_extraInitializers = [];
    let _taskCode_decorators;
    let _taskCode_initializers = [];
    let _taskCode_extraInitializers = [];
    let _hours_decorators;
    let _hours_initializers = [];
    let _hours_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isBillable_decorators;
    let _isBillable_initializers = [];
    let _isBillable_extraInitializers = [];
    let _isOvertime_decorators;
    let _isOvertime_initializers = [];
    let _isOvertime_extraInitializers = [];
    return _a = class TimesheetEntryDto {
            constructor() {
                this.date = __runInitializers(this, _date_initializers, void 0);
                this.projectCode = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _projectCode_initializers, void 0));
                this.taskCode = (__runInitializers(this, _projectCode_extraInitializers), __runInitializers(this, _taskCode_initializers, void 0));
                this.hours = (__runInitializers(this, _taskCode_extraInitializers), __runInitializers(this, _hours_initializers, void 0));
                this.description = (__runInitializers(this, _hours_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isBillable = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isBillable_initializers, void 0));
                this.isOvertime = (__runInitializers(this, _isBillable_extraInitializers), __runInitializers(this, _isOvertime_initializers, void 0));
                __runInitializers(this, _isOvertime_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _projectCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _taskCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _hours_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(24)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _isBillable_decorators = [(0, class_validator_1.IsBoolean)()];
            _isOvertime_decorators = [(0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _projectCode_decorators, { kind: "field", name: "projectCode", static: false, private: false, access: { has: obj => "projectCode" in obj, get: obj => obj.projectCode, set: (obj, value) => { obj.projectCode = value; } }, metadata: _metadata }, _projectCode_initializers, _projectCode_extraInitializers);
            __esDecorate(null, null, _taskCode_decorators, { kind: "field", name: "taskCode", static: false, private: false, access: { has: obj => "taskCode" in obj, get: obj => obj.taskCode, set: (obj, value) => { obj.taskCode = value; } }, metadata: _metadata }, _taskCode_initializers, _taskCode_extraInitializers);
            __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: obj => "hours" in obj, get: obj => obj.hours, set: (obj, value) => { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isBillable_decorators, { kind: "field", name: "isBillable", static: false, private: false, access: { has: obj => "isBillable" in obj, get: obj => obj.isBillable, set: (obj, value) => { obj.isBillable = value; } }, metadata: _metadata }, _isBillable_initializers, _isBillable_extraInitializers);
            __esDecorate(null, null, _isOvertime_decorators, { kind: "field", name: "isOvertime", static: false, private: false, access: { has: obj => "isOvertime" in obj, get: obj => obj.isOvertime, set: (obj, value) => { obj.isOvertime = value; } }, metadata: _metadata }, _isOvertime_initializers, _isOvertime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TimesheetEntryDto = TimesheetEntryDto;
/**
 * DTO for uploading document
 */
let UploadDocumentDto = (() => {
    var _a;
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _requiresSignature_decorators;
    let _requiresSignature_initializers = [];
    let _requiresSignature_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class UploadDocumentDto {
            constructor() {
                this.documentType = __runInitializers(this, _documentType_initializers, void 0);
                this.category = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.requiresSignature = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _requiresSignature_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _requiresSignature_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _documentType_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _category_decorators = [(0, class_validator_1.IsEnum)(['personal', 'employment', 'benefits', 'performance', 'compliance', 'other'])];
            _requiresSignature_decorators = [(0, class_validator_1.IsBoolean)()];
            _expirationDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _requiresSignature_decorators, { kind: "field", name: "requiresSignature", static: false, private: false, access: { has: obj => "requiresSignature" in obj, get: obj => obj.requiresSignature, set: (obj, value) => { obj.requiresSignature = value; } }, metadata: _metadata }, _requiresSignature_initializers, _requiresSignature_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UploadDocumentDto = UploadDocumentDto;
// ============================================================================
// EMPLOYEE PROFILE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Gets employee profile by ID
 *
 * @param employeeId - Employee identifier
 * @returns Employee profile
 *
 * @example
 * ```typescript
 * const profile = await getEmployeeProfile('emp-123');
 * console.log(profile.firstName, profile.lastName);
 * ```
 */
async function getEmployeeProfile(employeeId) {
    // In production, fetch from database
    return {
        id: faker_1.faker.string.uuid(),
        employeeId,
        userId: faker_1.faker.string.uuid(),
        firstName: faker_1.faker.person.firstName(),
        lastName: faker_1.faker.person.lastName(),
        email: faker_1.faker.internet.email(),
        status: EmployeeStatus.ACTIVE,
        hireDate: faker_1.faker.date.past(),
        department: faker_1.faker.commerce.department(),
        jobTitle: faker_1.faker.person.jobTitle(),
        location: faker_1.faker.location.city(),
        employmentType: 'full_time',
        emergencyContacts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Updates employee profile
 *
 * @param employeeId - Employee identifier
 * @param updates - Profile updates
 * @returns Updated profile
 *
 * @example
 * ```typescript
 * const updated = await updateEmployeeProfile('emp-123', {
 *   preferredName: 'Mike',
 *   mobilePhone: '+1-555-0100'
 * });
 * ```
 */
async function updateEmployeeProfile(employeeId, updates) {
    // In production, update in database
    await logAuditTrail(employeeId, 'update_profile', updates);
    const profile = await getEmployeeProfile(employeeId);
    return { ...profile, ...updates, updatedAt: new Date() };
}
/**
 * Gets employee profile picture URL
 *
 * @param employeeId - Employee identifier
 * @returns Profile picture URL
 *
 * @example
 * ```typescript
 * const pictureUrl = await getEmployeeProfilePicture('emp-123');
 * ```
 */
async function getEmployeeProfilePicture(employeeId) {
    const profile = await getEmployeeProfile(employeeId);
    return profile.profilePictureUrl || null;
}
/**
 * Updates employee profile picture
 *
 * @param employeeId - Employee identifier
 * @param fileUrl - New profile picture URL
 * @returns Updated profile
 *
 * @example
 * ```typescript
 * await updateEmployeeProfilePicture('emp-123', 'https://storage.example.com/profile.jpg');
 * ```
 */
async function updateEmployeeProfilePicture(employeeId, fileUrl) {
    return updateEmployeeProfile(employeeId, { profilePictureUrl: fileUrl });
}
/**
 * Gets employee work history
 *
 * @param employeeId - Employee identifier
 * @returns Work history records
 *
 * @example
 * ```typescript
 * const history = await getEmployeeWorkHistory('emp-123');
 * ```
 */
async function getEmployeeWorkHistory(employeeId) {
    // In production, fetch from database
    return [
        {
            jobTitle: 'Senior Engineer',
            department: 'Engineering',
            startDate: new Date('2020-01-01'),
        },
    ];
}
// ============================================================================
// PERSONAL INFORMATION & EMERGENCY CONTACTS
// ============================================================================
/**
 * Creates emergency contact
 *
 * @param employeeId - Employee identifier
 * @param contactData - Emergency contact data
 * @returns Created emergency contact
 *
 * @example
 * ```typescript
 * const contact = await createEmergencyContact('emp-123', {
 *   name: 'Jane Doe',
 *   relationship: EmergencyContactRelationship.SPOUSE,
 *   phone: '+1-555-0100',
 *   isPrimary: true
 * });
 * ```
 */
async function createEmergencyContact(employeeId, contactData) {
    const contact = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        ...contactData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await logAuditTrail(employeeId, 'create_emergency_contact', contact);
    return contact;
}
/**
 * Gets employee emergency contacts
 *
 * @param employeeId - Employee identifier
 * @returns List of emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('emp-123');
 * ```
 */
async function getEmergencyContacts(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Updates emergency contact
 *
 * @param contactId - Contact identifier
 * @param updates - Contact updates
 * @returns Updated emergency contact
 *
 * @example
 * ```typescript
 * await updateEmergencyContact('contact-123', { phone: '+1-555-0200' });
 * ```
 */
async function updateEmergencyContact(contactId, updates) {
    // In production, update in database
    const contact = await getEmergencyContactById(contactId);
    return { ...contact, ...updates, updatedAt: new Date() };
}
/**
 * Deletes emergency contact
 *
 * @param contactId - Contact identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteEmergencyContact('contact-123');
 * ```
 */
async function deleteEmergencyContact(contactId) {
    // In production, delete from database
    await logAuditTrail('', 'delete_emergency_contact', { contactId });
    return true;
}
/**
 * Sets primary emergency contact
 *
 * @param employeeId - Employee identifier
 * @param contactId - Contact identifier
 * @returns Updated contact
 *
 * @example
 * ```typescript
 * await setPrimaryEmergencyContact('emp-123', 'contact-456');
 * ```
 */
async function setPrimaryEmergencyContact(employeeId, contactId) {
    // Reset all contacts to non-primary
    const contacts = await getEmergencyContacts(employeeId);
    for (const contact of contacts) {
        if (contact.isPrimary) {
            await updateEmergencyContact(contact.id, { isPrimary: false });
        }
    }
    return updateEmergencyContact(contactId, { isPrimary: true });
}
/**
 * Validates address format
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateAddress({ street1: '123 Main St', city: 'Boston', state: 'MA', postalCode: '02101', country: 'USA' });
 * ```
 */
function validateAddress(address) {
    return !!(address.street1 &&
        address.city &&
        address.state &&
        address.postalCode &&
        address.country);
}
// ============================================================================
// PAYSLIP & TAX DOCUMENTS
// ============================================================================
/**
 * Gets employee payslips
 *
 * @param employeeId - Employee identifier
 * @param year - Optional year filter
 * @returns List of payslips
 *
 * @example
 * ```typescript
 * const payslips = await getEmployeePayslips('emp-123', 2025);
 * ```
 */
async function getEmployeePayslips(employeeId, year) {
    // In production, fetch from database with year filter
    return [];
}
/**
 * Gets single payslip by ID
 *
 * @param payslipId - Payslip identifier
 * @returns Payslip details
 *
 * @example
 * ```typescript
 * const payslip = await getPayslipById('payslip-123');
 * ```
 */
async function getPayslipById(payslipId) {
    // In production, fetch from database
    return {
        id: payslipId,
        employeeId: 'emp-1',
        payPeriodStart: new Date(),
        payPeriodEnd: new Date(),
        payDate: new Date(),
        grossPay: 5000,
        netPay: 3500,
        deductions: [],
        earnings: [],
        taxes: [],
        yearToDateGross: 50000,
        yearToDateNet: 35000,
        documentUrl: 'https://storage.example.com/payslip.pdf',
        currency: 'USD',
        createdAt: new Date(),
    };
}
/**
 * Downloads payslip document
 *
 * @param payslipId - Payslip identifier
 * @returns Document URL
 *
 * @example
 * ```typescript
 * const url = await downloadPayslip('payslip-123');
 * ```
 */
async function downloadPayslip(payslipId) {
    const payslip = await getPayslipById(payslipId);
    await logAuditTrail('', 'download_payslip', { payslipId });
    return payslip.documentUrl;
}
/**
 * Gets employee tax documents
 *
 * @param employeeId - Employee identifier
 * @param taxYear - Tax year
 * @returns List of tax documents
 *
 * @example
 * ```typescript
 * const taxDocs = await getEmployeeTaxDocuments('emp-123', 2024);
 * ```
 */
async function getEmployeeTaxDocuments(employeeId, taxYear) {
    // In production, fetch from database
    return [];
}
/**
 * Downloads tax document
 *
 * @param documentId - Document identifier
 * @returns Document URL
 *
 * @example
 * ```typescript
 * const url = await downloadTaxDocument('tax-doc-123');
 * ```
 */
async function downloadTaxDocument(documentId) {
    // In production, fetch from database and generate URL
    await logAuditTrail('', 'download_tax_document', { documentId });
    return 'https://storage.example.com/tax-document.pdf';
}
/**
 * Gets year-to-date earnings summary
 *
 * @param employeeId - Employee identifier
 * @returns YTD summary
 *
 * @example
 * ```typescript
 * const ytd = await getYearToDateSummary('emp-123');
 * ```
 */
async function getYearToDateSummary(employeeId) {
    const payslips = await getEmployeePayslips(employeeId, new Date().getFullYear());
    return {
        grossPay: payslips.reduce((sum, p) => sum + p.grossPay, 0),
        netPay: payslips.reduce((sum, p) => sum + p.netPay, 0),
        taxes: payslips.reduce((sum, p) => sum + p.taxes.reduce((t, tax) => t + tax.amount, 0), 0),
        deductions: payslips.reduce((sum, p) => sum + p.deductions.reduce((d, deduction) => d + deduction.amount, 0), 0),
    };
}
// ============================================================================
// BENEFITS ENROLLMENT & MANAGEMENT
// ============================================================================
/**
 * Gets employee benefits enrollments
 *
 * @param employeeId - Employee identifier
 * @returns List of benefits enrollments
 *
 * @example
 * ```typescript
 * const benefits = await getEmployeeBenefitsEnrollments('emp-123');
 * ```
 */
async function getEmployeeBenefitsEnrollments(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Gets available benefits plans
 *
 * @param employeeId - Employee identifier
 * @returns List of available plans
 *
 * @example
 * ```typescript
 * const plans = await getAvailableBenefitsPlans('emp-123');
 * ```
 */
async function getAvailableBenefitsPlans(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Enrolls employee in benefits plan
 *
 * @param employeeId - Employee identifier
 * @param enrollmentData - Enrollment data
 * @returns Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollInBenefitsPlan('emp-123', {
 *   planId: 'plan-456',
 *   planType: BenefitsPlanType.HEALTH_INSURANCE,
 *   effectiveDate: new Date('2025-01-01'),
 *   coverageLevel: 'family'
 * });
 * ```
 */
async function enrollInBenefitsPlan(employeeId, enrollmentData) {
    const enrollment = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        status: BenefitsEnrollmentStatus.PENDING,
        enrollmentDate: new Date(),
        lastModified: new Date(),
        ...enrollmentData,
    };
    await logAuditTrail(employeeId, 'enroll_benefits', enrollment);
    return enrollment;
}
/**
 * Updates benefits enrollment
 *
 * @param enrollmentId - Enrollment identifier
 * @param updates - Enrollment updates
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await updateBenefitsEnrollment('enrollment-123', { coverageLevel: 'employee_spouse' });
 * ```
 */
async function updateBenefitsEnrollment(enrollmentId, updates) {
    // In production, update in database
    const enrollment = await getBenefitsEnrollmentById(enrollmentId);
    return { ...enrollment, ...updates, lastModified: new Date() };
}
/**
 * Terminates benefits enrollment
 *
 * @param enrollmentId - Enrollment identifier
 * @param terminationDate - Termination date
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await terminateBenefitsEnrollment('enrollment-123', new Date('2025-12-31'));
 * ```
 */
async function terminateBenefitsEnrollment(enrollmentId, terminationDate) {
    return updateBenefitsEnrollment(enrollmentId, {
        status: BenefitsEnrollmentStatus.TERMINATED,
        terminationDate,
    });
}
/**
 * Waives benefits plan
 *
 * @param employeeId - Employee identifier
 * @param planType - Plan type to waive
 * @param reason - Waiver reason
 * @returns Waived enrollment record
 *
 * @example
 * ```typescript
 * await waiveBenefitsPlan('emp-123', BenefitsPlanType.HEALTH_INSURANCE, 'Covered by spouse');
 * ```
 */
async function waiveBenefitsPlan(employeeId, planType, reason) {
    const enrollment = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        planType,
        planName: 'Waived',
        planId: 'waived',
        status: BenefitsEnrollmentStatus.WAIVED,
        effectiveDate: new Date(),
        employeeContribution: 0,
        employerContribution: 0,
        coverageLevel: 'employee',
        enrollmentDate: new Date(),
        lastModified: new Date(),
    };
    await logAuditTrail(employeeId, 'waive_benefits', { planType, reason });
    return enrollment;
}
/**
 * Gets benefits enrollment summary
 *
 * @param employeeId - Employee identifier
 * @returns Enrollment summary
 *
 * @example
 * ```typescript
 * const summary = await getBenefitsEnrollmentSummary('emp-123');
 * ```
 */
async function getBenefitsEnrollmentSummary(employeeId) {
    const enrollments = await getEmployeeBenefitsEnrollments(employeeId);
    return {
        totalEmployeeContribution: enrollments.reduce((sum, e) => sum + e.employeeContribution, 0),
        totalEmployerContribution: enrollments.reduce((sum, e) => sum + e.employerContribution, 0),
        enrolledPlans: enrollments.filter((e) => e.status === BenefitsEnrollmentStatus.ENROLLED)
            .length,
        waivedPlans: enrollments.filter((e) => e.status === BenefitsEnrollmentStatus.WAIVED).length,
    };
}
// ============================================================================
// TIME OFF REQUESTS & TRACKING
// ============================================================================
/**
 * Creates time off request
 *
 * @param employeeId - Employee identifier
 * @param requestData - Time off request data
 * @returns Created time off request
 *
 * @example
 * ```typescript
 * const request = await createTimeOffRequest('emp-123', {
 *   type: TimeOffType.VACATION,
 *   startDate: new Date('2025-06-01'),
 *   endDate: new Date('2025-06-05'),
 *   reason: 'Family vacation'
 * });
 * ```
 */
async function createTimeOffRequest(employeeId, requestData) {
    const totalDays = calculateBusinessDays(requestData.startDate, requestData.endDate);
    const request = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        totalDays,
        status: TimeOffStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...requestData,
    };
    await logAuditTrail(employeeId, 'create_time_off_request', request);
    return request;
}
/**
 * Submits time off request
 *
 * @param requestId - Request identifier
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await submitTimeOffRequest('request-123');
 * ```
 */
async function submitTimeOffRequest(requestId) {
    const request = await getTimeOffRequestById(requestId);
    return {
        ...request,
        status: TimeOffStatus.SUBMITTED,
        submittedAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets employee time off requests
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of time off requests
 *
 * @example
 * ```typescript
 * const requests = await getEmployeeTimeOffRequests('emp-123', TimeOffStatus.APPROVED);
 * ```
 */
async function getEmployeeTimeOffRequests(employeeId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Cancels time off request
 *
 * @param requestId - Request identifier
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await cancelTimeOffRequest('request-123');
 * ```
 */
async function cancelTimeOffRequest(requestId) {
    const request = await getTimeOffRequestById(requestId);
    return {
        ...request,
        status: TimeOffStatus.CANCELLED,
        updatedAt: new Date(),
    };
}
/**
 * Gets employee time off balances
 *
 * @param employeeId - Employee identifier
 * @returns Time off balances by type
 *
 * @example
 * ```typescript
 * const balances = await getEmployeeTimeOffBalances('emp-123');
 * ```
 */
async function getEmployeeTimeOffBalances(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Calculates available time off balance
 *
 * @param employeeId - Employee identifier
 * @param type - Time off type
 * @returns Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableTimeOff('emp-123', TimeOffType.VACATION);
 * ```
 */
async function calculateAvailableTimeOff(employeeId, type) {
    const balances = await getEmployeeTimeOffBalances(employeeId);
    const balance = balances.find((b) => b.type === type);
    return balance ? balance.available : 0;
}
/**
 * Gets time off request history
 *
 * @param employeeId - Employee identifier
 * @param year - Year filter
 * @returns Time off history
 *
 * @example
 * ```typescript
 * const history = await getTimeOffRequestHistory('emp-123', 2025);
 * ```
 */
async function getTimeOffRequestHistory(employeeId, year) {
    const requests = await getEmployeeTimeOffRequests(employeeId);
    return requests.filter((r) => r.createdAt.getFullYear() === year);
}
// ============================================================================
// TIMESHEET SUBMISSION
// ============================================================================
/**
 * Creates timesheet
 *
 * @param employeeId - Employee identifier
 * @param timesheetData - Timesheet data
 * @returns Created timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await createTimesheet('emp-123', {
 *   periodStart: new Date('2025-11-01'),
 *   periodEnd: new Date('2025-11-07'),
 *   entries: [...]
 * });
 * ```
 */
async function createTimesheet(employeeId, timesheetData) {
    const timesheet = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        status: TimesheetStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...timesheetData,
    };
    await logAuditTrail(employeeId, 'create_timesheet', timesheet);
    return timesheet;
}
/**
 * Submits timesheet
 *
 * @param timesheetId - Timesheet identifier
 * @returns Updated timesheet
 *
 * @example
 * ```typescript
 * await submitTimesheet('timesheet-123');
 * ```
 */
async function submitTimesheet(timesheetId) {
    const timesheet = await getTimesheetById(timesheetId);
    return {
        ...timesheet,
        status: TimesheetStatus.SUBMITTED,
        submittedDate: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets employee timesheets
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of timesheets
 *
 * @example
 * ```typescript
 * const timesheets = await getEmployeeTimesheets('emp-123');
 * ```
 */
async function getEmployeeTimesheets(employeeId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Calculates timesheet totals
 *
 * @param entries - Timesheet entries
 * @returns Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateTimesheetTotals(entries);
 * ```
 */
function calculateTimesheetTotals(entries) {
    return {
        totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
        regularHours: entries.filter((e) => !e.isOvertime).reduce((sum, e) => sum + e.hours, 0),
        overtimeHours: entries.filter((e) => e.isOvertime).reduce((sum, e) => sum + e.hours, 0),
    };
}
// ============================================================================
// EXPENSE REPORT SUBMISSION
// ============================================================================
/**
 * Creates expense report
 *
 * @param employeeId - Employee identifier
 * @param reportData - Expense report data
 * @returns Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport('emp-123', {
 *   title: 'Business Trip - Boston',
 *   currency: 'USD',
 *   expenses: []
 * });
 * ```
 */
async function createExpenseReport(employeeId, reportData) {
    const reportNumber = generateExpenseReportNumber(employeeId);
    const report = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        reportNumber,
        status: ExpenseStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...reportData,
    };
    await logAuditTrail(employeeId, 'create_expense_report', report);
    return report;
}
/**
 * Adds expense item to report
 *
 * @param reportId - Report identifier
 * @param expenseData - Expense item data
 * @returns Created expense item
 *
 * @example
 * ```typescript
 * const expense = await addExpenseItem('report-123', {
 *   category: ExpenseCategory.MEALS,
 *   date: new Date(),
 *   merchant: 'Restaurant',
 *   description: 'Client dinner',
 *   amount: 125.50,
 *   currency: 'USD',
 *   billable: true
 * });
 * ```
 */
async function addExpenseItem(reportId, expenseData) {
    const expense = {
        id: faker_1.faker.string.uuid(),
        expenseReportId: reportId,
        createdAt: new Date(),
        ...expenseData,
    };
    return expense;
}
/**
 * Submits expense report
 *
 * @param reportId - Report identifier
 * @returns Updated report
 *
 * @example
 * ```typescript
 * await submitExpenseReport('report-123');
 * ```
 */
async function submitExpenseReport(reportId) {
    const report = await getExpenseReportById(reportId);
    return {
        ...report,
        status: ExpenseStatus.SUBMITTED,
        submittedAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets employee expense reports
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of expense reports
 *
 * @example
 * ```typescript
 * const reports = await getEmployeeExpenseReports('emp-123');
 * ```
 */
async function getEmployeeExpenseReports(employeeId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Calculates expense report total
 *
 * @param expenses - Expense items
 * @returns Total amount
 *
 * @example
 * ```typescript
 * const total = calculateExpenseReportTotal(expenses);
 * ```
 */
function calculateExpenseReportTotal(expenses) {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
}
// ============================================================================
// PERFORMANCE SELF-ASSESSMENT
// ============================================================================
/**
 * Gets employee self-assessments
 *
 * @param employeeId - Employee identifier
 * @returns List of self-assessments
 *
 * @example
 * ```typescript
 * const assessments = await getEmployeeSelfAssessments('emp-123');
 * ```
 */
async function getEmployeeSelfAssessments(employeeId) {
    // In production, fetch from database
    return [];
}
/**
 * Creates self-assessment
 *
 * @param employeeId - Employee identifier
 * @param assessmentData - Assessment data
 * @returns Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createSelfAssessment('emp-123', {
 *   reviewPeriodStart: new Date('2025-01-01'),
 *   reviewPeriodEnd: new Date('2025-12-31'),
 *   achievements: '...',
 *   challenges: '...',
 *   developmentAreas: '...',
 *   careerGoals: '...',
 *   competencyRatings: []
 * });
 * ```
 */
async function createSelfAssessment(employeeId, assessmentData) {
    const assessment = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        status: PerformanceReviewStatus.NOT_STARTED,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...assessmentData,
    };
    await logAuditTrail(employeeId, 'create_self_assessment', assessment);
    return assessment;
}
/**
 * Submits self-assessment
 *
 * @param assessmentId - Assessment identifier
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await submitSelfAssessment('assessment-123');
 * ```
 */
async function submitSelfAssessment(assessmentId) {
    const assessment = await getSelfAssessmentById(assessmentId);
    return {
        ...assessment,
        status: PerformanceReviewStatus.SUBMITTED,
        submittedDate: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Updates competency rating
 *
 * @param assessmentId - Assessment identifier
 * @param competencyName - Competency name
 * @param rating - Rating value
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await updateCompetencyRating('assessment-123', 'Communication', 4);
 * ```
 */
async function updateCompetencyRating(assessmentId, competencyName, rating) {
    const assessment = await getSelfAssessmentById(assessmentId);
    const competency = assessment.competencyRatings.find((c) => c.competencyName === competencyName);
    if (competency) {
        competency.selfRating = rating;
    }
    return { ...assessment, updatedAt: new Date() };
}
/**
 * Calculates average self-rating
 *
 * @param assessment - Performance assessment
 * @returns Average rating
 *
 * @example
 * ```typescript
 * const avgRating = calculateAverageSelfRating(assessment);
 * ```
 */
function calculateAverageSelfRating(assessment) {
    if (assessment.competencyRatings.length === 0)
        return 0;
    const sum = assessment.competencyRatings.reduce((total, c) => total + c.selfRating, 0);
    return sum / assessment.competencyRatings.length;
}
// ============================================================================
// GOAL MANAGEMENT & TRACKING
// ============================================================================
/**
 * Creates employee goal
 *
 * @param employeeId - Employee identifier
 * @param goalData - Goal data
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createEmployeeGoal('emp-123', {
 *   title: 'Complete AWS Certification',
 *   description: 'Obtain AWS Solutions Architect certification',
 *   category: 'development',
 *   priority: 'high',
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0,
 *   milestones: []
 * });
 * ```
 */
async function createEmployeeGoal(employeeId, goalData) {
    const goal = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        status: GoalStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...goalData,
    };
    await logAuditTrail(employeeId, 'create_goal', goal);
    return goal;
}
/**
 * Gets employee goals
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of goals
 *
 * @example
 * ```typescript
 * const goals = await getEmployeeGoals('emp-123', GoalStatus.ACTIVE);
 * ```
 */
async function getEmployeeGoals(employeeId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Updates goal progress
 *
 * @param goalId - Goal identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateGoalProgress('goal-123', 75);
 * ```
 */
async function updateGoalProgress(goalId, progress) {
    const goal = await getEmployeeGoalById(goalId);
    const newStatus = determineGoalStatusFromProgress(progress, goal.targetDate);
    return { ...goal, progress, status: newStatus, updatedAt: new Date() };
}
/**
 * Completes milestone
 *
 * @param goalId - Goal identifier
 * @param milestoneId - Milestone identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await completeMilestone('goal-123', 'milestone-456');
 * ```
 */
async function completeMilestone(goalId, milestoneId) {
    const goal = await getEmployeeGoalById(goalId);
    const milestone = goal.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
        milestone.isCompleted = true;
        milestone.completionDate = new Date();
    }
    return { ...goal, updatedAt: new Date() };
}
/**
 * Completes goal
 *
 * @param goalId - Goal identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await completeGoal('goal-123');
 * ```
 */
async function completeGoal(goalId) {
    const goal = await getEmployeeGoalById(goalId);
    return {
        ...goal,
        status: GoalStatus.COMPLETED,
        progress: 100,
        completionDate: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// LEARNING ENROLLMENT & TRACKING
// ============================================================================
/**
 * Gets available learning courses
 *
 * @param category - Optional category filter
 * @returns List of courses
 *
 * @example
 * ```typescript
 * const courses = await getAvailableLearningCourses('technical');
 * ```
 */
async function getAvailableLearningCourses(category) {
    // In production, fetch from database with optional category filter
    return [];
}
/**
 * Enrolls in learning course
 *
 * @param employeeId - Employee identifier
 * @param courseId - Course identifier
 * @returns Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await enrollInLearningCourse('emp-123', 'course-456');
 * ```
 */
async function enrollInLearningCourse(employeeId, courseId) {
    const course = await getLearningCourseById(courseId);
    const enrollment = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        courseId,
        courseTitle: course.title,
        status: LearningEnrollmentStatus.NOT_STARTED,
        enrollmentDate: new Date(),
        progress: 0,
        isRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await logAuditTrail(employeeId, 'enroll_learning_course', enrollment);
    return enrollment;
}
/**
 * Gets employee learning enrollments
 *
 * @param employeeId - Employee identifier
 * @param status - Optional status filter
 * @returns List of enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await getEmployeeLearningEnrollments('emp-123');
 * ```
 */
async function getEmployeeLearningEnrollments(employeeId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Updates learning course progress
 *
 * @param enrollmentId - Enrollment identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated enrollment
 *
 * @example
 * ```typescript
 * await updateLearningCourseProgress('enrollment-123', 50);
 * ```
 */
async function updateLearningCourseProgress(enrollmentId, progress) {
    const enrollment = await getLearningEnrollmentById(enrollmentId);
    const status = progress === 100
        ? LearningEnrollmentStatus.COMPLETED
        : LearningEnrollmentStatus.IN_PROGRESS;
    return { ...enrollment, progress, status, updatedAt: new Date() };
}
// ============================================================================
// DOCUMENT MANAGEMENT & E-SIGNATURES
// ============================================================================
/**
 * Gets employee documents
 *
 * @param employeeId - Employee identifier
 * @param category - Optional category filter
 * @returns List of documents
 *
 * @example
 * ```typescript
 * const docs = await getEmployeeDocuments('emp-123', 'benefits');
 * ```
 */
async function getEmployeeDocuments(employeeId, category) {
    // In production, fetch from database with optional category filter
    return [];
}
/**
 * Uploads employee document
 *
 * @param employeeId - Employee identifier
 * @param documentData - Document data
 * @returns Created document
 *
 * @example
 * ```typescript
 * const doc = await uploadEmployeeDocument('emp-123', {
 *   documentType: 'Resume',
 *   fileName: 'resume.pdf',
 *   fileUrl: 'https://storage.example.com/resume.pdf',
 *   fileSize: 102400,
 *   mimeType: 'application/pdf',
 *   category: 'personal',
 *   requiresSignature: false,
 *   isConfidential: false,
 *   uploadedBy: 'emp-123'
 * });
 * ```
 */
async function uploadEmployeeDocument(employeeId, documentData) {
    const document = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        uploadedAt: new Date(),
        ...documentData,
    };
    await logAuditTrail(employeeId, 'upload_document', document);
    return document;
}
/**
 * Signs document electronically
 *
 * @param documentId - Document identifier
 * @param signatureData - Signature data
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await signDocument('doc-123', 'base64-signature-data');
 * ```
 */
async function signDocument(documentId, signatureData) {
    const document = await getEmployeeDocumentById(documentId);
    return {
        ...document,
        signatureStatus: DocumentSignatureStatus.SIGNED,
        signedDate: new Date(),
        signatureUrl: signatureData,
    };
}
/**
 * Gets documents requiring signature
 *
 * @param employeeId - Employee identifier
 * @returns List of documents
 *
 * @example
 * ```typescript
 * const docs = await getDocumentsRequiringSignature('emp-123');
 * ```
 */
async function getDocumentsRequiringSignature(employeeId) {
    const documents = await getEmployeeDocuments(employeeId);
    return documents.filter((d) => d.requiresSignature &&
        (!d.signatureStatus || d.signatureStatus === DocumentSignatureStatus.PENDING));
}
/**
 * Declines document signature
 *
 * @param documentId - Document identifier
 * @param reason - Decline reason
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await declineDocumentSignature('doc-123', 'Need to review with legal counsel');
 * ```
 */
async function declineDocumentSignature(documentId, reason) {
    const document = await getEmployeeDocumentById(documentId);
    await logAuditTrail('', 'decline_document_signature', { documentId, reason });
    return {
        ...document,
        signatureStatus: DocumentSignatureStatus.DECLINED,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates business days between two dates
 */
function calculateBusinessDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}
/**
 * Generates unique expense report number
 */
function generateExpenseReportNumber(employeeId) {
    const timestamp = Date.now();
    return `EXP-${employeeId.slice(0, 6).toUpperCase()}-${timestamp}`;
}
/**
 * Determines goal status from progress and target date
 */
function determineGoalStatusFromProgress(progress, targetDate) {
    if (progress === 100)
        return GoalStatus.COMPLETED;
    if (progress === 0)
        return GoalStatus.DRAFT;
    const now = new Date();
    const daysRemaining = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining < 0)
        return GoalStatus.BEHIND;
    if (progress < 50 && daysRemaining < 30)
        return GoalStatus.AT_RISK;
    return GoalStatus.ON_TRACK;
}
/**
 * Logs audit trail entry
 */
async function logAuditTrail(employeeId, action, data) {
    // In production, log to audit database
    console.log(`Audit: ${employeeId} - ${action}`, data);
}
/**
 * Gets time off request by ID
 */
async function getTimeOffRequestById(requestId) {
    return {
        id: requestId,
        employeeId: 'emp-1',
        type: TimeOffType.VACATION,
        startDate: new Date(),
        endDate: new Date(),
        totalDays: 5,
        status: TimeOffStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets emergency contact by ID
 */
async function getEmergencyContactById(contactId) {
    return {
        id: contactId,
        employeeId: 'emp-1',
        name: 'Contact Name',
        relationship: EmergencyContactRelationship.SPOUSE,
        phone: '+1-555-0100',
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets benefits enrollment by ID
 */
async function getBenefitsEnrollmentById(enrollmentId) {
    return {
        id: enrollmentId,
        employeeId: 'emp-1',
        planType: BenefitsPlanType.HEALTH_INSURANCE,
        planName: 'Health Plan',
        planId: 'plan-1',
        status: BenefitsEnrollmentStatus.ENROLLED,
        effectiveDate: new Date(),
        employeeContribution: 100,
        employerContribution: 200,
        coverageLevel: 'employee',
        enrollmentDate: new Date(),
        lastModified: new Date(),
    };
}
/**
 * Gets expense report by ID
 */
async function getExpenseReportById(reportId) {
    return {
        id: reportId,
        employeeId: 'emp-1',
        reportNumber: 'EXP-001',
        title: 'Expense Report',
        totalAmount: 0,
        currency: 'USD',
        status: ExpenseStatus.DRAFT,
        expenses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets self-assessment by ID
 */
async function getSelfAssessmentById(assessmentId) {
    return {
        id: assessmentId,
        employeeId: 'emp-1',
        reviewPeriodStart: new Date(),
        reviewPeriodEnd: new Date(),
        status: PerformanceReviewStatus.NOT_STARTED,
        achievements: '',
        challenges: '',
        developmentAreas: '',
        careerGoals: '',
        competencyRatings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets employee goal by ID
 */
async function getEmployeeGoalById(goalId) {
    return {
        id: goalId,
        employeeId: 'emp-1',
        title: 'Goal',
        description: '',
        category: 'performance',
        status: GoalStatus.DRAFT,
        priority: 'medium',
        startDate: new Date(),
        targetDate: new Date(),
        progress: 0,
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets learning course by ID
 */
async function getLearningCourseById(courseId) {
    return {
        id: courseId,
        courseCode: 'COURSE-001',
        title: 'Course Title',
        description: '',
        category: 'technical',
        duration: 40,
        durationUnit: 'hours',
        provider: 'Provider',
        format: 'online',
        difficulty: 'intermediate',
        certificationOffered: false,
        isActive: true,
    };
}
/**
 * Gets learning enrollment by ID
 */
async function getLearningEnrollmentById(enrollmentId) {
    return {
        id: enrollmentId,
        employeeId: 'emp-1',
        courseId: 'course-1',
        courseTitle: 'Course',
        status: LearningEnrollmentStatus.NOT_STARTED,
        enrollmentDate: new Date(),
        progress: 0,
        isRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets employee document by ID
 */
async function getEmployeeDocumentById(documentId) {
    return {
        id: documentId,
        employeeId: 'emp-1',
        documentType: 'Document',
        fileName: 'document.pdf',
        fileUrl: 'https://storage.example.com/document.pdf',
        fileSize: 102400,
        mimeType: 'application/pdf',
        category: 'personal',
        requiresSignature: false,
        isConfidential: false,
        uploadedBy: 'emp-1',
        uploadedAt: new Date(),
    };
}
/**
 * Gets timesheet by ID
 */
async function getTimesheetById(timesheetId) {
    return {
        id: timesheetId,
        employeeId: 'emp-1',
        periodStart: new Date(),
        periodEnd: new Date(),
        totalHours: 0,
        regularHours: 0,
        overtimeHours: 0,
        entries: [],
        status: TimesheetStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Employee Self-Service Controller
 * Provides RESTful API endpoints for employee self-service operations
 */
let EmployeeSelfServiceController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('employee-self-service'), (0, common_1.Controller)('employee-self-service'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getProfile_decorators;
    let _updateProfile_decorators;
    let _getTimeOffRequests_decorators;
    let _createTimeOff_decorators;
    let _getExpenses_decorators;
    let _createExpense_decorators;
    let _getGoals_decorators;
    let _createGoal_decorators;
    var EmployeeSelfServiceController = _classThis = class {
        /**
         * Get employee profile
         */
        async getProfile(employeeId) {
            return getEmployeeProfile(employeeId);
        }
        /**
         * Update employee profile
         */
        async updateProfile(employeeId, updateDto) {
            return updateEmployeeProfile(employeeId, updateDto);
        }
        /**
         * Get time off requests
         */
        async getTimeOffRequests(employeeId) {
            return getEmployeeTimeOffRequests(employeeId);
        }
        /**
         * Create time off request
         */
        async createTimeOff(employeeId, createDto) {
            return createTimeOffRequest(employeeId, createDto);
        }
        /**
         * Get expense reports
         */
        async getExpenses(employeeId) {
            return getEmployeeExpenseReports(employeeId);
        }
        /**
         * Create expense report
         */
        async createExpense(employeeId, createDto) {
            return createExpenseReport(employeeId, createDto);
        }
        /**
         * Get employee goals
         */
        async getGoals(employeeId) {
            return getEmployeeGoals(employeeId);
        }
        /**
         * Create employee goal
         */
        async createGoal(employeeId, createDto) {
            return createEmployeeGoal(employeeId, createDto);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeSelfServiceController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getProfile_decorators = [(0, common_1.Get)('profile/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Get employee profile' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' })];
        _updateProfile_decorators = [(0, common_1.Patch)('profile/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Update employee profile' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getTimeOffRequests_decorators = [(0, common_1.Get)('time-off/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Get employee time off requests' })];
        _createTimeOff_decorators = [(0, common_1.Post)('time-off/:employeeId'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create time off request' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getExpenses_decorators = [(0, common_1.Get)('expenses/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Get employee expense reports' })];
        _createExpense_decorators = [(0, common_1.Post)('expenses/:employeeId'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create expense report' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getGoals_decorators = [(0, common_1.Get)('goals/:employeeId'), (0, swagger_1.ApiOperation)({ summary: 'Get employee goals' })];
        _createGoal_decorators = [(0, common_1.Post)('goals/:employeeId'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create employee goal' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: obj => "getProfile" in obj, get: obj => obj.getProfile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProfile_decorators, { kind: "method", name: "updateProfile", static: false, private: false, access: { has: obj => "updateProfile" in obj, get: obj => obj.updateProfile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimeOffRequests_decorators, { kind: "method", name: "getTimeOffRequests", static: false, private: false, access: { has: obj => "getTimeOffRequests" in obj, get: obj => obj.getTimeOffRequests }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTimeOff_decorators, { kind: "method", name: "createTimeOff", static: false, private: false, access: { has: obj => "createTimeOff" in obj, get: obj => obj.createTimeOff }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExpenses_decorators, { kind: "method", name: "getExpenses", static: false, private: false, access: { has: obj => "getExpenses" in obj, get: obj => obj.getExpenses }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createExpense_decorators, { kind: "method", name: "createExpense", static: false, private: false, access: { has: obj => "createExpense" in obj, get: obj => obj.createExpense }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGoals_decorators, { kind: "method", name: "getGoals", static: false, private: false, access: { has: obj => "getGoals" in obj, get: obj => obj.getGoals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGoal_decorators, { kind: "method", name: "createGoal", static: false, private: false, access: { has: obj => "createGoal" in obj, get: obj => obj.createGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeSelfServiceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeSelfServiceController = _classThis;
})();
exports.EmployeeSelfServiceController = EmployeeSelfServiceController;
//# sourceMappingURL=employee-self-service-kit.js.map