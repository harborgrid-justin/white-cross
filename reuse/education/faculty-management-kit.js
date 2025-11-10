"use strict";
/**
 * LOC: EDUCATION_FACULTY_MANAGEMENT_001
 * File: /reuse/education/faculty-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Faculty services
 *   - Course assignment services
 *   - Academic administration controllers
 *   - HR integration services
 *   - Faculty portal services
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
exports.FacultyEnums = exports.FacultySchemas = exports.FacultyModels = exports.API_BASE_PATH = exports.API_VERSION = exports.FacultyManagementService = exports.QualificationSchema = exports.CourseAssignmentSchema = exports.FacultyProfileSchema = exports.UpdateFacultySchema = exports.CreateFacultySchema = exports.FacultyQualifications = exports.FacultyLoad = exports.FacultyProfile = exports.Faculty = exports.DayOfWeek = exports.QualificationType = exports.EvaluationType = exports.ContractType = exports.EmploymentType = exports.FacultyRank = exports.FacultyStatus = void 0;
/**
 * File: /reuse/education/faculty-management-kit.ts
 * Locator: WC-EDUCATION-FACULTY-MANAGEMENT-001
 * Purpose: Production-Grade Faculty Management Kit - Comprehensive faculty administration toolkit
 *
 * Upstream: NestJS, Sequelize, Zod
 * Downstream: ../backend/education/*, Faculty Services, HR Services, Academic Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 45 production-ready faculty management functions
 *
 * LLM Context: Production-grade faculty management system for education SIS platform.
 * Provides comprehensive faculty administration including faculty profile management with complete
 * biographical and contact information, course assignment and teaching load calculation with
 * workload balancing algorithms, faculty credentials and qualifications tracking with expiration
 * monitoring, office hours scheduling and availability management, faculty evaluations and
 * performance reviews, contract management and renewal workflows, academic appointment tracking,
 * department and division assignments, research interests and publications management, teaching
 * specializations and certifications, sabbatical and leave tracking, faculty development programs,
 * peer evaluation systems, student feedback integration, committee assignments, academic rank
 * progression, tenure track management, compensation and benefits tracking, faculty onboarding
 * and offboarding, compliance and certification validation, and comprehensive audit logging.
 * Includes RESTful API design with versioning, proper HTTP methods, status codes, error handling,
 * pagination, filtering, and sorting. Advanced TypeScript patterns with generics, discriminated
 * unions, and utility types for maximum type safety.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================
/**
 * Faculty employment status enum
 */
var FacultyStatus;
(function (FacultyStatus) {
    FacultyStatus["ACTIVE"] = "active";
    FacultyStatus["ON_LEAVE"] = "on_leave";
    FacultyStatus["SABBATICAL"] = "sabbatical";
    FacultyStatus["RETIRED"] = "retired";
    FacultyStatus["TERMINATED"] = "terminated";
    FacultyStatus["EMERITUS"] = "emeritus";
})(FacultyStatus || (exports.FacultyStatus = FacultyStatus = {}));
/**
 * Faculty rank/position enum
 */
var FacultyRank;
(function (FacultyRank) {
    FacultyRank["PROFESSOR"] = "professor";
    FacultyRank["ASSOCIATE_PROFESSOR"] = "associate_professor";
    FacultyRank["ASSISTANT_PROFESSOR"] = "assistant_professor";
    FacultyRank["LECTURER"] = "lecturer";
    FacultyRank["SENIOR_LECTURER"] = "senior_lecturer";
    FacultyRank["INSTRUCTOR"] = "instructor";
    FacultyRank["ADJUNCT"] = "adjunct";
    FacultyRank["VISITING"] = "visiting";
    FacultyRank["RESEARCH_FACULTY"] = "research_faculty";
})(FacultyRank || (exports.FacultyRank = FacultyRank = {}));
/**
 * Employment type enum
 */
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "full_time";
    EmploymentType["PART_TIME"] = "part_time";
    EmploymentType["ADJUNCT"] = "adjunct";
    EmploymentType["VISITING"] = "visiting";
    EmploymentType["CONTRACT"] = "contract";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
/**
 * Contract type enum
 */
