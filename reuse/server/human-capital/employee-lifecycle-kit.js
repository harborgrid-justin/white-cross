"use strict";
/**
 * LOC: HCM-ELC-001
 * File: /reuse/server/human-capital/employee-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable HCM utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend HCM services
 *   - Employee management modules
 *   - Onboarding/offboarding services
 *   - Leave management systems
 *   - HR analytics and reporting
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
exports.EmployeeLifecycleService = exports.RehireRecord = exports.ExitInterview = exports.EmployeeExit = exports.ReturnToWork = exports.LeaveOfAbsence = exports.EmployeeRelocation = exports.InternalTransfer = exports.ProbationPeriod = exports.Onboarding = exports.EmployeeLifecycleEvent = exports.Employee = exports.RelocationStatus = exports.RehireEligibility = exports.ExitType = exports.LeaveStatus = exports.LeaveType = exports.TransferType = exports.ProbationStatus = exports.OnboardingStatus = exports.EmployeeLifecycleState = void 0;
exports.registerEmployee = registerEmployee;
exports.generateEmployeeNumber = generateEmployeeNumber;
exports.createOnboardingPlan = createOnboardingPlan;
exports.updateOnboardingChecklistItem = updateOnboardingChecklistItem;
exports.startOnboarding = startOnboarding;
exports.completeOnboarding = completeOnboarding;
exports.getOnboardingStatus = getOnboardingStatus;
exports.getOnboardingsByStatus = getOnboardingsByStatus;
exports.createProbationPeriod = createProbationPeriod;
exports.extendProbationPeriod = extendProbationPeriod;
exports.completeProbationEvaluation = completeProbationEvaluation;
exports.getProbationPeriodsEndingSoon = getProbationPeriodsEndingSoon;
exports.getProbationStatus = getProbationStatus;
exports.createTransferRequest = createTransferRequest;
exports.approveTransferRequest = approveTransferRequest;
exports.executeTransfer = executeTransfer;
exports.getPendingTransfers = getPendingTransfers;
exports.getTransferHistory = getTransferHistory;
exports.cancelTransferRequest = cancelTransferRequest;
exports.createRelocationRequest = createRelocationRequest;
exports.startRelocation = startRelocation;
exports.completeRelocation = completeRelocation;
exports.getActiveRelocations = getActiveRelocations;
exports.createLeaveOfAbsence = createLeaveOfAbsence;
exports.approveLeaveRequest = approveLeaveRequest;
exports.startLeave = startLeave;
exports.extendLeave = extendLeave;
exports.denyLeaveRequest = denyLeaveRequest;
exports.cancelLeaveRequest = cancelLeaveRequest;
exports.getActiveLeaves = getActiveLeaves;
exports.getLeavesEndingSoon = getLeavesEndingSoon;
exports.processReturnToWork = processReturnToWork;
exports.updateReturnToWorkPlan = updateReturnToWorkPlan;
exports.getReturnToWorkFollowUps = getReturnToWorkFollowUps;
exports.initiateEmployeeExit = initiateEmployeeExit;
exports.conductExitInterview = conductExitInterview;
exports.completeExitClearance = completeExitClearance;
exports.finalizeEmployeeExit = finalizeEmployeeExit;
exports.getEmployeesInNoticePeriod = getEmployeesInNoticePeriod;
exports.getExitsByType = getExitsByType;
exports.processRetirement = processRetirement;
exports.getRetirementEligibleEmployees = getRetirementEligibleEmployees;
exports.calculateRetirementBenefits = calculateRetirementBenefits;
exports.getUpcomingRetirements = getUpcomingRetirements;
exports.checkRehireEligibility = checkRehireEligibility;
exports.processBoomerangRehire = processBoomerangRehire;
exports.getBoomerangEmployeeStats = getBoomerangEmployeeStats;
/**
 * File: /reuse/server/human-capital/employee-lifecycle-kit.ts
 * Locator: WC-HCM-ELC-001
 * Purpose: Enterprise-grade Employee Lifecycle Management - hire-to-retire workflows, onboarding, transfers, leave management, exits
 *
 * Upstream: Independent utility module for employee lifecycle operations
 * Downstream: ../backend/hcm/*, employee controllers, onboarding services, leave processors, exit workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47 functions for employee lifecycle operations with SAP SuccessFactors Employee Central parity
 *
 * LLM Context: Comprehensive employee lifecycle utilities for production-ready HCM applications.
 * Provides employee registration, new hire onboarding workflows, probation period management, internal transfers,
 * promotions, relocations, leave of absence management (FMLA, parental, medical), return to work processes,
 * resignation/exit workflows, retirement processing, rehire/boomerang employee management, lifecycle milestones,
 * automated notifications, and audit trail compliance.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Employee lifecycle states
 */
var EmployeeLifecycleState;
(function (EmployeeLifecycleState) {
    EmployeeLifecycleState["PRE_HIRE"] = "pre_hire";
    EmployeeLifecycleState["ONBOARDING"] = "onboarding";
    EmployeeLifecycleState["PROBATION"] = "probation";
    EmployeeLifecycleState["ACTIVE"] = "active";
    EmployeeLifecycleState["ON_LEAVE"] = "on_leave";
    EmployeeLifecycleState["SUSPENDED"] = "suspended";
    EmployeeLifecycleState["NOTICE_PERIOD"] = "notice_period";
    EmployeeLifecycleState["EXITING"] = "exiting";
    EmployeeLifecycleState["TERMINATED"] = "terminated";
    EmployeeLifecycleState["RETIRED"] = "retired";
    EmployeeLifecycleState["REHIRABLE"] = "rehirable";
    EmployeeLifecycleState["NON_REHIRABLE"] = "non_rehirable";
})(EmployeeLifecycleState || (exports.EmployeeLifecycleState = EmployeeLifecycleState = {}));
/**
 * Onboarding status stages
 */
var OnboardingStatus;
(function (OnboardingStatus) {
    OnboardingStatus["NOT_STARTED"] = "not_started";
    OnboardingStatus["IN_PROGRESS"] = "in_progress";
    OnboardingStatus["PAPERWORK_PENDING"] = "paperwork_pending";
    OnboardingStatus["SYSTEM_ACCESS_PENDING"] = "system_access_pending";
    OnboardingStatus["TRAINING_PENDING"] = "training_pending";
    OnboardingStatus["COMPLETED"] = "completed";
    OnboardingStatus["DELAYED"] = "delayed";
})(OnboardingStatus || (exports.OnboardingStatus = OnboardingStatus = {}));
/**
 * Probation period status
 */
var ProbationStatus;
(function (ProbationStatus) {
    ProbationStatus["ACTIVE"] = "active";
    ProbationStatus["EXTENDED"] = "extended";
    ProbationStatus["PASSED"] = "passed";
    ProbationStatus["FAILED"] = "failed";
    ProbationStatus["WAIVED"] = "waived";
})(ProbationStatus || (exports.ProbationStatus = ProbationStatus = {}));
/**
 * Transfer types
 */
var TransferType;
(function (TransferType) {
    TransferType["PROMOTION"] = "promotion";
    TransferType["LATERAL_MOVE"] = "lateral_move";
    TransferType["DEMOTION"] = "demotion";
    TransferType["DEPARTMENT_TRANSFER"] = "department_transfer";
    TransferType["LOCATION_TRANSFER"] = "location_transfer";
    TransferType["TEMPORARY_ASSIGNMENT"] = "temporary_assignment";
    TransferType["PERMANENT_TRANSFER"] = "permanent_transfer";
})(TransferType || (exports.TransferType = TransferType = {}));
/**
 * Leave types
 */
