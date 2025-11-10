"use strict";
/**
 * LOC: HCM_REC_MGMT_001
 * File: /reuse/server/human-capital/recruitment-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *   - natural (NLP library)
 *
 * DOWNSTREAM (imported by):
 *   - Recruitment service implementations
 *   - Applicant tracking systems
 *   - Interview management services
 *   - Offer management systems
 *   - Recruitment analytics & reporting
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
exports.RecruitmentController = exports.RecruitmentService = exports.ReferenceCheckModel = exports.BackgroundCheckModel = exports.JobOfferModel = exports.InterviewFeedbackModel = exports.InterviewModel = exports.JobApplicationModel = exports.CandidateModel = exports.JobRequisitionModel = exports.JobOfferSchema = exports.InterviewFeedbackSchema = exports.InterviewSchema = exports.JobApplicationSchema = exports.CandidateSchema = exports.JobRequisitionSchema = exports.EducationSchema = exports.ExperienceLevel = exports.JobType = exports.ReferenceCheckStatus = exports.BackgroundCheckStatus = exports.OfferStatus = exports.InterviewRating = exports.InterviewStatus = exports.InterviewType = exports.CandidateSource = exports.ApplicationStatus = exports.RequisitionPriority = exports.RequisitionStatus = void 0;
exports.createJobRequisition = createJobRequisition;
exports.updateJobRequisition = updateJobRequisition;
exports.getRequisitionById = getRequisitionById;
exports.approveRequisition = approveRequisition;
exports.openRequisition = openRequisition;
exports.closeRequisition = closeRequisition;
exports.searchRequisitions = searchRequisitions;
exports.generateRequisitionNumber = generateRequisitionNumber;
exports.createCandidate = createCandidate;
exports.updateCandidate = updateCandidate;
exports.getCandidateById = getCandidateById;
exports.getCandidateByEmail = getCandidateByEmail;
exports.searchCandidates = searchCandidates;
exports.addCandidateToTalentPool = addCandidateToTalentPool;
exports.parseResume = parseResume;
exports.matchCandidateToRequisition = matchCandidateToRequisition;
exports.submitApplication = submitApplication;
exports.updateApplicationStatus = updateApplicationStatus;
exports.getApplicationById = getApplicationById;
exports.getApplicationsByRequisition = getApplicationsByRequisition;
exports.assignApplicationToRecruiter = assignApplicationToRecruiter;
exports.rejectApplication = rejectApplication;
exports.withdrawApplication = withdrawApplication;
exports.scheduleInterview = scheduleInterview;
exports.updateInterviewStatus = updateInterviewStatus;
exports.cancelInterview = cancelInterview;
exports.rescheduleInterview = rescheduleInterview;
exports.getInterviewsByApplication = getInterviewsByApplication;
exports.getUpcomingInterviews = getUpcomingInterviews;
exports.submitInterviewFeedback = submitInterviewFeedback;
exports.getInterviewFeedback = getInterviewFeedback;
exports.calculateAggregateInterviewScore = calculateAggregateInterviewScore;
exports.createJobOffer = createJobOffer;
exports.sendOffer = sendOffer;
exports.acceptOffer = acceptOffer;
exports.declineOffer = declineOffer;
exports.getOffersByCandidate = getOffersByCandidate;
exports.getExpiringOffers = getExpiringOffers;
exports.initiateBackgroundCheck = initiateBackgroundCheck;
exports.updateBackgroundCheckStatus = updateBackgroundCheckStatus;
exports.getBackgroundChecksByCandidate = getBackgroundChecksByCandidate;
exports.addReferenceCheck = addReferenceCheck;
exports.updateReferenceCheck = updateReferenceCheck;
exports.completeReferenceCheck = completeReferenceCheck;
exports.getReferenceChecksByCandidate = getReferenceChecksByCandidate;
exports.calculateTimeToFill = calculateTimeToFill;
exports.calculateTimeToHire = calculateTimeToHire;
exports.getRecruitmentMetrics = getRecruitmentMetrics;
exports.getPipelineConversionRates = getPipelineConversionRates;
exports.formatCandidateName = formatCandidateName;
exports.generateOfferLetterContent = generateOfferLetterContent;
/**
 * File: /reuse/server/human-capital/recruitment-management-kit.ts
 * Locator: WC-HCM-REC-MGMT-001
 * Purpose: Recruitment Management Kit - Comprehensive ATS and recruitment lifecycle management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, date-fns, Natural
 * Downstream: ../backend/recruitment/*, ../services/hiring/*, ATS portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 50+ utility functions for recruitment management including job requisitions, candidate sourcing,
 *          applicant tracking, resume parsing, interview scheduling, interview feedback, offer management,
 *          background checks, reference checks, recruitment analytics, hiring pipeline, candidate assessments,
 *          skill matching, talent pool management, and SAP SuccessFactors Recruiting parity
 *
 * LLM Context: Enterprise-grade recruitment and applicant tracking system for White Cross healthcare.
 * Provides complete recruitment lifecycle management including job requisition creation/approval,
 * multi-channel candidate sourcing, comprehensive applicant tracking system (ATS), AI-powered resume
 * parsing and skill matching, automated interview scheduling with calendar integration, structured
 * interview feedback collection, offer letter generation and approval workflows, background check
 * integration, reference check management, recruitment metrics and analytics, hiring pipeline
 * visualization, candidate experience optimization, collaborative hiring workflows, compliance tracking,
 * and feature parity with SAP SuccessFactors Recruiting module. HIPAA-compliant for healthcare recruitment.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Job requisition status
 */
var RequisitionStatus;
(function (RequisitionStatus) {
    RequisitionStatus["DRAFT"] = "draft";
    RequisitionStatus["PENDING_APPROVAL"] = "pending_approval";
    RequisitionStatus["APPROVED"] = "approved";
    RequisitionStatus["REJECTED"] = "rejected";
    RequisitionStatus["OPEN"] = "open";
    RequisitionStatus["ON_HOLD"] = "on_hold";
    RequisitionStatus["FILLED"] = "filled";
    RequisitionStatus["CANCELLED"] = "cancelled";
    RequisitionStatus["CLOSED"] = "closed";
})(RequisitionStatus || (exports.RequisitionStatus = RequisitionStatus = {}));
/**
 * Requisition priority
 */
var RequisitionPriority;
(function (RequisitionPriority) {
    RequisitionPriority["LOW"] = "low";
    RequisitionPriority["MEDIUM"] = "medium";
    RequisitionPriority["HIGH"] = "high";
    RequisitionPriority["CRITICAL"] = "critical";
})(RequisitionPriority || (exports.RequisitionPriority = RequisitionPriority = {}));
/**
 * Application status
 */
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["NEW"] = "new";
    ApplicationStatus["SCREENING"] = "screening";
    ApplicationStatus["PHONE_SCREEN"] = "phone_screen";
    ApplicationStatus["INTERVIEW"] = "interview";
    ApplicationStatus["ASSESSMENT"] = "assessment";
    ApplicationStatus["REFERENCE_CHECK"] = "reference_check";
    ApplicationStatus["BACKGROUND_CHECK"] = "background_check";
    ApplicationStatus["OFFER"] = "offer";
    ApplicationStatus["OFFER_ACCEPTED"] = "offer_accepted";
    ApplicationStatus["OFFER_DECLINED"] = "offer_declined";
    ApplicationStatus["HIRED"] = "hired";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["WITHDRAWN"] = "withdrawn";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
/**
 * Candidate source
 */
var CandidateSource;
(function (CandidateSource) {
    CandidateSource["JOB_BOARD"] = "job_board";
    CandidateSource["COMPANY_WEBSITE"] = "company_website";
    CandidateSource["EMPLOYEE_REFERRAL"] = "employee_referral";
    CandidateSource["RECRUITER"] = "recruiter";
    CandidateSource["SOCIAL_MEDIA"] = "social_media";
    CandidateSource["AGENCY"] = "agency";
    CandidateSource["CAMPUS"] = "campus";
    CandidateSource["CAREER_FAIR"] = "career_fair";
    CandidateSource["DIRECT_APPLICATION"] = "direct_application";
    CandidateSource["INTERNAL"] = "internal";
    CandidateSource["OTHER"] = "other";
})(CandidateSource || (exports.CandidateSource = CandidateSource = {}));
/**
 * Interview type
 */
var InterviewType;
(function (InterviewType) {
    InterviewType["PHONE_SCREEN"] = "phone_screen";
    InterviewType["VIDEO"] = "video";
    InterviewType["IN_PERSON"] = "in_person";
    InterviewType["PANEL"] = "panel";
    InterviewType["TECHNICAL"] = "technical";
    InterviewType["BEHAVIORAL"] = "behavioral";
    InterviewType["CASE_STUDY"] = "case_study";
    InterviewType["PRESENTATION"] = "presentation";
    InterviewType["GROUP"] = "group";
})(InterviewType || (exports.InterviewType = InterviewType = {}));
/**
 * Interview status
 */
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "scheduled";
    InterviewStatus["CONFIRMED"] = "confirmed";
    InterviewStatus["IN_PROGRESS"] = "in_progress";
    InterviewStatus["COMPLETED"] = "completed";
    InterviewStatus["CANCELLED"] = "cancelled";
    InterviewStatus["RESCHEDULED"] = "rescheduled";
    InterviewStatus["NO_SHOW"] = "no_show";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
/**
 * Interview rating
 */
var InterviewRating;
(function (InterviewRating) {
    InterviewRating["STRONG_HIRE"] = "strong_hire";
    InterviewRating["HIRE"] = "hire";
    InterviewRating["MAYBE"] = "maybe";
    InterviewRating["NO_HIRE"] = "no_hire";
    InterviewRating["STRONG_NO_HIRE"] = "strong_no_hire";
})(InterviewRating || (exports.InterviewRating = InterviewRating = {}));
/**
 * Offer status
 */
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["DRAFT"] = "draft";
    OfferStatus["PENDING_APPROVAL"] = "pending_approval";
    OfferStatus["APPROVED"] = "approved";
    OfferStatus["SENT"] = "sent";
    OfferStatus["ACCEPTED"] = "accepted";
    OfferStatus["DECLINED"] = "declined";
    OfferStatus["EXPIRED"] = "expired";
    OfferStatus["WITHDRAWN"] = "withdrawn";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
/**
 * Background check status
 */
var BackgroundCheckStatus;
(function (BackgroundCheckStatus) {
    BackgroundCheckStatus["NOT_STARTED"] = "not_started";
    BackgroundCheckStatus["IN_PROGRESS"] = "in_progress";
    BackgroundCheckStatus["CLEAR"] = "clear";
    BackgroundCheckStatus["NEEDS_REVIEW"] = "needs_review";
    BackgroundCheckStatus["FAILED"] = "failed";
    BackgroundCheckStatus["CANCELLED"] = "cancelled";
})(BackgroundCheckStatus || (exports.BackgroundCheckStatus = BackgroundCheckStatus = {}));
/**
 * Reference check status
 */
var ReferenceCheckStatus;
(function (ReferenceCheckStatus) {
    ReferenceCheckStatus["PENDING"] = "pending";
    ReferenceCheckStatus["CONTACTED"] = "contacted";
    ReferenceCheckStatus["COMPLETED"] = "completed";
    ReferenceCheckStatus["UNREACHABLE"] = "unreachable";
    ReferenceCheckStatus["DECLINED"] = "declined";
})(ReferenceCheckStatus || (exports.ReferenceCheckStatus = ReferenceCheckStatus = {}));
/**
 * Job type
 */
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "full_time";
    JobType["PART_TIME"] = "part_time";
    JobType["CONTRACT"] = "contract";
    JobType["TEMPORARY"] = "temporary";
    JobType["INTERN"] = "intern";
    JobType["PER_DIEM"] = "per_diem";
})(JobType || (exports.JobType = JobType = {}));
/**
 * Experience level
 */