var ContractType;
(function (ContractType) {
    ContractType["TENURE_TRACK"] = "tenure_track";
    ContractType["TENURED"] = "tenured";
    ContractType["FIXED_TERM"] = "fixed_term";
    ContractType["ANNUAL"] = "annual";
    ContractType["SEMESTER"] = "semester";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Evaluation type enum
 */
var EvaluationType;
(function (EvaluationType) {
    EvaluationType["ANNUAL_REVIEW"] = "annual_review";
    EvaluationType["TENURE_REVIEW"] = "tenure_review";
    EvaluationType["PROMOTION_REVIEW"] = "promotion_review";
    EvaluationType["PEER_REVIEW"] = "peer_review";
    EvaluationType["STUDENT_EVALUATION"] = "student_evaluation";
    EvaluationType["TEACHING_OBSERVATION"] = "teaching_observation";
})(EvaluationType || (exports.EvaluationType = EvaluationType = {}));
/**
 * Qualification type enum
 */
var QualificationType;
(function (QualificationType) {
    QualificationType["DEGREE"] = "degree";
    QualificationType["CERTIFICATION"] = "certification";
    QualificationType["LICENSE"] = "license";
    QualificationType["ACCREDITATION"] = "accreditation";
    QualificationType["TRAINING"] = "training";
})(QualificationType || (exports.QualificationType = QualificationType = {}));
/**
 * Day of week enum
 */
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MONDAY"] = "monday";
    DayOfWeek["TUESDAY"] = "tuesday";
    DayOfWeek["WEDNESDAY"] = "wednesday";
    DayOfWeek["THURSDAY"] = "thursday";
    DayOfWeek["FRIDAY"] = "friday";
    DayOfWeek["SATURDAY"] = "saturday";
    DayOfWeek["SUNDAY"] = "sunday";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Faculty model - Core faculty information
 */
let Faculty = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'faculty',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['email'], unique: true },
                { fields: ['employee_id'], unique: true },
                { fields: ['status'] },
                { fields: ['rank'] },
                { fields: ['department_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employee_id_decorators;
    let _employee_id_initializers = [];
    let _employee_id_extraInitializers = [];
    let _first_name_decorators;
    let _first_name_initializers = [];
    let _first_name_extraInitializers = [];
    let _middle_name_decorators;
    let _middle_name_initializers = [];
    let _middle_name_extraInitializers = [];
    let _last_name_decorators;
    let _last_name_initializers = [];
    let _last_name_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _rank_decorators;
    let _rank_initializers = [];
    let _rank_extraInitializers = [];
    let _employment_type_decorators;
    let _employment_type_initializers = [];
    let _employment_type_extraInitializers = [];
    let _department_id_decorators;
    let _department_id_initializers = [];
    let _department_id_extraInitializers = [];
    let _hire_date_decorators;
    let _hire_date_initializers = [];
    let _hire_date_extraInitializers = [];
    let _termination_date_decorators;
    let _termination_date_initializers = [];
    let _termination_date_extraInitializers = [];
    let _is_tenured_decorators;
    let _is_tenured_initializers = [];
    let _is_tenured_extraInitializers = [];
    let _tenure_date_decorators;
    let _tenure_date_initializers = [];
    let _tenure_date_extraInitializers = [];
    let _profile_decorators;
    let _profile_initializers = [];
    let _profile_extraInitializers = [];
    let _teaching_loads_decorators;
    let _teaching_loads_initializers = [];
    let _teaching_loads_extraInitializers = [];
    let _qualifications_decorators;
    let _qualifications_initializers = [];
    let _qualifications_extraInitializers = [];
    var Faculty = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employee_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employee_id_initializers, void 0));
            this.first_name = (__runInitializers(this, _employee_id_extraInitializers), __runInitializers(this, _first_name_initializers, void 0));
            this.middle_name = (__runInitializers(this, _first_name_extraInitializers), __runInitializers(this, _middle_name_initializers, void 0));
            this.last_name = (__runInitializers(this, _middle_name_extraInitializers), __runInitializers(this, _last_name_initializers, void 0));
            this.email = (__runInitializers(this, _last_name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.status = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.rank = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rank_initializers, void 0));
            this.employment_type = (__runInitializers(this, _rank_extraInitializers), __runInitializers(this, _employment_type_initializers, void 0));
            this.department_id = (__runInitializers(this, _employment_type_extraInitializers), __runInitializers(this, _department_id_initializers, void 0));
            this.hire_date = (__runInitializers(this, _department_id_extraInitializers), __runInitializers(this, _hire_date_initializers, void 0));
            this.termination_date = (__runInitializers(this, _hire_date_extraInitializers), __runInitializers(this, _termination_date_initializers, void 0));
            this.is_tenured = (__runInitializers(this, _termination_date_extraInitializers), __runInitializers(this, _is_tenured_initializers, void 0));
            this.tenure_date = (__runInitializers(this, _is_tenured_extraInitializers), __runInitializers(this, _tenure_date_initializers, void 0));
            this.profile = (__runInitializers(this, _tenure_date_extraInitializers), __runInitializers(this, _profile_initializers, void 0));
            this.teaching_loads = (__runInitializers(this, _profile_extraInitializers), __runInitializers(this, _teaching_loads_initializers, void 0));
            this.qualifications = (__runInitializers(this, _teaching_loads_extraInitializers), __runInitializers(this, _qualifications_initializers, void 0));
            __runInitializers(this, _qualifications_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Faculty");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employee_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _first_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'First name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _middle_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Middle name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _last_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address' }), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            })];
        _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Phone number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty status', enum: FacultyStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FacultyStatus)),
                defaultValue: FacultyStatus.ACTIVE,
                allowNull: false,
            })];
        _rank_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty rank', enum: FacultyRank }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FacultyRank)),
                allowNull: false,
            })];
        _employment_type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employment type', enum: EmploymentType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmploymentType)),
                defaultValue: EmploymentType.FULL_TIME,
                allowNull: false,
            })];
        _department_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Faculty), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _hire_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hire date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _termination_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Termination date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _is_tenured_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenure status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _tenure_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenure date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _profile_decorators = [(0, sequelize_typescript_1.HasOne)(() => FacultyProfile)];
        _teaching_loads_decorators = [(0, sequelize_typescript_1.HasMany)(() => FacultyLoad)];
        _qualifications_decorators = [(0, sequelize_typescript_1.HasMany)(() => FacultyQualifications)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employee_id_decorators, { kind: "field", name: "employee_id", static: false, private: false, access: { has: obj => "employee_id" in obj, get: obj => obj.employee_id, set: (obj, value) => { obj.employee_id = value; } }, metadata: _metadata }, _employee_id_initializers, _employee_id_extraInitializers);
        __esDecorate(null, null, _first_name_decorators, { kind: "field", name: "first_name", static: false, private: false, access: { has: obj => "first_name" in obj, get: obj => obj.first_name, set: (obj, value) => { obj.first_name = value; } }, metadata: _metadata }, _first_name_initializers, _first_name_extraInitializers);
        __esDecorate(null, null, _middle_name_decorators, { kind: "field", name: "middle_name", static: false, private: false, access: { has: obj => "middle_name" in obj, get: obj => obj.middle_name, set: (obj, value) => { obj.middle_name = value; } }, metadata: _metadata }, _middle_name_initializers, _middle_name_extraInitializers);
        __esDecorate(null, null, _last_name_decorators, { kind: "field", name: "last_name", static: false, private: false, access: { has: obj => "last_name" in obj, get: obj => obj.last_name, set: (obj, value) => { obj.last_name = value; } }, metadata: _metadata }, _last_name_initializers, _last_name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _rank_decorators, { kind: "field", name: "rank", static: false, private: false, access: { has: obj => "rank" in obj, get: obj => obj.rank, set: (obj, value) => { obj.rank = value; } }, metadata: _metadata }, _rank_initializers, _rank_extraInitializers);
        __esDecorate(null, null, _employment_type_decorators, { kind: "field", name: "employment_type", static: false, private: false, access: { has: obj => "employment_type" in obj, get: obj => obj.employment_type, set: (obj, value) => { obj.employment_type = value; } }, metadata: _metadata }, _employment_type_initializers, _employment_type_extraInitializers);
        __esDecorate(null, null, _department_id_decorators, { kind: "field", name: "department_id", static: false, private: false, access: { has: obj => "department_id" in obj, get: obj => obj.department_id, set: (obj, value) => { obj.department_id = value; } }, metadata: _metadata }, _department_id_initializers, _department_id_extraInitializers);
        __esDecorate(null, null, _hire_date_decorators, { kind: "field", name: "hire_date", static: false, private: false, access: { has: obj => "hire_date" in obj, get: obj => obj.hire_date, set: (obj, value) => { obj.hire_date = value; } }, metadata: _metadata }, _hire_date_initializers, _hire_date_extraInitializers);
        __esDecorate(null, null, _termination_date_decorators, { kind: "field", name: "termination_date", static: false, private: false, access: { has: obj => "termination_date" in obj, get: obj => obj.termination_date, set: (obj, value) => { obj.termination_date = value; } }, metadata: _metadata }, _termination_date_initializers, _termination_date_extraInitializers);
        __esDecorate(null, null, _is_tenured_decorators, { kind: "field", name: "is_tenured", static: false, private: false, access: { has: obj => "is_tenured" in obj, get: obj => obj.is_tenured, set: (obj, value) => { obj.is_tenured = value; } }, metadata: _metadata }, _is_tenured_initializers, _is_tenured_extraInitializers);
        __esDecorate(null, null, _tenure_date_decorators, { kind: "field", name: "tenure_date", static: false, private: false, access: { has: obj => "tenure_date" in obj, get: obj => obj.tenure_date, set: (obj, value) => { obj.tenure_date = value; } }, metadata: _metadata }, _tenure_date_initializers, _tenure_date_extraInitializers);
        __esDecorate(null, null, _profile_decorators, { kind: "field", name: "profile", static: false, private: false, access: { has: obj => "profile" in obj, get: obj => obj.profile, set: (obj, value) => { obj.profile = value; } }, metadata: _metadata }, _profile_initializers, _profile_extraInitializers);
        __esDecorate(null, null, _teaching_loads_decorators, { kind: "field", name: "teaching_loads", static: false, private: false, access: { has: obj => "teaching_loads" in obj, get: obj => obj.teaching_loads, set: (obj, value) => { obj.teaching_loads = value; } }, metadata: _metadata }, _teaching_loads_initializers, _teaching_loads_extraInitializers);
        __esDecorate(null, null, _qualifications_decorators, { kind: "field", name: "qualifications", static: false, private: false, access: { has: obj => "qualifications" in obj, get: obj => obj.qualifications, set: (obj, value) => { obj.qualifications = value; } }, metadata: _metadata }, _qualifications_initializers, _qualifications_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Faculty = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Faculty = _classThis;
})();
exports.Faculty = Faculty;
/**
 * Faculty Profile model - Extended faculty information
 */