var LeaveType;
(function (LeaveType) {
    LeaveType["FMLA"] = "fmla";
    LeaveType["PARENTAL"] = "parental";
    LeaveType["MEDICAL"] = "medical";
    LeaveType["PERSONAL"] = "personal";
    LeaveType["MILITARY"] = "military";
    LeaveType["BEREAVEMENT"] = "bereavement";
    LeaveType["SABBATICAL"] = "sabbatical";
    LeaveType["UNPAID"] = "unpaid";
    LeaveType["DISABILITY_SHORT_TERM"] = "disability_short_term";
    LeaveType["DISABILITY_LONG_TERM"] = "disability_long_term";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
/**
 * Leave status
 */
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["REQUESTED"] = "requested";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["DENIED"] = "denied";
    LeaveStatus["ACTIVE"] = "active";
    LeaveStatus["EXTENDED"] = "extended";
    LeaveStatus["RETURNED"] = "returned";
    LeaveStatus["CANCELLED"] = "cancelled";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
/**
 * Exit types
 */
var ExitType;
(function (ExitType) {
    ExitType["VOLUNTARY_RESIGNATION"] = "voluntary_resignation";
    ExitType["INVOLUNTARY_TERMINATION"] = "involuntary_termination";
    ExitType["RETIREMENT"] = "retirement";
    ExitType["END_OF_CONTRACT"] = "end_of_contract";
    ExitType["MUTUAL_SEPARATION"] = "mutual_separation";
    ExitType["LAYOFF"] = "layoff";
    ExitType["DEATH"] = "death";
})(ExitType || (exports.ExitType = ExitType = {}));
/**
 * Rehire eligibility
 */
var RehireEligibility;
(function (RehireEligibility) {
    RehireEligibility["ELIGIBLE"] = "eligible";
    RehireEligibility["NOT_ELIGIBLE"] = "not_eligible";
    RehireEligibility["CONDITIONAL"] = "conditional";
    RehireEligibility["UNDER_REVIEW"] = "under_review";
})(RehireEligibility || (exports.RehireEligibility = RehireEligibility = {}));
/**
 * Relocation status
 */
var RelocationStatus;
(function (RelocationStatus) {
    RelocationStatus["APPROVED"] = "approved";
    RelocationStatus["IN_PROGRESS"] = "in_progress";
    RelocationStatus["COMPLETED"] = "completed";
    RelocationStatus["CANCELLED"] = "cancelled";
})(RelocationStatus || (exports.RelocationStatus = RelocationStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Employee Model - Core employee master data
 */
let Employee = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employees',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_number'], unique: true },
                { fields: ['email'], unique: true },
                { fields: ['lifecycle_state'] },
                { fields: ['position_id'] },
                { fields: ['department_id'] },
                { fields: ['location_id'] },
                { fields: ['manager_id'] },
                { fields: ['hire_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeNumber_decorators;
    let _employeeNumber_initializers = [];
    let _employeeNumber_extraInitializers = [];
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
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _hireDate_decorators;
    let _hireDate_initializers = [];
    let _hireDate_extraInitializers = [];
    let _lifecycleState_decorators;
    let _lifecycleState_initializers = [];
    let _lifecycleState_extraInitializers = [];
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _employmentType_decorators;
    let _employmentType_initializers = [];
    let _employmentType_extraInitializers = [];
    let _jobTitle_decorators;
    let _jobTitle_initializers = [];
    let _jobTitle_extraInitializers = [];
    let _salaryGrade_decorators;
    let _salaryGrade_initializers = [];
    let _salaryGrade_extraInitializers = [];
    let _compensation_decorators;
    let _compensation_initializers = [];
    let _compensation_extraInitializers = [];
    let _lastWorkingDate_decorators;
    let _lastWorkingDate_initializers = [];
    let _lastWorkingDate_extraInitializers = [];
    let _terminationDate_decorators;
    let _terminationDate_initializers = [];
    let _terminationDate_extraInitializers = [];
    let _rehireEligibility_decorators;
    let _rehireEligibility_initializers = [];
    let _rehireEligibility_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _lifecycleEvents_decorators;
    let _lifecycleEvents_initializers = [];
    let _lifecycleEvents_extraInitializers = [];
    let _onboardingRecords_decorators;
    let _onboardingRecords_initializers = [];
    let _onboardingRecords_extraInitializers = [];
    let _probationPeriods_decorators;
    let _probationPeriods_initializers = [];
    let _probationPeriods_extraInitializers = [];
    let _transfers_decorators;
    let _transfers_initializers = [];
    let _transfers_extraInitializers = [];
    let _leaves_decorators;
    let _leaves_initializers = [];
    let _leaves_extraInitializers = [];
    let _exitRecords_decorators;
    let _exitRecords_initializers = [];
    let _exitRecords_extraInitializers = [];
    var Employee = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeNumber_initializers, void 0));
            this.firstName = (__runInitializers(this, _employeeNumber_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.middleName = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _middleName_initializers, void 0));
            this.email = (__runInitializers(this, _middleName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.dateOfBirth = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
            this.hireDate = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _hireDate_initializers, void 0));
            this.lifecycleState = (__runInitializers(this, _hireDate_extraInitializers), __runInitializers(this, _lifecycleState_initializers, void 0));
            this.positionId = (__runInitializers(this, _lifecycleState_extraInitializers), __runInitializers(this, _positionId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.locationId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.managerId = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.employmentType = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _employmentType_initializers, void 0));
            this.jobTitle = (__runInitializers(this, _employmentType_extraInitializers), __runInitializers(this, _jobTitle_initializers, void 0));
            this.salaryGrade = (__runInitializers(this, _jobTitle_extraInitializers), __runInitializers(this, _salaryGrade_initializers, void 0));
            this.compensation = (__runInitializers(this, _salaryGrade_extraInitializers), __runInitializers(this, _compensation_initializers, void 0));
            this.lastWorkingDate = (__runInitializers(this, _compensation_extraInitializers), __runInitializers(this, _lastWorkingDate_initializers, void 0));
            this.terminationDate = (__runInitializers(this, _lastWorkingDate_extraInitializers), __runInitializers(this, _terminationDate_initializers, void 0));
            this.rehireEligibility = (__runInitializers(this, _terminationDate_extraInitializers), __runInitializers(this, _rehireEligibility_initializers, void 0));
            this.isActive = (__runInitializers(this, _rehireEligibility_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.customFields = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.notes = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.lifecycleEvents = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _lifecycleEvents_initializers, void 0));
            this.onboardingRecords = (__runInitializers(this, _lifecycleEvents_extraInitializers), __runInitializers(this, _onboardingRecords_initializers, void 0));
            this.probationPeriods = (__runInitializers(this, _onboardingRecords_extraInitializers), __runInitializers(this, _probationPeriods_initializers, void 0));
            this.transfers = (__runInitializers(this, _probationPeriods_extraInitializers), __runInitializers(this, _transfers_initializers, void 0));
            this.leaves = (__runInitializers(this, _transfers_extraInitializers), __runInitializers(this, _leaves_initializers, void 0));
            this.exitRecords = (__runInitializers(this, _leaves_extraInitializers), __runInitializers(this, _exitRecords_initializers, void 0));
            __runInitializers(this, _exitRecords_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Employee");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _firstName_decorators = [(0, swagger_1.ApiProperty)({ description: 'First name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _lastName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _middleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Middle name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _phoneNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Phone number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20) })];
        _dateOfBirth_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date of birth' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _hireDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hire date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _lifecycleState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current lifecycle state' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmployeeLifecycleState)),
                allowNull: false,
                defaultValue: EmployeeLifecycleState.PRE_HIRE,
            }), sequelize_typescript_1.Index];
        _positionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _employmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employment type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('full_time', 'part_time', 'contract', 'intern'),
                allowNull: false,
            })];
        _jobTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _salaryGrade_decorators = [(0, swagger_1.ApiProperty)({ description: 'Salary grade' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _compensation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compensation amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _lastWorkingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last working date if exited' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _terminationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Termination date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _rehireEligibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rehire eligibility' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(RehireEligibility)) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is currently active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _lifecycleEvents_decorators = [(0, sequelize_typescript_1.HasMany)(() => EmployeeLifecycleEvent)];
        _onboardingRecords_decorators = [(0, sequelize_typescript_1.HasMany)(() => Onboarding)];
        _probationPeriods_decorators = [(0, sequelize_typescript_1.HasMany)(() => ProbationPeriod)];
        _transfers_decorators = [(0, sequelize_typescript_1.HasMany)(() => InternalTransfer)];
        _leaves_decorators = [(0, sequelize_typescript_1.HasMany)(() => LeaveOfAbsence)];
        _exitRecords_decorators = [(0, sequelize_typescript_1.HasMany)(() => EmployeeExit)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeNumber_decorators, { kind: "field", name: "employeeNumber", static: false, private: false, access: { has: obj => "employeeNumber" in obj, get: obj => obj.employeeNumber, set: (obj, value) => { obj.employeeNumber = value; } }, metadata: _metadata }, _employeeNumber_initializers, _employeeNumber_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _middleName_decorators, { kind: "field", name: "middleName", static: false, private: false, access: { has: obj => "middleName" in obj, get: obj => obj.middleName, set: (obj, value) => { obj.middleName = value; } }, metadata: _metadata }, _middleName_initializers, _middleName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
        __esDecorate(null, null, _hireDate_decorators, { kind: "field", name: "hireDate", static: false, private: false, access: { has: obj => "hireDate" in obj, get: obj => obj.hireDate, set: (obj, value) => { obj.hireDate = value; } }, metadata: _metadata }, _hireDate_initializers, _hireDate_extraInitializers);
        __esDecorate(null, null, _lifecycleState_decorators, { kind: "field", name: "lifecycleState", static: false, private: false, access: { has: obj => "lifecycleState" in obj, get: obj => obj.lifecycleState, set: (obj, value) => { obj.lifecycleState = value; } }, metadata: _metadata }, _lifecycleState_initializers, _lifecycleState_extraInitializers);
        __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _employmentType_decorators, { kind: "field", name: "employmentType", static: false, private: false, access: { has: obj => "employmentType" in obj, get: obj => obj.employmentType, set: (obj, value) => { obj.employmentType = value; } }, metadata: _metadata }, _employmentType_initializers, _employmentType_extraInitializers);
        __esDecorate(null, null, _jobTitle_decorators, { kind: "field", name: "jobTitle", static: false, private: false, access: { has: obj => "jobTitle" in obj, get: obj => obj.jobTitle, set: (obj, value) => { obj.jobTitle = value; } }, metadata: _metadata }, _jobTitle_initializers, _jobTitle_extraInitializers);
        __esDecorate(null, null, _salaryGrade_decorators, { kind: "field", name: "salaryGrade", static: false, private: false, access: { has: obj => "salaryGrade" in obj, get: obj => obj.salaryGrade, set: (obj, value) => { obj.salaryGrade = value; } }, metadata: _metadata }, _salaryGrade_initializers, _salaryGrade_extraInitializers);
        __esDecorate(null, null, _compensation_decorators, { kind: "field", name: "compensation", static: false, private: false, access: { has: obj => "compensation" in obj, get: obj => obj.compensation, set: (obj, value) => { obj.compensation = value; } }, metadata: _metadata }, _compensation_initializers, _compensation_extraInitializers);
        __esDecorate(null, null, _lastWorkingDate_decorators, { kind: "field", name: "lastWorkingDate", static: false, private: false, access: { has: obj => "lastWorkingDate" in obj, get: obj => obj.lastWorkingDate, set: (obj, value) => { obj.lastWorkingDate = value; } }, metadata: _metadata }, _lastWorkingDate_initializers, _lastWorkingDate_extraInitializers);
        __esDecorate(null, null, _terminationDate_decorators, { kind: "field", name: "terminationDate", static: false, private: false, access: { has: obj => "terminationDate" in obj, get: obj => obj.terminationDate, set: (obj, value) => { obj.terminationDate = value; } }, metadata: _metadata }, _terminationDate_initializers, _terminationDate_extraInitializers);
        __esDecorate(null, null, _rehireEligibility_decorators, { kind: "field", name: "rehireEligibility", static: false, private: false, access: { has: obj => "rehireEligibility" in obj, get: obj => obj.rehireEligibility, set: (obj, value) => { obj.rehireEligibility = value; } }, metadata: _metadata }, _rehireEligibility_initializers, _rehireEligibility_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _lifecycleEvents_decorators, { kind: "field", name: "lifecycleEvents", static: false, private: false, access: { has: obj => "lifecycleEvents" in obj, get: obj => obj.lifecycleEvents, set: (obj, value) => { obj.lifecycleEvents = value; } }, metadata: _metadata }, _lifecycleEvents_initializers, _lifecycleEvents_extraInitializers);
        __esDecorate(null, null, _onboardingRecords_decorators, { kind: "field", name: "onboardingRecords", static: false, private: false, access: { has: obj => "onboardingRecords" in obj, get: obj => obj.onboardingRecords, set: (obj, value) => { obj.onboardingRecords = value; } }, metadata: _metadata }, _onboardingRecords_initializers, _onboardingRecords_extraInitializers);
        __esDecorate(null, null, _probationPeriods_decorators, { kind: "field", name: "probationPeriods", static: false, private: false, access: { has: obj => "probationPeriods" in obj, get: obj => obj.probationPeriods, set: (obj, value) => { obj.probationPeriods = value; } }, metadata: _metadata }, _probationPeriods_initializers, _probationPeriods_extraInitializers);
        __esDecorate(null, null, _transfers_decorators, { kind: "field", name: "transfers", static: false, private: false, access: { has: obj => "transfers" in obj, get: obj => obj.transfers, set: (obj, value) => { obj.transfers = value; } }, metadata: _metadata }, _transfers_initializers, _transfers_extraInitializers);
        __esDecorate(null, null, _leaves_decorators, { kind: "field", name: "leaves", static: false, private: false, access: { has: obj => "leaves" in obj, get: obj => obj.leaves, set: (obj, value) => { obj.leaves = value; } }, metadata: _metadata }, _leaves_initializers, _leaves_extraInitializers);
        __esDecorate(null, null, _exitRecords_decorators, { kind: "field", name: "exitRecords", static: false, private: false, access: { has: obj => "exitRecords" in obj, get: obj => obj.exitRecords, set: (obj, value) => { obj.exitRecords = value; } }, metadata: _metadata }, _exitRecords_initializers, _exitRecords_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Employee = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Employee = _classThis;
})();
exports.Employee = Employee;
/**
 * Employee Lifecycle Event Model - Tracks all lifecycle state changes
 */
let EmployeeLifecycleEvent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_lifecycle_events',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['event_type'] },
                { fields: ['event_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    let _fromState_decorators;
    let _fromState_initializers = [];
    let _fromState_extraInitializers = [];
    let _toState_decorators;
    let _toState_initializers = [];
    let _toState_extraInitializers = [];
    let _triggeredBy_decorators;
    let _triggeredBy_initializers = [];
    let _triggeredBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var EmployeeLifecycleEvent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.eventType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.eventDate = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
            this.fromState = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _fromState_initializers, void 0));
            this.toState = (__runInitializers(this, _fromState_extraInitializers), __runInitializers(this, _toState_initializers, void 0));
            this.triggeredBy = (__runInitializers(this, _toState_extraInitializers), __runInitializers(this, _triggeredBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _triggeredBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.notes = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeLifecycleEvent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _eventDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _fromState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous lifecycle state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmployeeLifecycleState)) })];
        _toState_decorators = [(0, swagger_1.ApiProperty)({ description: 'New lifecycle state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmployeeLifecycleState)) })];
        _triggeredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User who triggered event' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _fromState_decorators, { kind: "field", name: "fromState", static: false, private: false, access: { has: obj => "fromState" in obj, get: obj => obj.fromState, set: (obj, value) => { obj.fromState = value; } }, metadata: _metadata }, _fromState_initializers, _fromState_extraInitializers);
        __esDecorate(null, null, _toState_decorators, { kind: "field", name: "toState", static: false, private: false, access: { has: obj => "toState" in obj, get: obj => obj.toState, set: (obj, value) => { obj.toState = value; } }, metadata: _metadata }, _toState_initializers, _toState_extraInitializers);
        __esDecorate(null, null, _triggeredBy_decorators, { kind: "field", name: "triggeredBy", static: false, private: false, access: { has: obj => "triggeredBy" in obj, get: obj => obj.triggeredBy, set: (obj, value) => { obj.triggeredBy = value; } }, metadata: _metadata }, _triggeredBy_initializers, _triggeredBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeLifecycleEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeLifecycleEvent = _classThis;
})();
exports.EmployeeLifecycleEvent = EmployeeLifecycleEvent;
/**
 * Onboarding Model - Tracks new hire onboarding process
 */
let Onboarding = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'onboardings',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['onboarding_status'] },
                { fields: ['planned_start_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _onboardingStatus_decorators;
    let _onboardingStatus_initializers = [];
    let _onboardingStatus_extraInitializers = [];
    let _plannedStartDate_decorators;
    let _plannedStartDate_initializers = [];
    let _plannedStartDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _buddyId_decorators;
    let _buddyId_initializers = [];
    let _buddyId_extraInitializers = [];
    let _mentorId_decorators;
    let _mentorId_initializers = [];
    let _mentorId_extraInitializers = [];
    let _checklistItems_decorators;
    let _checklistItems_initializers = [];
    let _checklistItems_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _completionPercentage_decorators;
    let _completionPercentage_initializers = [];
    let _completionPercentage_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var Onboarding = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.onboardingStatus = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _onboardingStatus_initializers, void 0));
            this.plannedStartDate = (__runInitializers(this, _onboardingStatus_extraInitializers), __runInitializers(this, _plannedStartDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _plannedStartDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.buddyId = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _buddyId_initializers, void 0));
            this.mentorId = (__runInitializers(this, _buddyId_extraInitializers), __runInitializers(this, _mentorId_initializers, void 0));
            this.checklistItems = (__runInitializers(this, _mentorId_extraInitializers), __runInitializers(this, _checklistItems_initializers, void 0));
            this.completionDate = (__runInitializers(this, _checklistItems_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.completionPercentage = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _completionPercentage_initializers, void 0));
            this.notes = (__runInitializers(this, _completionPercentage_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Onboarding");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _onboardingStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Onboarding status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OnboardingStatus)),
                allowNull: false,
                defaultValue: OnboardingStatus.NOT_STARTED,
            }), sequelize_typescript_1.Index];
        _plannedStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _actualStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _buddyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Buddy employee ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _mentorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mentor employee ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _checklistItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Onboarding checklist' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _completionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completionPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _onboardingStatus_decorators, { kind: "field", name: "onboardingStatus", static: false, private: false, access: { has: obj => "onboardingStatus" in obj, get: obj => obj.onboardingStatus, set: (obj, value) => { obj.onboardingStatus = value; } }, metadata: _metadata }, _onboardingStatus_initializers, _onboardingStatus_extraInitializers);
        __esDecorate(null, null, _plannedStartDate_decorators, { kind: "field", name: "plannedStartDate", static: false, private: false, access: { has: obj => "plannedStartDate" in obj, get: obj => obj.plannedStartDate, set: (obj, value) => { obj.plannedStartDate = value; } }, metadata: _metadata }, _plannedStartDate_initializers, _plannedStartDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _buddyId_decorators, { kind: "field", name: "buddyId", static: false, private: false, access: { has: obj => "buddyId" in obj, get: obj => obj.buddyId, set: (obj, value) => { obj.buddyId = value; } }, metadata: _metadata }, _buddyId_initializers, _buddyId_extraInitializers);
        __esDecorate(null, null, _mentorId_decorators, { kind: "field", name: "mentorId", static: false, private: false, access: { has: obj => "mentorId" in obj, get: obj => obj.mentorId, set: (obj, value) => { obj.mentorId = value; } }, metadata: _metadata }, _mentorId_initializers, _mentorId_extraInitializers);
        __esDecorate(null, null, _checklistItems_decorators, { kind: "field", name: "checklistItems", static: false, private: false, access: { has: obj => "checklistItems" in obj, get: obj => obj.checklistItems, set: (obj, value) => { obj.checklistItems = value; } }, metadata: _metadata }, _checklistItems_initializers, _checklistItems_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _completionPercentage_decorators, { kind: "field", name: "completionPercentage", static: false, private: false, access: { has: obj => "completionPercentage" in obj, get: obj => obj.completionPercentage, set: (obj, value) => { obj.completionPercentage = value; } }, metadata: _metadata }, _completionPercentage_initializers, _completionPercentage_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Onboarding = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Onboarding = _classThis;
})();
exports.Onboarding = Onboarding;
/**
 * Probation Period Model - Tracks employee probation periods
 */