var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["ENTRY_LEVEL"] = "entry_level";
    ExperienceLevel["JUNIOR"] = "junior";
    ExperienceLevel["MID_LEVEL"] = "mid_level";
    ExperienceLevel["SENIOR"] = "senior";
    ExperienceLevel["LEAD"] = "lead";
    ExperienceLevel["PRINCIPAL"] = "principal";
    ExperienceLevel["EXECUTIVE"] = "executive";
})(ExperienceLevel || (exports.ExperienceLevel = ExperienceLevel = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Education validation schema
 */
exports.EducationSchema = zod_1.z.object({
    institution: zod_1.z.string().min(1).max(255),
    degree: zod_1.z.string().min(1).max(100),
    fieldOfStudy: zod_1.z.string().min(1).max(100),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    gpa: zod_1.z.number().min(0).max(4).optional(),
    honors: zod_1.z.string().max(255).optional(),
});
/**
 * Job requisition validation schema
 */
exports.JobRequisitionSchema = zod_1.z.object({
    requisitionNumber: zod_1.z.string().min(1).max(50),
    title: zod_1.z.string().min(1).max(255),
    departmentId: zod_1.z.string().uuid(),
    positionId: zod_1.z.string().uuid().optional(),
    hiringManagerId: zod_1.z.string().uuid(),
    recruiterId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.nativeEnum(RequisitionStatus),
    priority: zod_1.z.nativeEnum(RequisitionPriority),
    jobType: zod_1.z.nativeEnum(JobType),
    experienceLevel: zod_1.z.nativeEnum(ExperienceLevel),
    numberOfPositions: zod_1.z.number().int().positive(),
    positionsFilled: zod_1.z.number().int().min(0).default(0),
    salaryMin: zod_1.z.number().positive().optional(),
    salaryMax: zod_1.z.number().positive().optional(),
    currency: zod_1.z.string().length(3),
    location: zod_1.z.string().min(1).max(255),
    remoteAllowed: zod_1.z.boolean().default(false),
    description: zod_1.z.string().min(1),
    requirements: zod_1.z.array(zod_1.z.string()).min(1),
    responsibilities: zod_1.z.array(zod_1.z.string()).min(1),
    qualifications: zod_1.z.array(zod_1.z.string()).min(1),
    benefits: zod_1.z.array(zod_1.z.string()).optional(),
    targetStartDate: zod_1.z.coerce.date().optional(),
    applicationDeadline: zod_1.z.coerce.date().optional(),
});
/**
 * Candidate validation schema
 */
exports.CandidateSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().max(20).optional(),
    linkedinUrl: zod_1.z.string().url().optional(),
    resumeUrl: zod_1.z.string().url().optional(),
    coverLetterUrl: zod_1.z.string().url().optional(),
    currentTitle: zod_1.z.string().max(255).optional(),
    currentCompany: zod_1.z.string().max(255).optional(),
    yearsExperience: zod_1.z.number().min(0).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    education: zod_1.z.array(exports.EducationSchema).optional(),
    location: zod_1.z.string().max(255).optional(),
    willingToRelocate: zod_1.z.boolean().optional(),
    expectedSalary: zod_1.z.number().positive().optional(),
    availableDate: zod_1.z.coerce.date().optional(),
    source: zod_1.z.nativeEnum(CandidateSource),
    sourceDetails: zod_1.z.string().max(500).optional(),
    referredBy: zod_1.z.string().uuid().optional(),
});
/**
 * Job application validation schema
 */
exports.JobApplicationSchema = zod_1.z.object({
    requisitionId: zod_1.z.string().uuid(),
    candidateId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(ApplicationStatus),
    appliedAt: zod_1.z.coerce.date(),
    screeningAnswers: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Interview validation schema
 */
exports.InterviewSchema = zod_1.z.object({
    applicationId: zod_1.z.string().uuid(),
    requisitionId: zod_1.z.string().uuid(),
    candidateId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(InterviewType),
    status: zod_1.z.nativeEnum(InterviewStatus),
    scheduledAt: zod_1.z.coerce.date(),
    duration: zod_1.z.number().int().positive(),
    location: zod_1.z.string().max(500).optional(),
    meetingLink: zod_1.z.string().url().optional(),
    interviewers: zod_1.z.array(zod_1.z.string().uuid()).min(1),
    organizer: zod_1.z.string().uuid(),
});
/**
 * Interview feedback validation schema
 */
exports.InterviewFeedbackSchema = zod_1.z.object({
    interviewId: zod_1.z.string().uuid(),
    interviewerId: zod_1.z.string().uuid(),
    rating: zod_1.z.nativeEnum(InterviewRating),
    strengths: zod_1.z.array(zod_1.z.string()).optional(),
    weaknesses: zod_1.z.array(zod_1.z.string()).optional(),
    technicalSkills: zod_1.z.number().min(1).max(10).optional(),
    communicationSkills: zod_1.z.number().min(1).max(10).optional(),
    cultureFit: zod_1.z.number().min(1).max(10).optional(),
    overallScore: zod_1.z.number().min(1).max(10).optional(),
    recommendation: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
/**
 * Job offer validation schema
 */
exports.JobOfferSchema = zod_1.z.object({
    applicationId: zod_1.z.string().uuid(),
    requisitionId: zod_1.z.string().uuid(),
    candidateId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(OfferStatus),
    jobTitle: zod_1.z.string().min(1).max(255),
    department: zod_1.z.string().min(1).max(255),
    salary: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    bonusAmount: zod_1.z.number().min(0).optional(),
    equityAmount: zod_1.z.number().min(0).optional(),
    startDate: zod_1.z.coerce.date(),
    benefits: zod_1.z.array(zod_1.z.string()).optional(),
    specialTerms: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Job Requisition Model
 */
let JobRequisitionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'job_requisitions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['requisition_number'], unique: true },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['department_id'] },
                { fields: ['hiring_manager_id'] },
                { fields: ['recruiter_id'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requisitionNumber_decorators;
    let _requisitionNumber_initializers = [];
    let _requisitionNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _positionId_decorators;
    let _positionId_initializers = [];
    let _positionId_extraInitializers = [];
    let _hiringManagerId_decorators;
    let _hiringManagerId_initializers = [];
    let _hiringManagerId_extraInitializers = [];
    let _recruiterId_decorators;
    let _recruiterId_initializers = [];
    let _recruiterId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _jobType_decorators;
    let _jobType_initializers = [];
    let _jobType_extraInitializers = [];
    let _experienceLevel_decorators;
    let _experienceLevel_initializers = [];
    let _experienceLevel_extraInitializers = [];
    let _numberOfPositions_decorators;
    let _numberOfPositions_initializers = [];
    let _numberOfPositions_extraInitializers = [];
    let _positionsFilled_decorators;
    let _positionsFilled_initializers = [];
    let _positionsFilled_extraInitializers = [];
    let _salaryMin_decorators;
    let _salaryMin_initializers = [];
    let _salaryMin_extraInitializers = [];
    let _salaryMax_decorators;
    let _salaryMax_initializers = [];
    let _salaryMax_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _remoteAllowed_decorators;
    let _remoteAllowed_initializers = [];
    let _remoteAllowed_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _requirements_decorators;
    let _requirements_initializers = [];
    let _requirements_extraInitializers = [];
    let _responsibilities_decorators;
    let _responsibilities_initializers = [];
    let _responsibilities_extraInitializers = [];
    let _qualifications_decorators;
    let _qualifications_initializers = [];
    let _qualifications_extraInitializers = [];
    let _benefits_decorators;
    let _benefits_initializers = [];
    let _benefits_extraInitializers = [];
    let _targetStartDate_decorators;
    let _targetStartDate_initializers = [];
    let _targetStartDate_extraInitializers = [];
    let _applicationDeadline_decorators;
    let _applicationDeadline_initializers = [];
    let _applicationDeadline_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _openedAt_decorators;
    let _openedAt_initializers = [];
    let _openedAt_extraInitializers = [];
    let _closedAt_decorators;
    let _closedAt_initializers = [];
    let _closedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _applications_decorators;
    let _applications_initializers = [];
    let _applications_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var JobRequisitionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requisitionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requisitionNumber_initializers, void 0));
            this.title = (__runInitializers(this, _requisitionNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.departmentId = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.positionId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _positionId_initializers, void 0));
            this.hiringManagerId = (__runInitializers(this, _positionId_extraInitializers), __runInitializers(this, _hiringManagerId_initializers, void 0));
            this.recruiterId = (__runInitializers(this, _hiringManagerId_extraInitializers), __runInitializers(this, _recruiterId_initializers, void 0));
            this.status = (__runInitializers(this, _recruiterId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.jobType = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _jobType_initializers, void 0));
            this.experienceLevel = (__runInitializers(this, _jobType_extraInitializers), __runInitializers(this, _experienceLevel_initializers, void 0));
            this.numberOfPositions = (__runInitializers(this, _experienceLevel_extraInitializers), __runInitializers(this, _numberOfPositions_initializers, void 0));
            this.positionsFilled = (__runInitializers(this, _numberOfPositions_extraInitializers), __runInitializers(this, _positionsFilled_initializers, void 0));
            this.salaryMin = (__runInitializers(this, _positionsFilled_extraInitializers), __runInitializers(this, _salaryMin_initializers, void 0));
            this.salaryMax = (__runInitializers(this, _salaryMin_extraInitializers), __runInitializers(this, _salaryMax_initializers, void 0));
            this.currency = (__runInitializers(this, _salaryMax_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.location = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.remoteAllowed = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _remoteAllowed_initializers, void 0));
            this.description = (__runInitializers(this, _remoteAllowed_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.requirements = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _requirements_initializers, void 0));
            this.responsibilities = (__runInitializers(this, _requirements_extraInitializers), __runInitializers(this, _responsibilities_initializers, void 0));
            this.qualifications = (__runInitializers(this, _responsibilities_extraInitializers), __runInitializers(this, _qualifications_initializers, void 0));
            this.benefits = (__runInitializers(this, _qualifications_extraInitializers), __runInitializers(this, _benefits_initializers, void 0));
            this.targetStartDate = (__runInitializers(this, _benefits_extraInitializers), __runInitializers(this, _targetStartDate_initializers, void 0));
            this.applicationDeadline = (__runInitializers(this, _targetStartDate_extraInitializers), __runInitializers(this, _applicationDeadline_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _applicationDeadline_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.openedAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _openedAt_initializers, void 0));
            this.closedAt = (__runInitializers(this, _openedAt_extraInitializers), __runInitializers(this, _closedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.applications = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _applications_initializers, void 0));
            this.createdAt = (__runInitializers(this, _applications_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "JobRequisitionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _requisitionNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'requisition_number',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _departmentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'department_id',
            })];
        _positionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'position_id',
            })];
        _hiringManagerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'hiring_manager_id',
            })];
        _recruiterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'recruiter_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RequisitionStatus)),
                allowNull: false,
                defaultValue: RequisitionStatus.DRAFT,
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RequisitionPriority)),
                allowNull: false,
                defaultValue: RequisitionPriority.MEDIUM,
            })];
        _jobType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(JobType)),
                allowNull: false,
                field: 'job_type',
            })];
        _experienceLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExperienceLevel)),
                allowNull: false,
                field: 'experience_level',
            })];
        _numberOfPositions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'number_of_positions',
            })];
        _positionsFilled_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'positions_filled',
            })];
        _salaryMin_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'salary_min',
            })];
        _salaryMax_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'salary_max',
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _remoteAllowed_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'remote_allowed',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _requirements_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _responsibilities_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _qualifications_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _benefits_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _targetStartDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'target_start_date',
            })];
        _applicationDeadline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'application_deadline',
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'approved_by',
            })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'approved_at',
            })];
        _openedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'opened_at',
            })];
        _closedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'closed_at',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _applications_decorators = [(0, sequelize_typescript_1.HasMany)(() => JobApplicationModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requisitionNumber_decorators, { kind: "field", name: "requisitionNumber", static: false, private: false, access: { has: obj => "requisitionNumber" in obj, get: obj => obj.requisitionNumber, set: (obj, value) => { obj.requisitionNumber = value; } }, metadata: _metadata }, _requisitionNumber_initializers, _requisitionNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _positionId_decorators, { kind: "field", name: "positionId", static: false, private: false, access: { has: obj => "positionId" in obj, get: obj => obj.positionId, set: (obj, value) => { obj.positionId = value; } }, metadata: _metadata }, _positionId_initializers, _positionId_extraInitializers);
        __esDecorate(null, null, _hiringManagerId_decorators, { kind: "field", name: "hiringManagerId", static: false, private: false, access: { has: obj => "hiringManagerId" in obj, get: obj => obj.hiringManagerId, set: (obj, value) => { obj.hiringManagerId = value; } }, metadata: _metadata }, _hiringManagerId_initializers, _hiringManagerId_extraInitializers);
        __esDecorate(null, null, _recruiterId_decorators, { kind: "field", name: "recruiterId", static: false, private: false, access: { has: obj => "recruiterId" in obj, get: obj => obj.recruiterId, set: (obj, value) => { obj.recruiterId = value; } }, metadata: _metadata }, _recruiterId_initializers, _recruiterId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _jobType_decorators, { kind: "field", name: "jobType", static: false, private: false, access: { has: obj => "jobType" in obj, get: obj => obj.jobType, set: (obj, value) => { obj.jobType = value; } }, metadata: _metadata }, _jobType_initializers, _jobType_extraInitializers);
        __esDecorate(null, null, _experienceLevel_decorators, { kind: "field", name: "experienceLevel", static: false, private: false, access: { has: obj => "experienceLevel" in obj, get: obj => obj.experienceLevel, set: (obj, value) => { obj.experienceLevel = value; } }, metadata: _metadata }, _experienceLevel_initializers, _experienceLevel_extraInitializers);
        __esDecorate(null, null, _numberOfPositions_decorators, { kind: "field", name: "numberOfPositions", static: false, private: false, access: { has: obj => "numberOfPositions" in obj, get: obj => obj.numberOfPositions, set: (obj, value) => { obj.numberOfPositions = value; } }, metadata: _metadata }, _numberOfPositions_initializers, _numberOfPositions_extraInitializers);
        __esDecorate(null, null, _positionsFilled_decorators, { kind: "field", name: "positionsFilled", static: false, private: false, access: { has: obj => "positionsFilled" in obj, get: obj => obj.positionsFilled, set: (obj, value) => { obj.positionsFilled = value; } }, metadata: _metadata }, _positionsFilled_initializers, _positionsFilled_extraInitializers);
        __esDecorate(null, null, _salaryMin_decorators, { kind: "field", name: "salaryMin", static: false, private: false, access: { has: obj => "salaryMin" in obj, get: obj => obj.salaryMin, set: (obj, value) => { obj.salaryMin = value; } }, metadata: _metadata }, _salaryMin_initializers, _salaryMin_extraInitializers);
        __esDecorate(null, null, _salaryMax_decorators, { kind: "field", name: "salaryMax", static: false, private: false, access: { has: obj => "salaryMax" in obj, get: obj => obj.salaryMax, set: (obj, value) => { obj.salaryMax = value; } }, metadata: _metadata }, _salaryMax_initializers, _salaryMax_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _remoteAllowed_decorators, { kind: "field", name: "remoteAllowed", static: false, private: false, access: { has: obj => "remoteAllowed" in obj, get: obj => obj.remoteAllowed, set: (obj, value) => { obj.remoteAllowed = value; } }, metadata: _metadata }, _remoteAllowed_initializers, _remoteAllowed_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _requirements_decorators, { kind: "field", name: "requirements", static: false, private: false, access: { has: obj => "requirements" in obj, get: obj => obj.requirements, set: (obj, value) => { obj.requirements = value; } }, metadata: _metadata }, _requirements_initializers, _requirements_extraInitializers);
        __esDecorate(null, null, _responsibilities_decorators, { kind: "field", name: "responsibilities", static: false, private: false, access: { has: obj => "responsibilities" in obj, get: obj => obj.responsibilities, set: (obj, value) => { obj.responsibilities = value; } }, metadata: _metadata }, _responsibilities_initializers, _responsibilities_extraInitializers);
        __esDecorate(null, null, _qualifications_decorators, { kind: "field", name: "qualifications", static: false, private: false, access: { has: obj => "qualifications" in obj, get: obj => obj.qualifications, set: (obj, value) => { obj.qualifications = value; } }, metadata: _metadata }, _qualifications_initializers, _qualifications_extraInitializers);
        __esDecorate(null, null, _benefits_decorators, { kind: "field", name: "benefits", static: false, private: false, access: { has: obj => "benefits" in obj, get: obj => obj.benefits, set: (obj, value) => { obj.benefits = value; } }, metadata: _metadata }, _benefits_initializers, _benefits_extraInitializers);
        __esDecorate(null, null, _targetStartDate_decorators, { kind: "field", name: "targetStartDate", static: false, private: false, access: { has: obj => "targetStartDate" in obj, get: obj => obj.targetStartDate, set: (obj, value) => { obj.targetStartDate = value; } }, metadata: _metadata }, _targetStartDate_initializers, _targetStartDate_extraInitializers);
        __esDecorate(null, null, _applicationDeadline_decorators, { kind: "field", name: "applicationDeadline", static: false, private: false, access: { has: obj => "applicationDeadline" in obj, get: obj => obj.applicationDeadline, set: (obj, value) => { obj.applicationDeadline = value; } }, metadata: _metadata }, _applicationDeadline_initializers, _applicationDeadline_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _openedAt_decorators, { kind: "field", name: "openedAt", static: false, private: false, access: { has: obj => "openedAt" in obj, get: obj => obj.openedAt, set: (obj, value) => { obj.openedAt = value; } }, metadata: _metadata }, _openedAt_initializers, _openedAt_extraInitializers);
        __esDecorate(null, null, _closedAt_decorators, { kind: "field", name: "closedAt", static: false, private: false, access: { has: obj => "closedAt" in obj, get: obj => obj.closedAt, set: (obj, value) => { obj.closedAt = value; } }, metadata: _metadata }, _closedAt_initializers, _closedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _applications_decorators, { kind: "field", name: "applications", static: false, private: false, access: { has: obj => "applications" in obj, get: obj => obj.applications, set: (obj, value) => { obj.applications = value; } }, metadata: _metadata }, _applications_initializers, _applications_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobRequisitionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobRequisitionModel = _classThis;
})();
exports.JobRequisitionModel = JobRequisitionModel;
/**
 * Candidate Model
 */
let CandidateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'candidates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['email'], unique: true },
                { fields: ['source'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _firstName_decorators;
    let _firstName_initializers = [];
    let _firstName_extraInitializers = [];
    let _lastName_decorators;
    let _lastName_initializers = [];
    let _lastName_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _linkedinUrl_decorators;
    let _linkedinUrl_initializers = [];
    let _linkedinUrl_extraInitializers = [];
    let _resumeUrl_decorators;
    let _resumeUrl_initializers = [];
    let _resumeUrl_extraInitializers = [];
    let _coverLetterUrl_decorators;
    let _coverLetterUrl_initializers = [];
    let _coverLetterUrl_extraInitializers = [];
    let _currentTitle_decorators;
    let _currentTitle_initializers = [];
    let _currentTitle_extraInitializers = [];
    let _currentCompany_decorators;
    let _currentCompany_initializers = [];
    let _currentCompany_extraInitializers = [];
    let _yearsExperience_decorators;
    let _yearsExperience_initializers = [];
    let _yearsExperience_extraInitializers = [];
    let _skills_decorators;
    let _skills_initializers = [];
    let _skills_extraInitializers = [];
    let _education_decorators;
    let _education_initializers = [];
    let _education_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _willingToRelocate_decorators;
    let _willingToRelocate_initializers = [];
    let _willingToRelocate_extraInitializers = [];
    let _expectedSalary_decorators;
    let _expectedSalary_initializers = [];
    let _expectedSalary_extraInitializers = [];
    let _availableDate_decorators;
    let _availableDate_initializers = [];
    let _availableDate_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _sourceDetails_decorators;
    let _sourceDetails_initializers = [];
    let _sourceDetails_extraInitializers = [];
    let _referredBy_decorators;
    let _referredBy_initializers = [];
    let _referredBy_extraInitializers = [];
    let _talentPoolIds_decorators;
    let _talentPoolIds_initializers = [];
    let _talentPoolIds_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _applications_decorators;
    let _applications_initializers = [];
    let _applications_extraInitializers = [];
    let _referenceChecks_decorators;
    let _referenceChecks_initializers = [];
    let _referenceChecks_extraInitializers = [];
    let _backgroundChecks_decorators;
    let _backgroundChecks_initializers = [];
    let _backgroundChecks_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CandidateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.firstName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.linkedinUrl = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
            this.resumeUrl = (__runInitializers(this, _linkedinUrl_extraInitializers), __runInitializers(this, _resumeUrl_initializers, void 0));
            this.coverLetterUrl = (__runInitializers(this, _resumeUrl_extraInitializers), __runInitializers(this, _coverLetterUrl_initializers, void 0));
            this.currentTitle = (__runInitializers(this, _coverLetterUrl_extraInitializers), __runInitializers(this, _currentTitle_initializers, void 0));
            this.currentCompany = (__runInitializers(this, _currentTitle_extraInitializers), __runInitializers(this, _currentCompany_initializers, void 0));
            this.yearsExperience = (__runInitializers(this, _currentCompany_extraInitializers), __runInitializers(this, _yearsExperience_initializers, void 0));
            this.skills = (__runInitializers(this, _yearsExperience_extraInitializers), __runInitializers(this, _skills_initializers, void 0));
            this.education = (__runInitializers(this, _skills_extraInitializers), __runInitializers(this, _education_initializers, void 0));
            this.location = (__runInitializers(this, _education_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.willingToRelocate = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _willingToRelocate_initializers, void 0));
            this.expectedSalary = (__runInitializers(this, _willingToRelocate_extraInitializers), __runInitializers(this, _expectedSalary_initializers, void 0));
            this.availableDate = (__runInitializers(this, _expectedSalary_extraInitializers), __runInitializers(this, _availableDate_initializers, void 0));
            this.source = (__runInitializers(this, _availableDate_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.sourceDetails = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _sourceDetails_initializers, void 0));
            this.referredBy = (__runInitializers(this, _sourceDetails_extraInitializers), __runInitializers(this, _referredBy_initializers, void 0));
            this.talentPoolIds = (__runInitializers(this, _referredBy_extraInitializers), __runInitializers(this, _talentPoolIds_initializers, void 0));
            this.tags = (__runInitializers(this, _talentPoolIds_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.notes = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.applications = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _applications_initializers, void 0));
            this.referenceChecks = (__runInitializers(this, _applications_extraInitializers), __runInitializers(this, _referenceChecks_initializers, void 0));
            this.backgroundChecks = (__runInitializers(this, _referenceChecks_extraInitializers), __runInitializers(this, _backgroundChecks_initializers, void 0));
            this.createdAt = (__runInitializers(this, _backgroundChecks_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CandidateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _firstName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'first_name',
            })];
        _lastName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'last_name',
            })];
        _email_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _phone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
            })];
        _linkedinUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'linkedin_url',
            })];
        _resumeUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'resume_url',
            })];
        _coverLetterUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'cover_letter_url',
            })];
        _currentTitle_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'current_title',
            })];
        _currentCompany_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'current_company',
            })];
        _yearsExperience_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'years_experience',
            })];
        _skills_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _education_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
            })];
        _willingToRelocate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                field: 'willing_to_relocate',
            })];
        _expectedSalary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'expected_salary',
            })];
        _availableDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'available_date',
            })];
        _source_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CandidateSource)),
                allowNull: false,
            })];
        _sourceDetails_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'source_details',
            })];
        _referredBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'referred_by',
            })];
        _talentPoolIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: true,
                field: 'talent_pool_ids',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _applications_decorators = [(0, sequelize_typescript_1.HasMany)(() => JobApplicationModel)];
        _referenceChecks_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReferenceCheckModel)];
        _backgroundChecks_decorators = [(0, sequelize_typescript_1.HasMany)(() => BackgroundCheckModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: obj => "firstName" in obj, get: obj => obj.firstName, set: (obj, value) => { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: obj => "lastName" in obj, get: obj => obj.lastName, set: (obj, value) => { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: obj => "linkedinUrl" in obj, get: obj => obj.linkedinUrl, set: (obj, value) => { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
        __esDecorate(null, null, _resumeUrl_decorators, { kind: "field", name: "resumeUrl", static: false, private: false, access: { has: obj => "resumeUrl" in obj, get: obj => obj.resumeUrl, set: (obj, value) => { obj.resumeUrl = value; } }, metadata: _metadata }, _resumeUrl_initializers, _resumeUrl_extraInitializers);
        __esDecorate(null, null, _coverLetterUrl_decorators, { kind: "field", name: "coverLetterUrl", static: false, private: false, access: { has: obj => "coverLetterUrl" in obj, get: obj => obj.coverLetterUrl, set: (obj, value) => { obj.coverLetterUrl = value; } }, metadata: _metadata }, _coverLetterUrl_initializers, _coverLetterUrl_extraInitializers);
        __esDecorate(null, null, _currentTitle_decorators, { kind: "field", name: "currentTitle", static: false, private: false, access: { has: obj => "currentTitle" in obj, get: obj => obj.currentTitle, set: (obj, value) => { obj.currentTitle = value; } }, metadata: _metadata }, _currentTitle_initializers, _currentTitle_extraInitializers);
        __esDecorate(null, null, _currentCompany_decorators, { kind: "field", name: "currentCompany", static: false, private: false, access: { has: obj => "currentCompany" in obj, get: obj => obj.currentCompany, set: (obj, value) => { obj.currentCompany = value; } }, metadata: _metadata }, _currentCompany_initializers, _currentCompany_extraInitializers);
        __esDecorate(null, null, _yearsExperience_decorators, { kind: "field", name: "yearsExperience", static: false, private: false, access: { has: obj => "yearsExperience" in obj, get: obj => obj.yearsExperience, set: (obj, value) => { obj.yearsExperience = value; } }, metadata: _metadata }, _yearsExperience_initializers, _yearsExperience_extraInitializers);
        __esDecorate(null, null, _skills_decorators, { kind: "field", name: "skills", static: false, private: false, access: { has: obj => "skills" in obj, get: obj => obj.skills, set: (obj, value) => { obj.skills = value; } }, metadata: _metadata }, _skills_initializers, _skills_extraInitializers);
        __esDecorate(null, null, _education_decorators, { kind: "field", name: "education", static: false, private: false, access: { has: obj => "education" in obj, get: obj => obj.education, set: (obj, value) => { obj.education = value; } }, metadata: _metadata }, _education_initializers, _education_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _willingToRelocate_decorators, { kind: "field", name: "willingToRelocate", static: false, private: false, access: { has: obj => "willingToRelocate" in obj, get: obj => obj.willingToRelocate, set: (obj, value) => { obj.willingToRelocate = value; } }, metadata: _metadata }, _willingToRelocate_initializers, _willingToRelocate_extraInitializers);
        __esDecorate(null, null, _expectedSalary_decorators, { kind: "field", name: "expectedSalary", static: false, private: false, access: { has: obj => "expectedSalary" in obj, get: obj => obj.expectedSalary, set: (obj, value) => { obj.expectedSalary = value; } }, metadata: _metadata }, _expectedSalary_initializers, _expectedSalary_extraInitializers);
        __esDecorate(null, null, _availableDate_decorators, { kind: "field", name: "availableDate", static: false, private: false, access: { has: obj => "availableDate" in obj, get: obj => obj.availableDate, set: (obj, value) => { obj.availableDate = value; } }, metadata: _metadata }, _availableDate_initializers, _availableDate_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _sourceDetails_decorators, { kind: "field", name: "sourceDetails", static: false, private: false, access: { has: obj => "sourceDetails" in obj, get: obj => obj.sourceDetails, set: (obj, value) => { obj.sourceDetails = value; } }, metadata: _metadata }, _sourceDetails_initializers, _sourceDetails_extraInitializers);
        __esDecorate(null, null, _referredBy_decorators, { kind: "field", name: "referredBy", static: false, private: false, access: { has: obj => "referredBy" in obj, get: obj => obj.referredBy, set: (obj, value) => { obj.referredBy = value; } }, metadata: _metadata }, _referredBy_initializers, _referredBy_extraInitializers);
        __esDecorate(null, null, _talentPoolIds_decorators, { kind: "field", name: "talentPoolIds", static: false, private: false, access: { has: obj => "talentPoolIds" in obj, get: obj => obj.talentPoolIds, set: (obj, value) => { obj.talentPoolIds = value; } }, metadata: _metadata }, _talentPoolIds_initializers, _talentPoolIds_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _applications_decorators, { kind: "field", name: "applications", static: false, private: false, access: { has: obj => "applications" in obj, get: obj => obj.applications, set: (obj, value) => { obj.applications = value; } }, metadata: _metadata }, _applications_initializers, _applications_extraInitializers);
        __esDecorate(null, null, _referenceChecks_decorators, { kind: "field", name: "referenceChecks", static: false, private: false, access: { has: obj => "referenceChecks" in obj, get: obj => obj.referenceChecks, set: (obj, value) => { obj.referenceChecks = value; } }, metadata: _metadata }, _referenceChecks_initializers, _referenceChecks_extraInitializers);
        __esDecorate(null, null, _backgroundChecks_decorators, { kind: "field", name: "backgroundChecks", static: false, private: false, access: { has: obj => "backgroundChecks" in obj, get: obj => obj.backgroundChecks, set: (obj, value) => { obj.backgroundChecks = value; } }, metadata: _metadata }, _backgroundChecks_initializers, _backgroundChecks_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CandidateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CandidateModel = _classThis;
})();
exports.CandidateModel = CandidateModel;
/**
 * Job Application Model
 */
let JobApplicationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'job_applications',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['requisition_id'] },
                { fields: ['candidate_id'] },
                { fields: ['status'] },
                { fields: ['applied_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _appliedAt_decorators;
    let _appliedAt_initializers = [];
    let _appliedAt_extraInitializers = [];
    let _currentStage_decorators;
    let _currentStage_initializers = [];
    let _currentStage_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _screeningAnswers_decorators;
    let _screeningAnswers_initializers = [];
    let _screeningAnswers_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _withdrawalReason_decorators;
    let _withdrawalReason_initializers = [];
    let _withdrawalReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _requisition_decorators;
    let _requisition_initializers = [];
    let _requisition_extraInitializers = [];
    let _candidate_decorators;
    let _candidate_initializers = [];
    let _candidate_extraInitializers = [];
    let _interviews_decorators;
    let _interviews_initializers = [];
    let _interviews_extraInitializers = [];
    let _offers_decorators;
    let _offers_initializers = [];
    let _offers_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var JobApplicationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requisitionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.candidateId = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.status = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.appliedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _appliedAt_initializers, void 0));
            this.currentStage = (__runInitializers(this, _appliedAt_extraInitializers), __runInitializers(this, _currentStage_initializers, void 0));
            this.rating = (__runInitializers(this, _currentStage_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.notes = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.screeningAnswers = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _screeningAnswers_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _screeningAnswers_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.withdrawalReason = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _withdrawalReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _withdrawalReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.requisition = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _requisition_initializers, void 0));
            this.candidate = (__runInitializers(this, _requisition_extraInitializers), __runInitializers(this, _candidate_initializers, void 0));
            this.interviews = (__runInitializers(this, _candidate_extraInitializers), __runInitializers(this, _interviews_initializers, void 0));
            this.offers = (__runInitializers(this, _interviews_extraInitializers), __runInitializers(this, _offers_initializers, void 0));
            this.createdAt = (__runInitializers(this, _offers_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "JobApplicationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => JobRequisitionModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => CandidateModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApplicationStatus)),
                allowNull: false,
                defaultValue: ApplicationStatus.NEW,
            })];
        _appliedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'applied_at',
            })];
        _currentStage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'current_stage',
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _screeningAnswers_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'screening_answers',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'assigned_to',
            })];
        _rejectionReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'rejection_reason',
            })];
        _withdrawalReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'withdrawal_reason',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _requisition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => JobRequisitionModel)];
        _candidate_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CandidateModel)];
        _interviews_decorators = [(0, sequelize_typescript_1.HasMany)(() => InterviewModel)];
        _offers_decorators = [(0, sequelize_typescript_1.HasMany)(() => JobOfferModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _appliedAt_decorators, { kind: "field", name: "appliedAt", static: false, private: false, access: { has: obj => "appliedAt" in obj, get: obj => obj.appliedAt, set: (obj, value) => { obj.appliedAt = value; } }, metadata: _metadata }, _appliedAt_initializers, _appliedAt_extraInitializers);
        __esDecorate(null, null, _currentStage_decorators, { kind: "field", name: "currentStage", static: false, private: false, access: { has: obj => "currentStage" in obj, get: obj => obj.currentStage, set: (obj, value) => { obj.currentStage = value; } }, metadata: _metadata }, _currentStage_initializers, _currentStage_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _screeningAnswers_decorators, { kind: "field", name: "screeningAnswers", static: false, private: false, access: { has: obj => "screeningAnswers" in obj, get: obj => obj.screeningAnswers, set: (obj, value) => { obj.screeningAnswers = value; } }, metadata: _metadata }, _screeningAnswers_initializers, _screeningAnswers_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _withdrawalReason_decorators, { kind: "field", name: "withdrawalReason", static: false, private: false, access: { has: obj => "withdrawalReason" in obj, get: obj => obj.withdrawalReason, set: (obj, value) => { obj.withdrawalReason = value; } }, metadata: _metadata }, _withdrawalReason_initializers, _withdrawalReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _requisition_decorators, { kind: "field", name: "requisition", static: false, private: false, access: { has: obj => "requisition" in obj, get: obj => obj.requisition, set: (obj, value) => { obj.requisition = value; } }, metadata: _metadata }, _requisition_initializers, _requisition_extraInitializers);
        __esDecorate(null, null, _candidate_decorators, { kind: "field", name: "candidate", static: false, private: false, access: { has: obj => "candidate" in obj, get: obj => obj.candidate, set: (obj, value) => { obj.candidate = value; } }, metadata: _metadata }, _candidate_initializers, _candidate_extraInitializers);
        __esDecorate(null, null, _interviews_decorators, { kind: "field", name: "interviews", static: false, private: false, access: { has: obj => "interviews" in obj, get: obj => obj.interviews, set: (obj, value) => { obj.interviews = value; } }, metadata: _metadata }, _interviews_initializers, _interviews_extraInitializers);
        __esDecorate(null, null, _offers_decorators, { kind: "field", name: "offers", static: false, private: false, access: { has: obj => "offers" in obj, get: obj => obj.offers, set: (obj, value) => { obj.offers = value; } }, metadata: _metadata }, _offers_initializers, _offers_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobApplicationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobApplicationModel = _classThis;
})();
exports.JobApplicationModel = JobApplicationModel;
/**
 * Interview Model
 */
let InterviewModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'interviews',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['application_id'] },
                { fields: ['candidate_id'] },
                { fields: ['status'] },
                { fields: ['scheduled_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledAt_decorators;
    let _scheduledAt_initializers = [];
    let _scheduledAt_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _meetingLink_decorators;
    let _meetingLink_initializers = [];
    let _meetingLink_extraInitializers = [];
    let _interviewers_decorators;
    let _interviewers_initializers = [];
    let _interviewers_extraInitializers = [];
    let _organizer_decorators;
    let _organizer_initializers = [];
    let _organizer_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _calendarEventId_decorators;
    let _calendarEventId_initializers = [];
    let _calendarEventId_extraInitializers = [];
    let _reminderSent_decorators;
    let _reminderSent_initializers = [];
    let _reminderSent_extraInitializers = [];
    let _application_decorators;
    let _application_initializers = [];
    let _application_extraInitializers = [];
    let _feedback_decorators;
    let _feedback_initializers = [];
    let _feedback_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var InterviewModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.applicationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.candidateId = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.type = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
            this.duration = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.location = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.meetingLink = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _meetingLink_initializers, void 0));
            this.interviewers = (__runInitializers(this, _meetingLink_extraInitializers), __runInitializers(this, _interviewers_initializers, void 0));
            this.organizer = (__runInitializers(this, _interviewers_extraInitializers), __runInitializers(this, _organizer_initializers, void 0));
            this.notes = (__runInitializers(this, _organizer_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.calendarEventId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _calendarEventId_initializers, void 0));
            this.reminderSent = (__runInitializers(this, _calendarEventId_extraInitializers), __runInitializers(this, _reminderSent_initializers, void 0));
            this.application = (__runInitializers(this, _reminderSent_extraInitializers), __runInitializers(this, _application_initializers, void 0));
            this.feedback = (__runInitializers(this, _application_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
            this.createdAt = (__runInitializers(this, _feedback_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InterviewModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _applicationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => JobApplicationModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'application_id',
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InterviewType)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InterviewStatus)),
                allowNull: false,
                defaultValue: InterviewStatus.SCHEDULED,
            })];
        _scheduledAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'scheduled_at',
            })];
        _duration_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                comment: 'Duration in minutes',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _meetingLink_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'meeting_link',
            })];
        _interviewers_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
            })];
        _organizer_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _calendarEventId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'calendar_event_id',
            })];
        _reminderSent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'reminder_sent',
            })];
        _application_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => JobApplicationModel)];
        _feedback_decorators = [(0, sequelize_typescript_1.HasMany)(() => InterviewFeedbackModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: obj => "scheduledAt" in obj, get: obj => obj.scheduledAt, set: (obj, value) => { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _meetingLink_decorators, { kind: "field", name: "meetingLink", static: false, private: false, access: { has: obj => "meetingLink" in obj, get: obj => obj.meetingLink, set: (obj, value) => { obj.meetingLink = value; } }, metadata: _metadata }, _meetingLink_initializers, _meetingLink_extraInitializers);
        __esDecorate(null, null, _interviewers_decorators, { kind: "field", name: "interviewers", static: false, private: false, access: { has: obj => "interviewers" in obj, get: obj => obj.interviewers, set: (obj, value) => { obj.interviewers = value; } }, metadata: _metadata }, _interviewers_initializers, _interviewers_extraInitializers);
        __esDecorate(null, null, _organizer_decorators, { kind: "field", name: "organizer", static: false, private: false, access: { has: obj => "organizer" in obj, get: obj => obj.organizer, set: (obj, value) => { obj.organizer = value; } }, metadata: _metadata }, _organizer_initializers, _organizer_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _calendarEventId_decorators, { kind: "field", name: "calendarEventId", static: false, private: false, access: { has: obj => "calendarEventId" in obj, get: obj => obj.calendarEventId, set: (obj, value) => { obj.calendarEventId = value; } }, metadata: _metadata }, _calendarEventId_initializers, _calendarEventId_extraInitializers);
        __esDecorate(null, null, _reminderSent_decorators, { kind: "field", name: "reminderSent", static: false, private: false, access: { has: obj => "reminderSent" in obj, get: obj => obj.reminderSent, set: (obj, value) => { obj.reminderSent = value; } }, metadata: _metadata }, _reminderSent_initializers, _reminderSent_extraInitializers);
        __esDecorate(null, null, _application_decorators, { kind: "field", name: "application", static: false, private: false, access: { has: obj => "application" in obj, get: obj => obj.application, set: (obj, value) => { obj.application = value; } }, metadata: _metadata }, _application_initializers, _application_extraInitializers);
        __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: obj => "feedback" in obj, get: obj => obj.feedback, set: (obj, value) => { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InterviewModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InterviewModel = _classThis;
})();
exports.InterviewModel = InterviewModel;
/**
 * Interview Feedback Model
 */
let InterviewFeedbackModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'interview_feedback',
            timestamps: true,
            indexes: [
                { fields: ['interview_id'] },
                { fields: ['interviewer_id'] },
                { fields: ['submitted_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _interviewId_decorators;
    let _interviewId_initializers = [];
    let _interviewId_extraInitializers = [];
    let _interviewerId_decorators;
    let _interviewerId_initializers = [];
    let _interviewerId_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _weaknesses_decorators;
    let _weaknesses_initializers = [];
    let _weaknesses_extraInitializers = [];
    let _technicalSkills_decorators;
    let _technicalSkills_initializers = [];
    let _technicalSkills_extraInitializers = [];
    let _communicationSkills_decorators;
    let _communicationSkills_initializers = [];
    let _communicationSkills_extraInitializers = [];
    let _cultureFit_decorators;
    let _cultureFit_initializers = [];
    let _cultureFit_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _recommendation_decorators;
    let _recommendation_initializers = [];
    let _recommendation_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _submittedAt_decorators;
    let _submittedAt_initializers = [];
    let _submittedAt_extraInitializers = [];
    let _interview_decorators;
    let _interview_initializers = [];
    let _interview_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var InterviewFeedbackModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.interviewId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _interviewId_initializers, void 0));
            this.interviewerId = (__runInitializers(this, _interviewId_extraInitializers), __runInitializers(this, _interviewerId_initializers, void 0));
            this.rating = (__runInitializers(this, _interviewerId_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.strengths = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
            this.weaknesses = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _weaknesses_initializers, void 0));
            this.technicalSkills = (__runInitializers(this, _weaknesses_extraInitializers), __runInitializers(this, _technicalSkills_initializers, void 0));
            this.communicationSkills = (__runInitializers(this, _technicalSkills_extraInitializers), __runInitializers(this, _communicationSkills_initializers, void 0));
            this.cultureFit = (__runInitializers(this, _communicationSkills_extraInitializers), __runInitializers(this, _cultureFit_initializers, void 0));
            this.overallScore = (__runInitializers(this, _cultureFit_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
            this.recommendation = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _recommendation_initializers, void 0));
            this.notes = (__runInitializers(this, _recommendation_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            this.interview = (__runInitializers(this, _submittedAt_extraInitializers), __runInitializers(this, _interview_initializers, void 0));
            this.createdAt = (__runInitializers(this, _interview_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InterviewFeedbackModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _interviewId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => InterviewModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'interview_id',
            })];
        _interviewerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'interviewer_id',
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InterviewRating)),
                allowNull: false,
            })];
        _strengths_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _weaknesses_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _technicalSkills_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'technical_skills',
            })];
        _communicationSkills_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'communication_skills',
            })];
        _cultureFit_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'culture_fit',
            })];
        _overallScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'overall_score',
            })];
        _recommendation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _submittedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'submitted_at',
            })];
        _interview_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => InterviewModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _interviewId_decorators, { kind: "field", name: "interviewId", static: false, private: false, access: { has: obj => "interviewId" in obj, get: obj => obj.interviewId, set: (obj, value) => { obj.interviewId = value; } }, metadata: _metadata }, _interviewId_initializers, _interviewId_extraInitializers);
        __esDecorate(null, null, _interviewerId_decorators, { kind: "field", name: "interviewerId", static: false, private: false, access: { has: obj => "interviewerId" in obj, get: obj => obj.interviewerId, set: (obj, value) => { obj.interviewerId = value; } }, metadata: _metadata }, _interviewerId_initializers, _interviewerId_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
        __esDecorate(null, null, _weaknesses_decorators, { kind: "field", name: "weaknesses", static: false, private: false, access: { has: obj => "weaknesses" in obj, get: obj => obj.weaknesses, set: (obj, value) => { obj.weaknesses = value; } }, metadata: _metadata }, _weaknesses_initializers, _weaknesses_extraInitializers);
        __esDecorate(null, null, _technicalSkills_decorators, { kind: "field", name: "technicalSkills", static: false, private: false, access: { has: obj => "technicalSkills" in obj, get: obj => obj.technicalSkills, set: (obj, value) => { obj.technicalSkills = value; } }, metadata: _metadata }, _technicalSkills_initializers, _technicalSkills_extraInitializers);
        __esDecorate(null, null, _communicationSkills_decorators, { kind: "field", name: "communicationSkills", static: false, private: false, access: { has: obj => "communicationSkills" in obj, get: obj => obj.communicationSkills, set: (obj, value) => { obj.communicationSkills = value; } }, metadata: _metadata }, _communicationSkills_initializers, _communicationSkills_extraInitializers);
        __esDecorate(null, null, _cultureFit_decorators, { kind: "field", name: "cultureFit", static: false, private: false, access: { has: obj => "cultureFit" in obj, get: obj => obj.cultureFit, set: (obj, value) => { obj.cultureFit = value; } }, metadata: _metadata }, _cultureFit_initializers, _cultureFit_extraInitializers);
        __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
        __esDecorate(null, null, _recommendation_decorators, { kind: "field", name: "recommendation", static: false, private: false, access: { has: obj => "recommendation" in obj, get: obj => obj.recommendation, set: (obj, value) => { obj.recommendation = value; } }, metadata: _metadata }, _recommendation_initializers, _recommendation_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: obj => "submittedAt" in obj, get: obj => obj.submittedAt, set: (obj, value) => { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, null, _interview_decorators, { kind: "field", name: "interview", static: false, private: false, access: { has: obj => "interview" in obj, get: obj => obj.interview, set: (obj, value) => { obj.interview = value; } }, metadata: _metadata }, _interview_initializers, _interview_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InterviewFeedbackModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InterviewFeedbackModel = _classThis;
})();
exports.InterviewFeedbackModel = InterviewFeedbackModel;
/**
 * Job Offer Model
 */
let JobOfferModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'job_offers',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['application_id'] },
                { fields: ['candidate_id'] },
                { fields: ['status'] },
                { fields: ['expiry_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _jobTitle_decorators;
    let _jobTitle_initializers = [];
    let _jobTitle_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _salary_decorators;
    let _salary_initializers = [];
    let _salary_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _bonusAmount_decorators;
    let _bonusAmount_initializers = [];
    let _bonusAmount_extraInitializers = [];
    let _equityAmount_decorators;
    let _equityAmount_initializers = [];
    let _equityAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _benefits_decorators;
    let _benefits_initializers = [];
    let _benefits_extraInitializers = [];
    let _specialTerms_decorators;
    let _specialTerms_initializers = [];
    let _specialTerms_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _respondedAt_decorators;
    let _respondedAt_initializers = [];
    let _respondedAt_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _offerLetterUrl_decorators;
    let _offerLetterUrl_initializers = [];
    let _offerLetterUrl_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _application_decorators;
    let _application_initializers = [];
    let _application_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var JobOfferModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.applicationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.candidateId = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.status = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.jobTitle = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _jobTitle_initializers, void 0));
            this.department = (__runInitializers(this, _jobTitle_extraInitializers), __runInitializers(this, _department_initializers, void 0));
            this.salary = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _salary_initializers, void 0));
            this.currency = (__runInitializers(this, _salary_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.bonusAmount = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _bonusAmount_initializers, void 0));
            this.equityAmount = (__runInitializers(this, _bonusAmount_extraInitializers), __runInitializers(this, _equityAmount_initializers, void 0));
            this.startDate = (__runInitializers(this, _equityAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.benefits = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _benefits_initializers, void 0));
            this.specialTerms = (__runInitializers(this, _benefits_extraInitializers), __runInitializers(this, _specialTerms_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _specialTerms_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.sentAt = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.respondedAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _respondedAt_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _respondedAt_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.offerLetterUrl = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _offerLetterUrl_initializers, void 0));
            this.metadata = (__runInitializers(this, _offerLetterUrl_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.application = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _application_initializers, void 0));
            this.createdAt = (__runInitializers(this, _application_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "JobOfferModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _applicationId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => JobApplicationModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'application_id',
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OfferStatus)),
                allowNull: false,
                defaultValue: OfferStatus.DRAFT,
            })];
        _jobTitle_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'job_title',
            })];
        _department_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _salary_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
            })];
        _bonusAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'bonus_amount',
            })];
        _equityAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'equity_amount',
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'start_date',
            })];
        _benefits_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _specialTerms_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'special_terms',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'expiry_date',
            })];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'sent_at',
            })];
        _respondedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'responded_at',
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'approved_by',
            })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'approved_at',
            })];
        _offerLetterUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'offer_letter_url',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _application_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => JobApplicationModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _jobTitle_decorators, { kind: "field", name: "jobTitle", static: false, private: false, access: { has: obj => "jobTitle" in obj, get: obj => obj.jobTitle, set: (obj, value) => { obj.jobTitle = value; } }, metadata: _metadata }, _jobTitle_initializers, _jobTitle_extraInitializers);
        __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
        __esDecorate(null, null, _salary_decorators, { kind: "field", name: "salary", static: false, private: false, access: { has: obj => "salary" in obj, get: obj => obj.salary, set: (obj, value) => { obj.salary = value; } }, metadata: _metadata }, _salary_initializers, _salary_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _bonusAmount_decorators, { kind: "field", name: "bonusAmount", static: false, private: false, access: { has: obj => "bonusAmount" in obj, get: obj => obj.bonusAmount, set: (obj, value) => { obj.bonusAmount = value; } }, metadata: _metadata }, _bonusAmount_initializers, _bonusAmount_extraInitializers);
        __esDecorate(null, null, _equityAmount_decorators, { kind: "field", name: "equityAmount", static: false, private: false, access: { has: obj => "equityAmount" in obj, get: obj => obj.equityAmount, set: (obj, value) => { obj.equityAmount = value; } }, metadata: _metadata }, _equityAmount_initializers, _equityAmount_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _benefits_decorators, { kind: "field", name: "benefits", static: false, private: false, access: { has: obj => "benefits" in obj, get: obj => obj.benefits, set: (obj, value) => { obj.benefits = value; } }, metadata: _metadata }, _benefits_initializers, _benefits_extraInitializers);
        __esDecorate(null, null, _specialTerms_decorators, { kind: "field", name: "specialTerms", static: false, private: false, access: { has: obj => "specialTerms" in obj, get: obj => obj.specialTerms, set: (obj, value) => { obj.specialTerms = value; } }, metadata: _metadata }, _specialTerms_initializers, _specialTerms_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _respondedAt_decorators, { kind: "field", name: "respondedAt", static: false, private: false, access: { has: obj => "respondedAt" in obj, get: obj => obj.respondedAt, set: (obj, value) => { obj.respondedAt = value; } }, metadata: _metadata }, _respondedAt_initializers, _respondedAt_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _offerLetterUrl_decorators, { kind: "field", name: "offerLetterUrl", static: false, private: false, access: { has: obj => "offerLetterUrl" in obj, get: obj => obj.offerLetterUrl, set: (obj, value) => { obj.offerLetterUrl = value; } }, metadata: _metadata }, _offerLetterUrl_initializers, _offerLetterUrl_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _application_decorators, { kind: "field", name: "application", static: false, private: false, access: { has: obj => "application" in obj, get: obj => obj.application, set: (obj, value) => { obj.application = value; } }, metadata: _metadata }, _application_initializers, _application_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobOfferModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobOfferModel = _classThis;
})();
exports.JobOfferModel = JobOfferModel;
/**
 * Background Check Model
 */
let BackgroundCheckModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'background_checks',
            timestamps: true,
            indexes: [
                { fields: ['candidate_id'] },
                { fields: ['application_id'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _orderedAt_decorators;
    let _orderedAt_initializers = [];
    let _orderedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _results_decorators;
    let _results_initializers = [];
    let _results_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _candidate_decorators;
    let _candidate_initializers = [];
    let _candidate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var BackgroundCheckModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.candidateId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.applicationId = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
            this.status = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.provider = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
            this.orderedAt = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _orderedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _orderedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.components = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _components_initializers, void 0));
            this.results = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _results_initializers, void 0));
            this.notes = (__runInitializers(this, _results_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.candidate = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _candidate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _candidate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BackgroundCheckModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => CandidateModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _applicationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'application_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(BackgroundCheckStatus)),
                allowNull: false,
                defaultValue: BackgroundCheckStatus.NOT_STARTED,
            })];
        _provider_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
            })];
        _orderedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'ordered_at',
            })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_at',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'expiry_date',
            })];
        _components_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            })];
        _results_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _candidate_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CandidateModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
        __esDecorate(null, null, _orderedAt_decorators, { kind: "field", name: "orderedAt", static: false, private: false, access: { has: obj => "orderedAt" in obj, get: obj => obj.orderedAt, set: (obj, value) => { obj.orderedAt = value; } }, metadata: _metadata }, _orderedAt_initializers, _orderedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
        __esDecorate(null, null, _results_decorators, { kind: "field", name: "results", static: false, private: false, access: { has: obj => "results" in obj, get: obj => obj.results, set: (obj, value) => { obj.results = value; } }, metadata: _metadata }, _results_initializers, _results_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _candidate_decorators, { kind: "field", name: "candidate", static: false, private: false, access: { has: obj => "candidate" in obj, get: obj => obj.candidate, set: (obj, value) => { obj.candidate = value; } }, metadata: _metadata }, _candidate_initializers, _candidate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BackgroundCheckModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BackgroundCheckModel = _classThis;
})();
exports.BackgroundCheckModel = BackgroundCheckModel;
/**
 * Reference Check Model
 */
let ReferenceCheckModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'reference_checks',
            timestamps: true,
            indexes: [
                { fields: ['candidate_id'] },
                { fields: ['application_id'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _referenceName_decorators;
    let _referenceName_initializers = [];
    let _referenceName_extraInitializers = [];
    let _referenceTitle_decorators;
    let _referenceTitle_initializers = [];
    let _referenceTitle_extraInitializers = [];
    let _referenceCompany_decorators;
    let _referenceCompany_initializers = [];
    let _referenceCompany_extraInitializers = [];
    let _referenceEmail_decorators;
    let _referenceEmail_initializers = [];
    let _referenceEmail_extraInitializers = [];
    let _referencePhone_decorators;
    let _referencePhone_initializers = [];
    let _referencePhone_extraInitializers = [];
    let _relationship_decorators;
    let _relationship_initializers = [];
    let _relationship_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _contactedAt_decorators;
    let _contactedAt_initializers = [];
    let _contactedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _wouldRehire_decorators;
    let _wouldRehire_initializers = [];
    let _wouldRehire_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _areasForImprovement_decorators;
    let _areasForImprovement_initializers = [];
    let _areasForImprovement_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _candidate_decorators;
    let _candidate_initializers = [];
    let _candidate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ReferenceCheckModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.candidateId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.applicationId = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
            this.referenceName = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _referenceName_initializers, void 0));
            this.referenceTitle = (__runInitializers(this, _referenceName_extraInitializers), __runInitializers(this, _referenceTitle_initializers, void 0));
            this.referenceCompany = (__runInitializers(this, _referenceTitle_extraInitializers), __runInitializers(this, _referenceCompany_initializers, void 0));
            this.referenceEmail = (__runInitializers(this, _referenceCompany_extraInitializers), __runInitializers(this, _referenceEmail_initializers, void 0));
            this.referencePhone = (__runInitializers(this, _referenceEmail_extraInitializers), __runInitializers(this, _referencePhone_initializers, void 0));
            this.relationship = (__runInitializers(this, _referencePhone_extraInitializers), __runInitializers(this, _relationship_initializers, void 0));
            this.status = (__runInitializers(this, _relationship_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.contactedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _contactedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _contactedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.rating = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.wouldRehire = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _wouldRehire_initializers, void 0));
            this.strengths = (__runInitializers(this, _wouldRehire_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
            this.areasForImprovement = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _areasForImprovement_initializers, void 0));
            this.notes = (__runInitializers(this, _areasForImprovement_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.candidate = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _candidate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _candidate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReferenceCheckModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => CandidateModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _applicationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'application_id',
            })];
        _referenceName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'reference_name',
            })];
        _referenceTitle_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'reference_title',
            })];
        _referenceCompany_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'reference_company',
            })];
        _referenceEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'reference_email',
            })];
        _referencePhone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'reference_phone',
            })];
        _relationship_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReferenceCheckStatus)),
                allowNull: false,
                defaultValue: ReferenceCheckStatus.PENDING,
            })];
        _contactedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'contacted_at',
            })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_at',
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _wouldRehire_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                field: 'would_rehire',
            })];
        _strengths_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _areasForImprovement_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'areas_for_improvement',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _candidate_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CandidateModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
        __esDecorate(null, null, _referenceName_decorators, { kind: "field", name: "referenceName", static: false, private: false, access: { has: obj => "referenceName" in obj, get: obj => obj.referenceName, set: (obj, value) => { obj.referenceName = value; } }, metadata: _metadata }, _referenceName_initializers, _referenceName_extraInitializers);
        __esDecorate(null, null, _referenceTitle_decorators, { kind: "field", name: "referenceTitle", static: false, private: false, access: { has: obj => "referenceTitle" in obj, get: obj => obj.referenceTitle, set: (obj, value) => { obj.referenceTitle = value; } }, metadata: _metadata }, _referenceTitle_initializers, _referenceTitle_extraInitializers);
        __esDecorate(null, null, _referenceCompany_decorators, { kind: "field", name: "referenceCompany", static: false, private: false, access: { has: obj => "referenceCompany" in obj, get: obj => obj.referenceCompany, set: (obj, value) => { obj.referenceCompany = value; } }, metadata: _metadata }, _referenceCompany_initializers, _referenceCompany_extraInitializers);
        __esDecorate(null, null, _referenceEmail_decorators, { kind: "field", name: "referenceEmail", static: false, private: false, access: { has: obj => "referenceEmail" in obj, get: obj => obj.referenceEmail, set: (obj, value) => { obj.referenceEmail = value; } }, metadata: _metadata }, _referenceEmail_initializers, _referenceEmail_extraInitializers);
        __esDecorate(null, null, _referencePhone_decorators, { kind: "field", name: "referencePhone", static: false, private: false, access: { has: obj => "referencePhone" in obj, get: obj => obj.referencePhone, set: (obj, value) => { obj.referencePhone = value; } }, metadata: _metadata }, _referencePhone_initializers, _referencePhone_extraInitializers);
        __esDecorate(null, null, _relationship_decorators, { kind: "field", name: "relationship", static: false, private: false, access: { has: obj => "relationship" in obj, get: obj => obj.relationship, set: (obj, value) => { obj.relationship = value; } }, metadata: _metadata }, _relationship_initializers, _relationship_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _contactedAt_decorators, { kind: "field", name: "contactedAt", static: false, private: false, access: { has: obj => "contactedAt" in obj, get: obj => obj.contactedAt, set: (obj, value) => { obj.contactedAt = value; } }, metadata: _metadata }, _contactedAt_initializers, _contactedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _wouldRehire_decorators, { kind: "field", name: "wouldRehire", static: false, private: false, access: { has: obj => "wouldRehire" in obj, get: obj => obj.wouldRehire, set: (obj, value) => { obj.wouldRehire = value; } }, metadata: _metadata }, _wouldRehire_initializers, _wouldRehire_extraInitializers);
        __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
        __esDecorate(null, null, _areasForImprovement_decorators, { kind: "field", name: "areasForImprovement", static: false, private: false, access: { has: obj => "areasForImprovement" in obj, get: obj => obj.areasForImprovement, set: (obj, value) => { obj.areasForImprovement = value; } }, metadata: _metadata }, _areasForImprovement_initializers, _areasForImprovement_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _candidate_decorators, { kind: "field", name: "candidate", static: false, private: false, access: { has: obj => "candidate" in obj, get: obj => obj.candidate, set: (obj, value) => { obj.candidate = value; } }, metadata: _metadata }, _candidate_initializers, _candidate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferenceCheckModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferenceCheckModel = _classThis;
})();
exports.ReferenceCheckModel = ReferenceCheckModel;
// ============================================================================
// JOB REQUISITION FUNCTIONS
// ============================================================================
/**
 * Create job requisition
 */