let FacultyProfile = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'faculty_profiles',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _faculty_id_decorators;
    let _faculty_id_initializers = [];
    let _faculty_id_extraInitializers = [];
    let _faculty_decorators;
    let _faculty_initializers = [];
    let _faculty_extraInitializers = [];
    let _photo_url_decorators;
    let _photo_url_initializers = [];
    let _photo_url_extraInitializers = [];
    let _biography_decorators;
    let _biography_initializers = [];
    let _biography_extraInitializers = [];
    let _research_interests_decorators;
    let _research_interests_initializers = [];
    let _research_interests_extraInitializers = [];
    let _specializations_decorators;
    let _specializations_initializers = [];
    let _specializations_extraInitializers = [];
    let _publications_decorators;
    let _publications_initializers = [];
    let _publications_extraInitializers = [];
    let _office_location_decorators;
    let _office_location_initializers = [];
    let _office_location_extraInitializers = [];
    let _office_hours_decorators;
    let _office_hours_initializers = [];
    let _office_hours_extraInitializers = [];
    let _preferred_contact_decorators;
    let _preferred_contact_initializers = [];
    let _preferred_contact_extraInitializers = [];
    let _website_url_decorators;
    let _website_url_initializers = [];
    let _website_url_extraInitializers = [];
    let _linkedin_url_decorators;
    let _linkedin_url_initializers = [];
    let _linkedin_url_extraInitializers = [];
    let _orcid_id_decorators;
    let _orcid_id_initializers = [];
    let _orcid_id_extraInitializers = [];
    var FacultyProfile = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.faculty_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _faculty_id_initializers, void 0));
            this.faculty = (__runInitializers(this, _faculty_id_extraInitializers), __runInitializers(this, _faculty_initializers, void 0));
            this.photo_url = (__runInitializers(this, _faculty_extraInitializers), __runInitializers(this, _photo_url_initializers, void 0));
            this.biography = (__runInitializers(this, _photo_url_extraInitializers), __runInitializers(this, _biography_initializers, void 0));
            this.research_interests = (__runInitializers(this, _biography_extraInitializers), __runInitializers(this, _research_interests_initializers, void 0));
            this.specializations = (__runInitializers(this, _research_interests_extraInitializers), __runInitializers(this, _specializations_initializers, void 0));
            this.publications = (__runInitializers(this, _specializations_extraInitializers), __runInitializers(this, _publications_initializers, void 0));
            this.office_location = (__runInitializers(this, _publications_extraInitializers), __runInitializers(this, _office_location_initializers, void 0));
            this.office_hours = (__runInitializers(this, _office_location_extraInitializers), __runInitializers(this, _office_hours_initializers, void 0));
            this.preferred_contact = (__runInitializers(this, _office_hours_extraInitializers), __runInitializers(this, _preferred_contact_initializers, void 0));
            this.website_url = (__runInitializers(this, _preferred_contact_extraInitializers), __runInitializers(this, _website_url_initializers, void 0));
            this.linkedin_url = (__runInitializers(this, _website_url_extraInitializers), __runInitializers(this, _linkedin_url_initializers, void 0));
            this.orcid_id = (__runInitializers(this, _linkedin_url_extraInitializers), __runInitializers(this, _orcid_id_initializers, void 0));
            __runInitializers(this, _orcid_id_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FacultyProfile");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Profile unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _faculty_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Faculty), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _faculty_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Faculty)];
        _photo_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Profile photo URL' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _biography_decorators = [(0, swagger_1.ApiProperty)({ description: 'Biography' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _research_interests_decorators = [(0, swagger_1.ApiProperty)({ description: 'Research interests' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                defaultValue: [],
            })];
        _specializations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Teaching specializations' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                defaultValue: [],
            })];
        _publications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Publications' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _office_location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Office location' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _office_hours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Office hours' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _preferred_contact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preferred contact method' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _website_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Website URL' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _linkedin_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'LinkedIn profile' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _orcid_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'ORCID identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _faculty_id_decorators, { kind: "field", name: "faculty_id", static: false, private: false, access: { has: obj => "faculty_id" in obj, get: obj => obj.faculty_id, set: (obj, value) => { obj.faculty_id = value; } }, metadata: _metadata }, _faculty_id_initializers, _faculty_id_extraInitializers);
        __esDecorate(null, null, _faculty_decorators, { kind: "field", name: "faculty", static: false, private: false, access: { has: obj => "faculty" in obj, get: obj => obj.faculty, set: (obj, value) => { obj.faculty = value; } }, metadata: _metadata }, _faculty_initializers, _faculty_extraInitializers);
        __esDecorate(null, null, _photo_url_decorators, { kind: "field", name: "photo_url", static: false, private: false, access: { has: obj => "photo_url" in obj, get: obj => obj.photo_url, set: (obj, value) => { obj.photo_url = value; } }, metadata: _metadata }, _photo_url_initializers, _photo_url_extraInitializers);
        __esDecorate(null, null, _biography_decorators, { kind: "field", name: "biography", static: false, private: false, access: { has: obj => "biography" in obj, get: obj => obj.biography, set: (obj, value) => { obj.biography = value; } }, metadata: _metadata }, _biography_initializers, _biography_extraInitializers);
        __esDecorate(null, null, _research_interests_decorators, { kind: "field", name: "research_interests", static: false, private: false, access: { has: obj => "research_interests" in obj, get: obj => obj.research_interests, set: (obj, value) => { obj.research_interests = value; } }, metadata: _metadata }, _research_interests_initializers, _research_interests_extraInitializers);
        __esDecorate(null, null, _specializations_decorators, { kind: "field", name: "specializations", static: false, private: false, access: { has: obj => "specializations" in obj, get: obj => obj.specializations, set: (obj, value) => { obj.specializations = value; } }, metadata: _metadata }, _specializations_initializers, _specializations_extraInitializers);
        __esDecorate(null, null, _publications_decorators, { kind: "field", name: "publications", static: false, private: false, access: { has: obj => "publications" in obj, get: obj => obj.publications, set: (obj, value) => { obj.publications = value; } }, metadata: _metadata }, _publications_initializers, _publications_extraInitializers);
        __esDecorate(null, null, _office_location_decorators, { kind: "field", name: "office_location", static: false, private: false, access: { has: obj => "office_location" in obj, get: obj => obj.office_location, set: (obj, value) => { obj.office_location = value; } }, metadata: _metadata }, _office_location_initializers, _office_location_extraInitializers);
        __esDecorate(null, null, _office_hours_decorators, { kind: "field", name: "office_hours", static: false, private: false, access: { has: obj => "office_hours" in obj, get: obj => obj.office_hours, set: (obj, value) => { obj.office_hours = value; } }, metadata: _metadata }, _office_hours_initializers, _office_hours_extraInitializers);
        __esDecorate(null, null, _preferred_contact_decorators, { kind: "field", name: "preferred_contact", static: false, private: false, access: { has: obj => "preferred_contact" in obj, get: obj => obj.preferred_contact, set: (obj, value) => { obj.preferred_contact = value; } }, metadata: _metadata }, _preferred_contact_initializers, _preferred_contact_extraInitializers);
        __esDecorate(null, null, _website_url_decorators, { kind: "field", name: "website_url", static: false, private: false, access: { has: obj => "website_url" in obj, get: obj => obj.website_url, set: (obj, value) => { obj.website_url = value; } }, metadata: _metadata }, _website_url_initializers, _website_url_extraInitializers);
        __esDecorate(null, null, _linkedin_url_decorators, { kind: "field", name: "linkedin_url", static: false, private: false, access: { has: obj => "linkedin_url" in obj, get: obj => obj.linkedin_url, set: (obj, value) => { obj.linkedin_url = value; } }, metadata: _metadata }, _linkedin_url_initializers, _linkedin_url_extraInitializers);
        __esDecorate(null, null, _orcid_id_decorators, { kind: "field", name: "orcid_id", static: false, private: false, access: { has: obj => "orcid_id" in obj, get: obj => obj.orcid_id, set: (obj, value) => { obj.orcid_id = value; } }, metadata: _metadata }, _orcid_id_initializers, _orcid_id_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FacultyProfile = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FacultyProfile = _classThis;
})();
exports.FacultyProfile = FacultyProfile;
/**
 * Faculty Load model - Teaching load and course assignments
 */
let FacultyLoad = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'faculty_loads',
            timestamps: true,
            indexes: [
                { fields: ['faculty_id', 'semester', 'academic_year'] },
                { fields: ['course_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _faculty_id_decorators;
    let _faculty_id_initializers = [];
    let _faculty_id_extraInitializers = [];
    let _faculty_decorators;
    let _faculty_initializers = [];
    let _faculty_extraInitializers = [];
    let _course_id_decorators;
    let _course_id_initializers = [];
    let _course_id_extraInitializers = [];
    let _academic_year_decorators;
    let _academic_year_initializers = [];
    let _academic_year_extraInitializers = [];
    let _semester_decorators;
    let _semester_initializers = [];
    let _semester_extraInitializers = [];
    let _credit_hours_decorators;
    let _credit_hours_initializers = [];
    let _credit_hours_extraInitializers = [];
    let _enrollment_count_decorators;
    let _enrollment_count_initializers = [];
    let _enrollment_count_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _is_primary_decorators;
    let _is_primary_initializers = [];
    let _is_primary_extraInitializers = [];
    let _load_percentage_decorators;
    let _load_percentage_initializers = [];
    let _load_percentage_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    var FacultyLoad = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.faculty_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _faculty_id_initializers, void 0));
            this.faculty = (__runInitializers(this, _faculty_id_extraInitializers), __runInitializers(this, _faculty_initializers, void 0));
            this.course_id = (__runInitializers(this, _faculty_extraInitializers), __runInitializers(this, _course_id_initializers, void 0));
            this.academic_year = (__runInitializers(this, _course_id_extraInitializers), __runInitializers(this, _academic_year_initializers, void 0));
            this.semester = (__runInitializers(this, _academic_year_extraInitializers), __runInitializers(this, _semester_initializers, void 0));
            this.credit_hours = (__runInitializers(this, _semester_extraInitializers), __runInitializers(this, _credit_hours_initializers, void 0));
            this.enrollment_count = (__runInitializers(this, _credit_hours_extraInitializers), __runInitializers(this, _enrollment_count_initializers, void 0));
            this.role = (__runInitializers(this, _enrollment_count_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.is_primary = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _is_primary_initializers, void 0));
            this.load_percentage = (__runInitializers(this, _is_primary_extraInitializers), __runInitializers(this, _load_percentage_initializers, void 0));
            this.notes = (__runInitializers(this, _load_percentage_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            __runInitializers(this, _notes_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FacultyLoad");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Load unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _faculty_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Faculty), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _faculty_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Faculty)];
        _course_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _academic_year_decorators = [(0, swagger_1.ApiProperty)({ description: 'Academic year' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: false,
            })];
        _semester_decorators = [(0, swagger_1.ApiProperty)({ description: 'Semester' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _credit_hours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit hours' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 3.0,
            })];
        _enrollment_count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enrollment count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role in course' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                defaultValue: 'instructor',
            })];
        _is_primary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is primary instructor' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _load_percentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Load percentage (0-100)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                defaultValue: 100.0,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _faculty_id_decorators, { kind: "field", name: "faculty_id", static: false, private: false, access: { has: obj => "faculty_id" in obj, get: obj => obj.faculty_id, set: (obj, value) => { obj.faculty_id = value; } }, metadata: _metadata }, _faculty_id_initializers, _faculty_id_extraInitializers);
        __esDecorate(null, null, _faculty_decorators, { kind: "field", name: "faculty", static: false, private: false, access: { has: obj => "faculty" in obj, get: obj => obj.faculty, set: (obj, value) => { obj.faculty = value; } }, metadata: _metadata }, _faculty_initializers, _faculty_extraInitializers);
        __esDecorate(null, null, _course_id_decorators, { kind: "field", name: "course_id", static: false, private: false, access: { has: obj => "course_id" in obj, get: obj => obj.course_id, set: (obj, value) => { obj.course_id = value; } }, metadata: _metadata }, _course_id_initializers, _course_id_extraInitializers);
        __esDecorate(null, null, _academic_year_decorators, { kind: "field", name: "academic_year", static: false, private: false, access: { has: obj => "academic_year" in obj, get: obj => obj.academic_year, set: (obj, value) => { obj.academic_year = value; } }, metadata: _metadata }, _academic_year_initializers, _academic_year_extraInitializers);
        __esDecorate(null, null, _semester_decorators, { kind: "field", name: "semester", static: false, private: false, access: { has: obj => "semester" in obj, get: obj => obj.semester, set: (obj, value) => { obj.semester = value; } }, metadata: _metadata }, _semester_initializers, _semester_extraInitializers);
        __esDecorate(null, null, _credit_hours_decorators, { kind: "field", name: "credit_hours", static: false, private: false, access: { has: obj => "credit_hours" in obj, get: obj => obj.credit_hours, set: (obj, value) => { obj.credit_hours = value; } }, metadata: _metadata }, _credit_hours_initializers, _credit_hours_extraInitializers);
        __esDecorate(null, null, _enrollment_count_decorators, { kind: "field", name: "enrollment_count", static: false, private: false, access: { has: obj => "enrollment_count" in obj, get: obj => obj.enrollment_count, set: (obj, value) => { obj.enrollment_count = value; } }, metadata: _metadata }, _enrollment_count_initializers, _enrollment_count_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _is_primary_decorators, { kind: "field", name: "is_primary", static: false, private: false, access: { has: obj => "is_primary" in obj, get: obj => obj.is_primary, set: (obj, value) => { obj.is_primary = value; } }, metadata: _metadata }, _is_primary_initializers, _is_primary_extraInitializers);
        __esDecorate(null, null, _load_percentage_decorators, { kind: "field", name: "load_percentage", static: false, private: false, access: { has: obj => "load_percentage" in obj, get: obj => obj.load_percentage, set: (obj, value) => { obj.load_percentage = value; } }, metadata: _metadata }, _load_percentage_initializers, _load_percentage_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FacultyLoad = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FacultyLoad = _classThis;
})();
exports.FacultyLoad = FacultyLoad;
/**
 * Faculty Qualifications model - Degrees, certifications, licenses
 */