let ProbationPeriod = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'probation_periods',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['probation_status'] },
                { fields: ['end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _probationStatus_decorators;
    let _probationStatus_initializers = [];
    let _probationStatus_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _reviewSchedule_decorators;
    let _reviewSchedule_initializers = [];
    let _reviewSchedule_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _criteria_decorators;
    let _criteria_initializers = [];
    let _criteria_extraInitializers = [];
    let _finalEvaluationDate_decorators;
    let _finalEvaluationDate_initializers = [];
    let _finalEvaluationDate_extraInitializers = [];
    let _passed_decorators;
    let _passed_initializers = [];
    let _passed_extraInitializers = [];
    let _extensionReason_decorators;
    let _extensionReason_initializers = [];
    let _extensionReason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var ProbationPeriod = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.probationStatus = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _probationStatus_initializers, void 0));
            this.startDate = (__runInitializers(this, _probationStatus_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.reviewSchedule = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _reviewSchedule_initializers, void 0));
            this.managerId = (__runInitializers(this, _reviewSchedule_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.criteria = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _criteria_initializers, void 0));
            this.finalEvaluationDate = (__runInitializers(this, _criteria_extraInitializers), __runInitializers(this, _finalEvaluationDate_initializers, void 0));
            this.passed = (__runInitializers(this, _finalEvaluationDate_extraInitializers), __runInitializers(this, _passed_initializers, void 0));
            this.extensionReason = (__runInitializers(this, _passed_extraInitializers), __runInitializers(this, _extensionReason_initializers, void 0));
            this.notes = (__runInitializers(this, _extensionReason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProbationPeriod");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _probationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Probation status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ProbationStatus)),
                allowNull: false,
                defaultValue: ProbationStatus.ACTIVE,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _reviewSchedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review schedule dates' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.DATE) })];
        _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _criteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation criteria' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _finalEvaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final evaluation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _passed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pass/fail decision' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _extensionReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Extension reason if extended' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _probationStatus_decorators, { kind: "field", name: "probationStatus", static: false, private: false, access: { has: obj => "probationStatus" in obj, get: obj => obj.probationStatus, set: (obj, value) => { obj.probationStatus = value; } }, metadata: _metadata }, _probationStatus_initializers, _probationStatus_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _reviewSchedule_decorators, { kind: "field", name: "reviewSchedule", static: false, private: false, access: { has: obj => "reviewSchedule" in obj, get: obj => obj.reviewSchedule, set: (obj, value) => { obj.reviewSchedule = value; } }, metadata: _metadata }, _reviewSchedule_initializers, _reviewSchedule_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _criteria_decorators, { kind: "field", name: "criteria", static: false, private: false, access: { has: obj => "criteria" in obj, get: obj => obj.criteria, set: (obj, value) => { obj.criteria = value; } }, metadata: _metadata }, _criteria_initializers, _criteria_extraInitializers);
        __esDecorate(null, null, _finalEvaluationDate_decorators, { kind: "field", name: "finalEvaluationDate", static: false, private: false, access: { has: obj => "finalEvaluationDate" in obj, get: obj => obj.finalEvaluationDate, set: (obj, value) => { obj.finalEvaluationDate = value; } }, metadata: _metadata }, _finalEvaluationDate_initializers, _finalEvaluationDate_extraInitializers);
        __esDecorate(null, null, _passed_decorators, { kind: "field", name: "passed", static: false, private: false, access: { has: obj => "passed" in obj, get: obj => obj.passed, set: (obj, value) => { obj.passed = value; } }, metadata: _metadata }, _passed_initializers, _passed_extraInitializers);
        __esDecorate(null, null, _extensionReason_decorators, { kind: "field", name: "extensionReason", static: false, private: false, access: { has: obj => "extensionReason" in obj, get: obj => obj.extensionReason, set: (obj, value) => { obj.extensionReason = value; } }, metadata: _metadata }, _extensionReason_initializers, _extensionReason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProbationPeriod = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProbationPeriod = _classThis;
})();
exports.ProbationPeriod = ProbationPeriod;
/**
 * Internal Transfer Model - Tracks employee transfers and promotions
 */
let InternalTransfer = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'internal_transfers',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['transfer_type'] },
                { fields: ['effective_date'] },
                { fields: ['approval_status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _transferType_decorators;
    let _transferType_initializers = [];
    let _transferType_extraInitializers = [];
    let _currentPositionId_decorators;
    let _currentPositionId_initializers = [];
    let _currentPositionId_extraInitializers = [];
    let _newPositionId_decorators;
    let _newPositionId_initializers = [];
    let _newPositionId_extraInitializers = [];
    let _currentDepartmentId_decorators;
    let _currentDepartmentId_initializers = [];
    let _currentDepartmentId_extraInitializers = [];
    let _newDepartmentId_decorators;
    let _newDepartmentId_initializers = [];
    let _newDepartmentId_extraInitializers = [];
    let _currentLocationId_decorators;
    let _currentLocationId_initializers = [];
    let _currentLocationId_extraInitializers = [];
    let _newLocationId_decorators;
    let _newLocationId_initializers = [];
    let _newLocationId_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _approvalStatus_decorators;
    let _approvalStatus_initializers = [];
    let _approvalStatus_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _compensationChange_decorators;
    let _compensationChange_initializers = [];
    let _compensationChange_extraInitializers = [];
    let _isPromotionEligible_decorators;
    let _isPromotionEligible_initializers = [];
    let _isPromotionEligible_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var InternalTransfer = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.transferType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _transferType_initializers, void 0));
            this.currentPositionId = (__runInitializers(this, _transferType_extraInitializers), __runInitializers(this, _currentPositionId_initializers, void 0));
            this.newPositionId = (__runInitializers(this, _currentPositionId_extraInitializers), __runInitializers(this, _newPositionId_initializers, void 0));
            this.currentDepartmentId = (__runInitializers(this, _newPositionId_extraInitializers), __runInitializers(this, _currentDepartmentId_initializers, void 0));
            this.newDepartmentId = (__runInitializers(this, _currentDepartmentId_extraInitializers), __runInitializers(this, _newDepartmentId_initializers, void 0));
            this.currentLocationId = (__runInitializers(this, _newDepartmentId_extraInitializers), __runInitializers(this, _currentLocationId_initializers, void 0));
            this.newLocationId = (__runInitializers(this, _currentLocationId_extraInitializers), __runInitializers(this, _newLocationId_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _newLocationId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.reason = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.approvalStatus = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _approvalStatus_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalStatus_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.compensationChange = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _compensationChange_initializers, void 0));
            this.isPromotionEligible = (__runInitializers(this, _compensationChange_extraInitializers), __runInitializers(this, _isPromotionEligible_initializers, void 0));
            this.notes = (__runInitializers(this, _isPromotionEligible_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InternalTransfer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _transferType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _currentPositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current position ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _newPositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'New position ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _currentDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _newDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'New department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _currentLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _newLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'New location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvalStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'approved', 'rejected', 'cancelled'),
                defaultValue: 'pending',
            }), sequelize_typescript_1.Index];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _compensationChange_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compensation change amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _isPromotionEligible_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is promotion eligible' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _transferType_decorators, { kind: "field", name: "transferType", static: false, private: false, access: { has: obj => "transferType" in obj, get: obj => obj.transferType, set: (obj, value) => { obj.transferType = value; } }, metadata: _metadata }, _transferType_initializers, _transferType_extraInitializers);
        __esDecorate(null, null, _currentPositionId_decorators, { kind: "field", name: "currentPositionId", static: false, private: false, access: { has: obj => "currentPositionId" in obj, get: obj => obj.currentPositionId, set: (obj, value) => { obj.currentPositionId = value; } }, metadata: _metadata }, _currentPositionId_initializers, _currentPositionId_extraInitializers);
        __esDecorate(null, null, _newPositionId_decorators, { kind: "field", name: "newPositionId", static: false, private: false, access: { has: obj => "newPositionId" in obj, get: obj => obj.newPositionId, set: (obj, value) => { obj.newPositionId = value; } }, metadata: _metadata }, _newPositionId_initializers, _newPositionId_extraInitializers);
        __esDecorate(null, null, _currentDepartmentId_decorators, { kind: "field", name: "currentDepartmentId", static: false, private: false, access: { has: obj => "currentDepartmentId" in obj, get: obj => obj.currentDepartmentId, set: (obj, value) => { obj.currentDepartmentId = value; } }, metadata: _metadata }, _currentDepartmentId_initializers, _currentDepartmentId_extraInitializers);
        __esDecorate(null, null, _newDepartmentId_decorators, { kind: "field", name: "newDepartmentId", static: false, private: false, access: { has: obj => "newDepartmentId" in obj, get: obj => obj.newDepartmentId, set: (obj, value) => { obj.newDepartmentId = value; } }, metadata: _metadata }, _newDepartmentId_initializers, _newDepartmentId_extraInitializers);
        __esDecorate(null, null, _currentLocationId_decorators, { kind: "field", name: "currentLocationId", static: false, private: false, access: { has: obj => "currentLocationId" in obj, get: obj => obj.currentLocationId, set: (obj, value) => { obj.currentLocationId = value; } }, metadata: _metadata }, _currentLocationId_initializers, _currentLocationId_extraInitializers);
        __esDecorate(null, null, _newLocationId_decorators, { kind: "field", name: "newLocationId", static: false, private: false, access: { has: obj => "newLocationId" in obj, get: obj => obj.newLocationId, set: (obj, value) => { obj.newLocationId = value; } }, metadata: _metadata }, _newLocationId_initializers, _newLocationId_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _approvalStatus_decorators, { kind: "field", name: "approvalStatus", static: false, private: false, access: { has: obj => "approvalStatus" in obj, get: obj => obj.approvalStatus, set: (obj, value) => { obj.approvalStatus = value; } }, metadata: _metadata }, _approvalStatus_initializers, _approvalStatus_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _compensationChange_decorators, { kind: "field", name: "compensationChange", static: false, private: false, access: { has: obj => "compensationChange" in obj, get: obj => obj.compensationChange, set: (obj, value) => { obj.compensationChange = value; } }, metadata: _metadata }, _compensationChange_initializers, _compensationChange_extraInitializers);
        __esDecorate(null, null, _isPromotionEligible_decorators, { kind: "field", name: "isPromotionEligible", static: false, private: false, access: { has: obj => "isPromotionEligible" in obj, get: obj => obj.isPromotionEligible, set: (obj, value) => { obj.isPromotionEligible = value; } }, metadata: _metadata }, _isPromotionEligible_initializers, _isPromotionEligible_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InternalTransfer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InternalTransfer = _classThis;
})();
exports.InternalTransfer = InternalTransfer;
/**
 * Employee Relocation Model - Tracks employee relocations
 */
let EmployeeRelocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_relocations',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['relocation_status'] },
                { fields: ['effective_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _fromLocationId_decorators;
    let _fromLocationId_initializers = [];
    let _fromLocationId_extraInitializers = [];
    let _toLocationId_decorators;
    let _toLocationId_initializers = [];
    let _toLocationId_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _relocationStatus_decorators;
    let _relocationStatus_initializers = [];
    let _relocationStatus_extraInitializers = [];
    let _relocationPackage_decorators;
    let _relocationPackage_initializers = [];
    let _relocationPackage_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _movingExpensesAllowed_decorators;
    let _movingExpensesAllowed_initializers = [];
    let _movingExpensesAllowed_extraInitializers = [];
    let _temporaryHousingDays_decorators;
    let _temporaryHousingDays_initializers = [];
    let _temporaryHousingDays_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var EmployeeRelocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.fromLocationId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _fromLocationId_initializers, void 0));
            this.toLocationId = (__runInitializers(this, _fromLocationId_extraInitializers), __runInitializers(this, _toLocationId_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _toLocationId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.relocationStatus = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _relocationStatus_initializers, void 0));
            this.relocationPackage = (__runInitializers(this, _relocationStatus_extraInitializers), __runInitializers(this, _relocationPackage_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _relocationPackage_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.movingExpensesAllowed = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _movingExpensesAllowed_initializers, void 0));
            this.temporaryHousingDays = (__runInitializers(this, _movingExpensesAllowed_extraInitializers), __runInitializers(this, _temporaryHousingDays_initializers, void 0));
            this.reason = (__runInitializers(this, _temporaryHousingDays_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.completionDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.notes = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeRelocation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _fromLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _toLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _relocationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relocation status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RelocationStatus)),
                defaultValue: RelocationStatus.APPROVED,
            }), sequelize_typescript_1.Index];
        _relocationPackage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relocation package identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _movingExpensesAllowed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Moving expenses allowed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _temporaryHousingDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Temporary housing days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relocation reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _completionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _fromLocationId_decorators, { kind: "field", name: "fromLocationId", static: false, private: false, access: { has: obj => "fromLocationId" in obj, get: obj => obj.fromLocationId, set: (obj, value) => { obj.fromLocationId = value; } }, metadata: _metadata }, _fromLocationId_initializers, _fromLocationId_extraInitializers);
        __esDecorate(null, null, _toLocationId_decorators, { kind: "field", name: "toLocationId", static: false, private: false, access: { has: obj => "toLocationId" in obj, get: obj => obj.toLocationId, set: (obj, value) => { obj.toLocationId = value; } }, metadata: _metadata }, _toLocationId_initializers, _toLocationId_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _relocationStatus_decorators, { kind: "field", name: "relocationStatus", static: false, private: false, access: { has: obj => "relocationStatus" in obj, get: obj => obj.relocationStatus, set: (obj, value) => { obj.relocationStatus = value; } }, metadata: _metadata }, _relocationStatus_initializers, _relocationStatus_extraInitializers);
        __esDecorate(null, null, _relocationPackage_decorators, { kind: "field", name: "relocationPackage", static: false, private: false, access: { has: obj => "relocationPackage" in obj, get: obj => obj.relocationPackage, set: (obj, value) => { obj.relocationPackage = value; } }, metadata: _metadata }, _relocationPackage_initializers, _relocationPackage_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _movingExpensesAllowed_decorators, { kind: "field", name: "movingExpensesAllowed", static: false, private: false, access: { has: obj => "movingExpensesAllowed" in obj, get: obj => obj.movingExpensesAllowed, set: (obj, value) => { obj.movingExpensesAllowed = value; } }, metadata: _metadata }, _movingExpensesAllowed_initializers, _movingExpensesAllowed_extraInitializers);
        __esDecorate(null, null, _temporaryHousingDays_decorators, { kind: "field", name: "temporaryHousingDays", static: false, private: false, access: { has: obj => "temporaryHousingDays" in obj, get: obj => obj.temporaryHousingDays, set: (obj, value) => { obj.temporaryHousingDays = value; } }, metadata: _metadata }, _temporaryHousingDays_initializers, _temporaryHousingDays_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeRelocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeRelocation = _classThis;
})();
exports.EmployeeRelocation = EmployeeRelocation;
/**
 * Leave of Absence Model - Tracks employee leaves
 */