async function createJobRequisition(requisitionData, transaction) {
    const validated = exports.JobRequisitionSchema.parse(requisitionData);
    return JobRequisitionModel.create(validated, { transaction });
}
/**
 * Update job requisition
 */
async function updateJobRequisition(requisitionId, updates, transaction) {
    const requisition = await JobRequisitionModel.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    await requisition.update(updates, { transaction });
    return requisition;
}
/**
 * Get requisition by ID
 */
async function getRequisitionById(requisitionId, includeApplications = false) {
    const options = { where: { id: requisitionId } };
    if (includeApplications) {
        options.include = [{ model: JobApplicationModel, as: 'applications' }];
    }
    return JobRequisitionModel.findOne(options);
}
/**
 * Approve requisition
 */
async function approveRequisition(requisitionId, approvedBy, transaction) {
    await updateJobRequisition(requisitionId, { status: RequisitionStatus.APPROVED, approvedBy, approvedAt: new Date() }, transaction);
}
/**
 * Open requisition
 */
async function openRequisition(requisitionId, transaction) {
    await updateJobRequisition(requisitionId, { status: RequisitionStatus.OPEN, openedAt: new Date() }, transaction);
}
/**
 * Close requisition
 */
async function closeRequisition(requisitionId, transaction) {
    await updateJobRequisition(requisitionId, { status: RequisitionStatus.CLOSED, closedAt: new Date() }, transaction);
}
/**
 * Search requisitions
 */
async function searchRequisitions(filters, page = 1, limit = 20) {
    const where = {};
    if (filters.status?.length)
        where.status = { [sequelize_1.Op.in]: filters.status };
    if (filters.departmentId)
        where.departmentId = filters.departmentId;
    if (filters.hiringManagerId)
        where.hiringManagerId = filters.hiringManagerId;
    if (filters.priority?.length)
        where.priority = { [sequelize_1.Op.in]: filters.priority };
    const { rows, count } = await JobRequisitionModel.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
    });
    return { requisitions: rows, total: count };
}
/**
 * Generate requisition number
 */