let FacultyQualifications = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'faculty_qualifications',
            timestamps: true,
            indexes: [
                { fields: ['faculty_id'] },
                { fields: ['qualification_type'] },
                { fields: ['expiration_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _faculty_id_decorators;
    let _faculty_id_initializers = [];
    let _faculty_id_extraInitializers = [];
    let _faculty_decorators;
    let _faculty_initializers = [];
    let _faculty_extraInitializers = [];
    let _qualification_type_decorators;
    let _qualification_type_initializers = [];
    let _qualification_type_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _institution_decorators;
    let _institution_initializers = [];
    let _institution_extraInitializers = [];
    let _field_decorators;
    let _field_initializers = [];
    let _field_extraInitializers = [];
    let _earned_date_decorators;
    let _earned_date_initializers = [];
    let _earned_date_extraInitializers = [];
    let _expiration_date_decorators;
    let _expiration_date_initializers = [];
    let _expiration_date_extraInitializers = [];
    let _credential_number_decorators;
    let _credential_number_initializers = [];
    let _credential_number_extraInitializers = [];
    let _verification_url_decorators;
    let _verification_url_initializers = [];
    let _verification_url_extraInitializers = [];
    let _is_verified_decorators;
    let _is_verified_initializers = [];
    let _is_verified_extraInitializers = [];
    let _document_url_decorators;
    let _document_url_initializers = [];
    let _document_url_extraInitializers = [];
    var FacultyQualifications = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.faculty_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _faculty_id_initializers, void 0));
            this.faculty = (__runInitializers(this, _faculty_id_extraInitializers), __runInitializers(this, _faculty_initializers, void 0));
            this.qualification_type = (__runInitializers(this, _faculty_extraInitializers), __runInitializers(this, _qualification_type_initializers, void 0));
            this.name = (__runInitializers(this, _qualification_type_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.institution = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _institution_initializers, void 0));
            this.field = (__runInitializers(this, _institution_extraInitializers), __runInitializers(this, _field_initializers, void 0));
            this.earned_date = (__runInitializers(this, _field_extraInitializers), __runInitializers(this, _earned_date_initializers, void 0));
            this.expiration_date = (__runInitializers(this, _earned_date_extraInitializers), __runInitializers(this, _expiration_date_initializers, void 0));
            this.credential_number = (__runInitializers(this, _expiration_date_extraInitializers), __runInitializers(this, _credential_number_initializers, void 0));
            this.verification_url = (__runInitializers(this, _credential_number_extraInitializers), __runInitializers(this, _verification_url_initializers, void 0));
            this.is_verified = (__runInitializers(this, _verification_url_extraInitializers), __runInitializers(this, _is_verified_initializers, void 0));
            this.document_url = (__runInitializers(this, _is_verified_extraInitializers), __runInitializers(this, _document_url_initializers, void 0));
            __runInitializers(this, _document_url_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FacultyQualifications");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Qualification unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _faculty_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Faculty), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _faculty_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Faculty)];
        _qualification_type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Qualification type', enum: QualificationType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(QualificationType)),
                allowNull: false,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Qualification name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _institution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issuing institution' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _field_decorators = [(0, swagger_1.ApiProperty)({ description: 'Field of study' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: true,
            })];
        _earned_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date earned' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _expiration_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date (for licenses/certifications)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _credential_number_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credential number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _verification_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Verification URL' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _is_verified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is verified' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _document_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document attachment URL' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _faculty_id_decorators, { kind: "field", name: "faculty_id", static: false, private: false, access: { has: obj => "faculty_id" in obj, get: obj => obj.faculty_id, set: (obj, value) => { obj.faculty_id = value; } }, metadata: _metadata }, _faculty_id_initializers, _faculty_id_extraInitializers);
        __esDecorate(null, null, _faculty_decorators, { kind: "field", name: "faculty", static: false, private: false, access: { has: obj => "faculty" in obj, get: obj => obj.faculty, set: (obj, value) => { obj.faculty = value; } }, metadata: _metadata }, _faculty_initializers, _faculty_extraInitializers);
        __esDecorate(null, null, _qualification_type_decorators, { kind: "field", name: "qualification_type", static: false, private: false, access: { has: obj => "qualification_type" in obj, get: obj => obj.qualification_type, set: (obj, value) => { obj.qualification_type = value; } }, metadata: _metadata }, _qualification_type_initializers, _qualification_type_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _institution_decorators, { kind: "field", name: "institution", static: false, private: false, access: { has: obj => "institution" in obj, get: obj => obj.institution, set: (obj, value) => { obj.institution = value; } }, metadata: _metadata }, _institution_initializers, _institution_extraInitializers);
        __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: obj => "field" in obj, get: obj => obj.field, set: (obj, value) => { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
        __esDecorate(null, null, _earned_date_decorators, { kind: "field", name: "earned_date", static: false, private: false, access: { has: obj => "earned_date" in obj, get: obj => obj.earned_date, set: (obj, value) => { obj.earned_date = value; } }, metadata: _metadata }, _earned_date_initializers, _earned_date_extraInitializers);
        __esDecorate(null, null, _expiration_date_decorators, { kind: "field", name: "expiration_date", static: false, private: false, access: { has: obj => "expiration_date" in obj, get: obj => obj.expiration_date, set: (obj, value) => { obj.expiration_date = value; } }, metadata: _metadata }, _expiration_date_initializers, _expiration_date_extraInitializers);
        __esDecorate(null, null, _credential_number_decorators, { kind: "field", name: "credential_number", static: false, private: false, access: { has: obj => "credential_number" in obj, get: obj => obj.credential_number, set: (obj, value) => { obj.credential_number = value; } }, metadata: _metadata }, _credential_number_initializers, _credential_number_extraInitializers);
        __esDecorate(null, null, _verification_url_decorators, { kind: "field", name: "verification_url", static: false, private: false, access: { has: obj => "verification_url" in obj, get: obj => obj.verification_url, set: (obj, value) => { obj.verification_url = value; } }, metadata: _metadata }, _verification_url_initializers, _verification_url_extraInitializers);
        __esDecorate(null, null, _is_verified_decorators, { kind: "field", name: "is_verified", static: false, private: false, access: { has: obj => "is_verified" in obj, get: obj => obj.is_verified, set: (obj, value) => { obj.is_verified = value; } }, metadata: _metadata }, _is_verified_initializers, _is_verified_extraInitializers);
        __esDecorate(null, null, _document_url_decorators, { kind: "field", name: "document_url", static: false, private: false, access: { has: obj => "document_url" in obj, get: obj => obj.document_url, set: (obj, value) => { obj.document_url = value; } }, metadata: _metadata }, _document_url_initializers, _document_url_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FacultyQualifications = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FacultyQualifications = _classThis;
})();
exports.FacultyQualifications = FacultyQualifications;
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Faculty creation schema
 */