let LeaveOfAbsence = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'leaves_of_absence',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['leave_type'] },
                { fields: ['leave_status'] },
                { fields: ['start_date'] },
                { fields: ['end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _leaveType_decorators;
    let _leaveType_initializers = [];
    let _leaveType_extraInitializers = [];
    let _leaveStatus_decorators;
    let _leaveStatus_initializers = [];
    let _leaveStatus_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _expectedReturnDate_decorators;
    let _expectedReturnDate_initializers = [];
    let _expectedReturnDate_extraInitializers = [];
    let _actualReturnDate_decorators;
    let _actualReturnDate_initializers = [];
    let _actualReturnDate_extraInitializers = [];
    let _isPaid_decorators;
    let _isPaid_initializers = [];
    let _isPaid_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _medicalCertificationRequired_decorators;
    let _medicalCertificationRequired_initializers = [];
    let _medicalCertificationRequired_extraInitializers = [];
    let _intermittentLeave_decorators;
    let _intermittentLeave_initializers = [];
    let _intermittentLeave_extraInitializers = [];
    let _reducedSchedule_decorators;
    let _reducedSchedule_initializers = [];
    let _reducedSchedule_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var LeaveOfAbsence = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.leaveType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _leaveType_initializers, void 0));
            this.leaveStatus = (__runInitializers(this, _leaveType_extraInitializers), __runInitializers(this, _leaveStatus_initializers, void 0));
            this.startDate = (__runInitializers(this, _leaveStatus_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.expectedReturnDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _expectedReturnDate_initializers, void 0));
            this.actualReturnDate = (__runInitializers(this, _expectedReturnDate_extraInitializers), __runInitializers(this, _actualReturnDate_initializers, void 0));
            this.isPaid = (__runInitializers(this, _actualReturnDate_extraInitializers), __runInitializers(this, _isPaid_initializers, void 0));
            this.reason = (__runInitializers(this, _isPaid_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.medicalCertificationRequired = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _medicalCertificationRequired_initializers, void 0));
            this.intermittentLeave = (__runInitializers(this, _medicalCertificationRequired_extraInitializers), __runInitializers(this, _intermittentLeave_initializers, void 0));
            this.reducedSchedule = (__runInitializers(this, _intermittentLeave_extraInitializers), __runInitializers(this, _reducedSchedule_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reducedSchedule_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.documents = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.notes = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LeaveOfAbsence");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _leaveType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Leave type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LeaveType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _leaveStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Leave status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LeaveStatus)),
                allowNull: false,
                defaultValue: LeaveStatus.REQUESTED,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _expectedReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected return date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _actualReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual return date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isPaid_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is paid leave' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Leave reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _medicalCertificationRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Medical certification required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _intermittentLeave_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is intermittent leave' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _reducedSchedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Has reduced schedule' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _documents_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _leaveType_decorators, { kind: "field", name: "leaveType", static: false, private: false, access: { has: obj => "leaveType" in obj, get: obj => obj.leaveType, set: (obj, value) => { obj.leaveType = value; } }, metadata: _metadata }, _leaveType_initializers, _leaveType_extraInitializers);
        __esDecorate(null, null, _leaveStatus_decorators, { kind: "field", name: "leaveStatus", static: false, private: false, access: { has: obj => "leaveStatus" in obj, get: obj => obj.leaveStatus, set: (obj, value) => { obj.leaveStatus = value; } }, metadata: _metadata }, _leaveStatus_initializers, _leaveStatus_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _expectedReturnDate_decorators, { kind: "field", name: "expectedReturnDate", static: false, private: false, access: { has: obj => "expectedReturnDate" in obj, get: obj => obj.expectedReturnDate, set: (obj, value) => { obj.expectedReturnDate = value; } }, metadata: _metadata }, _expectedReturnDate_initializers, _expectedReturnDate_extraInitializers);
        __esDecorate(null, null, _actualReturnDate_decorators, { kind: "field", name: "actualReturnDate", static: false, private: false, access: { has: obj => "actualReturnDate" in obj, get: obj => obj.actualReturnDate, set: (obj, value) => { obj.actualReturnDate = value; } }, metadata: _metadata }, _actualReturnDate_initializers, _actualReturnDate_extraInitializers);
        __esDecorate(null, null, _isPaid_decorators, { kind: "field", name: "isPaid", static: false, private: false, access: { has: obj => "isPaid" in obj, get: obj => obj.isPaid, set: (obj, value) => { obj.isPaid = value; } }, metadata: _metadata }, _isPaid_initializers, _isPaid_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _medicalCertificationRequired_decorators, { kind: "field", name: "medicalCertificationRequired", static: false, private: false, access: { has: obj => "medicalCertificationRequired" in obj, get: obj => obj.medicalCertificationRequired, set: (obj, value) => { obj.medicalCertificationRequired = value; } }, metadata: _metadata }, _medicalCertificationRequired_initializers, _medicalCertificationRequired_extraInitializers);
        __esDecorate(null, null, _intermittentLeave_decorators, { kind: "field", name: "intermittentLeave", static: false, private: false, access: { has: obj => "intermittentLeave" in obj, get: obj => obj.intermittentLeave, set: (obj, value) => { obj.intermittentLeave = value; } }, metadata: _metadata }, _intermittentLeave_initializers, _intermittentLeave_extraInitializers);
        __esDecorate(null, null, _reducedSchedule_decorators, { kind: "field", name: "reducedSchedule", static: false, private: false, access: { has: obj => "reducedSchedule" in obj, get: obj => obj.reducedSchedule, set: (obj, value) => { obj.reducedSchedule = value; } }, metadata: _metadata }, _reducedSchedule_initializers, _reducedSchedule_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LeaveOfAbsence = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LeaveOfAbsence = _classThis;
})();
exports.LeaveOfAbsence = LeaveOfAbsence;
/**
 * Return to Work Model - Tracks return from leave
 */
let ReturnToWork = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'return_to_work',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['leave_id'] },
                { fields: ['actual_return_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _leaveId_decorators;
    let _leaveId_initializers = [];
    let _leaveId_extraInitializers = [];
    let _actualReturnDate_decorators;
    let _actualReturnDate_initializers = [];
    let _actualReturnDate_extraInitializers = [];
    let _workRestrictions_decorators;
    let _workRestrictions_initializers = [];
    let _workRestrictions_extraInitializers = [];
    let _modifiedDuties_decorators;
    let _modifiedDuties_initializers = [];
    let _modifiedDuties_extraInitializers = [];
    let _medicalClearance_decorators;
    let _medicalClearance_initializers = [];
    let _medicalClearance_extraInitializers = [];
    let _reintegrationPlan_decorators;
    let _reintegrationPlan_initializers = [];
    let _reintegrationPlan_extraInitializers = [];
    let _followUpDate_decorators;
    let _followUpDate_initializers = [];
    let _followUpDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _leave_decorators;
    let _leave_initializers = [];
    let _leave_extraInitializers = [];
    var ReturnToWork = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.leaveId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _leaveId_initializers, void 0));
            this.actualReturnDate = (__runInitializers(this, _leaveId_extraInitializers), __runInitializers(this, _actualReturnDate_initializers, void 0));
            this.workRestrictions = (__runInitializers(this, _actualReturnDate_extraInitializers), __runInitializers(this, _workRestrictions_initializers, void 0));
            this.modifiedDuties = (__runInitializers(this, _workRestrictions_extraInitializers), __runInitializers(this, _modifiedDuties_initializers, void 0));
            this.medicalClearance = (__runInitializers(this, _modifiedDuties_extraInitializers), __runInitializers(this, _medicalClearance_initializers, void 0));
            this.reintegrationPlan = (__runInitializers(this, _medicalClearance_extraInitializers), __runInitializers(this, _reintegrationPlan_initializers, void 0));
            this.followUpDate = (__runInitializers(this, _reintegrationPlan_extraInitializers), __runInitializers(this, _followUpDate_initializers, void 0));
            this.notes = (__runInitializers(this, _followUpDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.leave = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _leave_initializers, void 0));
            __runInitializers(this, _leave_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReturnToWork");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _leaveId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Leave of absence ID' }), (0, sequelize_typescript_1.ForeignKey)(() => LeaveOfAbsence), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _actualReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual return date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _workRestrictions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work restrictions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _modifiedDuties_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modified duties description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _medicalClearance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Medical clearance received' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _reintegrationPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reintegration plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _followUpDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        _leave_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LeaveOfAbsence)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _leaveId_decorators, { kind: "field", name: "leaveId", static: false, private: false, access: { has: obj => "leaveId" in obj, get: obj => obj.leaveId, set: (obj, value) => { obj.leaveId = value; } }, metadata: _metadata }, _leaveId_initializers, _leaveId_extraInitializers);
        __esDecorate(null, null, _actualReturnDate_decorators, { kind: "field", name: "actualReturnDate", static: false, private: false, access: { has: obj => "actualReturnDate" in obj, get: obj => obj.actualReturnDate, set: (obj, value) => { obj.actualReturnDate = value; } }, metadata: _metadata }, _actualReturnDate_initializers, _actualReturnDate_extraInitializers);
        __esDecorate(null, null, _workRestrictions_decorators, { kind: "field", name: "workRestrictions", static: false, private: false, access: { has: obj => "workRestrictions" in obj, get: obj => obj.workRestrictions, set: (obj, value) => { obj.workRestrictions = value; } }, metadata: _metadata }, _workRestrictions_initializers, _workRestrictions_extraInitializers);
        __esDecorate(null, null, _modifiedDuties_decorators, { kind: "field", name: "modifiedDuties", static: false, private: false, access: { has: obj => "modifiedDuties" in obj, get: obj => obj.modifiedDuties, set: (obj, value) => { obj.modifiedDuties = value; } }, metadata: _metadata }, _modifiedDuties_initializers, _modifiedDuties_extraInitializers);
        __esDecorate(null, null, _medicalClearance_decorators, { kind: "field", name: "medicalClearance", static: false, private: false, access: { has: obj => "medicalClearance" in obj, get: obj => obj.medicalClearance, set: (obj, value) => { obj.medicalClearance = value; } }, metadata: _metadata }, _medicalClearance_initializers, _medicalClearance_extraInitializers);
        __esDecorate(null, null, _reintegrationPlan_decorators, { kind: "field", name: "reintegrationPlan", static: false, private: false, access: { has: obj => "reintegrationPlan" in obj, get: obj => obj.reintegrationPlan, set: (obj, value) => { obj.reintegrationPlan = value; } }, metadata: _metadata }, _reintegrationPlan_initializers, _reintegrationPlan_extraInitializers);
        __esDecorate(null, null, _followUpDate_decorators, { kind: "field", name: "followUpDate", static: false, private: false, access: { has: obj => "followUpDate" in obj, get: obj => obj.followUpDate, set: (obj, value) => { obj.followUpDate = value; } }, metadata: _metadata }, _followUpDate_initializers, _followUpDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _leave_decorators, { kind: "field", name: "leave", static: false, private: false, access: { has: obj => "leave" in obj, get: obj => obj.leave, set: (obj, value) => { obj.leave = value; } }, metadata: _metadata }, _leave_initializers, _leave_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReturnToWork = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReturnToWork = _classThis;
})();
exports.ReturnToWork = ReturnToWork;
/**
 * Employee Exit Model - Tracks employee exits
 */
let EmployeeExit = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_exits',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['exit_type'] },
                { fields: ['last_working_date'] },
                { fields: ['rehire_eligibility'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _exitType_decorators;
    let _exitType_initializers = [];
    let _exitType_extraInitializers = [];
    let _lastWorkingDate_decorators;
    let _lastWorkingDate_initializers = [];
    let _lastWorkingDate_extraInitializers = [];
    let _noticeDate_decorators;
    let _noticeDate_initializers = [];
    let _noticeDate_extraInitializers = [];
    let _noticePeriodDays_decorators;
    let _noticePeriodDays_initializers = [];
    let _noticePeriodDays_extraInitializers = [];
    let _exitReason_decorators;
    let _exitReason_initializers = [];
    let _exitReason_extraInitializers = [];
    let _initiatedBy_decorators;
    let _initiatedBy_initializers = [];
    let _initiatedBy_extraInitializers = [];
    let _rehireEligibility_decorators;
    let _rehireEligibility_initializers = [];
    let _rehireEligibility_extraInitializers = [];
    let _finalSettlementAmount_decorators;
    let _finalSettlementAmount_initializers = [];
    let _finalSettlementAmount_extraInitializers = [];
    let _equipmentReturnStatus_decorators;
    let _equipmentReturnStatus_initializers = [];
    let _equipmentReturnStatus_extraInitializers = [];
    let _exitInterviewScheduled_decorators;
    let _exitInterviewScheduled_initializers = [];
    let _exitInterviewScheduled_extraInitializers = [];
    let _exitInterviewCompleted_decorators;
    let _exitInterviewCompleted_initializers = [];
    let _exitInterviewCompleted_extraInitializers = [];
    let _referenceCheckAllowed_decorators;
    let _referenceCheckAllowed_initializers = [];
    let _referenceCheckAllowed_extraInitializers = [];
    let _exitClearanceCompleted_decorators;
    let _exitClearanceCompleted_initializers = [];
    let _exitClearanceCompleted_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var EmployeeExit = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.exitType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _exitType_initializers, void 0));
            this.lastWorkingDate = (__runInitializers(this, _exitType_extraInitializers), __runInitializers(this, _lastWorkingDate_initializers, void 0));
            this.noticeDate = (__runInitializers(this, _lastWorkingDate_extraInitializers), __runInitializers(this, _noticeDate_initializers, void 0));
            this.noticePeriodDays = (__runInitializers(this, _noticeDate_extraInitializers), __runInitializers(this, _noticePeriodDays_initializers, void 0));
            this.exitReason = (__runInitializers(this, _noticePeriodDays_extraInitializers), __runInitializers(this, _exitReason_initializers, void 0));
            this.initiatedBy = (__runInitializers(this, _exitReason_extraInitializers), __runInitializers(this, _initiatedBy_initializers, void 0));
            this.rehireEligibility = (__runInitializers(this, _initiatedBy_extraInitializers), __runInitializers(this, _rehireEligibility_initializers, void 0));
            this.finalSettlementAmount = (__runInitializers(this, _rehireEligibility_extraInitializers), __runInitializers(this, _finalSettlementAmount_initializers, void 0));
            this.equipmentReturnStatus = (__runInitializers(this, _finalSettlementAmount_extraInitializers), __runInitializers(this, _equipmentReturnStatus_initializers, void 0));
            this.exitInterviewScheduled = (__runInitializers(this, _equipmentReturnStatus_extraInitializers), __runInitializers(this, _exitInterviewScheduled_initializers, void 0));
            this.exitInterviewCompleted = (__runInitializers(this, _exitInterviewScheduled_extraInitializers), __runInitializers(this, _exitInterviewCompleted_initializers, void 0));
            this.referenceCheckAllowed = (__runInitializers(this, _exitInterviewCompleted_extraInitializers), __runInitializers(this, _referenceCheckAllowed_initializers, void 0));
            this.exitClearanceCompleted = (__runInitializers(this, _referenceCheckAllowed_extraInitializers), __runInitializers(this, _exitClearanceCompleted_initializers, void 0));
            this.notes = (__runInitializers(this, _exitClearanceCompleted_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeExit");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _exitType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExitType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _lastWorkingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last working date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _noticeDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notice date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _noticePeriodDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notice period days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _exitReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _initiatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initiated by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _rehireEligibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rehire eligibility' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RehireEligibility)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _finalSettlementAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final settlement amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _equipmentReturnStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Equipment return status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'partial', 'complete'),
                defaultValue: 'pending',
            })];
        _exitInterviewScheduled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit interview scheduled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _exitInterviewCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit interview completed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _referenceCheckAllowed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference check allowed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _exitClearanceCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit clearance completed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _exitType_decorators, { kind: "field", name: "exitType", static: false, private: false, access: { has: obj => "exitType" in obj, get: obj => obj.exitType, set: (obj, value) => { obj.exitType = value; } }, metadata: _metadata }, _exitType_initializers, _exitType_extraInitializers);
        __esDecorate(null, null, _lastWorkingDate_decorators, { kind: "field", name: "lastWorkingDate", static: false, private: false, access: { has: obj => "lastWorkingDate" in obj, get: obj => obj.lastWorkingDate, set: (obj, value) => { obj.lastWorkingDate = value; } }, metadata: _metadata }, _lastWorkingDate_initializers, _lastWorkingDate_extraInitializers);
        __esDecorate(null, null, _noticeDate_decorators, { kind: "field", name: "noticeDate", static: false, private: false, access: { has: obj => "noticeDate" in obj, get: obj => obj.noticeDate, set: (obj, value) => { obj.noticeDate = value; } }, metadata: _metadata }, _noticeDate_initializers, _noticeDate_extraInitializers);
        __esDecorate(null, null, _noticePeriodDays_decorators, { kind: "field", name: "noticePeriodDays", static: false, private: false, access: { has: obj => "noticePeriodDays" in obj, get: obj => obj.noticePeriodDays, set: (obj, value) => { obj.noticePeriodDays = value; } }, metadata: _metadata }, _noticePeriodDays_initializers, _noticePeriodDays_extraInitializers);
        __esDecorate(null, null, _exitReason_decorators, { kind: "field", name: "exitReason", static: false, private: false, access: { has: obj => "exitReason" in obj, get: obj => obj.exitReason, set: (obj, value) => { obj.exitReason = value; } }, metadata: _metadata }, _exitReason_initializers, _exitReason_extraInitializers);
        __esDecorate(null, null, _initiatedBy_decorators, { kind: "field", name: "initiatedBy", static: false, private: false, access: { has: obj => "initiatedBy" in obj, get: obj => obj.initiatedBy, set: (obj, value) => { obj.initiatedBy = value; } }, metadata: _metadata }, _initiatedBy_initializers, _initiatedBy_extraInitializers);
        __esDecorate(null, null, _rehireEligibility_decorators, { kind: "field", name: "rehireEligibility", static: false, private: false, access: { has: obj => "rehireEligibility" in obj, get: obj => obj.rehireEligibility, set: (obj, value) => { obj.rehireEligibility = value; } }, metadata: _metadata }, _rehireEligibility_initializers, _rehireEligibility_extraInitializers);
        __esDecorate(null, null, _finalSettlementAmount_decorators, { kind: "field", name: "finalSettlementAmount", static: false, private: false, access: { has: obj => "finalSettlementAmount" in obj, get: obj => obj.finalSettlementAmount, set: (obj, value) => { obj.finalSettlementAmount = value; } }, metadata: _metadata }, _finalSettlementAmount_initializers, _finalSettlementAmount_extraInitializers);
        __esDecorate(null, null, _equipmentReturnStatus_decorators, { kind: "field", name: "equipmentReturnStatus", static: false, private: false, access: { has: obj => "equipmentReturnStatus" in obj, get: obj => obj.equipmentReturnStatus, set: (obj, value) => { obj.equipmentReturnStatus = value; } }, metadata: _metadata }, _equipmentReturnStatus_initializers, _equipmentReturnStatus_extraInitializers);
        __esDecorate(null, null, _exitInterviewScheduled_decorators, { kind: "field", name: "exitInterviewScheduled", static: false, private: false, access: { has: obj => "exitInterviewScheduled" in obj, get: obj => obj.exitInterviewScheduled, set: (obj, value) => { obj.exitInterviewScheduled = value; } }, metadata: _metadata }, _exitInterviewScheduled_initializers, _exitInterviewScheduled_extraInitializers);
        __esDecorate(null, null, _exitInterviewCompleted_decorators, { kind: "field", name: "exitInterviewCompleted", static: false, private: false, access: { has: obj => "exitInterviewCompleted" in obj, get: obj => obj.exitInterviewCompleted, set: (obj, value) => { obj.exitInterviewCompleted = value; } }, metadata: _metadata }, _exitInterviewCompleted_initializers, _exitInterviewCompleted_extraInitializers);
        __esDecorate(null, null, _referenceCheckAllowed_decorators, { kind: "field", name: "referenceCheckAllowed", static: false, private: false, access: { has: obj => "referenceCheckAllowed" in obj, get: obj => obj.referenceCheckAllowed, set: (obj, value) => { obj.referenceCheckAllowed = value; } }, metadata: _metadata }, _referenceCheckAllowed_initializers, _referenceCheckAllowed_extraInitializers);
        __esDecorate(null, null, _exitClearanceCompleted_decorators, { kind: "field", name: "exitClearanceCompleted", static: false, private: false, access: { has: obj => "exitClearanceCompleted" in obj, get: obj => obj.exitClearanceCompleted, set: (obj, value) => { obj.exitClearanceCompleted = value; } }, metadata: _metadata }, _exitClearanceCompleted_initializers, _exitClearanceCompleted_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeExit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeExit = _classThis;
})();
exports.EmployeeExit = EmployeeExit;
/**
 * Exit Interview Model - Tracks exit interview data
 */