function generateRequisitionNumber(prefix = 'REQ', sequence) {
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${String(sequence).padStart(5, '0')}`;
}
// ============================================================================
// CANDIDATE FUNCTIONS
// ============================================================================
/**
 * Create candidate
 */
async function createCandidate(candidateData, transaction) {
    const validated = exports.CandidateSchema.parse(candidateData);
    // Check for existing candidate
    const existing = await CandidateModel.findOne({
        where: { email: validated.email },
        transaction,
    });
    if (existing) {
        return existing;
    }
    return CandidateModel.create(validated, { transaction });
}
/**
 * Update candidate
 */
async function updateCandidate(candidateId, updates, transaction) {
    const candidate = await CandidateModel.findByPk(candidateId, { transaction });
    if (!candidate) {
        throw new common_1.NotFoundException(`Candidate ${candidateId} not found`);
    }
    await candidate.update(updates, { transaction });
    return candidate;
}
/**
 * Get candidate by ID
 */
async function getCandidateById(candidateId) {
    return CandidateModel.findByPk(candidateId, {
        include: [
            { model: JobApplicationModel, as: 'applications' },
            { model: ReferenceCheckModel, as: 'referenceChecks' },
            { model: BackgroundCheckModel, as: 'backgroundChecks' },
        ],
    });
}
/**
 * Get candidate by email
 */
async function getCandidateByEmail(email) {
    return CandidateModel.findOne({ where: { email } });
}
/**
 * Search candidates
 */
async function searchCandidates(filters, page = 1, limit = 20) {
    const where = {};
    if (filters.source?.length) {
        where.source = { [sequelize_1.Op.in]: filters.source };
    }
    if (filters.location) {
        where.location = { [sequelize_1.Op.iLike]: `%${filters.location}%` };
    }
    if (filters.minExperience !== undefined) {
        where.yearsExperience = { [sequelize_1.Op.gte]: filters.minExperience };
    }
    if (filters.maxExperience !== undefined) {
        where.yearsExperience = { ...where.yearsExperience, [sequelize_1.Op.lte]: filters.maxExperience };
    }
    const { rows, count } = await CandidateModel.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
    });
    return { candidates: rows, total: count };
}
/**
 * Add candidate to talent pool
 */
async function addCandidateToTalentPool(candidateId, talentPoolId, transaction) {
    const candidate = await CandidateModel.findByPk(candidateId, { transaction });
    if (!candidate) {
        throw new common_1.NotFoundException(`Candidate ${candidateId} not found`);
    }
    const pools = candidate.talentPoolIds || [];
    if (!pools.includes(talentPoolId)) {
        pools.push(talentPoolId);
        await candidate.update({ talentPoolIds: pools }, { transaction });
    }
}
/**
 * Parse resume (simple implementation)
 */
function parseResume(resumeText) {
    const result = {
        skills: [],
        experience: [],
        education: [],
        confidence: 0.5,
    };
    // Email extraction
    const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch)
        result.email = emailMatch[0];
    // Phone extraction
    const phoneMatch = resumeText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch)
        result.phone = phoneMatch[0];
    // Simple skill extraction (common tech skills)
    const commonSkills = ['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS'];
    result.skills = commonSkills.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()));
    return result;
}
/**
 * Match candidate to requisition (skill-based)
 */
function matchCandidateToRequisition(candidate, requisition) {
    let score = 0;
    const candidateSkills = new Set(candidate.skills?.map((s) => s.toLowerCase()) || []);
    const requiredSkills = requisition.requirements
        .join(' ')
        .toLowerCase()
        .split(/\s+/);
    requiredSkills.forEach((skill) => {
        if (candidateSkills.has(skill)) {
            score += 10;
        }
    });
    // Experience match
    if (candidate.yearsExperience !== undefined) {
        const expLevel = requisition.experienceLevel;
        if ((expLevel === ExperienceLevel.ENTRY_LEVEL && candidate.yearsExperience <= 2) ||
            (expLevel === ExperienceLevel.JUNIOR && candidate.yearsExperience >= 1 && candidate.yearsExperience <= 3) ||
            (expLevel === ExperienceLevel.MID_LEVEL && candidate.yearsExperience >= 3 && candidate.yearsExperience <= 6) ||
            (expLevel === ExperienceLevel.SENIOR && candidate.yearsExperience >= 5)) {
            score += 20;
        }
    }
    return Math.min(score, 100);
}
// ============================================================================
// APPLICATION FUNCTIONS
// ============================================================================
/**
 * Submit application
 */
async function submitApplication(applicationData, transaction) {
    const validated = exports.JobApplicationSchema.parse(applicationData);
    // Check for duplicate application
    const existing = await JobApplicationModel.findOne({
        where: {
            requisitionId: validated.requisitionId,
            candidateId: validated.candidateId,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Candidate has already applied to this position');
    }
    return JobApplicationModel.create(validated, { transaction });
}
/**
 * Update application status
 */
async function updateApplicationStatus(applicationId, newStatus, notes, transaction) {
    const application = await JobApplicationModel.findByPk(applicationId, { transaction });
    if (!application) {
        throw new common_1.NotFoundException(`Application ${applicationId} not found`);
    }
    await application.update({ status: newStatus, notes }, { transaction });
}
/**
 * Get application by ID
 */
async function getApplicationById(applicationId) {
    return JobApplicationModel.findByPk(applicationId, {
        include: [
            { model: JobRequisitionModel, as: 'requisition' },
            { model: CandidateModel, as: 'candidate' },
            { model: InterviewModel, as: 'interviews' },
            { model: JobOfferModel, as: 'offers' },
        ],
    });
}
/**
 * Get applications by requisition
 */
async function getApplicationsByRequisition(requisitionId, status) {
    const where = { requisitionId };
    if (status?.length) {
        where.status = { [sequelize_1.Op.in]: status };
    }
    return JobApplicationModel.findAll({
        where,
        include: [{ model: CandidateModel, as: 'candidate' }],
        order: [['appliedAt', 'DESC']],
    });
}
/**
 * Assign application to recruiter
 */
async function assignApplicationToRecruiter(applicationId, recruiterId, transaction) {
    await JobApplicationModel.update({ assignedTo: recruiterId }, { where: { id: applicationId }, transaction });
}
/**
 * Reject application
 */
async function rejectApplication(applicationId, reason, transaction) {
    await JobApplicationModel.update({ status: ApplicationStatus.REJECTED, rejectionReason: reason }, { where: { id: applicationId }, transaction });
}
/**
 * Withdraw application
 */
async function withdrawApplication(applicationId, reason, transaction) {
    await JobApplicationModel.update({ status: ApplicationStatus.WITHDRAWN, withdrawalReason: reason }, { where: { id: applicationId }, transaction });
}
// ============================================================================
// INTERVIEW FUNCTIONS
// ============================================================================
/**
 * Schedule interview
 */
async function scheduleInterview(interviewData, transaction) {
    const validated = exports.InterviewSchema.parse(interviewData);
    return InterviewModel.create(validated, { transaction });
}
/**
 * Update interview status
 */
async function updateInterviewStatus(interviewId, newStatus, transaction) {
    await InterviewModel.update({ status: newStatus }, { where: { id: interviewId }, transaction });
}
/**
 * Cancel interview
 */
async function cancelInterview(interviewId, transaction) {
    await updateInterviewStatus(interviewId, InterviewStatus.CANCELLED, transaction);
}
/**
 * Reschedule interview
 */
async function rescheduleInterview(interviewId, newScheduledAt, transaction) {
    await InterviewModel.update({ scheduledAt: newScheduledAt, status: InterviewStatus.RESCHEDULED }, { where: { id: interviewId }, transaction });
}
/**
 * Get interviews by application
 */
async function getInterviewsByApplication(applicationId) {
    return InterviewModel.findAll({
        where: { applicationId },
        include: [{ model: InterviewFeedbackModel, as: 'feedback' }],
        order: [['scheduledAt', 'ASC']],
    });
}
/**
 * Get upcoming interviews
 */
async function getUpcomingInterviews(interviewerId, days = 7) {
    const where = {
        scheduledAt: {
            [sequelize_1.Op.gte]: new Date(),
            [sequelize_1.Op.lte]: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        },
        status: { [sequelize_1.Op.in]: [InterviewStatus.SCHEDULED, InterviewStatus.CONFIRMED] },
    };
    if (interviewerId) {
        where.interviewers = { [sequelize_1.Op.contains]: [interviewerId] };
    }
    return InterviewModel.findAll({
        where,
        order: [['scheduledAt', 'ASC']],
    });
}
/**
 * Submit interview feedback
 */
async function submitInterviewFeedback(feedbackData, transaction) {
    const validated = exports.InterviewFeedbackSchema.parse(feedbackData);
    return InterviewFeedbackModel.create(validated, { transaction });
}
/**
 * Get interview feedback
 */
async function getInterviewFeedback(interviewId) {
    return InterviewFeedbackModel.findAll({
        where: { interviewId },
        order: [['submittedAt', 'DESC']],
    });
}
/**
 * Calculate aggregate interview score
 */
async function calculateAggregateInterviewScore(interviewId) {
    const feedbackList = await getInterviewFeedback(interviewId);
    if (feedbackList.length === 0)
        return null;
    const total = feedbackList.reduce((sum, fb) => sum + (fb.overallScore || 0), 0);
    return total / feedbackList.length;
}
// ============================================================================
// OFFER FUNCTIONS
// ============================================================================
/**
 * Create job offer
 */
async function createJobOffer(offerData, transaction) {
    const validated = exports.JobOfferSchema.parse(offerData);
    return JobOfferModel.create(validated, { transaction });
}
/**
 * Send offer
 */
async function sendOffer(offerId, transaction) {
    await JobOfferModel.update({ status: OfferStatus.SENT, sentAt: new Date() }, { where: { id: offerId }, transaction });
}
/**
 * Accept offer
 */
async function acceptOffer(offerId, transaction) {
    const offer = await JobOfferModel.findByPk(offerId, { transaction });
    if (!offer) {
        throw new common_1.NotFoundException(`Offer ${offerId} not found`);
    }
    await offer.update({ status: OfferStatus.ACCEPTED, respondedAt: new Date() }, { transaction });
    // Update application status
    await updateApplicationStatus(offer.applicationId, ApplicationStatus.OFFER_ACCEPTED, undefined, transaction);
}
/**
 * Decline offer
 */
async function declineOffer(offerId, transaction) {
    const offer = await JobOfferModel.findByPk(offerId, { transaction });
    if (!offer) {
        throw new common_1.NotFoundException(`Offer ${offerId} not found`);
    }
    await offer.update({ status: OfferStatus.DECLINED, respondedAt: new Date() }, { transaction });
    // Update application status
    await updateApplicationStatus(offer.applicationId, ApplicationStatus.OFFER_DECLINED, undefined, transaction);
}
/**
 * Get offers by candidate
 */
async function getOffersByCandidate(candidateId) {
    return JobOfferModel.findAll({
        where: { candidateId },
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Get expiring offers
 */
async function getExpiringOffers(days = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return JobOfferModel.findAll({
        where: {
            expiryDate: { [sequelize_1.Op.lte]: futureDate },
            status: OfferStatus.SENT,
        },
        order: [['expiryDate', 'ASC']],
    });
}
// ============================================================================
// BACKGROUND CHECK FUNCTIONS
// ============================================================================
/**
 * Initiate background check
 */
async function initiateBackgroundCheck(checkData, transaction) {
    return BackgroundCheckModel.create({ ...checkData, status: BackgroundCheckStatus.IN_PROGRESS, orderedAt: new Date() }, { transaction });
}
/**
 * Update background check status
 */
async function updateBackgroundCheckStatus(checkId, status, results, transaction) {
    const updateData = { status };
    if (status === BackgroundCheckStatus.CLEAR || status === BackgroundCheckStatus.FAILED) {
        updateData.completedAt = new Date();
    }
    if (results) {
        updateData.results = results;
    }
    await BackgroundCheckModel.update(updateData, { where: { id: checkId }, transaction });
}
/**
 * Get background checks by candidate
 */
async function getBackgroundChecksByCandidate(candidateId) {
    return BackgroundCheckModel.findAll({
        where: { candidateId },
        order: [['orderedAt', 'DESC']],
    });
}
// ============================================================================
// REFERENCE CHECK FUNCTIONS
// ============================================================================
/**
 * Add reference check
 */
async function addReferenceCheck(checkData, transaction) {
    return ReferenceCheckModel.create(checkData, { transaction });
}
/**
 * Update reference check
 */
async function updateReferenceCheck(checkId, updates, transaction) {
    await ReferenceCheckModel.update(updates, { where: { id: checkId }, transaction });
}
/**
 * Complete reference check
 */
async function completeReferenceCheck(checkId, results, transaction) {
    await ReferenceCheckModel.update({ ...results, status: ReferenceCheckStatus.COMPLETED, completedAt: new Date() }, { where: { id: checkId }, transaction });
}
/**
 * Get reference checks by candidate
 */
async function getReferenceChecksByCandidate(candidateId) {
    return ReferenceCheckModel.findAll({
        where: { candidateId },
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Calculate time to fill
 */
async function calculateTimeToFill(requisitionId) {
    const requisition = await JobRequisitionModel.findByPk(requisitionId);
    if (!requisition || !requisition.openedAt || !requisition.closedAt) {
        return null;
    }
    const diffMs = requisition.closedAt.getTime() - requisition.openedAt.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days
}
/**
 * Calculate time to hire
 */
async function calculateTimeToHire(applicationId) {
    const application = await JobApplicationModel.findByPk(applicationId);
    if (!application || application.status !== ApplicationStatus.HIRED) {
        return null;
    }
    const diffMs = new Date().getTime() - application.appliedAt.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days
}
/**
 * Get recruitment metrics
 */
async function getRecruitmentMetrics(startDate, endDate) {
    const requisitions = await JobRequisitionModel.findAll({
        where: {
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const applications = await JobApplicationModel.findAll({
        where: {
            appliedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        include: [{ model: CandidateModel, as: 'candidate' }],
    });
    const offers = await JobOfferModel.findAll({
        where: {
            sentAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const totalRequisitions = requisitions.length;
    const openRequisitions = requisitions.filter((r) => r.status === RequisitionStatus.OPEN).length;
    const filledRequisitions = requisitions.filter((r) => r.status === RequisitionStatus.FILLED).length;
    const sourceEffectiveness = {};
    Object.values(CandidateSource).forEach((source) => {
        sourceEffectiveness[source] = applications.filter((a) => a.candidate?.source === source).length;
    });
    const acceptedOffers = offers.filter((o) => o.status === OfferStatus.ACCEPTED).length;
    const sentOffers = offers.filter((o) => o.status === OfferStatus.SENT || o.status === OfferStatus.ACCEPTED || o.status === OfferStatus.DECLINED).length;
    return {
        totalRequisitions,
        openRequisitions,
        filledRequisitions,
        totalApplications: applications.length,
        averageTimeToFill: 0, // Would need calculation
        averageTimeToHire: 0, // Would need calculation
        offerAcceptanceRate: sentOffers > 0 ? (acceptedOffers / sentOffers) * 100 : 0,
        sourceEffectiveness,
        costPerHire: 0, // Would need cost data
        qualityOfHire: 0, // Would need performance data
    };
}
/**
 * Get pipeline conversion rates
 */
async function getPipelineConversionRates(requisitionId) {
    const applications = await JobApplicationModel.findAll({
        where: { requisitionId },
    });
    const total = applications.length;
    if (total === 0)
        return {};
    const stages = Object.values(ApplicationStatus);
    const rates = {};
    stages.forEach((stage) => {
        const count = applications.filter((a) => a.status === stage).length;
        rates[stage] = (count / total) * 100;
    });
    return rates;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Format candidate name
 */
function formatCandidateName(candidate) {
    return `${candidate.firstName} ${candidate.lastName}`;
}
/**
 * Generate offer letter content
 */
function generateOfferLetterContent(offer, candidate) {
    return `
Dear ${formatCandidateName(candidate)},

We are pleased to offer you the position of ${offer.jobTitle} in the ${offer.department} department.

Compensation: ${offer.currency} ${offer.salary.toLocaleString()} per annum
Start Date: ${offer.startDate.toISOString().split('T')[0]}

${offer.benefits?.length ? `Benefits:\n${offer.benefits.map((b) => `- ${b}`).join('\n')}` : ''}

${offer.specialTerms ? `Special Terms:\n${offer.specialTerms}` : ''}

This offer expires on ${offer.expiryDate.toISOString().split('T')[0]}.

We look forward to welcoming you to our team.

Sincerely,
HR Department
  `.trim();
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let RecruitmentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RecruitmentService = _classThis = class {
        async createRequisition(data) {
            return createJobRequisition(data);
        }
        async createCandidate(data) {
            return createCandidate(data);
        }
        async submitApplication(data) {
            return submitApplication(data);
        }
        async scheduleInterview(data) {
            return scheduleInterview(data);
        }
        async createOffer(data) {
            return createJobOffer(data);
        }
        async getMetrics(startDate, endDate) {
            return getRecruitmentMetrics(startDate, endDate);
        }
    };
    __setFunctionName(_classThis, "RecruitmentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentService = _classThis;
})();
exports.RecruitmentService = RecruitmentService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let RecruitmentController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Recruitment'), (0, common_1.Controller)('recruitment'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRequisition_decorators;
    let _createCandidate_decorators;
    let _submitApplication_decorators;
    let _getMetrics_decorators;
    var RecruitmentController = _classThis = class {
        constructor(recruitmentService) {
            this.recruitmentService = (__runInitializers(this, _instanceExtraInitializers), recruitmentService);
        }
        async createRequisition(data) {
            return this.recruitmentService.createRequisition(data);
        }
        async createCandidate(data) {
            return this.recruitmentService.createCandidate(data);
        }
        async submitApplication(data) {
            return this.recruitmentService.submitApplication(data);
        }
        async getMetrics(startDate, endDate) {
            return this.recruitmentService.getMetrics(new Date(startDate), new Date(endDate));
        }
    };
    __setFunctionName(_classThis, "RecruitmentController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createRequisition_decorators = [(0, common_1.Post)('requisitions'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create job requisition' })];
        _createCandidate_decorators = [(0, common_1.Post)('candidates'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create candidate' })];
        _submitApplication_decorators = [(0, common_1.Post)('applications'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Submit application' })];
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, swagger_1.ApiOperation)({ summary: 'Get recruitment metrics' }), (0, swagger_1.ApiQuery)({ name: 'startDate', type: 'string' }), (0, swagger_1.ApiQuery)({ name: 'endDate', type: 'string' })];
        __esDecorate(_classThis, null, _createRequisition_decorators, { kind: "method", name: "createRequisition", static: false, private: false, access: { has: obj => "createRequisition" in obj, get: obj => obj.createRequisition }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCandidate_decorators, { kind: "method", name: "createCandidate", static: false, private: false, access: { has: obj => "createCandidate" in obj, get: obj => obj.createCandidate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitApplication_decorators, { kind: "method", name: "submitApplication", static: false, private: false, access: { has: obj => "submitApplication" in obj, get: obj => obj.submitApplication }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: obj => "getMetrics" in obj, get: obj => obj.getMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentController = _classThis;
})();
exports.RecruitmentController = RecruitmentController;
//# sourceMappingURL=recruitment-management-kit.js.map