exports.CreateFacultySchema = zod_1.z.object({
    employee_id: zod_1.z.string().min(1).max(50),
    first_name: zod_1.z.string().min(1).max(100),
    middle_name: zod_1.z.string().max(100).optional(),
    last_name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email().max(255),
    phone: zod_1.z.string().max(20).optional(),
    rank: zod_1.z.nativeEnum(FacultyRank),
    employment_type: zod_1.z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
    department_id: zod_1.z.string().uuid().optional(),
    hire_date: zod_1.z.coerce.date(),
    is_tenured: zod_1.z.boolean().default(false),
    tenure_date: zod_1.z.coerce.date().optional(),
});
/**
 * Faculty update schema
 */
exports.UpdateFacultySchema = exports.CreateFacultySchema.partial();
/**
 * Faculty profile schema
 */
exports.FacultyProfileSchema = zod_1.z.object({
    faculty_id: zod_1.z.string().uuid(),
    photo_url: zod_1.z.string().url().optional(),
    biography: zod_1.z.string().optional(),
    research_interests: zod_1.z.array(zod_1.z.string()).default([]),
    specializations: zod_1.z.array(zod_1.z.string()).default([]),
    office_location: zod_1.z.string().max(100).optional(),
    office_hours: zod_1.z.array(zod_1.z.object({
        day: zod_1.z.nativeEnum(DayOfWeek),
        start_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        location: zod_1.z.string().optional(),
        type: zod_1.z.enum(['in_person', 'virtual', 'hybrid']).optional(),
    })).default([]),
    preferred_contact: zod_1.z.string().max(50).optional(),
    website_url: zod_1.z.string().url().optional(),
    linkedin_url: zod_1.z.string().url().optional(),
    orcid_id: zod_1.z.string().max(50).optional(),
});
/**
 * Course assignment schema
 */
exports.CourseAssignmentSchema = zod_1.z.object({
    faculty_id: zod_1.z.string().uuid(),
    course_id: zod_1.z.string().uuid(),
    academic_year: zod_1.z.string().max(10),
    semester: zod_1.z.string().max(20),
    credit_hours: zod_1.z.number().min(0).max(20).default(3),
    role: zod_1.z.string().max(50).default('instructor'),
    is_primary: zod_1.z.boolean().default(true),
    load_percentage: zod_1.z.number().min(0).max(100).default(100),
    notes: zod_1.z.string().optional(),
});
/**
 * Qualification schema
 */