let ExitInterview = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'exit_interviews',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['exit_id'] },
                { fields: ['interview_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _exitId_decorators;
    let _exitId_initializers = [];
    let _exitId_extraInitializers = [];
    let _interviewDate_decorators;
    let _interviewDate_initializers = [];
    let _interviewDate_extraInitializers = [];
    let _conductedBy_decorators;
    let _conductedBy_initializers = [];
    let _conductedBy_extraInitializers = [];
    let _reasonForLeaving_decorators;
    let _reasonForLeaving_initializers = [];
    let _reasonForLeaving_extraInitializers = [];
    let _feedbackOnManagement_decorators;
    let _feedbackOnManagement_initializers = [];
    let _feedbackOnManagement_extraInitializers = [];
    let _feedbackOnWorkEnvironment_decorators;
    let _feedbackOnWorkEnvironment_initializers = [];
    let _feedbackOnWorkEnvironment_extraInitializers = [];
    let _wouldRecommendCompany_decorators;
    let _wouldRecommendCompany_initializers = [];
    let _wouldRecommendCompany_extraInitializers = [];
    let _wouldRehire_decorators;
    let _wouldRehire_initializers = [];
    let _wouldRehire_extraInitializers = [];
    let _improvementSuggestions_decorators;
    let _improvementSuggestions_initializers = [];
    let _improvementSuggestions_extraInitializers = [];
    let _exitSurveyResponses_decorators;
    let _exitSurveyResponses_initializers = [];
    let _exitSurveyResponses_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _exit_decorators;
    let _exit_initializers = [];
    let _exit_extraInitializers = [];
    var ExitInterview = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.exitId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _exitId_initializers, void 0));
            this.interviewDate = (__runInitializers(this, _exitId_extraInitializers), __runInitializers(this, _interviewDate_initializers, void 0));
            this.conductedBy = (__runInitializers(this, _interviewDate_extraInitializers), __runInitializers(this, _conductedBy_initializers, void 0));
            this.reasonForLeaving = (__runInitializers(this, _conductedBy_extraInitializers), __runInitializers(this, _reasonForLeaving_initializers, void 0));
            this.feedbackOnManagement = (__runInitializers(this, _reasonForLeaving_extraInitializers), __runInitializers(this, _feedbackOnManagement_initializers, void 0));
            this.feedbackOnWorkEnvironment = (__runInitializers(this, _feedbackOnManagement_extraInitializers), __runInitializers(this, _feedbackOnWorkEnvironment_initializers, void 0));
            this.wouldRecommendCompany = (__runInitializers(this, _feedbackOnWorkEnvironment_extraInitializers), __runInitializers(this, _wouldRecommendCompany_initializers, void 0));
            this.wouldRehire = (__runInitializers(this, _wouldRecommendCompany_extraInitializers), __runInitializers(this, _wouldRehire_initializers, void 0));
            this.improvementSuggestions = (__runInitializers(this, _wouldRehire_extraInitializers), __runInitializers(this, _improvementSuggestions_initializers, void 0));
            this.exitSurveyResponses = (__runInitializers(this, _improvementSuggestions_extraInitializers), __runInitializers(this, _exitSurveyResponses_initializers, void 0));
            this.notes = (__runInitializers(this, _exitSurveyResponses_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.exit = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _exit_initializers, void 0));
            __runInitializers(this, _exit_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExitInterview");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _exitId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit ID' }), (0, sequelize_typescript_1.ForeignKey)(() => EmployeeExit), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _interviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Interview date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _conductedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conducted by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _reasonForLeaving_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primary reason for leaving' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _feedbackOnManagement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback on management' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _feedbackOnWorkEnvironment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback on work environment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _wouldRecommendCompany_decorators = [(0, swagger_1.ApiProperty)({ description: 'Would recommend company' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _wouldRehire_decorators = [(0, swagger_1.ApiProperty)({ description: 'Would rehire employee' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _improvementSuggestions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Improvement suggestions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _exitSurveyResponses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exit survey responses' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        _exit_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EmployeeExit)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _exitId_decorators, { kind: "field", name: "exitId", static: false, private: false, access: { has: obj => "exitId" in obj, get: obj => obj.exitId, set: (obj, value) => { obj.exitId = value; } }, metadata: _metadata }, _exitId_initializers, _exitId_extraInitializers);
        __esDecorate(null, null, _interviewDate_decorators, { kind: "field", name: "interviewDate", static: false, private: false, access: { has: obj => "interviewDate" in obj, get: obj => obj.interviewDate, set: (obj, value) => { obj.interviewDate = value; } }, metadata: _metadata }, _interviewDate_initializers, _interviewDate_extraInitializers);
        __esDecorate(null, null, _conductedBy_decorators, { kind: "field", name: "conductedBy", static: false, private: false, access: { has: obj => "conductedBy" in obj, get: obj => obj.conductedBy, set: (obj, value) => { obj.conductedBy = value; } }, metadata: _metadata }, _conductedBy_initializers, _conductedBy_extraInitializers);
        __esDecorate(null, null, _reasonForLeaving_decorators, { kind: "field", name: "reasonForLeaving", static: false, private: false, access: { has: obj => "reasonForLeaving" in obj, get: obj => obj.reasonForLeaving, set: (obj, value) => { obj.reasonForLeaving = value; } }, metadata: _metadata }, _reasonForLeaving_initializers, _reasonForLeaving_extraInitializers);
        __esDecorate(null, null, _feedbackOnManagement_decorators, { kind: "field", name: "feedbackOnManagement", static: false, private: false, access: { has: obj => "feedbackOnManagement" in obj, get: obj => obj.feedbackOnManagement, set: (obj, value) => { obj.feedbackOnManagement = value; } }, metadata: _metadata }, _feedbackOnManagement_initializers, _feedbackOnManagement_extraInitializers);
        __esDecorate(null, null, _feedbackOnWorkEnvironment_decorators, { kind: "field", name: "feedbackOnWorkEnvironment", static: false, private: false, access: { has: obj => "feedbackOnWorkEnvironment" in obj, get: obj => obj.feedbackOnWorkEnvironment, set: (obj, value) => { obj.feedbackOnWorkEnvironment = value; } }, metadata: _metadata }, _feedbackOnWorkEnvironment_initializers, _feedbackOnWorkEnvironment_extraInitializers);
        __esDecorate(null, null, _wouldRecommendCompany_decorators, { kind: "field", name: "wouldRecommendCompany", static: false, private: false, access: { has: obj => "wouldRecommendCompany" in obj, get: obj => obj.wouldRecommendCompany, set: (obj, value) => { obj.wouldRecommendCompany = value; } }, metadata: _metadata }, _wouldRecommendCompany_initializers, _wouldRecommendCompany_extraInitializers);
        __esDecorate(null, null, _wouldRehire_decorators, { kind: "field", name: "wouldRehire", static: false, private: false, access: { has: obj => "wouldRehire" in obj, get: obj => obj.wouldRehire, set: (obj, value) => { obj.wouldRehire = value; } }, metadata: _metadata }, _wouldRehire_initializers, _wouldRehire_extraInitializers);
        __esDecorate(null, null, _improvementSuggestions_decorators, { kind: "field", name: "improvementSuggestions", static: false, private: false, access: { has: obj => "improvementSuggestions" in obj, get: obj => obj.improvementSuggestions, set: (obj, value) => { obj.improvementSuggestions = value; } }, metadata: _metadata }, _improvementSuggestions_initializers, _improvementSuggestions_extraInitializers);
        __esDecorate(null, null, _exitSurveyResponses_decorators, { kind: "field", name: "exitSurveyResponses", static: false, private: false, access: { has: obj => "exitSurveyResponses" in obj, get: obj => obj.exitSurveyResponses, set: (obj, value) => { obj.exitSurveyResponses = value; } }, metadata: _metadata }, _exitSurveyResponses_initializers, _exitSurveyResponses_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _exit_decorators, { kind: "field", name: "exit", static: false, private: false, access: { has: obj => "exit" in obj, get: obj => obj.exit, set: (obj, value) => { obj.exit = value; } }, metadata: _metadata }, _exit_initializers, _exit_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExitInterview = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExitInterview = _classThis;
})();
exports.ExitInterview = ExitInterview;
/**
 * Rehire Record Model - Tracks rehire eligibility and records
 */
let RehireRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'rehire_records',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['former_employee_number'] },
                { fields: ['eligibility_status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _formerEmployeeNumber_decorators;
    let _formerEmployeeNumber_initializers = [];
    let _formerEmployeeNumber_extraInitializers = [];
    let _previousExitType_decorators;
    let _previousExitType_initializers = [];
    let _previousExitType_extraInitializers = [];
    let _previousExitDate_decorators;
    let _previousExitDate_initializers = [];
    let _previousExitDate_extraInitializers = [];
    let _eligibilityStatus_decorators;
    let _eligibilityStatus_initializers = [];
    let _eligibilityStatus_extraInitializers = [];
    let _reasonsForIneligibility_decorators;
    let _reasonsForIneligibility_initializers = [];
    let _reasonsForIneligibility_extraInitializers = [];
    let _conditionalRequirements_decorators;
    let _conditionalRequirements_initializers = [];
    let _conditionalRequirements_extraInitializers = [];
    let _performanceHistory_decorators;
    let _performanceHistory_initializers = [];
    let _performanceHistory_extraInitializers = [];
    let _disciplinaryHistory_decorators;
    let _disciplinaryHistory_initializers = [];
    let _disciplinaryHistory_extraInitializers = [];
    let _rehireRecommendation_decorators;
    let _rehireRecommendation_initializers = [];
    let _rehireRecommendation_extraInitializers = [];
    let _rehireDate_decorators;
    let _rehireDate_initializers = [];
    let _rehireDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var RehireRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.formerEmployeeNumber = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _formerEmployeeNumber_initializers, void 0));
            this.previousExitType = (__runInitializers(this, _formerEmployeeNumber_extraInitializers), __runInitializers(this, _previousExitType_initializers, void 0));
            this.previousExitDate = (__runInitializers(this, _previousExitType_extraInitializers), __runInitializers(this, _previousExitDate_initializers, void 0));
            this.eligibilityStatus = (__runInitializers(this, _previousExitDate_extraInitializers), __runInitializers(this, _eligibilityStatus_initializers, void 0));
            this.reasonsForIneligibility = (__runInitializers(this, _eligibilityStatus_extraInitializers), __runInitializers(this, _reasonsForIneligibility_initializers, void 0));
            this.conditionalRequirements = (__runInitializers(this, _reasonsForIneligibility_extraInitializers), __runInitializers(this, _conditionalRequirements_initializers, void 0));
            this.performanceHistory = (__runInitializers(this, _conditionalRequirements_extraInitializers), __runInitializers(this, _performanceHistory_initializers, void 0));
            this.disciplinaryHistory = (__runInitializers(this, _performanceHistory_extraInitializers), __runInitializers(this, _disciplinaryHistory_initializers, void 0));
            this.rehireRecommendation = (__runInitializers(this, _disciplinaryHistory_extraInitializers), __runInitializers(this, _rehireRecommendation_initializers, void 0));
            this.rehireDate = (__runInitializers(this, _rehireRecommendation_extraInitializers), __runInitializers(this, _rehireDate_initializers, void 0));
            this.notes = (__runInitializers(this, _rehireDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RehireRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current employee ID (if rehired)' }), (0, sequelize_typescript_1.ForeignKey)(() => Employee), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _formerEmployeeNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Former employee number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _previousExitType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous exit type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExitType)), allowNull: false })];
        _previousExitDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous exit date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _eligibilityStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Eligibility status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RehireEligibility)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _reasonsForIneligibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reasons for ineligibility' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _conditionalRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditional requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _performanceHistory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance history summary' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _disciplinaryHistory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disciplinary history summary' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rehireRecommendation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rehire recommendation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _rehireDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rehire date (if rehired)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Employee)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _formerEmployeeNumber_decorators, { kind: "field", name: "formerEmployeeNumber", static: false, private: false, access: { has: obj => "formerEmployeeNumber" in obj, get: obj => obj.formerEmployeeNumber, set: (obj, value) => { obj.formerEmployeeNumber = value; } }, metadata: _metadata }, _formerEmployeeNumber_initializers, _formerEmployeeNumber_extraInitializers);
        __esDecorate(null, null, _previousExitType_decorators, { kind: "field", name: "previousExitType", static: false, private: false, access: { has: obj => "previousExitType" in obj, get: obj => obj.previousExitType, set: (obj, value) => { obj.previousExitType = value; } }, metadata: _metadata }, _previousExitType_initializers, _previousExitType_extraInitializers);
        __esDecorate(null, null, _previousExitDate_decorators, { kind: "field", name: "previousExitDate", static: false, private: false, access: { has: obj => "previousExitDate" in obj, get: obj => obj.previousExitDate, set: (obj, value) => { obj.previousExitDate = value; } }, metadata: _metadata }, _previousExitDate_initializers, _previousExitDate_extraInitializers);
        __esDecorate(null, null, _eligibilityStatus_decorators, { kind: "field", name: "eligibilityStatus", static: false, private: false, access: { has: obj => "eligibilityStatus" in obj, get: obj => obj.eligibilityStatus, set: (obj, value) => { obj.eligibilityStatus = value; } }, metadata: _metadata }, _eligibilityStatus_initializers, _eligibilityStatus_extraInitializers);
        __esDecorate(null, null, _reasonsForIneligibility_decorators, { kind: "field", name: "reasonsForIneligibility", static: false, private: false, access: { has: obj => "reasonsForIneligibility" in obj, get: obj => obj.reasonsForIneligibility, set: (obj, value) => { obj.reasonsForIneligibility = value; } }, metadata: _metadata }, _reasonsForIneligibility_initializers, _reasonsForIneligibility_extraInitializers);
        __esDecorate(null, null, _conditionalRequirements_decorators, { kind: "field", name: "conditionalRequirements", static: false, private: false, access: { has: obj => "conditionalRequirements" in obj, get: obj => obj.conditionalRequirements, set: (obj, value) => { obj.conditionalRequirements = value; } }, metadata: _metadata }, _conditionalRequirements_initializers, _conditionalRequirements_extraInitializers);
        __esDecorate(null, null, _performanceHistory_decorators, { kind: "field", name: "performanceHistory", static: false, private: false, access: { has: obj => "performanceHistory" in obj, get: obj => obj.performanceHistory, set: (obj, value) => { obj.performanceHistory = value; } }, metadata: _metadata }, _performanceHistory_initializers, _performanceHistory_extraInitializers);
        __esDecorate(null, null, _disciplinaryHistory_decorators, { kind: "field", name: "disciplinaryHistory", static: false, private: false, access: { has: obj => "disciplinaryHistory" in obj, get: obj => obj.disciplinaryHistory, set: (obj, value) => { obj.disciplinaryHistory = value; } }, metadata: _metadata }, _disciplinaryHistory_initializers, _disciplinaryHistory_extraInitializers);
        __esDecorate(null, null, _rehireRecommendation_decorators, { kind: "field", name: "rehireRecommendation", static: false, private: false, access: { has: obj => "rehireRecommendation" in obj, get: obj => obj.rehireRecommendation, set: (obj, value) => { obj.rehireRecommendation = value; } }, metadata: _metadata }, _rehireRecommendation_initializers, _rehireRecommendation_extraInitializers);
        __esDecorate(null, null, _rehireDate_decorators, { kind: "field", name: "rehireDate", static: false, private: false, access: { has: obj => "rehireDate" in obj, get: obj => obj.rehireDate, set: (obj, value) => { obj.rehireDate = value; } }, metadata: _metadata }, _rehireDate_initializers, _rehireDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RehireRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RehireRecord = _classThis;
})();
exports.RehireRecord = RehireRecord;
// ============================================================================
// EMPLOYEE REGISTRATION AND ONBOARDING (Functions 1-8)
// ============================================================================
/**
 * Registers a new employee in the system
 *
 * @param data - Employee registration data
 * @param transaction - Optional database transaction
 * @returns Created employee record
 *
 * @example
 * ```typescript
 * const employee = await registerEmployee({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@company.com',
 *   dateOfBirth: new Date('1990-01-15'),
 *   hireDate: new Date('2024-03-01'),
 *   positionId: 'pos-123',
 *   departmentId: 'dept-456',
 *   locationId: 'loc-789',
 *   employmentType: 'full_time',
 *   jobTitle: 'Software Engineer'
 * });
 * ```
 */