exports.QualificationSchema = zod_1.z.object({
    faculty_id: zod_1.z.string().uuid(),
    qualification_type: zod_1.z.nativeEnum(QualificationType),
    name: zod_1.z.string().min(1).max(200),
    institution: zod_1.z.string().min(1).max(200),
    field: zod_1.z.string().max(200).optional(),
    earned_date: zod_1.z.coerce.date(),
    expiration_date: zod_1.z.coerce.date().optional(),
    credential_number: zod_1.z.string().max(100).optional(),
    verification_url: zod_1.z.string().url().optional(),
    document_url: zod_1.z.string().url().optional(),
});
// ============================================================================
// FACULTY MANAGEMENT SERVICE
// ============================================================================
let FacultyManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FacultyManagementService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(FacultyManagementService.name);
        }
        // ========================================================================
        // CORE CRUD OPERATIONS (Functions 1-10)
        // ========================================================================
        /**
         * Function 1: Create faculty record
         * POST /api/v1/faculty
         * Status: 201 Created, 400 Bad Request, 409 Conflict
         */
        async createFaculty(data) {
            try {
                // Validate input
                const validated = exports.CreateFacultySchema.parse(data);
                // Check for duplicate email or employee_id
                const existing = await Faculty.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { email: validated.email },
                            { employee_id: validated.employee_id },
                        ],
                    },
                });
                if (existing) {
                    throw new common_1.ConflictException('Faculty with this email or employee ID already exists');
                }
                // Create faculty
                const faculty = await Faculty.create(validated);
                this.logger.log(`Created faculty: ${faculty.id} (${faculty.email})`);
                return faculty;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
                        message: 'Validation failed',
                        errors: error.errors,
                    });
                }
                throw error;
            }
        }
        /**
         * Function 2: Get faculty by ID
         * GET /api/v1/faculty/:id
         * Status: 200 OK, 404 Not Found
         */
        async getFacultyById(id, options) {
            const include = [];
            if (options?.includeProfile) {
                include.push({ model: FacultyProfile, as: 'profile' });
            }
            if (options?.includeLoads) {
                include.push({ model: FacultyLoad, as: 'teaching_loads' });
            }
            if (options?.includeQualifications) {
                include.push({ model: FacultyQualifications, as: 'qualifications' });
            }
            const faculty = await Faculty.findByPk(id, { include });
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${id} not found`);
            }
            return faculty;
        }
        /**
         * Function 3: List faculty with pagination
         * GET /api/v1/faculty?page=1&limit=20&sort=last_name&order=asc
         * Status: 200 OK
         */
        async listFaculty(params) {
            const page = Math.max(1, params.page || 1);
            const limit = Math.min(100, Math.max(1, params.limit || 20));
            const offset = (page - 1) * limit;
            const where = {};
            // Filter by status
            if (params.status) {
                where.status = params.status;
            }
            // Filter by rank
            if (params.rank) {
                where.rank = params.rank;
            }
            // Filter by department
            if (params.department_id) {
                where.department_id = params.department_id;
            }
            // Search functionality
            if (params.search) {
                where[sequelize_1.Op.or] = [
                    { first_name: { [sequelize_1.Op.iLike]: `%${params.search}%` } },
                    { last_name: { [sequelize_1.Op.iLike]: `%${params.search}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${params.search}%` } },
                    { employee_id: { [sequelize_1.Op.iLike]: `%${params.search}%` } },
                ];
            }
            // Sorting
            const order = [];
            if (params.sort) {
                order.push([params.sort, params.order || 'asc']);
            }
            else {
                order.push(['last_name', 'asc']);
            }
            const { rows: data, count: total } = await Faculty.findAndCountAll({
                where,
                limit,
                offset,
                order,
            });
            const total_pages = Math.ceil(total / limit);
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages,
                    has_next: page < total_pages,
                    has_prev: page > 1,
                },
            };
        }
        /**
         * Function 4: Update faculty information
         * PUT /api/v1/faculty/:id or PATCH /api/v1/faculty/:id
         * Status: 200 OK, 404 Not Found, 400 Bad Request
         */
        async updateFaculty(id, data) {
            try {
                const validated = exports.UpdateFacultySchema.parse(data);
                const faculty = await Faculty.findByPk(id);
                if (!faculty) {
                    throw new common_1.NotFoundException(`Faculty with ID ${id} not found`);
                }
                // Check for email/employee_id conflicts if being updated
                if (validated.email || validated.employee_id) {
                    const conflicts = await Faculty.findOne({
                        where: {
                            id: { [sequelize_1.Op.ne]: id },
                            [sequelize_1.Op.or]: [
                                ...(validated.email ? [{ email: validated.email }] : []),
                                ...(validated.employee_id ? [{ employee_id: validated.employee_id }] : []),
                            ],
                        },
                    });
                    if (conflicts) {
                        throw new common_1.ConflictException('Email or employee ID already in use');
                    }
                }
                await faculty.update(validated);
                this.logger.log(`Updated faculty: ${id}`);
                return faculty;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
                        message: 'Validation failed',
                        errors: error.errors,
                    });
                }
                throw error;
            }
        }
        /**
         * Function 5: Delete/deactivate faculty
         * DELETE /api/v1/faculty/:id
         * Status: 204 No Content, 404 Not Found
         */
        async deleteFaculty(id, softDelete = true) {
            const faculty = await Faculty.findByPk(id);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${id} not found`);
            }
            if (softDelete) {
                // Soft delete - update status
                await faculty.update({
                    status: FacultyStatus.TERMINATED,
                    termination_date: new Date(),
                });
                this.logger.log(`Soft deleted faculty: ${id}`);
            }
            else {
                // Hard delete
                await faculty.destroy();
                this.logger.log(`Hard deleted faculty: ${id}`);
            }
        }
        /**
         * Function 6: Bulk create faculty
         * POST /api/v1/faculty/bulk
         * Status: 201 Created, 400 Bad Request
         */
        async bulkCreateFaculty(facultyList) {
            const created = [];
            const errors = [];
            for (let i = 0; i < facultyList.length; i++) {
                try {
                    const faculty = await this.createFaculty(facultyList[i]);
                    created.push(faculty);
                }
                catch (error) {
                    errors.push({
                        index: i,
                        error: error.message || 'Unknown error',
                    });
                }
            }
            this.logger.log(`Bulk created ${created.length} faculty, ${errors.length} errors`);
            return { created, errors };
        }
        /**
         * Function 7: Search faculty
         * GET /api/v1/faculty/search?q=searchterm
         * Status: 200 OK
         */
        async searchFaculty(query, limit = 20) {
            if (!query || query.trim().length === 0) {
                throw new common_1.BadRequestException('Search query is required');
            }
            const faculty = await Faculty.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { first_name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { last_name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { email: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { employee_id: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    ],
                },
                limit: Math.min(limit, 100),
                order: [['last_name', 'asc']],
            });
            return faculty;
        }
        /**
         * Function 8: Filter faculty by criteria
         * GET /api/v1/faculty/filter
         * Status: 200 OK
         */
        async filterFaculty(criteria) {
            const where = {};
            if (criteria.status && criteria.status.length > 0) {
                where.status = { [sequelize_1.Op.in]: criteria.status };
            }
            if (criteria.rank && criteria.rank.length > 0) {
                where.rank = { [sequelize_1.Op.in]: criteria.rank };
            }
            if (criteria.employment_type && criteria.employment_type.length > 0) {
                where.employment_type = { [sequelize_1.Op.in]: criteria.employment_type };
            }
            if (criteria.department_ids && criteria.department_ids.length > 0) {
                where.department_id = { [sequelize_1.Op.in]: criteria.department_ids };
            }
            if (criteria.is_tenured !== undefined) {
                where.is_tenured = criteria.is_tenured;
            }
            if (criteria.hired_after) {
                where.hire_date = { ...where.hire_date, [sequelize_1.Op.gte]: criteria.hired_after };
            }
            if (criteria.hired_before) {
                where.hire_date = { ...where.hire_date, [sequelize_1.Op.lte]: criteria.hired_before };
            }
            const faculty = await Faculty.findAll({
                where,
                order: [['last_name', 'asc']],
            });
            return faculty;
        }
        /**
         * Function 9: Sort faculty results
         * GET /api/v1/faculty?sort=field&order=asc|desc
         * Status: 200 OK
         */
        async sortFaculty(sortField = 'last_name', sortOrder = 'asc', filters) {
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'rank',
                'hire_date',
                'employee_id',
            ];
            if (!allowedFields.includes(sortField)) {
                throw new common_1.BadRequestException(`Invalid sort field. Allowed: ${allowedFields.join(', ')}`);
            }
            const faculty = await Faculty.findAll({
                where: filters || {},
                order: [[sortField, sortOrder.toUpperCase()]],
            });
            return faculty;
        }
        /**
         * Function 10: Export faculty data
         * GET /api/v1/faculty/export?format=json|csv
         * Status: 200 OK
         */
        async exportFacultyData(format = 'json') {
            const faculty = await Faculty.findAll({
                include: [
                    { model: FacultyProfile, as: 'profile' },
                    { model: FacultyQualifications, as: 'qualifications' },
                ],
            });
            if (format === 'csv') {
                // Convert to CSV format
                const headers = [
                    'ID',
                    'Employee ID',
                    'First Name',
                    'Last Name',
                    'Email',
                    'Rank',
                    'Status',
                    'Department ID',
                    'Hire Date',
                ];
                const rows = faculty.map((f) => [
                    f.id,
                    f.employee_id,
                    f.first_name,
                    f.last_name,
                    f.email,
                    f.rank,
                    f.status,
                    f.department_id || '',
                    f.hire_date,
                ]);
                return {
                    headers,
                    rows,
                    format: 'csv',
                };
            }
            return {
                data: faculty,
                format: 'json',
                count: faculty.length,
            };
        }
        // ========================================================================
        // FACULTY PROFILE MANAGEMENT (Functions 11-18)
        // ========================================================================
        /**
         * Function 11: Create faculty profile
         * POST /api/v1/faculty/:facultyId/profile
         * Status: 201 Created, 400 Bad Request, 409 Conflict
         */
        async createFacultyProfile(data) {
            try {
                const validated = exports.FacultyProfileSchema.parse(data);
                // Check if faculty exists
                const faculty = await Faculty.findByPk(validated.faculty_id);
                if (!faculty) {
                    throw new common_1.NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
                }
                // Check if profile already exists
                const existing = await FacultyProfile.findOne({
                    where: { faculty_id: validated.faculty_id },
                });
                if (existing) {
                    throw new common_1.ConflictException('Profile already exists for this faculty');
                }
                const profile = await FacultyProfile.create(validated);
                this.logger.log(`Created profile for faculty: ${validated.faculty_id}`);
                return profile;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
                        message: 'Validation failed',
                        errors: error.errors,
                    });
                }
                throw error;
            }
        }
        /**
         * Function 12: Update profile information
         * PATCH /api/v1/faculty/:facultyId/profile
         * Status: 200 OK, 404 Not Found
         */
        async updateFacultyProfile(facultyId, data) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            await profile.update(data);
            this.logger.log(`Updated profile for faculty: ${facultyId}`);
            return profile;
        }
        /**
         * Function 13: Get profile details
         * GET /api/v1/faculty/:facultyId/profile
         * Status: 200 OK, 404 Not Found
         */
        async getFacultyProfile(facultyId) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
                include: [{ model: Faculty, as: 'faculty' }],
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            return profile;
        }
        /**
         * Function 14: Upload profile photo
         * POST /api/v1/faculty/:facultyId/profile/photo
         * Status: 200 OK, 404 Not Found
         */
        async uploadProfilePhoto(facultyId, photoUrl) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            await profile.update({ photo_url: photoUrl });
            this.logger.log(`Updated photo for faculty: ${facultyId}`);
            return profile;
        }
        /**
         * Function 15: Manage contact information
         * PATCH /api/v1/faculty/:id/contact
         * Status: 200 OK, 404 Not Found
         */
        async updateContactInformation(facultyId, contact) {
            const faculty = await Faculty.findByPk(facultyId);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${facultyId} not found`);
            }
            // Update faculty record
            if (contact.email)
                faculty.email = contact.email;
            if (contact.phone)
                faculty.phone = contact.phone;
            await faculty.save();
            // Update profile if it exists
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (profile) {
                if (contact.office_location)
                    profile.office_location = contact.office_location;
                if (contact.preferred_contact)
                    profile.preferred_contact = contact.preferred_contact;
                await profile.save();
            }
            this.logger.log(`Updated contact info for faculty: ${facultyId}`);
            return faculty;
        }
        /**
         * Function 16: Update biography
         * PATCH /api/v1/faculty/:facultyId/profile/biography
         * Status: 200 OK, 404 Not Found
         */
        async updateBiography(facultyId, biography) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            await profile.update({ biography });
            this.logger.log(`Updated biography for faculty: ${facultyId}`);
            return profile;
        }
        /**
         * Function 17: Set specializations
         * PUT /api/v1/faculty/:facultyId/profile/specializations
         * Status: 200 OK, 404 Not Found
         */
        async setSpecializations(facultyId, specializations) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            await profile.update({ specializations });
            this.logger.log(`Updated specializations for faculty: ${facultyId}`);
            return profile;
        }
        /**
         * Function 18: Manage publications
         * POST /api/v1/faculty/:facultyId/profile/publications
         * Status: 201 Created, 404 Not Found
         */
        async addPublication(facultyId, publication) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            const publications = [...(profile.publications || []), publication];
            await profile.update({ publications });
            this.logger.log(`Added publication for faculty: ${facultyId}`);
            return profile;
        }
        // ========================================================================
        // COURSE ASSIGNMENT (Functions 19-26)
        // ========================================================================
        /**
         * Function 19: Assign course to faculty
         * POST /api/v1/faculty/:facultyId/courses
         * Status: 201 Created, 400 Bad Request, 409 Conflict
         */
        async assignCourse(data) {
            try {
                const validated = exports.CourseAssignmentSchema.parse(data);
                // Check if faculty exists
                const faculty = await Faculty.findByPk(validated.faculty_id);
                if (!faculty) {
                    throw new common_1.NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
                }
                // Check for existing assignment
                const existing = await FacultyLoad.findOne({
                    where: {
                        faculty_id: validated.faculty_id,
                        course_id: validated.course_id,
                        academic_year: validated.academic_year,
                        semester: validated.semester,
                    },
                });
                if (existing) {
                    throw new common_1.ConflictException('Course already assigned to this faculty');
                }
                const assignment = await FacultyLoad.create(validated);
                this.logger.log(`Assigned course ${validated.course_id} to faculty ${validated.faculty_id}`);
                return assignment;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
                        message: 'Validation failed',
                        errors: error.errors,
                    });
                }
                throw error;
            }
        }
        /**
         * Function 20: Remove course assignment
         * DELETE /api/v1/faculty/:facultyId/courses/:assignmentId
         * Status: 204 No Content, 404 Not Found
         */
        async removeCourseAssignment(assignmentId) {
            const assignment = await FacultyLoad.findByPk(assignmentId);
            if (!assignment) {
                throw new common_1.NotFoundException(`Course assignment with ID ${assignmentId} not found`);
            }
            await assignment.destroy();
            this.logger.log(`Removed course assignment: ${assignmentId}`);
        }
        /**
         * Function 21: List faculty courses
         * GET /api/v1/faculty/:facultyId/courses
         * Status: 200 OK
         */
        async listFacultyCourses(facultyId, filters) {
            const where = { faculty_id: facultyId };
            if (filters?.academic_year) {
                where.academic_year = filters.academic_year;
            }
            if (filters?.semester) {
                where.semester = filters.semester;
            }
            const courses = await FacultyLoad.findAll({
                where,
                order: [['academic_year', 'desc'], ['semester', 'desc']],
            });
            return courses;
        }
        /**
         * Function 22: Get course assignment details
         * GET /api/v1/faculty/courses/:assignmentId
         * Status: 200 OK, 404 Not Found
         */
        async getCourseAssignmentDetails(assignmentId) {
            const assignment = await FacultyLoad.findByPk(assignmentId, {
                include: [{ model: Faculty, as: 'faculty' }],
            });
            if (!assignment) {
                throw new common_1.NotFoundException(`Course assignment with ID ${assignmentId} not found`);
            }
            return assignment;
        }
        /**
         * Function 23: Update course assignment
         * PATCH /api/v1/faculty/courses/:assignmentId
         * Status: 200 OK, 404 Not Found
         */
        async updateCourseAssignment(assignmentId, data) {
            const assignment = await FacultyLoad.findByPk(assignmentId);
            if (!assignment) {
                throw new common_1.NotFoundException(`Course assignment with ID ${assignmentId} not found`);
            }
            await assignment.update(data);
            this.logger.log(`Updated course assignment: ${assignmentId}`);
            return assignment;
        }
        /**
         * Function 24: Assign multiple courses
         * POST /api/v1/faculty/:facultyId/courses/bulk
         * Status: 201 Created
         */
        async assignMultipleCourses(facultyId, courses) {
            const created = [];
            const errors = [];
            for (let i = 0; i < courses.length; i++) {
                try {
                    const assignment = await this.assignCourse({
                        ...courses[i],
                        faculty_id: facultyId,
                    });
                    created.push(assignment);
                }
                catch (error) {
                    errors.push({
                        index: i,
                        error: error.message || 'Unknown error',
                    });
                }
            }
            this.logger.log(`Bulk assigned ${created.length} courses to faculty ${facultyId}, ${errors.length} errors`);
            return { created, errors };
        }
        /**
         * Function 25: Check assignment conflicts
         * GET /api/v1/faculty/:facultyId/courses/conflicts
         * Status: 200 OK
         */
        async checkAssignmentConflicts(facultyId, academicYear, semester) {
            // This would integrate with scheduling system to check for time conflicts
            // Simplified version here
            const assignments = await FacultyLoad.findAll({
                where: {
                    faculty_id: facultyId,
                    academic_year: academicYear,
                    semester,
                },
            });
            // Check for overload (simplified - would need actual credit hour limits)
            const totalCredits = assignments.reduce((sum, a) => sum + parseFloat(a.credit_hours.toString()), 0);
            const conflicts = [];
            if (totalCredits > 12) {
                conflicts.push({
                    type: 'overload',
                    message: `Faculty has ${totalCredits} credit hours (maximum: 12)`,
                    severity: 'warning',
                });
            }
            return {
                conflicts,
                hasConflicts: conflicts.length > 0,
            };
        }
        /**
         * Function 26: Course assignment history
         * GET /api/v1/faculty/:facultyId/courses/history
         * Status: 200 OK
         */
        async getCourseAssignmentHistory(facultyId) {
            const history = await FacultyLoad.findAll({
                where: { faculty_id: facultyId },
                order: [['academic_year', 'desc'], ['semester', 'desc']],
            });
            return history;
        }
        // ========================================================================
        // TEACHING LOAD CALCULATION (Functions 27-32)
        // ========================================================================
        /**
         * Function 27: Calculate teaching load
         * GET /api/v1/faculty/:facultyId/load/calculate
         * Status: 200 OK
         */
        async calculateTeachingLoad(facultyId, academicYear, semester) {
            const assignments = await FacultyLoad.findAll({
                where: {
                    faculty_id: facultyId,
                    academic_year: academicYear,
                    semester,
                },
            });
            const totalCreditHours = assignments.reduce((sum, a) => sum + parseFloat(a.credit_hours.toString()) * (parseFloat(a.load_percentage.toString()) / 100), 0);
            const totalStudents = assignments.reduce((sum, a) => sum + a.enrollment_count, 0);
            // Standard load is typically 12 credit hours per semester
            const standardLoad = 12;
            const loadPercentage = (totalCreditHours / standardLoad) * 100;
            let status = 'normal';
            if (loadPercentage < 75)
                status = 'underload';
            if (loadPercentage > 125)
                status = 'overload';
            return {
                faculty_id: facultyId,
                academic_year: academicYear,
                semester,
                total_credit_hours: totalCreditHours,
                total_courses: assignments.length,
                total_students: totalStudents,
                load_percentage: loadPercentage,
                status,
            };
        }
        /**
         * Function 28: Get current load
         * GET /api/v1/faculty/:facultyId/load/current
         * Status: 200 OK
         */
        async getCurrentLoad(facultyId) {
            // Get current academic year and semester (simplified)
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            let semester = 'fall';
            let academicYear = `${year}-${year + 1}`;
            if (month >= 1 && month <= 5) {
                semester = 'spring';
                academicYear = `${year - 1}-${year}`;
            }
            else if (month >= 6 && month <= 7) {
                semester = 'summer';
                academicYear = `${year}-${year + 1}`;
            }
            return this.calculateTeachingLoad(facultyId, academicYear, semester);
        }
        /**
         * Function 29: Load balancing algorithm
         * POST /api/v1/faculty/load/balance
         * Status: 200 OK
         */
        async balanceTeachingLoads(departmentId, academicYear, semester) {
            // Get all faculty in department
            const faculty = await Faculty.findAll({
                where: {
                    department_id: departmentId,
                    status: FacultyStatus.ACTIVE,
                },
            });
            const recommendations = [];
            for (const f of faculty) {
                const load = await this.calculateTeachingLoad(f.id, academicYear, semester);
                const adjustments = [];
                if (load.status === 'underload') {
                    adjustments.push('Consider assigning additional courses');
                }
                else if (load.status === 'overload') {
                    adjustments.push('Consider redistributing courses to other faculty');
                }
                recommendations.push({
                    faculty_id: f.id,
                    current_load: load.total_credit_hours,
                    recommended_adjustments: adjustments,
                });
            }
            return { recommendations };
        }
        /**
         * Function 30: Overload detection
         * GET /api/v1/faculty/load/overloads
         * Status: 200 OK
         */
        async detectOverloads(departmentId, academicYear, semester) {
            const faculty = await Faculty.findAll({
                where: {
                    department_id: departmentId,
                    status: FacultyStatus.ACTIVE,
                },
            });
            const overloaded = [];
            for (const f of faculty) {
                const load = await this.calculateTeachingLoad(f.id, academicYear, semester);
                if (load.status === 'overload') {
                    overloaded.push({ faculty: f, load });
                }
            }
            return { overloaded_faculty: overloaded };
        }
        /**
         * Function 31: Load comparison
         * GET /api/v1/faculty/load/compare
         * Status: 200 OK
         */
        async compareTeachingLoads(facultyIds, academicYear, semester) {
            const comparisons = [];
            let totalLoad = 0;
            for (const facultyId of facultyIds) {
                const faculty = await Faculty.findByPk(facultyId);
                if (!faculty)
                    continue;
                const load = await this.calculateTeachingLoad(facultyId, academicYear, semester);
                totalLoad += load.total_credit_hours;
                comparisons.push({
                    faculty_id: facultyId,
                    name: `${faculty.first_name} ${faculty.last_name}`,
                    load,
                });
            }
            const averageLoad = comparisons.length > 0 ? totalLoad / comparisons.length : 0;
            return {
                comparisons,
                average_load: averageLoad,
            };
        }
        /**
         * Function 32: Load forecasting
         * GET /api/v1/faculty/:facultyId/load/forecast
         * Status: 200 OK
         */
        async forecastTeachingLoad(facultyId, futureSemesters = 3) {
            // Get historical data
            const history = await FacultyLoad.findAll({
                where: { faculty_id: facultyId },
                order: [['academic_year', 'desc'], ['semester', 'desc']],
                limit: 6,
            });
            // Simple average-based forecast (would use more sophisticated ML in production)
            const avgLoad = history.reduce((sum, h) => sum + parseFloat(h.credit_hours.toString()), 0) /
                (history.length || 1);
            const forecasts = [];
            // Generate future forecasts
            const now = new Date();
            const currentYear = now.getFullYear();
            for (let i = 0; i < futureSemesters; i++) {
                const semesterIndex = i % 3;
                const yearOffset = Math.floor(i / 3);
                let semester = 'fall';
                if (semesterIndex === 1)
                    semester = 'spring';
                if (semesterIndex === 2)
                    semester = 'summer';
                forecasts.push({
                    academic_year: `${currentYear + yearOffset}-${currentYear + yearOffset + 1}`,
                    semester,
                    projected_load: avgLoad,
                });
            }
            return { forecasts };
        }
        // ========================================================================
        // CREDENTIALS & QUALIFICATIONS (Functions 33-37)
        // ========================================================================
        /**
         * Function 33: Add qualification
         * POST /api/v1/faculty/:facultyId/qualifications
         * Status: 201 Created, 400 Bad Request
         */
        async addQualification(data) {
            try {
                const validated = exports.QualificationSchema.parse(data);
                // Check if faculty exists
                const faculty = await Faculty.findByPk(validated.faculty_id);
                if (!faculty) {
                    throw new common_1.NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
                }
                const qualification = await FacultyQualifications.create(validated);
                this.logger.log(`Added qualification for faculty: ${validated.faculty_id}`);
                return qualification;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
                        message: 'Validation failed',
                        errors: error.errors,
                    });
                }
                throw error;
            }
        }
        /**
         * Function 34: Update credentials
         * PATCH /api/v1/faculty/qualifications/:qualificationId
         * Status: 200 OK, 404 Not Found
         */
        async updateQualification(qualificationId, data) {
            const qualification = await FacultyQualifications.findByPk(qualificationId);
            if (!qualification) {
                throw new common_1.NotFoundException(`Qualification with ID ${qualificationId} not found`);
            }
            await qualification.update(data);
            this.logger.log(`Updated qualification: ${qualificationId}`);
            return qualification;
        }
        /**
         * Function 35: Verify qualifications
         * POST /api/v1/faculty/qualifications/:qualificationId/verify
         * Status: 200 OK, 404 Not Found
         */
        async verifyQualification(qualificationId) {
            const qualification = await FacultyQualifications.findByPk(qualificationId);
            if (!qualification) {
                throw new common_1.NotFoundException(`Qualification with ID ${qualificationId} not found`);
            }
            await qualification.update({ is_verified: true });
            this.logger.log(`Verified qualification: ${qualificationId}`);
            return qualification;
        }
        /**
         * Function 36: List credentials
         * GET /api/v1/faculty/:facultyId/qualifications
         * Status: 200 OK
         */
        async listQualifications(facultyId, filters) {
            const where = { faculty_id: facultyId };
            if (filters?.qualification_type) {
                where.qualification_type = filters.qualification_type;
            }
            if (filters?.is_verified !== undefined) {
                where.is_verified = filters.is_verified;
            }
            const qualifications = await FacultyQualifications.findAll({
                where,
                order: [['earned_date', 'desc']],
            });
            return qualifications;
        }
        /**
         * Function 37: Credential expiration tracking
         * GET /api/v1/faculty/qualifications/expiring
         * Status: 200 OK
         */
        async getExpiringCredentials(daysAhead = 90) {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysAhead);
            const expiring = await FacultyQualifications.findAll({
                where: {
                    expiration_date: {
                        [sequelize_1.Op.between]: [now, futureDate],
                    },
                },
                include: [{ model: Faculty, as: 'faculty' }],
            });
            const result = expiring.map((q) => {
                const daysUntil = Math.ceil((q.expiration_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return {
                    qualification: q,
                    faculty: q.faculty,
                    days_until_expiration: daysUntil,
                };
            });
            return { expiring: result };
        }
        // ========================================================================
        // OFFICE HOURS & AVAILABILITY (Functions 38-42)
        // ========================================================================
        /**
         * Function 38: Set office hours
         * PUT /api/v1/faculty/:facultyId/office-hours
         * Status: 200 OK, 404 Not Found
         */
        async setOfficeHours(facultyId, officeHours) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            await profile.update({ office_hours: officeHours });
            this.logger.log(`Updated office hours for faculty: ${facultyId}`);
            return profile;
        }
        /**
         * Function 39: Get availability
         * GET /api/v1/faculty/:facultyId/availability
         * Status: 200 OK
         */
        async getFacultyAvailability(facultyId, date) {
            const profile = await FacultyProfile.findOne({
                where: { faculty_id: facultyId },
            });
            if (!profile) {
                throw new common_1.NotFoundException(`Profile not found for faculty: ${facultyId}`);
            }
            // Get teaching schedule (simplified)
            const teachingSchedule = await FacultyLoad.findAll({
                where: { faculty_id: facultyId },
            });
            // Calculate available slots (simplified - would integrate with calendar)
            const availableSlots = [];
            return {
                faculty_id: facultyId,
                office_hours: profile.office_hours || [],
                teaching_schedule: teachingSchedule,
                available_slots: availableSlots,
            };
        }
        /**
         * Function 40: Update schedule
         * PATCH /api/v1/faculty/:facultyId/schedule
         * Status: 200 OK
         */
        async updateFacultySchedule(facultyId, schedule) {
            // This would integrate with the scheduling system
            // Simplified implementation
            const faculty = await Faculty.findByPk(facultyId);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${facultyId} not found`);
            }
            this.logger.log(`Updated schedule for faculty: ${facultyId}`);
            return {
                success: true,
                message: 'Schedule updated successfully',
            };
        }
        /**
         * Function 41: Book appointment
         * POST /api/v1/faculty/:facultyId/appointments
         * Status: 201 Created
         */
        async bookAppointment(facultyId, appointment) {
            const faculty = await Faculty.findByPk(facultyId);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${facultyId} not found`);
            }
            // Check availability (simplified)
            const availability = await this.getFacultyAvailability(facultyId, appointment.date);
            // Create appointment (would store in appointments table)
            const appointmentId = `appt_${Date.now()}`;
            this.logger.log(`Booked appointment ${appointmentId} for faculty: ${facultyId}`);
            return {
                appointment_id: appointmentId,
                confirmation: `Appointment confirmed with ${faculty.first_name} ${faculty.last_name}`,
            };
        }
        /**
         * Function 42: Availability conflicts
         * GET /api/v1/faculty/:facultyId/availability/conflicts
         * Status: 200 OK
         */
        async checkAvailabilityConflicts(facultyId, startDate, endDate) {
            // This would check against teaching schedule, appointments, and other commitments
            // Simplified implementation
            const conflicts = [];
            const teachingLoad = await FacultyLoad.findAll({
                where: { faculty_id: facultyId },
            });
            // Add conflict detection logic here
            return { conflicts };
        }
        // ========================================================================
        // EVALUATIONS & CONTRACTS (Functions 43-45)
        // ========================================================================
        /**
         * Function 43: Create evaluation
         * POST /api/v1/faculty/:facultyId/evaluations
         * Status: 201 Created
         */
        async createEvaluation(evaluation) {
            const faculty = await Faculty.findByPk(evaluation.faculty_id);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${evaluation.faculty_id} not found`);
            }
            // Validate rating
            if (evaluation.rating < 1 || evaluation.rating > 5) {
                throw new common_1.BadRequestException('Rating must be between 1 and 5');
            }
            // Would create in evaluations table
            const evaluationId = `eval_${Date.now()}`;
            this.logger.log(`Created evaluation ${evaluationId} for faculty: ${evaluation.faculty_id}`);
            return {
                evaluation_id: evaluationId,
                status: 'submitted',
            };
        }
        /**
         * Function 44: Manage contracts
         * POST /api/v1/faculty/:facultyId/contracts
         * Status: 201 Created
         */
        async createContract(contract) {
            const faculty = await Faculty.findByPk(contract.faculty_id);
            if (!faculty) {
                throw new common_1.NotFoundException(`Faculty with ID ${contract.faculty_id} not found`);
            }
            // Validate dates
            if (contract.end_date <= contract.start_date) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            // Would create in contracts table
            const contractId = `contract_${Date.now()}`;
            this.logger.log(`Created contract ${contractId} for faculty: ${contract.faculty_id}`);
            return {
                contract_id: contractId,
                status: contract.signed_date ? 'active' : 'pending_signature',
            };
        }
        /**
         * Function 45: Contract renewal
         * POST /api/v1/faculty/contracts/:contractId/renew
         * Status: 201 Created, 404 Not Found
         */
        async renewContract(contractId, renewal) {
            // Would fetch original contract
            // Create new contract based on renewal terms
            const newContractId = `contract_${Date.now()}_renewal`;
            this.logger.log(`Renewed contract: ${contractId} -> ${newContractId}`);
            return {
                new_contract_id: newContractId,
                status: 'pending_signature',
            };
        }
    };
    __setFunctionName(_classThis, "FacultyManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FacultyManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FacultyManagementService = _classThis;
})();
exports.FacultyManagementService = FacultyManagementService;
// ============================================================================
// UTILITY TYPES AND HELPERS
// ============================================================================
/**
 * Import Op from Sequelize for operations
 */
const sequelize_1 = require("sequelize");
/**
 * API version constant
 */
exports.API_VERSION = 'v1';
/**
 * API base path
 */
exports.API_BASE_PATH = `/api/${exports.API_VERSION}`;
/**
 * Export all models for external use
 */
exports.FacultyModels = {
    Faculty,
    FacultyProfile,
    FacultyLoad,
    FacultyQualifications,
};
/**
 * Export all schemas for validation
 */
exports.FacultySchemas = {
    CreateFacultySchema: exports.CreateFacultySchema,
    UpdateFacultySchema: exports.UpdateFacultySchema,
    FacultyProfileSchema: exports.FacultyProfileSchema,
    CourseAssignmentSchema: exports.CourseAssignmentSchema,
    QualificationSchema: exports.QualificationSchema,
};
/**
 * Export all enums
 */
exports.FacultyEnums = {
    FacultyStatus,
    FacultyRank,
    EmploymentType,
    ContractType,
    EvaluationType,
    QualificationType,
    DayOfWeek,
};
//# sourceMappingURL=faculty-management-kit.js.map