async function registerEmployee(data, transaction) {
    // Generate employee number if not provided
    const employeeNumber = data.employeeNumber || await generateEmployeeNumber();
    // Create employee record
    const employee = await Employee.create({
        ...data,
        employeeNumber,
        lifecycleState: EmployeeLifecycleState.PRE_HIRE,
        isActive: true,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'employee_registered',
        eventDate: new Date(),
        toState: EmployeeLifecycleState.PRE_HIRE,
        triggeredBy: 'system',
        metadata: { registrationData: data },
    }, { transaction });
    return employee;
}
/**
 * Generates a unique employee number
 *
 * @returns Generated employee number
 *
 * @example
 * ```typescript
 * const empNumber = await generateEmployeeNumber();
 * // Returns: "EMP-2024-001234"
 * ```
 */
async function generateEmployeeNumber() {
    const year = new Date().getFullYear();
    const count = await Employee.count();
    return `EMP-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Creates onboarding plan for new hire
 *
 * @param data - Onboarding plan data
 * @param transaction - Optional database transaction
 * @returns Created onboarding record
 *
 * @example
 * ```typescript
 * const onboarding = await createOnboardingPlan({
 *   employeeId: 'emp-123',
 *   plannedStartDate: new Date('2024-03-01'),
 *   buddy: 'emp-456',
 *   mentor: 'emp-789',
 *   checklistItems: [
 *     {
 *       id: '1',
 *       category: 'paperwork',
 *       taskName: 'Complete W-4 form',
 *       isRequired: true,
 *       status: 'pending'
 *     }
 *   ]
 * });
 * ```
 */
async function createOnboardingPlan(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    const onboarding = await Onboarding.create({
        employeeId: data.employeeId,
        onboardingStatus: OnboardingStatus.NOT_STARTED,
        plannedStartDate: data.plannedStartDate,
        actualStartDate: data.actualStartDate,
        buddyId: data.buddy,
        mentorId: data.mentor,
        checklistItems: data.checklistItems,
        completionPercentage: 0,
        notes: data.notes,
    }, { transaction });
    return onboarding;
}
/**
 * Updates onboarding checklist item status
 *
 * @param onboardingId - Onboarding identifier
 * @param itemId - Checklist item ID
 * @param status - New status
 * @param completedDate - Completion date if completed
 * @param transaction - Optional database transaction
 * @returns Updated onboarding record
 *
 * @example
 * ```typescript
 * await updateOnboardingChecklistItem(
 *   'onb-123',
 *   'item-1',
 *   'completed',
 *   new Date()
 * );
 * ```
 */
async function updateOnboardingChecklistItem(onboardingId, itemId, status, completedDate, transaction) {
    const onboarding = await Onboarding.findByPk(onboardingId, { transaction });
    if (!onboarding) {
        throw new common_1.NotFoundException(`Onboarding ${onboardingId} not found`);
    }
    const checklistItems = onboarding.checklistItems || [];
    const item = checklistItems.find(i => i.id === itemId);
    if (!item) {
        throw new common_1.NotFoundException(`Checklist item ${itemId} not found`);
    }
    item.status = status;
    if (status === 'completed' && completedDate) {
        item.completedDate = completedDate;
    }
    // Calculate completion percentage
    const completedCount = checklistItems.filter(i => i.status === 'completed').length;
    const completionPercentage = Math.round((completedCount / checklistItems.length) * 100);
    await onboarding.update({
        checklistItems,
        completionPercentage,
        onboardingStatus: completionPercentage === 100
            ? OnboardingStatus.COMPLETED
            : OnboardingStatus.IN_PROGRESS,
    }, { transaction });
    return onboarding;
}
/**
 * Starts employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param actualStartDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and onboarding records
 *
 * @example
 * ```typescript
 * const { employee, onboarding } = await startOnboarding(
 *   'emp-123',
 *   new Date('2024-03-01')
 * );
 * ```
 */
async function startOnboarding(employeeId, actualStartDate, transaction) {
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    // Update employee lifecycle state
    await employee.update({ lifecycleState: EmployeeLifecycleState.ONBOARDING }, { transaction });
    // Update onboarding record
    const onboarding = await Onboarding.findOne({
        where: { employeeId },
        transaction,
    });
    if (!onboarding) {
        throw new common_1.NotFoundException(`Onboarding plan not found for employee ${employeeId}`);
    }
    await onboarding.update({
        actualStartDate,
        onboardingStatus: OnboardingStatus.IN_PROGRESS,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId,
        eventType: 'onboarding_started',
        eventDate: actualStartDate,
        fromState: EmployeeLifecycleState.PRE_HIRE,
        toState: EmployeeLifecycleState.ONBOARDING,
        triggeredBy: 'system',
    }, { transaction });
    return { employee, onboarding };
}
/**
 * Completes employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param completionDate - Onboarding completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 *
 * @example
 * ```typescript
 * const employee = await completeOnboarding('emp-123', new Date());
 * ```
 */
async function completeOnboarding(employeeId, completionDate, transaction) {
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    // Update onboarding record
    const onboarding = await Onboarding.findOne({
        where: { employeeId },
        transaction,
    });
    if (onboarding) {
        await onboarding.update({
            completionDate,
            onboardingStatus: OnboardingStatus.COMPLETED,
            completionPercentage: 100,
        }, { transaction });
    }
    // Update employee lifecycle state
    await employee.update({ lifecycleState: EmployeeLifecycleState.PROBATION }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId,
        eventType: 'onboarding_completed',
        eventDate: completionDate,
        fromState: EmployeeLifecycleState.ONBOARDING,
        toState: EmployeeLifecycleState.PROBATION,
        triggeredBy: 'system',
    }, { transaction });
    return employee;
}
/**
 * Gets onboarding status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Onboarding record with details
 *
 * @example
 * ```typescript
 * const status = await getOnboardingStatus('emp-123');
 * console.log(status.completionPercentage);
 * ```
 */
async function getOnboardingStatus(employeeId) {
    const onboarding = await Onboarding.findOne({
        where: { employeeId },
        include: [{ model: Employee }],
    });
    if (!onboarding) {
        throw new common_1.NotFoundException(`Onboarding plan not found for employee ${employeeId}`);
    }
    return onboarding;
}
/**
 * Gets all onboarding records with specific status
 *
 * @param status - Onboarding status to filter
 * @param limit - Maximum number of records
 * @returns Array of onboarding records
 *
 * @example
 * ```typescript
 * const inProgress = await getOnboardingsByStatus(
 *   OnboardingStatus.IN_PROGRESS,
 *   50
 * );
 * ```
 */
async function getOnboardingsByStatus(status, limit = 100) {
    return Onboarding.findAll({
        where: { onboardingStatus: status },
        include: [{ model: Employee }],
        order: [['plannedStartDate', 'ASC']],
        limit,
    });
}
// ============================================================================
// PROBATION PERIOD MANAGEMENT (Functions 9-13)
// ============================================================================
/**
 * Creates probation period for employee
 *
 * @param data - Probation period data
 * @param transaction - Optional database transaction
 * @returns Created probation period record
 *
 * @example
 * ```typescript
 * const probation = await createProbationPeriod({
 *   employeeId: 'emp-123',
 *   startDate: new Date('2024-03-01'),
 *   endDate: new Date('2024-06-01'),
 *   reviewSchedule: [new Date('2024-04-15'), new Date('2024-05-15')],
 *   managerId: 'mgr-456'
 * });
 * ```
 */
async function createProbationPeriod(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    const probation = await ProbationPeriod.create({
        employeeId: data.employeeId,
        probationStatus: ProbationStatus.ACTIVE,
        startDate: data.startDate,
        endDate: data.endDate,
        reviewSchedule: data.reviewSchedule,
        managerId: data.managerId,
        criteria: data.criteria,
        notes: data.notes,
    }, { transaction });
    return probation;
}
/**
 * Extends probation period
 *
 * @param probationId - Probation period identifier
 * @param newEndDate - New end date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated probation period
 *
 * @example
 * ```typescript
 * const extended = await extendProbationPeriod(
 *   'prob-123',
 *   new Date('2024-09-01'),
 *   'Additional time needed for performance improvement'
 * );
 * ```
 */
async function extendProbationPeriod(probationId, newEndDate, reason, transaction) {
    const probation = await ProbationPeriod.findByPk(probationId, { transaction });
    if (!probation) {
        throw new common_1.NotFoundException(`Probation period ${probationId} not found`);
    }
    await probation.update({
        endDate: newEndDate,
        probationStatus: ProbationStatus.EXTENDED,
        extensionReason: reason,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: probation.employeeId,
        eventType: 'probation_extended',
        eventDate: new Date(),
        triggeredBy: 'system',
        metadata: { newEndDate, reason },
    }, { transaction });
    return probation;
}
/**
 * Completes probation period evaluation
 *
 * @param probationId - Probation period identifier
 * @param passed - Whether employee passed probation
 * @param evaluationDate - Evaluation date
 * @param notes - Evaluation notes
 * @param transaction - Optional database transaction
 * @returns Updated probation period and employee
 *
 * @example
 * ```typescript
 * const result = await completeProbationEvaluation(
 *   'prob-123',
 *   true,
 *   new Date(),
 *   'Excellent performance, confirmed in position'
 * );
 * ```
 */
async function completeProbationEvaluation(probationId, passed, evaluationDate, notes, transaction) {
    const probation = await ProbationPeriod.findByPk(probationId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!probation) {
        throw new common_1.NotFoundException(`Probation period ${probationId} not found`);
    }
    // Update probation record
    await probation.update({
        probationStatus: passed ? ProbationStatus.PASSED : ProbationStatus.FAILED,
        finalEvaluationDate: evaluationDate,
        passed,
        notes: notes ? `${probation.notes || ''}\n${notes}` : probation.notes,
    }, { transaction });
    // Update employee lifecycle state
    const employee = probation.employee;
    if (passed) {
        await employee.update({ lifecycleState: EmployeeLifecycleState.ACTIVE }, { transaction });
        // Create lifecycle event
        await EmployeeLifecycleEvent.create({
            employeeId: employee.id,
            eventType: 'probation_passed',
            eventDate: evaluationDate,
            fromState: EmployeeLifecycleState.PROBATION,
            toState: EmployeeLifecycleState.ACTIVE,
            triggeredBy: probation.managerId,
        }, { transaction });
    }
    else {
        // Failed probation typically leads to termination
        await employee.update({ lifecycleState: EmployeeLifecycleState.TERMINATED }, { transaction });
        // Create lifecycle event
        await EmployeeLifecycleEvent.create({
            employeeId: employee.id,
            eventType: 'probation_failed',
            eventDate: evaluationDate,
            fromState: EmployeeLifecycleState.PROBATION,
            toState: EmployeeLifecycleState.TERMINATED,
            triggeredBy: probation.managerId,
            metadata: { reason: 'Failed probation period' },
        }, { transaction });
    }
    return { probation, employee };
}
/**
 * Gets probation periods ending soon
 *
 * @param daysUntilEnd - Number of days threshold
 * @returns Probation periods ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getProbationPeriodsEndingSoon(30);
 * ```
 */
async function getProbationPeriodsEndingSoon(daysUntilEnd = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysUntilEnd);
    return ProbationPeriod.findAll({
        where: {
            probationStatus: { [sequelize_1.Op.in]: [ProbationStatus.ACTIVE, ProbationStatus.EXTENDED] },
            endDate: { [sequelize_1.Op.lte]: thresholdDate },
        },
        include: [{ model: Employee }],
        order: [['endDate', 'ASC']],
    });
}
/**
 * Gets probation status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active probation period or null
 *
 * @example
 * ```typescript
 * const probation = await getProbationStatus('emp-123');
 * ```
 */
async function getProbationStatus(employeeId) {
    return ProbationPeriod.findOne({
        where: {
            employeeId,
            probationStatus: { [sequelize_1.Op.in]: [ProbationStatus.ACTIVE, ProbationStatus.EXTENDED] },
        },
        include: [{ model: Employee }],
    });
}
// ============================================================================
// INTERNAL TRANSFERS & PROMOTIONS (Functions 14-19)
// ============================================================================
/**
 * Creates internal transfer request
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer request
 *
 * @example
 * ```typescript
 * const transfer = await createTransferRequest({
 *   employeeId: 'emp-123',
 *   transferType: TransferType.PROMOTION,
 *   currentPositionId: 'pos-123',
 *   newPositionId: 'pos-456',
 *   currentDepartmentId: 'dept-123',
 *   newDepartmentId: 'dept-456',
 *   effectiveDate: new Date('2024-04-01'),
 *   reason: 'Promotion to senior role',
 *   requestedBy: 'mgr-789',
 *   approvalRequired: true
 * });
 * ```
 */
async function createTransferRequest(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    const transfer = await InternalTransfer.create({
        ...data,
        approvalStatus: data.approvalRequired ? 'pending' : 'approved',
    }, { transaction });
    return transfer;
}
/**
 * Approves transfer request
 *
 * @param transferId - Transfer identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const approved = await approveTransferRequest(
 *   'trans-123',
 *   'mgr-456',
 *   new Date()
 * );
 * ```
 */
async function approveTransferRequest(transferId, approvedBy, approvalDate = new Date(), transaction) {
    const transfer = await InternalTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    await transfer.update({
        approvalStatus: 'approved',
        approvedBy,
        approvalDate,
    }, { transaction });
    return transfer;
}
/**
 * Executes approved transfer
 *
 * @param transferId - Transfer identifier
 * @param effectiveDate - Effective date of transfer
 * @param transaction - Optional database transaction
 * @returns Updated employee and transfer records
 *
 * @example
 * ```typescript
 * const result = await executeTransfer('trans-123', new Date());
 * ```
 */
async function executeTransfer(transferId, effectiveDate = new Date(), transaction) {
    const transfer = await InternalTransfer.findByPk(transferId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.approvalStatus !== 'approved') {
        throw new common_1.BadRequestException('Transfer must be approved before execution');
    }
    const employee = transfer.employee;
    // Update employee details
    await employee.update({
        positionId: transfer.newPositionId,
        departmentId: transfer.newDepartmentId,
        locationId: transfer.newLocationId || employee.locationId,
        compensation: transfer.compensationChange
            ? (employee.compensation || 0) + transfer.compensationChange
            : employee.compensation,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'transfer_executed',
        eventDate: effectiveDate,
        triggeredBy: transfer.approvedBy || 'system',
        metadata: {
            transferType: transfer.transferType,
            fromPosition: transfer.currentPositionId,
            toPosition: transfer.newPositionId,
        },
    }, { transaction });
    return { employee, transfer };
}
/**
 * Gets pending transfer requests
 *
 * @param limit - Maximum number of records
 * @returns Pending transfer requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingTransfers(100);
 * ```
 */
async function getPendingTransfers(limit = 100) {
    return InternalTransfer.findAll({
        where: { approvalStatus: 'pending' },
        include: [{ model: Employee }],
        order: [['createdAt', 'ASC']],
        limit,
    });
}
/**
 * Gets transfer history for employee
 *
 * @param employeeId - Employee identifier
 * @param limit - Maximum number of records
 * @returns Transfer history
 *
 * @example
 * ```typescript
 * const history = await getTransferHistory('emp-123', 10);
 * ```
 */
async function getTransferHistory(employeeId, limit = 10) {
    return InternalTransfer.findAll({
        where: { employeeId },
        order: [['effectiveDate', 'DESC']],
        limit,
    });
}
/**
 * Cancels pending transfer request
 *
 * @param transferId - Transfer identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTransferRequest(
 *   'trans-123',
 *   'Employee declined promotion'
 * );
 * ```
 */
async function cancelTransferRequest(transferId, reason, transaction) {
    const transfer = await InternalTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    await transfer.update({
        approvalStatus: 'cancelled',
        notes: `${transfer.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return transfer;
}
// ============================================================================
// RELOCATION MANAGEMENT (Functions 20-23)
// ============================================================================
/**
 * Creates employee relocation request
 *
 * @param data - Relocation request data
 * @param transaction - Optional database transaction
 * @returns Created relocation record
 *
 * @example
 * ```typescript
 * const relocation = await createRelocationRequest({
 *   employeeId: 'emp-123',
 *   fromLocationId: 'loc-123',
 *   toLocationId: 'loc-456',
 *   effectiveDate: new Date('2024-05-01'),
 *   relocationPackage: 'standard',
 *   estimatedCost: 15000,
 *   movingExpensesAllowed: true,
 *   temporaryHousingDays: 30,
 *   reason: 'Business need - new office opening',
 *   requestedBy: 'mgr-789'
 * });
 * ```
 */
async function createRelocationRequest(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    const relocation = await EmployeeRelocation.create({
        ...data,
        relocationStatus: RelocationStatus.APPROVED,
    }, { transaction });
    return relocation;
}
/**
 * Starts relocation process
 *
 * @param relocationId - Relocation identifier
 * @param transaction - Optional database transaction
 * @returns Updated relocation record
 *
 * @example
 * ```typescript
 * const started = await startRelocation('rel-123');
 * ```
 */
async function startRelocation(relocationId, transaction) {
    const relocation = await EmployeeRelocation.findByPk(relocationId, { transaction });
    if (!relocation) {
        throw new common_1.NotFoundException(`Relocation ${relocationId} not found`);
    }
    await relocation.update({ relocationStatus: RelocationStatus.IN_PROGRESS }, { transaction });
    return relocation;
}
/**
 * Completes relocation process
 *
 * @param relocationId - Relocation identifier
 * @param completionDate - Completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee and relocation records
 *
 * @example
 * ```typescript
 * const result = await completeRelocation('rel-123', new Date());
 * ```
 */
async function completeRelocation(relocationId, completionDate = new Date(), transaction) {
    const relocation = await EmployeeRelocation.findByPk(relocationId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!relocation) {
        throw new common_1.NotFoundException(`Relocation ${relocationId} not found`);
    }
    // Update relocation status
    await relocation.update({
        relocationStatus: RelocationStatus.COMPLETED,
        completionDate,
    }, { transaction });
    // Update employee location
    const employee = relocation.employee;
    await employee.update({ locationId: relocation.toLocationId }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'relocation_completed',
        eventDate: completionDate,
        triggeredBy: 'system',
        metadata: {
            fromLocation: relocation.fromLocationId,
            toLocation: relocation.toLocationId,
        },
    }, { transaction });
    return { employee, relocation };
}
/**
 * Gets active relocations
 *
 * @param limit - Maximum number of records
 * @returns Active relocation records
 *
 * @example
 * ```typescript
 * const active = await getActiveRelocations(50);
 * ```
 */
async function getActiveRelocations(limit = 100) {
    return EmployeeRelocation.findAll({
        where: {
            relocationStatus: {
                [sequelize_1.Op.in]: [RelocationStatus.APPROVED, RelocationStatus.IN_PROGRESS],
            },
        },
        include: [{ model: Employee }],
        order: [['effectiveDate', 'ASC']],
        limit,
    });
}
// ============================================================================
// LEAVE OF ABSENCE MANAGEMENT (Functions 24-31)
// ============================================================================
/**
 * Creates leave of absence request
 *
 * @param data - Leave of absence data
 * @param transaction - Optional database transaction
 * @returns Created leave record
 *
 * @example
 * ```typescript
 * const leave = await createLeaveOfAbsence({
 *   employeeId: 'emp-123',
 *   leaveType: LeaveType.FMLA,
 *   startDate: new Date('2024-04-01'),
 *   endDate: new Date('2024-06-01'),
 *   expectedReturnDate: new Date('2024-06-03'),
 *   isPaid: false,
 *   reason: 'Medical condition requiring treatment',
 *   medicalCertificationRequired: true
 * });
 * ```
 */
async function createLeaveOfAbsence(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    const leave = await LeaveOfAbsence.create({
        ...data,
        leaveStatus: LeaveStatus.REQUESTED,
    }, { transaction });
    return leave;
}
/**
 * Approves leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const approved = await approveLeaveRequest('leave-123', 'mgr-456');
 * ```
 */
async function approveLeaveRequest(leaveId, approvedBy, approvalDate = new Date(), transaction) {
    const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${leaveId} not found`);
    }
    await leave.update({
        leaveStatus: LeaveStatus.APPROVED,
        approvedBy,
        approvalDate,
    }, { transaction });
    return leave;
}
/**
 * Starts leave of absence
 *
 * @param leaveId - Leave identifier
 * @param startDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and leave records
 *
 * @example
 * ```typescript
 * const result = await startLeave('leave-123', new Date());
 * ```
 */
async function startLeave(leaveId, startDate = new Date(), transaction) {
    const leave = await LeaveOfAbsence.findByPk(leaveId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${leaveId} not found`);
    }
    if (leave.leaveStatus !== LeaveStatus.APPROVED) {
        throw new common_1.BadRequestException('Leave must be approved before starting');
    }
    // Update leave status
    await leave.update({ leaveStatus: LeaveStatus.ACTIVE }, { transaction });
    // Update employee lifecycle state
    const employee = leave.employee;
    await employee.update({ lifecycleState: EmployeeLifecycleState.ON_LEAVE }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'leave_started',
        eventDate: startDate,
        fromState: EmployeeLifecycleState.ACTIVE,
        toState: EmployeeLifecycleState.ON_LEAVE,
        triggeredBy: leave.approvedBy || 'system',
        metadata: { leaveType: leave.leaveType, leaveId: leave.id },
    }, { transaction });
    return { employee, leave };
}
/**
 * Extends leave of absence
 *
 * @param leaveId - Leave identifier
 * @param newEndDate - New end date
 * @param newExpectedReturnDate - New expected return date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const extended = await extendLeave(
 *   'leave-123',
 *   new Date('2024-07-01'),
 *   new Date('2024-07-03'),
 *   'Medical condition requires additional recovery time'
 * );
 * ```
 */
async function extendLeave(leaveId, newEndDate, newExpectedReturnDate, reason, transaction) {
    const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${leaveId} not found`);
    }
    await leave.update({
        endDate: newEndDate,
        expectedReturnDate: newExpectedReturnDate,
        leaveStatus: LeaveStatus.EXTENDED,
        notes: `${leave.notes || ''}\nExtended: ${reason}`,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: leave.employeeId,
        eventType: 'leave_extended',
        eventDate: new Date(),
        triggeredBy: 'system',
        metadata: { newEndDate, reason },
    }, { transaction });
    return leave;
}
/**
 * Denies leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param reason - Denial reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const denied = await denyLeaveRequest(
 *   'leave-123',
 *   'Insufficient leave balance'
 * );
 * ```
 */
async function denyLeaveRequest(leaveId, reason, transaction) {
    const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${leaveId} not found`);
    }
    await leave.update({
        leaveStatus: LeaveStatus.DENIED,
        notes: `${leave.notes || ''}\nDenied: ${reason}`,
    }, { transaction });
    return leave;
}
/**
 * Cancels approved leave request
 *
 * @param leaveId - Leave identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const cancelled = await cancelLeaveRequest(
 *   'leave-123',
 *   'Employee no longer requires leave'
 * );
 * ```
 */
async function cancelLeaveRequest(leaveId, reason, transaction) {
    const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${leaveId} not found`);
    }
    await leave.update({
        leaveStatus: LeaveStatus.CANCELLED,
        notes: `${leave.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return leave;
}
/**
 * Gets active leaves for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active leave records
 *
 * @example
 * ```typescript
 * const leaves = await getActiveLeaves('emp-123');
 * ```
 */
async function getActiveLeaves(employeeId) {
    return LeaveOfAbsence.findAll({
        where: {
            employeeId,
            leaveStatus: { [sequelize_1.Op.in]: [LeaveStatus.ACTIVE, LeaveStatus.EXTENDED] },
        },
        order: [['startDate', 'DESC']],
    });
}
/**
 * Gets leaves ending soon
 *
 * @param daysUntilEnd - Days threshold
 * @returns Leaves ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getLeavesEndingSoon(7);
 * ```
 */
async function getLeavesEndingSoon(daysUntilEnd = 7) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysUntilEnd);
    return LeaveOfAbsence.findAll({
        where: {
            leaveStatus: { [sequelize_1.Op.in]: [LeaveStatus.ACTIVE, LeaveStatus.EXTENDED] },
            expectedReturnDate: { [sequelize_1.Op.lte]: thresholdDate },
        },
        include: [{ model: Employee }],
        order: [['expectedReturnDate', 'ASC']],
    });
}
// ============================================================================
// RETURN TO WORK PROCESSES (Functions 32-34)
// ============================================================================
/**
 * Processes return to work from leave
 *
 * @param data - Return to work data
 * @param transaction - Optional database transaction
 * @returns Return to work record and updated employee
 *
 * @example
 * ```typescript
 * const result = await processReturnToWork({
 *   employeeId: 'emp-123',
 *   leaveId: 'leave-456',
 *   actualReturnDate: new Date(),
 *   medicalClearance: true,
 *   workRestrictions: ['No lifting over 20 lbs'],
 *   reintegrationPlan: 'Gradual return to full duties over 2 weeks'
 * });
 * ```
 */
async function processReturnToWork(data, transaction) {
    const leave = await LeaveOfAbsence.findByPk(data.leaveId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!leave) {
        throw new common_1.NotFoundException(`Leave ${data.leaveId} not found`);
    }
    // Create return to work record
    const returnToWork = await ReturnToWork.create({
        ...data,
    }, { transaction });
    // Update leave status
    await leave.update({
        leaveStatus: LeaveStatus.RETURNED,
        actualReturnDate: data.actualReturnDate,
    }, { transaction });
    // Update employee lifecycle state
    const employee = leave.employee;
    await employee.update({ lifecycleState: EmployeeLifecycleState.ACTIVE }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'returned_to_work',
        eventDate: data.actualReturnDate,
        fromState: EmployeeLifecycleState.ON_LEAVE,
        toState: EmployeeLifecycleState.ACTIVE,
        triggeredBy: 'system',
        metadata: { leaveId: data.leaveId },
    }, { transaction });
    return { returnToWork, employee, leave };
}
/**
 * Updates return to work plan
 *
 * @param returnToWorkId - Return to work identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated return to work record
 *
 * @example
 * ```typescript
 * const updated = await updateReturnToWorkPlan('rtw-123', {
 *   modifiedDuties: 'Light duty assignments for first week',
 *   followUpDate: new Date('2024-05-15')
 * });
 * ```
 */
async function updateReturnToWorkPlan(returnToWorkId, updates, transaction) {
    const returnToWork = await ReturnToWork.findByPk(returnToWorkId, { transaction });
    if (!returnToWork) {
        throw new common_1.NotFoundException(`Return to work ${returnToWorkId} not found`);
    }
    await returnToWork.update(updates, { transaction });
    return returnToWork;
}
/**
 * Gets return to work records requiring follow-up
 *
 * @param daysUntilFollowUp - Days threshold
 * @returns Return to work records needing follow-up
 *
 * @example
 * ```typescript
 * const followUps = await getReturnToWorkFollowUps(7);
 * ```
 */
async function getReturnToWorkFollowUps(daysUntilFollowUp = 7) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysUntilFollowUp);
    return ReturnToWork.findAll({
        where: {
            followUpDate: { [sequelize_1.Op.lte]: thresholdDate, [sequelize_1.Op.ne]: null },
        },
        include: [{ model: Employee }],
        order: [['followUpDate', 'ASC']],
    });
}
// ============================================================================
// RESIGNATION & EXIT WORKFLOWS (Functions 35-40)
// ============================================================================
/**
 * Initiates employee exit process
 *
 * @param data - Employee exit data
 * @param transaction - Optional database transaction
 * @returns Created exit record
 *
 * @example
 * ```typescript
 * const exit = await initiateEmployeeExit({
 *   employeeId: 'emp-123',
 *   exitType: ExitType.VOLUNTARY_RESIGNATION,
 *   lastWorkingDate: new Date('2024-05-31'),
 *   noticeDate: new Date('2024-05-01'),
 *   noticePeriodDays: 30,
 *   exitReason: 'Career advancement opportunity',
 *   initiatedBy: 'emp-123',
 *   rehireEligibility: RehireEligibility.ELIGIBLE,
 *   referenceCheckAllowed: true
 * });
 * ```
 */
async function initiateEmployeeExit(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    // Create exit record
    const exit = await EmployeeExit.create({
        ...data,
        exitInterviewCompleted: false,
        exitClearanceCompleted: false,
    }, { transaction });
    // Update employee lifecycle state
    await employee.update({
        lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD,
        lastWorkingDate: data.lastWorkingDate,
        rehireEligibility: data.rehireEligibility,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'exit_initiated',
        eventDate: data.noticeDate || new Date(),
        fromState: employee.lifecycleState,
        toState: EmployeeLifecycleState.NOTICE_PERIOD,
        triggeredBy: data.initiatedBy,
        metadata: { exitType: data.exitType, lastWorkingDate: data.lastWorkingDate },
    }, { transaction });
    return exit;
}
/**
 * Conducts exit interview
 *
 * @param data - Exit interview data
 * @param transaction - Optional database transaction
 * @returns Created exit interview record
 *
 * @example
 * ```typescript
 * const interview = await conductExitInterview({
 *   employeeId: 'emp-123',
 *   exitId: 'exit-456',
 *   interviewDate: new Date(),
 *   conductedBy: 'hr-789',
 *   reasonForLeaving: 'Better career opportunity',
 *   feedbackOnManagement: 'Good support, clear communication',
 *   wouldRecommendCompany: true,
 *   wouldRehire: true
 * });
 * ```
 */
async function conductExitInterview(data, transaction) {
    const exit = await EmployeeExit.findByPk(data.exitId, { transaction });
    if (!exit) {
        throw new common_1.NotFoundException(`Exit ${data.exitId} not found`);
    }
    // Create exit interview record
    const interview = await ExitInterview.create({
        ...data,
    }, { transaction });
    // Update exit record
    await exit.update({ exitInterviewCompleted: true }, { transaction });
    return interview;
}
/**
 * Completes exit clearance
 *
 * @param exitId - Exit identifier
 * @param equipmentReturned - Whether equipment was returned
 * @param finalSettlement - Final settlement amount
 * @param transaction - Optional database transaction
 * @returns Updated exit record
 *
 * @example
 * ```typescript
 * const completed = await completeExitClearance(
 *   'exit-456',
 *   true,
 *   5000
 * );
 * ```
 */
async function completeExitClearance(exitId, equipmentReturned, finalSettlement, transaction) {
    const exit = await EmployeeExit.findByPk(exitId, { transaction });
    if (!exit) {
        throw new common_1.NotFoundException(`Exit ${exitId} not found`);
    }
    await exit.update({
        equipmentReturnStatus: equipmentReturned ? 'complete' : 'partial',
        finalSettlementAmount: finalSettlement,
        exitClearanceCompleted: true,
    }, { transaction });
    return exit;
}
/**
 * Finalizes employee exit
 *
 * @param exitId - Exit identifier
 * @param transaction - Optional database transaction
 * @returns Updated employee and exit records
 *
 * @example
 * ```typescript
 * const result = await finalizeEmployeeExit('exit-456');
 * ```
 */
async function finalizeEmployeeExit(exitId, transaction) {
    const exit = await EmployeeExit.findByPk(exitId, {
        include: [{ model: Employee }],
        transaction,
    });
    if (!exit) {
        throw new common_1.NotFoundException(`Exit ${exitId} not found`);
    }
    if (!exit.exitClearanceCompleted) {
        throw new common_1.BadRequestException('Exit clearance must be completed before finalizing');
    }
    const employee = exit.employee;
    // Update employee lifecycle state
    await employee.update({
        lifecycleState: exit.exitType === ExitType.RETIREMENT
            ? EmployeeLifecycleState.RETIRED
            : EmployeeLifecycleState.TERMINATED,
        isActive: false,
        terminationDate: exit.lastWorkingDate,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'exit_finalized',
        eventDate: exit.lastWorkingDate,
        fromState: EmployeeLifecycleState.NOTICE_PERIOD,
        toState: employee.lifecycleState,
        triggeredBy: 'system',
        metadata: { exitType: exit.exitType },
    }, { transaction });
    return { employee, exit };
}
/**
 * Gets employees in notice period
 *
 * @param limit - Maximum number of records
 * @returns Employees in notice period
 *
 * @example
 * ```typescript
 * const inNotice = await getEmployeesInNoticePeriod(50);
 * ```
 */
async function getEmployeesInNoticePeriod(limit = 100) {
    return Employee.findAll({
        where: { lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD },
        include: [{ model: EmployeeExit }],
        order: [['lastWorkingDate', 'ASC']],
        limit,
    });
}
/**
 * Gets exit records by type
 *
 * @param exitType - Exit type
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Exit records
 *
 * @example
 * ```typescript
 * const resignations = await getExitsByType(
 *   ExitType.VOLUNTARY_RESIGNATION,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getExitsByType(exitType, startDate, endDate) {
    return EmployeeExit.findAll({
        where: {
            exitType,
            lastWorkingDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        include: [{ model: Employee }],
        order: [['lastWorkingDate', 'DESC']],
    });
}
// ============================================================================
// RETIREMENT PROCESSING (Functions 41-44)
// ============================================================================
/**
 * Processes employee retirement
 *
 * @param data - Retirement data
 * @param transaction - Optional database transaction
 * @returns Created retirement exit record
 *
 * @example
 * ```typescript
 * const retirement = await processRetirement({
 *   employeeId: 'emp-123',
 *   retirementDate: new Date('2024-12-31'),
 *   noticeDate: new Date('2024-06-01'),
 *   retirementType: 'normal',
 *   pensionEligible: true,
 *   knowledgeTransferPlan: 'Train successor over 6 months',
 *   emeritusStatus: true
 * });
 * ```
 */
async function processRetirement(data, transaction) {
    const employee = await Employee.findByPk(data.employeeId, { transaction });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${data.employeeId} not found`);
    }
    // Create exit record for retirement
    const exit = await EmployeeExit.create({
        employeeId: data.employeeId,
        exitType: ExitType.RETIREMENT,
        lastWorkingDate: data.retirementDate,
        noticeDate: data.noticeDate,
        noticePeriodDays: Math.floor((data.retirementDate.getTime() - data.noticeDate.getTime()) / (1000 * 60 * 60 * 24)),
        exitReason: `Retirement - ${data.retirementType}`,
        initiatedBy: data.employeeId,
        rehireEligibility: RehireEligibility.NOT_ELIGIBLE,
        notes: `Pension Eligible: ${data.pensionEligible}\n${data.knowledgeTransferPlan || ''}`,
    }, { transaction });
    // Update employee lifecycle state
    await employee.update({
        lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD,
        lastWorkingDate: data.retirementDate,
    }, { transaction });
    return exit;
}
/**
 * Gets employees eligible for retirement
 *
 * @param minAge - Minimum age for retirement
 * @param minYearsOfService - Minimum years of service
 * @returns Eligible employees
 *
 * @example
 * ```typescript
 * const eligible = await getRetirementEligibleEmployees(65, 10);
 * ```
 */
async function getRetirementEligibleEmployees(minAge = 65, minYearsOfService = 10) {
    const cutoffBirthDate = new Date();
    cutoffBirthDate.setFullYear(cutoffBirthDate.getFullYear() - minAge);
    const cutoffHireDate = new Date();
    cutoffHireDate.setFullYear(cutoffHireDate.getFullYear() - minYearsOfService);
    return Employee.findAll({
        where: {
            lifecycleState: EmployeeLifecycleState.ACTIVE,
            dateOfBirth: { [sequelize_1.Op.lte]: cutoffBirthDate },
            hireDate: { [sequelize_1.Op.lte]: cutoffHireDate },
            isActive: true,
        },
        order: [['dateOfBirth', 'ASC']],
    });
}
/**
 * Calculates retirement benefits
 *
 * @param employeeId - Employee identifier
 * @param retirementDate - Planned retirement date
 * @returns Retirement benefit calculation
 *
 * @example
 * ```typescript
 * const benefits = await calculateRetirementBenefits(
 *   'emp-123',
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function calculateRetirementBenefits(employeeId, retirementDate) {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    const yearsOfService = (retirementDate.getTime() - employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const pensionEligible = yearsOfService >= 10;
    // Simplified pension calculation - would be more complex in reality
    const estimatedPension = pensionEligible
        ? (employee.compensation || 0) * 0.02 * yearsOfService
        : 0;
    const healthBenefitsContinuation = yearsOfService >= 20;
    return {
        yearsOfService: Math.floor(yearsOfService),
        pensionEligible,
        estimatedPension,
        healthBenefitsContinuation,
    };
}
/**
 * Gets upcoming retirements
 *
 * @param monthsAhead - Number of months to look ahead
 * @returns Upcoming retirement exit records
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingRetirements(6);
 * ```
 */
async function getUpcomingRetirements(monthsAhead = 6) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + monthsAhead);
    return EmployeeExit.findAll({
        where: {
            exitType: ExitType.RETIREMENT,
            lastWorkingDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
        },
        include: [{ model: Employee }],
        order: [['lastWorkingDate', 'ASC']],
    });
}
// ============================================================================
// REHIRE & BOOMERANG EMPLOYEES (Functions 45-47)
// ============================================================================
/**
 * Checks rehire eligibility for former employee
 *
 * @param formerEmployeeNumber - Former employee number
 * @returns Rehire eligibility check result
 *
 * @example
 * ```typescript
 * const eligibility = await checkRehireEligibility('EMP-2020-001234');
 * if (eligibility.rehireRecommendation) {
 *   // Proceed with rehire process
 * }
 * ```
 */
async function checkRehireEligibility(formerEmployeeNumber) {
    // Find former employee
    const formerEmployee = await Employee.findOne({
        where: { employeeNumber: formerEmployeeNumber },
        include: [{ model: EmployeeExit }],
    });
    if (!formerEmployee) {
        throw new common_1.NotFoundException(`Former employee ${formerEmployeeNumber} not found`);
    }
    const exit = formerEmployee.exitRecords?.[0];
    if (!exit) {
        throw new common_1.NotFoundException(`Exit record not found for ${formerEmployeeNumber}`);
    }
    const reasonsForIneligibility = [];
    const conditionalRequirements = [];
    // Check exit type
    if (exit.exitType === ExitType.INVOLUNTARY_TERMINATION ||
        exit.exitType === ExitType.DEATH) {
        reasonsForIneligibility.push(`Exit type: ${exit.exitType}`);
    }
    // Check rehire eligibility from exit record
    if (exit.rehireEligibility === RehireEligibility.NOT_ELIGIBLE) {
        reasonsForIneligibility.push('Marked as not eligible for rehire');
    }
    if (exit.rehireEligibility === RehireEligibility.CONDITIONAL) {
        conditionalRequirements.push('Manager approval required');
    }
    const eligibilityStatus = reasonsForIneligibility.length > 0
        ? RehireEligibility.NOT_ELIGIBLE
        : conditionalRequirements.length > 0
            ? RehireEligibility.CONDITIONAL
            : RehireEligibility.ELIGIBLE;
    const rehireRecommendation = eligibilityStatus === RehireEligibility.ELIGIBLE ||
        eligibilityStatus === RehireEligibility.CONDITIONAL;
    return {
        employeeId: formerEmployee.id,
        formerEmployeeNumber,
        previousExitType: exit.exitType,
        previousExitDate: exit.lastWorkingDate,
        eligibilityStatus,
        reasonsForIneligibility: reasonsForIneligibility.length > 0 ? reasonsForIneligibility : undefined,
        conditionalRequirements: conditionalRequirements.length > 0 ? conditionalRequirements : undefined,
        performanceHistory: 'Good standing', // Would be fetched from performance records
        disciplinaryHistory: 'None', // Would be fetched from disciplinary records
        rehireRecommendation,
    };
}
/**
 * Processes boomerang employee rehire
 *
 * @param formerEmployeeNumber - Former employee number
 * @param registrationData - New employee registration data
 * @param transaction - Optional database transaction
 * @returns New employee record and rehire record
 *
 * @example
 * ```typescript
 * const result = await processBoomerangRehire(
 *   'EMP-2020-001234',
 *   {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@company.com',
 *     dateOfBirth: new Date('1990-01-15'),
 *     hireDate: new Date('2024-06-01'),
 *     positionId: 'pos-456',
 *     departmentId: 'dept-789',
 *     locationId: 'loc-123',
 *     employmentType: 'full_time',
 *     jobTitle: 'Senior Engineer'
 *   }
 * );
 * ```
 */
async function processBoomerangRehire(formerEmployeeNumber, registrationData, transaction) {
    // Check eligibility
    const eligibility = await checkRehireEligibility(formerEmployeeNumber);
    if (!eligibility.rehireRecommendation) {
        throw new common_1.BadRequestException(`Employee not eligible for rehire: ${eligibility.reasonsForIneligibility?.join(', ')}`);
    }
    // Register new employee
    const employee = await registerEmployee(registrationData, transaction);
    // Create rehire record
    const rehireRecord = await RehireRecord.create({
        employeeId: employee.id,
        formerEmployeeNumber,
        previousExitType: eligibility.previousExitType,
        previousExitDate: eligibility.previousExitDate,
        eligibilityStatus: eligibility.eligibilityStatus,
        reasonsForIneligibility: eligibility.reasonsForIneligibility,
        conditionalRequirements: eligibility.conditionalRequirements,
        performanceHistory: eligibility.performanceHistory,
        disciplinaryHistory: eligibility.disciplinaryHistory,
        rehireRecommendation: true,
        rehireDate: registrationData.hireDate,
    }, { transaction });
    // Create lifecycle event
    await EmployeeLifecycleEvent.create({
        employeeId: employee.id,
        eventType: 'boomerang_rehired',
        eventDate: registrationData.hireDate,
        triggeredBy: 'system',
        metadata: {
            formerEmployeeNumber,
            previousExitDate: eligibility.previousExitDate,
        },
    }, { transaction });
    return { employee, rehireRecord };
}
/**
 * Gets boomerang employee statistics
 *
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Boomerang employee statistics
 *
 * @example
 * ```typescript
 * const stats = await getBoomerangEmployeeStats(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Rehire rate: ${stats.rehireRate}%`);
 * ```
 */
async function getBoomerangEmployeeStats(startDate, endDate) {
    const rehires = await RehireRecord.findAll({
        where: {
            rehireDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const totalRehires = rehires.length;
    const byExitType = {};
    let totalDaysToRehire = 0;
    rehires.forEach((rehire) => {
        byExitType[rehire.previousExitType] = (byExitType[rehire.previousExitType] || 0) + 1;
        if (rehire.rehireDate) {
            const daysToRehire = (rehire.rehireDate.getTime() - rehire.previousExitDate.getTime()) /
                (1000 * 60 * 60 * 24);
            totalDaysToRehire += daysToRehire;
        }
    });
    const averageTimeToRehire = totalRehires > 0 ? Math.floor(totalDaysToRehire / totalRehires) : 0;
    // Calculate rehire rate (rehires / total exits in period)
    const totalExits = await EmployeeExit.count({
        where: {
            lastWorkingDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const rehireRate = totalExits > 0 ? (totalRehires / totalExits) * 100 : 0;
    return {
        totalRehires,
        byExitType,
        averageTimeToRehire,
        rehireRate,
    };
}
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * NestJS Injectable service for Employee Lifecycle Management
 *
 * @example
 * ```typescript
 * @Controller('employees')
 * export class EmployeesController {
 *   constructor(private readonly lifecycleService: EmployeeLifecycleService) {}
 *
 *   @Post('register')
 *   async registerEmployee(@Body() data: EmployeeRegistrationData) {
 *     return this.lifecycleService.registerEmployee(data);
 *   }
 * }
 * ```
 */
let EmployeeLifecycleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmployeeLifecycleService = _classThis = class {
        async registerEmployee(data) {
            return registerEmployee(data);
        }
        async createOnboardingPlan(data) {
            return createOnboardingPlan(data);
        }
        async startOnboarding(employeeId, actualStartDate) {
            return startOnboarding(employeeId, actualStartDate);
        }
        async createProbationPeriod(data) {
            return createProbationPeriod(data);
        }
        async createTransferRequest(data) {
            return createTransferRequest(data);
        }
        async createLeaveOfAbsence(data) {
            return createLeaveOfAbsence(data);
        }
        async initiateEmployeeExit(data) {
            return initiateEmployeeExit(data);
        }
        async checkRehireEligibility(formerEmployeeNumber) {
            return checkRehireEligibility(formerEmployeeNumber);
        }
    };
    __setFunctionName(_classThis, "EmployeeLifecycleService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeLifecycleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeLifecycleService = _classThis;
})();
exports.EmployeeLifecycleService = EmployeeLifecycleService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Employee,
    EmployeeLifecycleEvent,
    Onboarding,
    ProbationPeriod,
    InternalTransfer,
    EmployeeRelocation,
    LeaveOfAbsence,
    ReturnToWork,
    EmployeeExit,
    ExitInterview,
    RehireRecord,
    // Employee Registration & Onboarding
    registerEmployee,
    generateEmployeeNumber,
    createOnboardingPlan,
    updateOnboardingChecklistItem,
    startOnboarding,
    completeOnboarding,
    getOnboardingStatus,
    getOnboardingsByStatus,
    // Probation Period Management
    createProbationPeriod,
    extendProbationPeriod,
    completeProbationEvaluation,
    getProbationPeriodsEndingSoon,
    getProbationStatus,
    // Internal Transfers & Promotions
    createTransferRequest,
    approveTransferRequest,
    executeTransfer,
    getPendingTransfers,
    getTransferHistory,
    cancelTransferRequest,
    // Relocation Management
    createRelocationRequest,
    startRelocation,
    completeRelocation,
    getActiveRelocations,
    // Leave of Absence Management
    createLeaveOfAbsence,
    approveLeaveRequest,
    startLeave,
    extendLeave,
    denyLeaveRequest,
    cancelLeaveRequest,
    getActiveLeaves,
    getLeavesEndingSoon,
    // Return to Work Processes
    processReturnToWork,
    updateReturnToWorkPlan,
    getReturnToWorkFollowUps,
    // Resignation & Exit Workflows
    initiateEmployeeExit,
    conductExitInterview,
    completeExitClearance,
    finalizeEmployeeExit,
    getEmployeesInNoticePeriod,
    getExitsByType,
    // Retirement Processing
    processRetirement,
    getRetirementEligibleEmployees,
    calculateRetirementBenefits,
    getUpcomingRetirements,
    // Rehire & Boomerang Employees
    checkRehireEligibility,
    processBoomerangRehire,
    getBoomerangEmployeeStats,
    // Service
    EmployeeLifecycleService,
};
//# sourceMappingURL=employee-lifecycle-kit.js.map