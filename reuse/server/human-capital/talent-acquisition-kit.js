"use strict";
/**
 * LOC: HCM_TAL_ACQ_001
 * File: /reuse/server/human-capital/talent-acquisition-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *   - uuid
 *
 * DOWNSTREAM (imported by):
 *   - Talent acquisition service implementations
 *   - Career site applications
 *   - Recruitment marketing systems
 *   - Referral program services
 *   - Compliance & reporting systems
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
exports.TalentAcquisitionController = exports.TalentAcquisitionService = exports.SourcingChannelModel = exports.CandidateEngagementModel = exports.EEOReportModel = exports.DiversityInitiativeModel = exports.AgencySubmissionModel = exports.RecruitingAgencyModel = exports.CampusRecruitmentEventModel = exports.EmployeeReferralModel = exports.RecruitmentCampaignModel = exports.CareerSitePageModel = exports.JobPostingModel = exports.TalentPoolModel = exports.DiversityInitiativeSchema = exports.RecruitingAgencySchema = exports.CampusRecruitmentEventSchema = exports.EmployeeReferralSchema = exports.RecruitmentCampaignSchema = exports.CareerSitePageSchema = exports.JobPostingSchema = exports.TalentPoolSchema = exports.EEOCategory = exports.DiversityCategory = exports.AgencyStatus = exports.CampusRecruitmentStage = exports.ReferralRewardStatus = exports.ReferralStatus = exports.CampaignStatus = exports.CampaignType = exports.JobBoard = exports.JobPostingStatus = exports.TalentPoolType = void 0;
exports.createTalentPool = createTalentPool;
exports.updateTalentPool = updateTalentPool;
exports.getTalentPoolById = getTalentPoolById;
exports.getAllTalentPools = getAllTalentPools;
exports.deleteTalentPool = deleteTalentPool;
exports.createJobPosting = createJobPosting;
exports.publishJobPosting = publishJobPosting;
exports.pauseJobPosting = pauseJobPosting;
exports.closeJobPosting = closeJobPosting;
exports.trackJobPostingView = trackJobPostingView;
exports.trackJobPostingClick = trackJobPostingClick;
exports.trackJobPostingApplication = trackJobPostingApplication;
exports.getActiveJobPostings = getActiveJobPostings;
exports.createCareerSitePage = createCareerSitePage;
exports.updateCareerSitePage = updateCareerSitePage;
exports.publishCareerSitePage = publishCareerSitePage;
exports.getCareerSitePageBySlug = getCareerSitePageBySlug;
exports.getPublishedCareerSitePages = getPublishedCareerSitePages;
exports.createRecruitmentCampaign = createRecruitmentCampaign;
exports.launchCampaign = launchCampaign;
exports.pauseCampaign = pauseCampaign;
exports.trackCampaignMetrics = trackCampaignMetrics;
exports.getCampaignROI = getCampaignROI;
exports.submitEmployeeReferral = submitEmployeeReferral;
exports.updateReferralStatus = updateReferralStatus;
exports.approveReferralReward = approveReferralReward;
exports.payReferralReward = payReferralReward;
exports.getReferralsByEmployee = getReferralsByEmployee;
exports.calculateReferralProgramMetrics = calculateReferralProgramMetrics;
exports.createCampusRecruitmentEvent = createCampusRecruitmentEvent;
exports.updateCampusEventStage = updateCampusEventStage;
exports.updateCampusEventMetrics = updateCampusEventMetrics;
exports.getUpcomingCampusEvents = getUpcomingCampusEvents;
exports.calculateCampusRecruitmentROI = calculateCampusRecruitmentROI;
exports.addRecruitingAgency = addRecruitingAgency;
exports.updateAgencyStatus = updateAgencyStatus;
exports.rateAgencyPerformance = rateAgencyPerformance;
exports.submitAgencyCandidate = submitAgencyCandidate;
exports.getAgencySubmissions = getAgencySubmissions;
exports.calculateAgencyPerformanceMetrics = calculateAgencyPerformanceMetrics;
exports.createDiversityInitiative = createDiversityInitiative;
exports.updateDiversityInitiativeMetrics = updateDiversityInitiativeMetrics;
exports.getActiveDiversityInitiatives = getActiveDiversityInitiatives;
exports.generateEEOReport = generateEEOReport;
exports.getEEOReportsByYear = getEEOReportsByYear;
exports.trackCandidateEngagement = trackCandidateEngagement;
exports.getCandidateEngagementHistory = getCandidateEngagementHistory;
exports.calculateEngagementRate = calculateEngagementRate;
exports.addSourcingChannel = addSourcingChannel;
exports.trackSourcingChannelPerformance = trackSourcingChannelPerformance;
exports.calculateSourcingChannelROI = calculateSourcingChannelROI;
exports.getTopPerformingSourcingChannels = getTopPerformingSourcingChannels;
exports.calculateCostPerHire = calculateCostPerHire;
exports.calculateQualityOfHire = calculateQualityOfHire;
/**
 * File: /reuse/server/human-capital/talent-acquisition-kit.ts
 * Locator: WC-HCM-TAL-ACQ-001
 * Purpose: Talent Acquisition Kit - Comprehensive talent pipeline and recruitment marketing
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, date-fns, uuid
 * Downstream: ../backend/talent/*, ../services/careers/*, Career portals, Marketing automation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 45+ utility functions for talent acquisition including talent pipeline management, career site
 *          content management, job posting and distribution, candidate CRM and engagement, recruitment
 *          marketing campaigns, employee referral programs, campus recruitment, agency/vendor management,
 *          diversity recruitment initiatives, EEOC/OFCCP compliance, talent communities, sourcing strategies,
 *          employer branding, and SAP SuccessFactors Recruiting Marketing parity
 *
 * LLM Context: Enterprise-grade talent acquisition and recruitment marketing for White Cross healthcare.
 * Provides comprehensive talent pipeline management including proactive sourcing, talent pool segmentation,
 * career site content management with job search and application tracking, multi-channel job posting
 * distribution, candidate relationship management (CRM) with automated nurture campaigns, recruitment
 * marketing automation, employee referral program with rewards tracking, campus recruitment with university
 * partnerships, agency/vendor management with performance tracking, diversity and inclusion recruiting
 * initiatives, EEO/OFCCP compliance reporting, talent community building, social media recruitment,
 * employer branding, candidate experience optimization, and feature parity with SAP SuccessFactors
 * Recruiting Marketing. HIPAA-compliant for healthcare talent acquisition.
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
 * Talent pool type
 */
var TalentPoolType;
(function (TalentPoolType) {
    TalentPoolType["ACTIVE"] = "active";
    TalentPoolType["PASSIVE"] = "passive";
    TalentPoolType["SILVER_MEDALISTS"] = "silver_medalists";
    TalentPoolType["ALUMNI"] = "alumni";
    TalentPoolType["REFERRALS"] = "referrals";
    TalentPoolType["CAMPUS"] = "campus";
    TalentPoolType["DIVERSITY"] = "diversity";
    TalentPoolType["SPECIALIST"] = "specialist";
    TalentPoolType["EXECUTIVE"] = "executive";
})(TalentPoolType || (exports.TalentPoolType = TalentPoolType = {}));
/**
 * Job posting status
 */
var JobPostingStatus;
(function (JobPostingStatus) {
    JobPostingStatus["DRAFT"] = "draft";
    JobPostingStatus["SCHEDULED"] = "scheduled";
    JobPostingStatus["ACTIVE"] = "active";
    JobPostingStatus["PAUSED"] = "paused";
    JobPostingStatus["EXPIRED"] = "expired";
    JobPostingStatus["CLOSED"] = "closed";
})(JobPostingStatus || (exports.JobPostingStatus = JobPostingStatus = {}));
/**
 * Job board
 */
var JobBoard;
(function (JobBoard) {
    JobBoard["LINKEDIN"] = "linkedin";
    JobBoard["INDEED"] = "indeed";
    JobBoard["GLASSDOOR"] = "glassdoor";
    JobBoard["MONSTER"] = "monster";
    JobBoard["ZIPRECRUITER"] = "ziprecruiter";
    JobBoard["CAREERBUILDER"] = "careerbuilder";
    JobBoard["HEALTHCAREJOBSITE"] = "healthcarejobsite";
    JobBoard["NURSE_COM"] = "nurse_com";
    JobBoard["COMPANY_WEBSITE"] = "company_website";
    JobBoard["FACEBOOK"] = "facebook";
    JobBoard["TWITTER"] = "twitter";
    JobBoard["INSTAGRAM"] = "instagram";
})(JobBoard || (exports.JobBoard = JobBoard = {}));
/**
 * Campaign type
 */
var CampaignType;
(function (CampaignType) {
    CampaignType["EMAIL"] = "email";
    CampaignType["SMS"] = "sms";
    CampaignType["SOCIAL_MEDIA"] = "social_media";
    CampaignType["DISPLAY_AD"] = "display_ad";
    CampaignType["JOB_ALERT"] = "job_alert";
    CampaignType["EVENT"] = "event";
    CampaignType["WEBINAR"] = "webinar";
})(CampaignType || (exports.CampaignType = CampaignType = {}));
/**
 * Campaign status
 */
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
/**
 * Referral status
 */
var ReferralStatus;
(function (ReferralStatus) {
    ReferralStatus["SUBMITTED"] = "submitted";
    ReferralStatus["UNDER_REVIEW"] = "under_review";
    ReferralStatus["CONTACTED"] = "contacted";
    ReferralStatus["INTERVIEWING"] = "interviewing";
    ReferralStatus["HIRED"] = "hired";
    ReferralStatus["NOT_SELECTED"] = "not_selected";
    ReferralStatus["WITHDRAWN"] = "withdrawn";
})(ReferralStatus || (exports.ReferralStatus = ReferralStatus = {}));
/**
 * Referral reward status
 */
var ReferralRewardStatus;
(function (ReferralRewardStatus) {
    ReferralRewardStatus["PENDING"] = "pending";
    ReferralRewardStatus["ELIGIBLE"] = "eligible";
    ReferralRewardStatus["APPROVED"] = "approved";
    ReferralRewardStatus["PAID"] = "paid";
    ReferralRewardStatus["DENIED"] = "denied";
})(ReferralRewardStatus || (exports.ReferralRewardStatus = ReferralRewardStatus = {}));
/**
 * Campus recruitment stage
 */
var CampusRecruitmentStage;
(function (CampusRecruitmentStage) {
    CampusRecruitmentStage["PLANNING"] = "planning";
    CampusRecruitmentStage["REGISTRATION"] = "registration";
    CampusRecruitmentStage["PRE_EVENT"] = "pre_event";
    CampusRecruitmentStage["EVENT_DAY"] = "event_day";
    CampusRecruitmentStage["POST_EVENT"] = "post_event";
    CampusRecruitmentStage["FOLLOW_UP"] = "follow_up";
    CampusRecruitmentStage["COMPLETED"] = "completed";
})(CampusRecruitmentStage || (exports.CampusRecruitmentStage = CampusRecruitmentStage = {}));
/**
 * Agency status
 */
var AgencyStatus;
(function (AgencyStatus) {
    AgencyStatus["ACTIVE"] = "active";
    AgencyStatus["INACTIVE"] = "inactive";
    AgencyStatus["SUSPENDED"] = "suspended";
    AgencyStatus["TERMINATED"] = "terminated";
})(AgencyStatus || (exports.AgencyStatus = AgencyStatus = {}));
/**
 * Diversity category
 */
var DiversityCategory;
(function (DiversityCategory) {
    DiversityCategory["GENDER"] = "gender";
    DiversityCategory["ETHNICITY"] = "ethnicity";
    DiversityCategory["VETERAN"] = "veteran";
    DiversityCategory["DISABILITY"] = "disability";
    DiversityCategory["LGBTQ"] = "lgbtq";
    DiversityCategory["AGE"] = "age";
})(DiversityCategory || (exports.DiversityCategory = DiversityCategory = {}));
/**
 * EEO category
 */
var EEOCategory;
(function (EEOCategory) {
    EEOCategory["EXECUTIVES_SENIOR_OFFICIALS"] = "1.1";
    EEOCategory["FIRST_MID_OFFICIALS_MANAGERS"] = "1.2";
    EEOCategory["PROFESSIONALS"] = "2";
    EEOCategory["TECHNICIANS"] = "3";
    EEOCategory["SALES_WORKERS"] = "4";
    EEOCategory["ADMINISTRATIVE_SUPPORT"] = "5";
    EEOCategory["CRAFT_WORKERS"] = "6";
    EEOCategory["OPERATIVES"] = "7";
    EEOCategory["LABORERS_HELPERS"] = "8";
    EEOCategory["SERVICE_WORKERS"] = "9";
})(EEOCategory || (exports.EEOCategory = EEOCategory = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Talent pool validation schema
 */
exports.TalentPoolSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    type: zod_1.z.nativeEnum(TalentPoolType),
    criteria: zod_1.z.record(zod_1.z.any()).optional(),
    ownerId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean().default(true),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Job posting validation schema
 */
exports.JobPostingSchema = zod_1.z.object({
    requisitionId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(JobPostingStatus),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1),
    shortDescription: zod_1.z.string().max(500).optional(),
    boards: zod_1.z.array(zod_1.z.nativeEnum(JobBoard)),
    publishedAt: zod_1.z.coerce.date().optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
    views: zod_1.z.number().int().min(0).default(0),
    applications: zod_1.z.number().int().min(0).default(0),
    clicks: zod_1.z.number().int().min(0).default(0),
    seoKeywords: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Career site page validation schema
 */
exports.CareerSitePageSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
    title: zod_1.z.string().min(1).max(255),
    content: zod_1.z.string().min(1),
    metaDescription: zod_1.z.string().max(500).optional(),
    metaKeywords: zod_1.z.array(zod_1.z.string()).optional(),
    isPublished: zod_1.z.boolean().default(false),
    order: zod_1.z.number().int().min(0).default(0),
});
/**
 * Recruitment campaign validation schema
 */
exports.RecruitmentCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    type: zod_1.z.nativeEnum(CampaignType),
    status: zod_1.z.nativeEnum(CampaignStatus),
    targetAudience: zod_1.z.string().max(500).optional(),
    talentPoolIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    requisitionIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    budget: zod_1.z.number().min(0).optional(),
    createdBy: zod_1.z.string().uuid(),
});
/**
 * Employee referral validation schema
 */
exports.EmployeeReferralSchema = zod_1.z.object({
    referrerId: zod_1.z.string().uuid(),
    candidateEmail: zod_1.z.string().email(),
    candidateName: zod_1.z.string().min(1).max(255),
    candidatePhone: zod_1.z.string().max(20).optional(),
    candidateResume: zod_1.z.string().url().optional(),
    requisitionId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(ReferralStatus),
    rewardStatus: zod_1.z.nativeEnum(ReferralRewardStatus).default(ReferralRewardStatus.PENDING),
    rewardAmount: zod_1.z.number().min(0).optional(),
});
/**
 * Campus recruitment event validation schema
 */
exports.CampusRecruitmentEventSchema = zod_1.z.object({
    universityId: zod_1.z.string().uuid(),
    universityName: zod_1.z.string().min(1).max(255),
    eventType: zod_1.z.string().min(1).max(100),
    eventName: zod_1.z.string().min(1).max(255),
    eventDate: zod_1.z.coerce.date(),
    location: zod_1.z.string().max(500).optional(),
    stage: zod_1.z.nativeEnum(CampusRecruitmentStage),
    recruiters: zod_1.z.array(zod_1.z.string().uuid()),
    targetPositions: zod_1.z.array(zod_1.z.string()),
    budget: zod_1.z.number().min(0).optional(),
});
/**
 * Recruiting agency validation schema
 */
exports.RecruitingAgencySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    contactName: zod_1.z.string().min(1).max(255),
    contactEmail: zod_1.z.string().email(),
    contactPhone: zod_1.z.string().max(20).optional(),
    website: zod_1.z.string().url().optional(),
    status: zod_1.z.nativeEnum(AgencyStatus),
    specializations: zod_1.z.array(zod_1.z.string()),
    feeStructure: zod_1.z.string().max(500).optional(),
    feePercentage: zod_1.z.number().min(0).max(100).optional(),
    contractStartDate: zod_1.z.coerce.date(),
    contractEndDate: zod_1.z.coerce.date().optional(),
});
/**
 * Diversity initiative validation schema
 */
exports.DiversityInitiativeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    categories: zod_1.z.array(zod_1.z.nativeEnum(DiversityCategory)),
    goals: zod_1.z.record(zod_1.z.any()).optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date().optional(),
    ownerId: zod_1.z.string().uuid(),
    partnerOrganizations: zod_1.z.array(zod_1.z.string()).optional(),
    budget: zod_1.z.number().min(0).optional(),
    isActive: zod_1.z.boolean().default(true),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Talent Pool Model
 */
let TalentPoolModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'talent_pools',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['owner_id'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _criteria_decorators;
    let _criteria_initializers = [];
    let _criteria_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _memberCount_decorators;
    let _memberCount_initializers = [];
    let _memberCount_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var TalentPoolModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.criteria = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _criteria_initializers, void 0));
            this.ownerId = (__runInitializers(this, _criteria_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.isActive = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.tags = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.memberCount = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _memberCount_initializers, void 0));
            this.metadata = (__runInitializers(this, _memberCount_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TalentPoolModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TalentPoolType)),
                allowNull: false,
            })];
        _criteria_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'owner_id',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _memberCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'member_count',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _criteria_decorators, { kind: "field", name: "criteria", static: false, private: false, access: { has: obj => "criteria" in obj, get: obj => obj.criteria, set: (obj, value) => { obj.criteria = value; } }, metadata: _metadata }, _criteria_initializers, _criteria_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _memberCount_decorators, { kind: "field", name: "memberCount", static: false, private: false, access: { has: obj => "memberCount" in obj, get: obj => obj.memberCount, set: (obj, value) => { obj.memberCount = value; } }, metadata: _metadata }, _memberCount_initializers, _memberCount_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TalentPoolModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TalentPoolModel = _classThis;
})();
exports.TalentPoolModel = TalentPoolModel;
/**
 * Job Posting Model
 */
let JobPostingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'job_postings',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['requisition_id'] },
                { fields: ['status'] },
                { fields: ['published_at'] },
                { fields: ['expires_at'] },
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
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _shortDescription_decorators;
    let _shortDescription_initializers = [];
    let _shortDescription_extraInitializers = [];
    let _boards_decorators;
    let _boards_initializers = [];
    let _boards_extraInitializers = [];
    let _publishedAt_decorators;
    let _publishedAt_initializers = [];
    let _publishedAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _views_decorators;
    let _views_initializers = [];
    let _views_extraInitializers = [];
    let _applications_decorators;
    let _applications_initializers = [];
    let _applications_extraInitializers = [];
    let _clicks_decorators;
    let _clicks_initializers = [];
    let _clicks_extraInitializers = [];
    let _seoKeywords_decorators;
    let _seoKeywords_initializers = [];
    let _seoKeywords_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var JobPostingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requisitionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.status = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.title = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.shortDescription = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _shortDescription_initializers, void 0));
            this.boards = (__runInitializers(this, _shortDescription_extraInitializers), __runInitializers(this, _boards_initializers, void 0));
            this.publishedAt = (__runInitializers(this, _boards_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.views = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _views_initializers, void 0));
            this.applications = (__runInitializers(this, _views_extraInitializers), __runInitializers(this, _applications_initializers, void 0));
            this.clicks = (__runInitializers(this, _applications_extraInitializers), __runInitializers(this, _clicks_initializers, void 0));
            this.seoKeywords = (__runInitializers(this, _clicks_extraInitializers), __runInitializers(this, _seoKeywords_initializers, void 0));
            this.metadata = (__runInitializers(this, _seoKeywords_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "JobPostingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(JobPostingStatus)),
                allowNull: false,
                defaultValue: JobPostingStatus.DRAFT,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _shortDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'short_description',
            })];
        _boards_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            })];
        _publishedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'published_at',
            })];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expires_at',
            })];
        _views_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _applications_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _clicks_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _seoKeywords_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'seo_keywords',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _shortDescription_decorators, { kind: "field", name: "shortDescription", static: false, private: false, access: { has: obj => "shortDescription" in obj, get: obj => obj.shortDescription, set: (obj, value) => { obj.shortDescription = value; } }, metadata: _metadata }, _shortDescription_initializers, _shortDescription_extraInitializers);
        __esDecorate(null, null, _boards_decorators, { kind: "field", name: "boards", static: false, private: false, access: { has: obj => "boards" in obj, get: obj => obj.boards, set: (obj, value) => { obj.boards = value; } }, metadata: _metadata }, _boards_initializers, _boards_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: obj => "publishedAt" in obj, get: obj => obj.publishedAt, set: (obj, value) => { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _views_decorators, { kind: "field", name: "views", static: false, private: false, access: { has: obj => "views" in obj, get: obj => obj.views, set: (obj, value) => { obj.views = value; } }, metadata: _metadata }, _views_initializers, _views_extraInitializers);
        __esDecorate(null, null, _applications_decorators, { kind: "field", name: "applications", static: false, private: false, access: { has: obj => "applications" in obj, get: obj => obj.applications, set: (obj, value) => { obj.applications = value; } }, metadata: _metadata }, _applications_initializers, _applications_extraInitializers);
        __esDecorate(null, null, _clicks_decorators, { kind: "field", name: "clicks", static: false, private: false, access: { has: obj => "clicks" in obj, get: obj => obj.clicks, set: (obj, value) => { obj.clicks = value; } }, metadata: _metadata }, _clicks_initializers, _clicks_extraInitializers);
        __esDecorate(null, null, _seoKeywords_decorators, { kind: "field", name: "seoKeywords", static: false, private: false, access: { has: obj => "seoKeywords" in obj, get: obj => obj.seoKeywords, set: (obj, value) => { obj.seoKeywords = value; } }, metadata: _metadata }, _seoKeywords_initializers, _seoKeywords_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobPostingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobPostingModel = _classThis;
})();
exports.JobPostingModel = JobPostingModel;
/**
 * Career Site Page Model
 */
let CareerSitePageModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'career_site_pages',
            timestamps: true,
            indexes: [
                { fields: ['slug'], unique: true },
                { fields: ['is_published'] },
                { fields: ['order'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _metaDescription_decorators;
    let _metaDescription_initializers = [];
    let _metaDescription_extraInitializers = [];
    let _metaKeywords_decorators;
    let _metaKeywords_initializers = [];
    let _metaKeywords_extraInitializers = [];
    let _isPublished_decorators;
    let _isPublished_initializers = [];
    let _isPublished_extraInitializers = [];
    let _publishedAt_decorators;
    let _publishedAt_initializers = [];
    let _publishedAt_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CareerSitePageModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.slug = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.title = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.metaDescription = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _metaDescription_initializers, void 0));
            this.metaKeywords = (__runInitializers(this, _metaDescription_extraInitializers), __runInitializers(this, _metaKeywords_initializers, void 0));
            this.isPublished = (__runInitializers(this, _metaKeywords_extraInitializers), __runInitializers(this, _isPublished_initializers, void 0));
            this.publishedAt = (__runInitializers(this, _isPublished_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.order = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.createdAt = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CareerSitePageModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _slug_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _metaDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'meta_description',
            })];
        _metaKeywords_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'meta_keywords',
            })];
        _isPublished_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_published',
            })];
        _publishedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'published_at',
            })];
        _order_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _metaDescription_decorators, { kind: "field", name: "metaDescription", static: false, private: false, access: { has: obj => "metaDescription" in obj, get: obj => obj.metaDescription, set: (obj, value) => { obj.metaDescription = value; } }, metadata: _metadata }, _metaDescription_initializers, _metaDescription_extraInitializers);
        __esDecorate(null, null, _metaKeywords_decorators, { kind: "field", name: "metaKeywords", static: false, private: false, access: { has: obj => "metaKeywords" in obj, get: obj => obj.metaKeywords, set: (obj, value) => { obj.metaKeywords = value; } }, metadata: _metadata }, _metaKeywords_initializers, _metaKeywords_extraInitializers);
        __esDecorate(null, null, _isPublished_decorators, { kind: "field", name: "isPublished", static: false, private: false, access: { has: obj => "isPublished" in obj, get: obj => obj.isPublished, set: (obj, value) => { obj.isPublished = value; } }, metadata: _metadata }, _isPublished_initializers, _isPublished_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: obj => "publishedAt" in obj, get: obj => obj.publishedAt, set: (obj, value) => { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CareerSitePageModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CareerSitePageModel = _classThis;
})();
exports.CareerSitePageModel = CareerSitePageModel;
/**
 * Recruitment Campaign Model
 */
let RecruitmentCampaignModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'recruitment_campaigns',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['status'] },
                { fields: ['start_date'] },
                { fields: ['created_by'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _targetAudience_decorators;
    let _targetAudience_initializers = [];
    let _targetAudience_extraInitializers = [];
    let _talentPoolIds_decorators;
    let _talentPoolIds_initializers = [];
    let _talentPoolIds_extraInitializers = [];
    let _requisitionIds_decorators;
    let _requisitionIds_initializers = [];
    let _requisitionIds_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _spent_decorators;
    let _spent_initializers = [];
    let _spent_extraInitializers = [];
    let _impressions_decorators;
    let _impressions_initializers = [];
    let _impressions_extraInitializers = [];
    let _clicks_decorators;
    let _clicks_initializers = [];
    let _clicks_extraInitializers = [];
    let _conversions_decorators;
    let _conversions_initializers = [];
    let _conversions_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var RecruitmentCampaignModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.targetAudience = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _targetAudience_initializers, void 0));
            this.talentPoolIds = (__runInitializers(this, _targetAudience_extraInitializers), __runInitializers(this, _talentPoolIds_initializers, void 0));
            this.requisitionIds = (__runInitializers(this, _talentPoolIds_extraInitializers), __runInitializers(this, _requisitionIds_initializers, void 0));
            this.startDate = (__runInitializers(this, _requisitionIds_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.budget = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
            this.spent = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _spent_initializers, void 0));
            this.impressions = (__runInitializers(this, _spent_extraInitializers), __runInitializers(this, _impressions_initializers, void 0));
            this.clicks = (__runInitializers(this, _impressions_extraInitializers), __runInitializers(this, _clicks_initializers, void 0));
            this.conversions = (__runInitializers(this, _clicks_extraInitializers), __runInitializers(this, _conversions_initializers, void 0));
            this.createdBy = (__runInitializers(this, _conversions_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RecruitmentCampaignModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CampaignType)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CampaignStatus)),
                allowNull: false,
                defaultValue: CampaignStatus.DRAFT,
            })];
        _targetAudience_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'target_audience',
            })];
        _talentPoolIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: true,
                field: 'talent_pool_ids',
            })];
        _requisitionIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: true,
                field: 'requisition_ids',
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'start_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'end_date',
            })];
        _budget_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _spent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _impressions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _clicks_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _conversions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'created_by',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _targetAudience_decorators, { kind: "field", name: "targetAudience", static: false, private: false, access: { has: obj => "targetAudience" in obj, get: obj => obj.targetAudience, set: (obj, value) => { obj.targetAudience = value; } }, metadata: _metadata }, _targetAudience_initializers, _targetAudience_extraInitializers);
        __esDecorate(null, null, _talentPoolIds_decorators, { kind: "field", name: "talentPoolIds", static: false, private: false, access: { has: obj => "talentPoolIds" in obj, get: obj => obj.talentPoolIds, set: (obj, value) => { obj.talentPoolIds = value; } }, metadata: _metadata }, _talentPoolIds_initializers, _talentPoolIds_extraInitializers);
        __esDecorate(null, null, _requisitionIds_decorators, { kind: "field", name: "requisitionIds", static: false, private: false, access: { has: obj => "requisitionIds" in obj, get: obj => obj.requisitionIds, set: (obj, value) => { obj.requisitionIds = value; } }, metadata: _metadata }, _requisitionIds_initializers, _requisitionIds_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
        __esDecorate(null, null, _spent_decorators, { kind: "field", name: "spent", static: false, private: false, access: { has: obj => "spent" in obj, get: obj => obj.spent, set: (obj, value) => { obj.spent = value; } }, metadata: _metadata }, _spent_initializers, _spent_extraInitializers);
        __esDecorate(null, null, _impressions_decorators, { kind: "field", name: "impressions", static: false, private: false, access: { has: obj => "impressions" in obj, get: obj => obj.impressions, set: (obj, value) => { obj.impressions = value; } }, metadata: _metadata }, _impressions_initializers, _impressions_extraInitializers);
        __esDecorate(null, null, _clicks_decorators, { kind: "field", name: "clicks", static: false, private: false, access: { has: obj => "clicks" in obj, get: obj => obj.clicks, set: (obj, value) => { obj.clicks = value; } }, metadata: _metadata }, _clicks_initializers, _clicks_extraInitializers);
        __esDecorate(null, null, _conversions_decorators, { kind: "field", name: "conversions", static: false, private: false, access: { has: obj => "conversions" in obj, get: obj => obj.conversions, set: (obj, value) => { obj.conversions = value; } }, metadata: _metadata }, _conversions_initializers, _conversions_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentCampaignModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentCampaignModel = _classThis;
})();
exports.RecruitmentCampaignModel = RecruitmentCampaignModel;
/**
 * Employee Referral Model
 */
let EmployeeReferralModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'employee_referrals',
            timestamps: true,
            indexes: [
                { fields: ['referrer_id'] },
                { fields: ['requisition_id'] },
                { fields: ['status'] },
                { fields: ['reward_status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _referrerId_decorators;
    let _referrerId_initializers = [];
    let _referrerId_extraInitializers = [];
    let _candidateEmail_decorators;
    let _candidateEmail_initializers = [];
    let _candidateEmail_extraInitializers = [];
    let _candidateName_decorators;
    let _candidateName_initializers = [];
    let _candidateName_extraInitializers = [];
    let _candidatePhone_decorators;
    let _candidatePhone_initializers = [];
    let _candidatePhone_extraInitializers = [];
    let _candidateResume_decorators;
    let _candidateResume_initializers = [];
    let _candidateResume_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _submittedAt_decorators;
    let _submittedAt_initializers = [];
    let _submittedAt_extraInitializers = [];
    let _contactedAt_decorators;
    let _contactedAt_initializers = [];
    let _contactedAt_extraInitializers = [];
    let _hiredAt_decorators;
    let _hiredAt_initializers = [];
    let _hiredAt_extraInitializers = [];
    let _rewardStatus_decorators;
    let _rewardStatus_initializers = [];
    let _rewardStatus_extraInitializers = [];
    let _rewardAmount_decorators;
    let _rewardAmount_initializers = [];
    let _rewardAmount_extraInitializers = [];
    let _rewardPaidAt_decorators;
    let _rewardPaidAt_initializers = [];
    let _rewardPaidAt_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EmployeeReferralModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.referrerId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _referrerId_initializers, void 0));
            this.candidateEmail = (__runInitializers(this, _referrerId_extraInitializers), __runInitializers(this, _candidateEmail_initializers, void 0));
            this.candidateName = (__runInitializers(this, _candidateEmail_extraInitializers), __runInitializers(this, _candidateName_initializers, void 0));
            this.candidatePhone = (__runInitializers(this, _candidateName_extraInitializers), __runInitializers(this, _candidatePhone_initializers, void 0));
            this.candidateResume = (__runInitializers(this, _candidatePhone_extraInitializers), __runInitializers(this, _candidateResume_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _candidateResume_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.status = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            this.contactedAt = (__runInitializers(this, _submittedAt_extraInitializers), __runInitializers(this, _contactedAt_initializers, void 0));
            this.hiredAt = (__runInitializers(this, _contactedAt_extraInitializers), __runInitializers(this, _hiredAt_initializers, void 0));
            this.rewardStatus = (__runInitializers(this, _hiredAt_extraInitializers), __runInitializers(this, _rewardStatus_initializers, void 0));
            this.rewardAmount = (__runInitializers(this, _rewardStatus_extraInitializers), __runInitializers(this, _rewardAmount_initializers, void 0));
            this.rewardPaidAt = (__runInitializers(this, _rewardAmount_extraInitializers), __runInitializers(this, _rewardPaidAt_initializers, void 0));
            this.notes = (__runInitializers(this, _rewardPaidAt_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmployeeReferralModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _referrerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'referrer_id',
            })];
        _candidateEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'candidate_email',
            })];
        _candidateName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'candidate_name',
            })];
        _candidatePhone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'candidate_phone',
            })];
        _candidateResume_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'candidate_resume',
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReferralStatus)),
                allowNull: false,
                defaultValue: ReferralStatus.SUBMITTED,
            })];
        _submittedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'submitted_at',
            })];
        _contactedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'contacted_at',
            })];
        _hiredAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'hired_at',
            })];
        _rewardStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReferralRewardStatus)),
                allowNull: false,
                defaultValue: ReferralRewardStatus.PENDING,
                field: 'reward_status',
            })];
        _rewardAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
                field: 'reward_amount',
            })];
        _rewardPaidAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'reward_paid_at',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _referrerId_decorators, { kind: "field", name: "referrerId", static: false, private: false, access: { has: obj => "referrerId" in obj, get: obj => obj.referrerId, set: (obj, value) => { obj.referrerId = value; } }, metadata: _metadata }, _referrerId_initializers, _referrerId_extraInitializers);
        __esDecorate(null, null, _candidateEmail_decorators, { kind: "field", name: "candidateEmail", static: false, private: false, access: { has: obj => "candidateEmail" in obj, get: obj => obj.candidateEmail, set: (obj, value) => { obj.candidateEmail = value; } }, metadata: _metadata }, _candidateEmail_initializers, _candidateEmail_extraInitializers);
        __esDecorate(null, null, _candidateName_decorators, { kind: "field", name: "candidateName", static: false, private: false, access: { has: obj => "candidateName" in obj, get: obj => obj.candidateName, set: (obj, value) => { obj.candidateName = value; } }, metadata: _metadata }, _candidateName_initializers, _candidateName_extraInitializers);
        __esDecorate(null, null, _candidatePhone_decorators, { kind: "field", name: "candidatePhone", static: false, private: false, access: { has: obj => "candidatePhone" in obj, get: obj => obj.candidatePhone, set: (obj, value) => { obj.candidatePhone = value; } }, metadata: _metadata }, _candidatePhone_initializers, _candidatePhone_extraInitializers);
        __esDecorate(null, null, _candidateResume_decorators, { kind: "field", name: "candidateResume", static: false, private: false, access: { has: obj => "candidateResume" in obj, get: obj => obj.candidateResume, set: (obj, value) => { obj.candidateResume = value; } }, metadata: _metadata }, _candidateResume_initializers, _candidateResume_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: obj => "submittedAt" in obj, get: obj => obj.submittedAt, set: (obj, value) => { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, null, _contactedAt_decorators, { kind: "field", name: "contactedAt", static: false, private: false, access: { has: obj => "contactedAt" in obj, get: obj => obj.contactedAt, set: (obj, value) => { obj.contactedAt = value; } }, metadata: _metadata }, _contactedAt_initializers, _contactedAt_extraInitializers);
        __esDecorate(null, null, _hiredAt_decorators, { kind: "field", name: "hiredAt", static: false, private: false, access: { has: obj => "hiredAt" in obj, get: obj => obj.hiredAt, set: (obj, value) => { obj.hiredAt = value; } }, metadata: _metadata }, _hiredAt_initializers, _hiredAt_extraInitializers);
        __esDecorate(null, null, _rewardStatus_decorators, { kind: "field", name: "rewardStatus", static: false, private: false, access: { has: obj => "rewardStatus" in obj, get: obj => obj.rewardStatus, set: (obj, value) => { obj.rewardStatus = value; } }, metadata: _metadata }, _rewardStatus_initializers, _rewardStatus_extraInitializers);
        __esDecorate(null, null, _rewardAmount_decorators, { kind: "field", name: "rewardAmount", static: false, private: false, access: { has: obj => "rewardAmount" in obj, get: obj => obj.rewardAmount, set: (obj, value) => { obj.rewardAmount = value; } }, metadata: _metadata }, _rewardAmount_initializers, _rewardAmount_extraInitializers);
        __esDecorate(null, null, _rewardPaidAt_decorators, { kind: "field", name: "rewardPaidAt", static: false, private: false, access: { has: obj => "rewardPaidAt" in obj, get: obj => obj.rewardPaidAt, set: (obj, value) => { obj.rewardPaidAt = value; } }, metadata: _metadata }, _rewardPaidAt_initializers, _rewardPaidAt_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmployeeReferralModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmployeeReferralModel = _classThis;
})();
exports.EmployeeReferralModel = EmployeeReferralModel;
/**
 * Campus Recruitment Event Model
 */
let CampusRecruitmentEventModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'campus_recruitment_events',
            timestamps: true,
            indexes: [
                { fields: ['university_id'] },
                { fields: ['event_date'] },
                { fields: ['stage'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _universityId_decorators;
    let _universityId_initializers = [];
    let _universityId_extraInitializers = [];
    let _universityName_decorators;
    let _universityName_initializers = [];
    let _universityName_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _eventName_decorators;
    let _eventName_initializers = [];
    let _eventName_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _stage_decorators;
    let _stage_initializers = [];
    let _stage_extraInitializers = [];
    let _recruiters_decorators;
    let _recruiters_initializers = [];
    let _recruiters_extraInitializers = [];
    let _targetPositions_decorators;
    let _targetPositions_initializers = [];
    let _targetPositions_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _attendees_decorators;
    let _attendees_initializers = [];
    let _attendees_extraInitializers = [];
    let _resumesCollected_decorators;
    let _resumesCollected_initializers = [];
    let _resumesCollected_extraInitializers = [];
    let _interviewsScheduled_decorators;
    let _interviewsScheduled_initializers = [];
    let _interviewsScheduled_extraInitializers = [];
    let _offersExtended_decorators;
    let _offersExtended_initializers = [];
    let _offersExtended_extraInitializers = [];
    let _hires_decorators;
    let _hires_initializers = [];
    let _hires_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CampusRecruitmentEventModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.universityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _universityId_initializers, void 0));
            this.universityName = (__runInitializers(this, _universityId_extraInitializers), __runInitializers(this, _universityName_initializers, void 0));
            this.eventType = (__runInitializers(this, _universityName_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.eventName = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _eventName_initializers, void 0));
            this.eventDate = (__runInitializers(this, _eventName_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
            this.location = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.stage = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _stage_initializers, void 0));
            this.recruiters = (__runInitializers(this, _stage_extraInitializers), __runInitializers(this, _recruiters_initializers, void 0));
            this.targetPositions = (__runInitializers(this, _recruiters_extraInitializers), __runInitializers(this, _targetPositions_initializers, void 0));
            this.budget = (__runInitializers(this, _targetPositions_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
            this.attendees = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _attendees_initializers, void 0));
            this.resumesCollected = (__runInitializers(this, _attendees_extraInitializers), __runInitializers(this, _resumesCollected_initializers, void 0));
            this.interviewsScheduled = (__runInitializers(this, _resumesCollected_extraInitializers), __runInitializers(this, _interviewsScheduled_initializers, void 0));
            this.offersExtended = (__runInitializers(this, _interviewsScheduled_extraInitializers), __runInitializers(this, _offersExtended_initializers, void 0));
            this.hires = (__runInitializers(this, _offersExtended_extraInitializers), __runInitializers(this, _hires_initializers, void 0));
            this.notes = (__runInitializers(this, _hires_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CampusRecruitmentEventModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _universityId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'university_id',
            })];
        _universityName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'university_name',
            })];
        _eventType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'event_type',
            })];
        _eventName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'event_name',
            })];
        _eventDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'event_date',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _stage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CampusRecruitmentStage)),
                allowNull: false,
                defaultValue: CampusRecruitmentStage.PLANNING,
            })];
        _recruiters_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
            })];
        _targetPositions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                field: 'target_positions',
            })];
        _budget_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _attendees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _resumesCollected_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'resumes_collected',
            })];
        _interviewsScheduled_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'interviews_scheduled',
            })];
        _offersExtended_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'offers_extended',
            })];
        _hires_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _universityId_decorators, { kind: "field", name: "universityId", static: false, private: false, access: { has: obj => "universityId" in obj, get: obj => obj.universityId, set: (obj, value) => { obj.universityId = value; } }, metadata: _metadata }, _universityId_initializers, _universityId_extraInitializers);
        __esDecorate(null, null, _universityName_decorators, { kind: "field", name: "universityName", static: false, private: false, access: { has: obj => "universityName" in obj, get: obj => obj.universityName, set: (obj, value) => { obj.universityName = value; } }, metadata: _metadata }, _universityName_initializers, _universityName_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _eventName_decorators, { kind: "field", name: "eventName", static: false, private: false, access: { has: obj => "eventName" in obj, get: obj => obj.eventName, set: (obj, value) => { obj.eventName = value; } }, metadata: _metadata }, _eventName_initializers, _eventName_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _stage_decorators, { kind: "field", name: "stage", static: false, private: false, access: { has: obj => "stage" in obj, get: obj => obj.stage, set: (obj, value) => { obj.stage = value; } }, metadata: _metadata }, _stage_initializers, _stage_extraInitializers);
        __esDecorate(null, null, _recruiters_decorators, { kind: "field", name: "recruiters", static: false, private: false, access: { has: obj => "recruiters" in obj, get: obj => obj.recruiters, set: (obj, value) => { obj.recruiters = value; } }, metadata: _metadata }, _recruiters_initializers, _recruiters_extraInitializers);
        __esDecorate(null, null, _targetPositions_decorators, { kind: "field", name: "targetPositions", static: false, private: false, access: { has: obj => "targetPositions" in obj, get: obj => obj.targetPositions, set: (obj, value) => { obj.targetPositions = value; } }, metadata: _metadata }, _targetPositions_initializers, _targetPositions_extraInitializers);
        __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
        __esDecorate(null, null, _attendees_decorators, { kind: "field", name: "attendees", static: false, private: false, access: { has: obj => "attendees" in obj, get: obj => obj.attendees, set: (obj, value) => { obj.attendees = value; } }, metadata: _metadata }, _attendees_initializers, _attendees_extraInitializers);
        __esDecorate(null, null, _resumesCollected_decorators, { kind: "field", name: "resumesCollected", static: false, private: false, access: { has: obj => "resumesCollected" in obj, get: obj => obj.resumesCollected, set: (obj, value) => { obj.resumesCollected = value; } }, metadata: _metadata }, _resumesCollected_initializers, _resumesCollected_extraInitializers);
        __esDecorate(null, null, _interviewsScheduled_decorators, { kind: "field", name: "interviewsScheduled", static: false, private: false, access: { has: obj => "interviewsScheduled" in obj, get: obj => obj.interviewsScheduled, set: (obj, value) => { obj.interviewsScheduled = value; } }, metadata: _metadata }, _interviewsScheduled_initializers, _interviewsScheduled_extraInitializers);
        __esDecorate(null, null, _offersExtended_decorators, { kind: "field", name: "offersExtended", static: false, private: false, access: { has: obj => "offersExtended" in obj, get: obj => obj.offersExtended, set: (obj, value) => { obj.offersExtended = value; } }, metadata: _metadata }, _offersExtended_initializers, _offersExtended_extraInitializers);
        __esDecorate(null, null, _hires_decorators, { kind: "field", name: "hires", static: false, private: false, access: { has: obj => "hires" in obj, get: obj => obj.hires, set: (obj, value) => { obj.hires = value; } }, metadata: _metadata }, _hires_initializers, _hires_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CampusRecruitmentEventModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CampusRecruitmentEventModel = _classThis;
})();
exports.CampusRecruitmentEventModel = CampusRecruitmentEventModel;
/**
 * Recruiting Agency Model
 */
let RecruitingAgencyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'recruiting_agencies',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['performance_rating'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _contactName_decorators;
    let _contactName_initializers = [];
    let _contactName_extraInitializers = [];
    let _contactEmail_decorators;
    let _contactEmail_initializers = [];
    let _contactEmail_extraInitializers = [];
    let _contactPhone_decorators;
    let _contactPhone_initializers = [];
    let _contactPhone_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _specializations_decorators;
    let _specializations_initializers = [];
    let _specializations_extraInitializers = [];
    let _feeStructure_decorators;
    let _feeStructure_initializers = [];
    let _feeStructure_extraInitializers = [];
    let _feePercentage_decorators;
    let _feePercentage_initializers = [];
    let _feePercentage_extraInitializers = [];
    let _contractStartDate_decorators;
    let _contractStartDate_initializers = [];
    let _contractStartDate_extraInitializers = [];
    let _contractEndDate_decorators;
    let _contractEndDate_initializers = [];
    let _contractEndDate_extraInitializers = [];
    let _performanceRating_decorators;
    let _performanceRating_initializers = [];
    let _performanceRating_extraInitializers = [];
    let _placements_decorators;
    let _placements_initializers = [];
    let _placements_extraInitializers = [];
    let _activePlacements_decorators;
    let _activePlacements_initializers = [];
    let _activePlacements_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _submissions_decorators;
    let _submissions_initializers = [];
    let _submissions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var RecruitingAgencyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.contactName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _contactName_initializers, void 0));
            this.contactEmail = (__runInitializers(this, _contactName_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
            this.contactPhone = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
            this.website = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.status = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.specializations = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _specializations_initializers, void 0));
            this.feeStructure = (__runInitializers(this, _specializations_extraInitializers), __runInitializers(this, _feeStructure_initializers, void 0));
            this.feePercentage = (__runInitializers(this, _feeStructure_extraInitializers), __runInitializers(this, _feePercentage_initializers, void 0));
            this.contractStartDate = (__runInitializers(this, _feePercentage_extraInitializers), __runInitializers(this, _contractStartDate_initializers, void 0));
            this.contractEndDate = (__runInitializers(this, _contractStartDate_extraInitializers), __runInitializers(this, _contractEndDate_initializers, void 0));
            this.performanceRating = (__runInitializers(this, _contractEndDate_extraInitializers), __runInitializers(this, _performanceRating_initializers, void 0));
            this.placements = (__runInitializers(this, _performanceRating_extraInitializers), __runInitializers(this, _placements_initializers, void 0));
            this.activePlacements = (__runInitializers(this, _placements_extraInitializers), __runInitializers(this, _activePlacements_initializers, void 0));
            this.metadata = (__runInitializers(this, _activePlacements_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.submissions = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _submissions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _submissions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RecruitingAgencyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _contactName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'contact_name',
            })];
        _contactEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'contact_email',
            })];
        _contactPhone_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
                field: 'contact_phone',
            })];
        _website_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AgencyStatus)),
                allowNull: false,
                defaultValue: AgencyStatus.ACTIVE,
            })];
        _specializations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            })];
        _feeStructure_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'fee_structure',
            })];
        _feePercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                field: 'fee_percentage',
            })];
        _contractStartDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: false,
                field: 'contract_start_date',
            })];
        _contractEndDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATEONLY,
                allowNull: true,
                field: 'contract_end_date',
            })];
        _performanceRating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(3, 2),
                allowNull: true,
                field: 'performance_rating',
            })];
        _placements_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _activePlacements_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'active_placements',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _submissions_decorators = [(0, sequelize_typescript_1.HasMany)(() => AgencySubmissionModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _contactName_decorators, { kind: "field", name: "contactName", static: false, private: false, access: { has: obj => "contactName" in obj, get: obj => obj.contactName, set: (obj, value) => { obj.contactName = value; } }, metadata: _metadata }, _contactName_initializers, _contactName_extraInitializers);
        __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: obj => "contactEmail" in obj, get: obj => obj.contactEmail, set: (obj, value) => { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
        __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: obj => "contactPhone" in obj, get: obj => obj.contactPhone, set: (obj, value) => { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _specializations_decorators, { kind: "field", name: "specializations", static: false, private: false, access: { has: obj => "specializations" in obj, get: obj => obj.specializations, set: (obj, value) => { obj.specializations = value; } }, metadata: _metadata }, _specializations_initializers, _specializations_extraInitializers);
        __esDecorate(null, null, _feeStructure_decorators, { kind: "field", name: "feeStructure", static: false, private: false, access: { has: obj => "feeStructure" in obj, get: obj => obj.feeStructure, set: (obj, value) => { obj.feeStructure = value; } }, metadata: _metadata }, _feeStructure_initializers, _feeStructure_extraInitializers);
        __esDecorate(null, null, _feePercentage_decorators, { kind: "field", name: "feePercentage", static: false, private: false, access: { has: obj => "feePercentage" in obj, get: obj => obj.feePercentage, set: (obj, value) => { obj.feePercentage = value; } }, metadata: _metadata }, _feePercentage_initializers, _feePercentage_extraInitializers);
        __esDecorate(null, null, _contractStartDate_decorators, { kind: "field", name: "contractStartDate", static: false, private: false, access: { has: obj => "contractStartDate" in obj, get: obj => obj.contractStartDate, set: (obj, value) => { obj.contractStartDate = value; } }, metadata: _metadata }, _contractStartDate_initializers, _contractStartDate_extraInitializers);
        __esDecorate(null, null, _contractEndDate_decorators, { kind: "field", name: "contractEndDate", static: false, private: false, access: { has: obj => "contractEndDate" in obj, get: obj => obj.contractEndDate, set: (obj, value) => { obj.contractEndDate = value; } }, metadata: _metadata }, _contractEndDate_initializers, _contractEndDate_extraInitializers);
        __esDecorate(null, null, _performanceRating_decorators, { kind: "field", name: "performanceRating", static: false, private: false, access: { has: obj => "performanceRating" in obj, get: obj => obj.performanceRating, set: (obj, value) => { obj.performanceRating = value; } }, metadata: _metadata }, _performanceRating_initializers, _performanceRating_extraInitializers);
        __esDecorate(null, null, _placements_decorators, { kind: "field", name: "placements", static: false, private: false, access: { has: obj => "placements" in obj, get: obj => obj.placements, set: (obj, value) => { obj.placements = value; } }, metadata: _metadata }, _placements_initializers, _placements_extraInitializers);
        __esDecorate(null, null, _activePlacements_decorators, { kind: "field", name: "activePlacements", static: false, private: false, access: { has: obj => "activePlacements" in obj, get: obj => obj.activePlacements, set: (obj, value) => { obj.activePlacements = value; } }, metadata: _metadata }, _activePlacements_initializers, _activePlacements_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _submissions_decorators, { kind: "field", name: "submissions", static: false, private: false, access: { has: obj => "submissions" in obj, get: obj => obj.submissions, set: (obj, value) => { obj.submissions = value; } }, metadata: _metadata }, _submissions_initializers, _submissions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitingAgencyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitingAgencyModel = _classThis;
})();
exports.RecruitingAgencyModel = RecruitingAgencyModel;
/**
 * Agency Submission Model
 */
let AgencySubmissionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'agency_submissions',
            timestamps: true,
            indexes: [
                { fields: ['agency_id'] },
                { fields: ['requisition_id'] },
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
    let _agencyId_decorators;
    let _agencyId_initializers = [];
    let _agencyId_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _candidateEmail_decorators;
    let _candidateEmail_initializers = [];
    let _candidateEmail_extraInitializers = [];
    let _candidateName_decorators;
    let _candidateName_initializers = [];
    let _candidateName_extraInitializers = [];
    let _candidateResume_decorators;
    let _candidateResume_initializers = [];
    let _candidateResume_extraInitializers = [];
    let _submittedAt_decorators;
    let _submittedAt_initializers = [];
    let _submittedAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _fee_decorators;
    let _fee_initializers = [];
    let _fee_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _agency_decorators;
    let _agency_initializers = [];
    let _agency_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AgencySubmissionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.agencyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _agencyId_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _agencyId_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.candidateEmail = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _candidateEmail_initializers, void 0));
            this.candidateName = (__runInitializers(this, _candidateEmail_extraInitializers), __runInitializers(this, _candidateName_initializers, void 0));
            this.candidateResume = (__runInitializers(this, _candidateName_extraInitializers), __runInitializers(this, _candidateResume_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _candidateResume_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            this.status = (__runInitializers(this, _submittedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.applicationId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
            this.fee = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _fee_initializers, void 0));
            this.notes = (__runInitializers(this, _fee_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.agency = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _agency_initializers, void 0));
            this.createdAt = (__runInitializers(this, _agency_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AgencySubmissionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _agencyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => RecruitingAgencyModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'agency_id',
            })];
        _requisitionId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requisition_id',
            })];
        _candidateEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'candidate_email',
            })];
        _candidateName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'candidate_name',
            })];
        _candidateResume_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                field: 'candidate_resume',
            })];
        _submittedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'submitted_at',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                defaultValue: 'pending',
            })];
        _applicationId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'application_id',
            })];
        _fee_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _agency_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => RecruitingAgencyModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _agencyId_decorators, { kind: "field", name: "agencyId", static: false, private: false, access: { has: obj => "agencyId" in obj, get: obj => obj.agencyId, set: (obj, value) => { obj.agencyId = value; } }, metadata: _metadata }, _agencyId_initializers, _agencyId_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _candidateEmail_decorators, { kind: "field", name: "candidateEmail", static: false, private: false, access: { has: obj => "candidateEmail" in obj, get: obj => obj.candidateEmail, set: (obj, value) => { obj.candidateEmail = value; } }, metadata: _metadata }, _candidateEmail_initializers, _candidateEmail_extraInitializers);
        __esDecorate(null, null, _candidateName_decorators, { kind: "field", name: "candidateName", static: false, private: false, access: { has: obj => "candidateName" in obj, get: obj => obj.candidateName, set: (obj, value) => { obj.candidateName = value; } }, metadata: _metadata }, _candidateName_initializers, _candidateName_extraInitializers);
        __esDecorate(null, null, _candidateResume_decorators, { kind: "field", name: "candidateResume", static: false, private: false, access: { has: obj => "candidateResume" in obj, get: obj => obj.candidateResume, set: (obj, value) => { obj.candidateResume = value; } }, metadata: _metadata }, _candidateResume_initializers, _candidateResume_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: obj => "submittedAt" in obj, get: obj => obj.submittedAt, set: (obj, value) => { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
        __esDecorate(null, null, _fee_decorators, { kind: "field", name: "fee", static: false, private: false, access: { has: obj => "fee" in obj, get: obj => obj.fee, set: (obj, value) => { obj.fee = value; } }, metadata: _metadata }, _fee_initializers, _fee_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _agency_decorators, { kind: "field", name: "agency", static: false, private: false, access: { has: obj => "agency" in obj, get: obj => obj.agency, set: (obj, value) => { obj.agency = value; } }, metadata: _metadata }, _agency_initializers, _agency_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AgencySubmissionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AgencySubmissionModel = _classThis;
})();
exports.AgencySubmissionModel = AgencySubmissionModel;
/**
 * Diversity Initiative Model
 */
let DiversityInitiativeModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'diversity_initiatives',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['owner_id'] },
                { fields: ['is_active'] },
                { fields: ['start_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _categories_decorators;
    let _categories_initializers = [];
    let _categories_extraInitializers = [];
    let _goals_decorators;
    let _goals_initializers = [];
    let _goals_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _partnerOrganizations_decorators;
    let _partnerOrganizations_initializers = [];
    let _partnerOrganizations_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _requisitionIds_decorators;
    let _requisitionIds_initializers = [];
    let _requisitionIds_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var DiversityInitiativeModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.categories = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
            this.goals = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
            this.startDate = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.ownerId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.partnerOrganizations = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _partnerOrganizations_initializers, void 0));
            this.budget = (__runInitializers(this, _partnerOrganizations_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
            this.requisitionIds = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _requisitionIds_initializers, void 0));
            this.metrics = (__runInitializers(this, _requisitionIds_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
            this.isActive = (__runInitializers(this, _metrics_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DiversityInitiativeModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _categories_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            })];
        _goals_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'start_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'end_date',
            })];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'owner_id',
            })];
        _partnerOrganizations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'partner_organizations',
            })];
        _budget_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _requisitionIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: true,
                field: 'requisition_ids',
            })];
        _metrics_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: obj => "categories" in obj, get: obj => obj.categories, set: (obj, value) => { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
        __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: obj => "goals" in obj, get: obj => obj.goals, set: (obj, value) => { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _partnerOrganizations_decorators, { kind: "field", name: "partnerOrganizations", static: false, private: false, access: { has: obj => "partnerOrganizations" in obj, get: obj => obj.partnerOrganizations, set: (obj, value) => { obj.partnerOrganizations = value; } }, metadata: _metadata }, _partnerOrganizations_initializers, _partnerOrganizations_extraInitializers);
        __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
        __esDecorate(null, null, _requisitionIds_decorators, { kind: "field", name: "requisitionIds", static: false, private: false, access: { has: obj => "requisitionIds" in obj, get: obj => obj.requisitionIds, set: (obj, value) => { obj.requisitionIds = value; } }, metadata: _metadata }, _requisitionIds_initializers, _requisitionIds_extraInitializers);
        __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiversityInitiativeModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiversityInitiativeModel = _classThis;
})();
exports.DiversityInitiativeModel = DiversityInitiativeModel;
/**
 * EEO Report Model
 */
let EEOReportModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'eeo_reports',
            timestamps: true,
            indexes: [
                { fields: ['report_year'] },
                { fields: ['report_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reportYear_decorators;
    let _reportYear_initializers = [];
    let _reportYear_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _facilityId_decorators;
    let _facilityId_initializers = [];
    let _facilityId_extraInitializers = [];
    let _totalEmployees_decorators;
    let _totalEmployees_initializers = [];
    let _totalEmployees_extraInitializers = [];
    let _jobCategories_decorators;
    let _jobCategories_initializers = [];
    let _jobCategories_extraInitializers = [];
    let _newHires_decorators;
    let _newHires_initializers = [];
    let _newHires_extraInitializers = [];
    let _promotions_decorators;
    let _promotions_initializers = [];
    let _promotions_extraInitializers = [];
    let _terminations_decorators;
    let _terminations_initializers = [];
    let _terminations_extraInitializers = [];
    let _generatedAt_decorators;
    let _generatedAt_initializers = [];
    let _generatedAt_extraInitializers = [];
    let _generatedBy_decorators;
    let _generatedBy_initializers = [];
    let _generatedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EEOReportModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reportYear = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reportYear_initializers, void 0));
            this.reportType = (__runInitializers(this, _reportYear_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
            this.facilityId = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _facilityId_initializers, void 0));
            this.totalEmployees = (__runInitializers(this, _facilityId_extraInitializers), __runInitializers(this, _totalEmployees_initializers, void 0));
            this.jobCategories = (__runInitializers(this, _totalEmployees_extraInitializers), __runInitializers(this, _jobCategories_initializers, void 0));
            this.newHires = (__runInitializers(this, _jobCategories_extraInitializers), __runInitializers(this, _newHires_initializers, void 0));
            this.promotions = (__runInitializers(this, _newHires_extraInitializers), __runInitializers(this, _promotions_initializers, void 0));
            this.terminations = (__runInitializers(this, _promotions_extraInitializers), __runInitializers(this, _terminations_initializers, void 0));
            this.generatedAt = (__runInitializers(this, _terminations_extraInitializers), __runInitializers(this, _generatedAt_initializers, void 0));
            this.generatedBy = (__runInitializers(this, _generatedAt_extraInitializers), __runInitializers(this, _generatedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _generatedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EEOReportModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _reportYear_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'report_year',
            })];
        _reportType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'report_type',
            })];
        _facilityId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'facility_id',
            })];
        _totalEmployees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'total_employees',
            })];
        _jobCategories_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'job_categories',
            })];
        _newHires_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'new_hires',
            })];
        _promotions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _terminations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _generatedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'generated_at',
            })];
        _generatedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'generated_by',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reportYear_decorators, { kind: "field", name: "reportYear", static: false, private: false, access: { has: obj => "reportYear" in obj, get: obj => obj.reportYear, set: (obj, value) => { obj.reportYear = value; } }, metadata: _metadata }, _reportYear_initializers, _reportYear_extraInitializers);
        __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
        __esDecorate(null, null, _facilityId_decorators, { kind: "field", name: "facilityId", static: false, private: false, access: { has: obj => "facilityId" in obj, get: obj => obj.facilityId, set: (obj, value) => { obj.facilityId = value; } }, metadata: _metadata }, _facilityId_initializers, _facilityId_extraInitializers);
        __esDecorate(null, null, _totalEmployees_decorators, { kind: "field", name: "totalEmployees", static: false, private: false, access: { has: obj => "totalEmployees" in obj, get: obj => obj.totalEmployees, set: (obj, value) => { obj.totalEmployees = value; } }, metadata: _metadata }, _totalEmployees_initializers, _totalEmployees_extraInitializers);
        __esDecorate(null, null, _jobCategories_decorators, { kind: "field", name: "jobCategories", static: false, private: false, access: { has: obj => "jobCategories" in obj, get: obj => obj.jobCategories, set: (obj, value) => { obj.jobCategories = value; } }, metadata: _metadata }, _jobCategories_initializers, _jobCategories_extraInitializers);
        __esDecorate(null, null, _newHires_decorators, { kind: "field", name: "newHires", static: false, private: false, access: { has: obj => "newHires" in obj, get: obj => obj.newHires, set: (obj, value) => { obj.newHires = value; } }, metadata: _metadata }, _newHires_initializers, _newHires_extraInitializers);
        __esDecorate(null, null, _promotions_decorators, { kind: "field", name: "promotions", static: false, private: false, access: { has: obj => "promotions" in obj, get: obj => obj.promotions, set: (obj, value) => { obj.promotions = value; } }, metadata: _metadata }, _promotions_initializers, _promotions_extraInitializers);
        __esDecorate(null, null, _terminations_decorators, { kind: "field", name: "terminations", static: false, private: false, access: { has: obj => "terminations" in obj, get: obj => obj.terminations, set: (obj, value) => { obj.terminations = value; } }, metadata: _metadata }, _terminations_initializers, _terminations_extraInitializers);
        __esDecorate(null, null, _generatedAt_decorators, { kind: "field", name: "generatedAt", static: false, private: false, access: { has: obj => "generatedAt" in obj, get: obj => obj.generatedAt, set: (obj, value) => { obj.generatedAt = value; } }, metadata: _metadata }, _generatedAt_initializers, _generatedAt_extraInitializers);
        __esDecorate(null, null, _generatedBy_decorators, { kind: "field", name: "generatedBy", static: false, private: false, access: { has: obj => "generatedBy" in obj, get: obj => obj.generatedBy, set: (obj, value) => { obj.generatedBy = value; } }, metadata: _metadata }, _generatedBy_initializers, _generatedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EEOReportModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EEOReportModel = _classThis;
})();
exports.EEOReportModel = EEOReportModel;
/**
 * Candidate Engagement Model
 */
let CandidateEngagementModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'candidate_engagements',
            timestamps: true,
            indexes: [
                { fields: ['candidate_id'] },
                { fields: ['engagement_type'] },
                { fields: ['sent_at'] },
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
    let _engagementType_decorators;
    let _engagementType_initializers = [];
    let _engagementType_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _openedAt_decorators;
    let _openedAt_initializers = [];
    let _openedAt_extraInitializers = [];
    let _clickedAt_decorators;
    let _clickedAt_initializers = [];
    let _clickedAt_extraInitializers = [];
    let _respondedAt_decorators;
    let _respondedAt_initializers = [];
    let _respondedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CandidateEngagementModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.candidateId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.engagementType = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _engagementType_initializers, void 0));
            this.channel = (__runInitializers(this, _engagementType_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
            this.subject = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.content = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.sentAt = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.openedAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _openedAt_initializers, void 0));
            this.clickedAt = (__runInitializers(this, _openedAt_extraInitializers), __runInitializers(this, _clickedAt_initializers, void 0));
            this.respondedAt = (__runInitializers(this, _clickedAt_extraInitializers), __runInitializers(this, _respondedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _respondedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CandidateEngagementModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _candidateId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'candidate_id',
            })];
        _engagementType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'engagement_type',
            })];
        _channel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _subject_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'sent_at',
            })];
        _openedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'opened_at',
            })];
        _clickedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'clicked_at',
            })];
        _respondedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'responded_at',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _engagementType_decorators, { kind: "field", name: "engagementType", static: false, private: false, access: { has: obj => "engagementType" in obj, get: obj => obj.engagementType, set: (obj, value) => { obj.engagementType = value; } }, metadata: _metadata }, _engagementType_initializers, _engagementType_extraInitializers);
        __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _openedAt_decorators, { kind: "field", name: "openedAt", static: false, private: false, access: { has: obj => "openedAt" in obj, get: obj => obj.openedAt, set: (obj, value) => { obj.openedAt = value; } }, metadata: _metadata }, _openedAt_initializers, _openedAt_extraInitializers);
        __esDecorate(null, null, _clickedAt_decorators, { kind: "field", name: "clickedAt", static: false, private: false, access: { has: obj => "clickedAt" in obj, get: obj => obj.clickedAt, set: (obj, value) => { obj.clickedAt = value; } }, metadata: _metadata }, _clickedAt_initializers, _clickedAt_extraInitializers);
        __esDecorate(null, null, _respondedAt_decorators, { kind: "field", name: "respondedAt", static: false, private: false, access: { has: obj => "respondedAt" in obj, get: obj => obj.respondedAt, set: (obj, value) => { obj.respondedAt = value; } }, metadata: _metadata }, _respondedAt_initializers, _respondedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CandidateEngagementModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CandidateEngagementModel = _classThis;
})();
exports.CandidateEngagementModel = CandidateEngagementModel;
/**
 * Sourcing Channel Model
 */
let SourcingChannelModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'sourcing_channels',
            timestamps: true,
            indexes: [
                { fields: ['type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _costType_decorators;
    let _costType_initializers = [];
    let _costType_extraInitializers = [];
    let _applications_decorators;
    let _applications_initializers = [];
    let _applications_extraInitializers = [];
    let _hires_decorators;
    let _hires_initializers = [];
    let _hires_extraInitializers = [];
    let _qualityScore_decorators;
    let _qualityScore_initializers = [];
    let _qualityScore_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SourcingChannelModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.cost = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
            this.costType = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _costType_initializers, void 0));
            this.applications = (__runInitializers(this, _costType_extraInitializers), __runInitializers(this, _applications_initializers, void 0));
            this.hires = (__runInitializers(this, _applications_extraInitializers), __runInitializers(this, _hires_initializers, void 0));
            this.qualityScore = (__runInitializers(this, _hires_extraInitializers), __runInitializers(this, _qualityScore_initializers, void 0));
            this.isActive = (__runInitializers(this, _qualityScore_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SourcingChannelModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _cost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _costType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'cost_type',
            })];
        _applications_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _hires_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _qualityScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                field: 'quality_score',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
        __esDecorate(null, null, _costType_decorators, { kind: "field", name: "costType", static: false, private: false, access: { has: obj => "costType" in obj, get: obj => obj.costType, set: (obj, value) => { obj.costType = value; } }, metadata: _metadata }, _costType_initializers, _costType_extraInitializers);
        __esDecorate(null, null, _applications_decorators, { kind: "field", name: "applications", static: false, private: false, access: { has: obj => "applications" in obj, get: obj => obj.applications, set: (obj, value) => { obj.applications = value; } }, metadata: _metadata }, _applications_initializers, _applications_extraInitializers);
        __esDecorate(null, null, _hires_decorators, { kind: "field", name: "hires", static: false, private: false, access: { has: obj => "hires" in obj, get: obj => obj.hires, set: (obj, value) => { obj.hires = value; } }, metadata: _metadata }, _hires_initializers, _hires_extraInitializers);
        __esDecorate(null, null, _qualityScore_decorators, { kind: "field", name: "qualityScore", static: false, private: false, access: { has: obj => "qualityScore" in obj, get: obj => obj.qualityScore, set: (obj, value) => { obj.qualityScore = value; } }, metadata: _metadata }, _qualityScore_initializers, _qualityScore_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SourcingChannelModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SourcingChannelModel = _classThis;
})();
exports.SourcingChannelModel = SourcingChannelModel;
// ============================================================================
// TALENT POOL FUNCTIONS
// ============================================================================
/**
 * Create talent pool
 */
async function createTalentPool(poolData, transaction) {
    const validated = exports.TalentPoolSchema.parse(poolData);
    return TalentPoolModel.create(validated, { transaction });
}
/**
 * Update talent pool
 */
async function updateTalentPool(poolId, updates, transaction) {
    const pool = await TalentPoolModel.findByPk(poolId, { transaction });
    if (!pool) {
        throw new common_1.NotFoundException(`Talent pool ${poolId} not found`);
    }
    await pool.update(updates, { transaction });
    return pool;
}
/**
 * Get talent pool by ID
 */
async function getTalentPoolById(poolId) {
    return TalentPoolModel.findByPk(poolId);
}
/**
 * Get all talent pools
 */
async function getAllTalentPools(activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    return TalentPoolModel.findAll({ where, order: [['name', 'ASC']] });
}
/**
 * Delete talent pool
 */
async function deleteTalentPool(poolId, transaction) {
    await TalentPoolModel.destroy({ where: { id: poolId }, transaction });
}
// ============================================================================
// JOB POSTING FUNCTIONS
// ============================================================================
/**
 * Create job posting
 */
async function createJobPosting(postingData, transaction) {
    const validated = exports.JobPostingSchema.parse(postingData);
    return JobPostingModel.create(validated, { transaction });
}
/**
 * Publish job posting
 */
async function publishJobPosting(postingId, transaction) {
    await JobPostingModel.update({ status: JobPostingStatus.ACTIVE, publishedAt: new Date() }, { where: { id: postingId }, transaction });
}
/**
 * Pause job posting
 */
async function pauseJobPosting(postingId, transaction) {
    await JobPostingModel.update({ status: JobPostingStatus.PAUSED }, { where: { id: postingId }, transaction });
}
/**
 * Close job posting
 */
async function closeJobPosting(postingId, transaction) {
    await JobPostingModel.update({ status: JobPostingStatus.CLOSED }, { where: { id: postingId }, transaction });
}
/**
 * Track job posting view
 */
async function trackJobPostingView(postingId, transaction) {
    await JobPostingModel.increment('views', { where: { id: postingId }, transaction });
}
/**
 * Track job posting click
 */
async function trackJobPostingClick(postingId, transaction) {
    await JobPostingModel.increment('clicks', { where: { id: postingId }, transaction });
}
/**
 * Track job posting application
 */
async function trackJobPostingApplication(postingId, transaction) {
    await JobPostingModel.increment('applications', { where: { id: postingId }, transaction });
}
/**
 * Get active job postings
 */
async function getActiveJobPostings() {
    return JobPostingModel.findAll({
        where: { status: JobPostingStatus.ACTIVE },
        order: [['publishedAt', 'DESC']],
    });
}
// ============================================================================
// CAREER SITE FUNCTIONS
// ============================================================================
/**
 * Create career site page
 */
async function createCareerSitePage(pageData, transaction) {
    const validated = exports.CareerSitePageSchema.parse(pageData);
    return CareerSitePageModel.create(validated, { transaction });
}
/**
 * Update career site page
 */
async function updateCareerSitePage(pageId, updates, transaction) {
    const page = await CareerSitePageModel.findByPk(pageId, { transaction });
    if (!page) {
        throw new common_1.NotFoundException(`Career site page ${pageId} not found`);
    }
    await page.update(updates, { transaction });
    return page;
}
/**
 * Publish career site page
 */
async function publishCareerSitePage(pageId, transaction) {
    await CareerSitePageModel.update({ isPublished: true, publishedAt: new Date() }, { where: { id: pageId }, transaction });
}
/**
 * Get career site page by slug
 */
async function getCareerSitePageBySlug(slug) {
    return CareerSitePageModel.findOne({ where: { slug, isPublished: true } });
}
/**
 * Get all published career site pages
 */
async function getPublishedCareerSitePages() {
    return CareerSitePageModel.findAll({
        where: { isPublished: true },
        order: [['order', 'ASC']],
    });
}
// ============================================================================
// RECRUITMENT CAMPAIGN FUNCTIONS
// ============================================================================
/**
 * Create recruitment campaign
 */
async function createRecruitmentCampaign(campaignData, transaction) {
    const validated = exports.RecruitmentCampaignSchema.parse(campaignData);
    return RecruitmentCampaignModel.create(validated, { transaction });
}
/**
 * Launch campaign
 */
async function launchCampaign(campaignId, transaction) {
    await RecruitmentCampaignModel.update({ status: CampaignStatus.ACTIVE }, { where: { id: campaignId }, transaction });
}
/**
 * Pause campaign
 */
async function pauseCampaign(campaignId, transaction) {
    await RecruitmentCampaignModel.update({ status: CampaignStatus.PAUSED }, { where: { id: campaignId }, transaction });
}
/**
 * Track campaign metrics
 */
async function trackCampaignMetrics(campaignId, metrics, transaction) {
    const updateData = {};
    if (metrics.impressions)
        updateData.impressions = metrics.impressions;
    if (metrics.clicks)
        updateData.clicks = metrics.clicks;
    if (metrics.conversions)
        updateData.conversions = metrics.conversions;
    if (metrics.spent)
        updateData.spent = metrics.spent;
    await RecruitmentCampaignModel.update(updateData, { where: { id: campaignId }, transaction });
}
/**
 * Get campaign ROI
 */
async function getCampaignROI(campaignId) {
    const campaign = await RecruitmentCampaignModel.findByPk(campaignId);
    if (!campaign || !campaign.spent || campaign.spent === 0) {
        return null;
    }
    return campaign.conversions / campaign.spent;
}
// ============================================================================
// EMPLOYEE REFERRAL FUNCTIONS
// ============================================================================
/**
 * Submit employee referral
 */
async function submitEmployeeReferral(referralData, transaction) {
    const validated = exports.EmployeeReferralSchema.parse(referralData);
    return EmployeeReferralModel.create(validated, { transaction });
}
/**
 * Update referral status
 */
async function updateReferralStatus(referralId, newStatus, transaction) {
    const updateData = { status: newStatus };
    if (newStatus === ReferralStatus.CONTACTED) {
        updateData.contactedAt = new Date();
    }
    else if (newStatus === ReferralStatus.HIRED) {
        updateData.hiredAt = new Date();
        updateData.rewardStatus = ReferralRewardStatus.ELIGIBLE;
    }
    await EmployeeReferralModel.update(updateData, { where: { id: referralId }, transaction });
}
/**
 * Approve referral reward
 */
async function approveReferralReward(referralId, rewardAmount, transaction) {
    await EmployeeReferralModel.update({ rewardStatus: ReferralRewardStatus.APPROVED, rewardAmount }, { where: { id: referralId }, transaction });
}
/**
 * Pay referral reward
 */
async function payReferralReward(referralId, transaction) {
    await EmployeeReferralModel.update({ rewardStatus: ReferralRewardStatus.PAID, rewardPaidAt: new Date() }, { where: { id: referralId }, transaction });
}
/**
 * Get referrals by employee
 */
async function getReferralsByEmployee(employeeId) {
    return EmployeeReferralModel.findAll({
        where: { referrerId: employeeId },
        order: [['submittedAt', 'DESC']],
    });
}
/**
 * Calculate referral program metrics
 */
async function calculateReferralProgramMetrics(startDate, endDate) {
    const referrals = await EmployeeReferralModel.findAll({
        where: {
            submittedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const hiredReferrals = referrals.filter((r) => r.status === ReferralStatus.HIRED);
    const totalRewardsPaid = referrals
        .filter((r) => r.rewardStatus === ReferralRewardStatus.PAID)
        .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);
    return {
        totalReferrals: referrals.length,
        hiredReferrals: hiredReferrals.length,
        totalRewardsPaid,
        conversionRate: referrals.length > 0 ? (hiredReferrals.length / referrals.length) * 100 : 0,
    };
}
// ============================================================================
// CAMPUS RECRUITMENT FUNCTIONS
// ============================================================================
/**
 * Create campus recruitment event
 */
async function createCampusRecruitmentEvent(eventData, transaction) {
    const validated = exports.CampusRecruitmentEventSchema.parse(eventData);
    return CampusRecruitmentEventModel.create(validated, { transaction });
}
/**
 * Update event stage
 */
async function updateCampusEventStage(eventId, newStage, transaction) {
    await CampusRecruitmentEventModel.update({ stage: newStage }, { where: { id: eventId }, transaction });
}
/**
 * Update event metrics
 */
async function updateCampusEventMetrics(eventId, metrics, transaction) {
    await CampusRecruitmentEventModel.update(metrics, { where: { id: eventId }, transaction });
}
/**
 * Get upcoming campus events
 */
async function getUpcomingCampusEvents(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return CampusRecruitmentEventModel.findAll({
        where: {
            eventDate: { [sequelize_1.Op.between]: [new Date(), futureDate] },
        },
        order: [['eventDate', 'ASC']],
    });
}
/**
 * Calculate campus recruitment ROI
 */
async function calculateCampusRecruitmentROI(eventId) {
    const event = await CampusRecruitmentEventModel.findByPk(eventId);
    if (!event || !event.budget || event.budget === 0 || event.hires === 0) {
        return null;
    }
    return event.budget / event.hires; // Cost per hire
}
// ============================================================================
// AGENCY MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Add recruiting agency
 */
async function addRecruitingAgency(agencyData, transaction) {
    const validated = exports.RecruitingAgencySchema.parse(agencyData);
    return RecruitingAgencyModel.create(validated, { transaction });
}
/**
 * Update agency status
 */
async function updateAgencyStatus(agencyId, newStatus, transaction) {
    await RecruitingAgencyModel.update({ status: newStatus }, { where: { id: agencyId }, transaction });
}
/**
 * Rate agency performance
 */
async function rateAgencyPerformance(agencyId, rating, transaction) {
    if (rating < 0 || rating > 5) {
        throw new common_1.BadRequestException('Rating must be between 0 and 5');
    }
    await RecruitingAgencyModel.update({ performanceRating: rating }, { where: { id: agencyId }, transaction });
}
/**
 * Submit agency candidate
 */
async function submitAgencyCandidate(submissionData, transaction) {
    return AgencySubmissionModel.create(submissionData, { transaction });
}
/**
 * Get agency submissions
 */
async function getAgencySubmissions(agencyId, status) {
    const where = { agencyId };
    if (status) {
        where.status = status;
    }
    return AgencySubmissionModel.findAll({
        where,
        order: [['submittedAt', 'DESC']],
    });
}
/**
 * Calculate agency performance metrics
 */
async function calculateAgencyPerformanceMetrics(agencyId, startDate, endDate) {
    const submissions = await AgencySubmissionModel.findAll({
        where: {
            agencyId,
            submittedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const interviews = submissions.filter((s) => s.status === 'interview' || s.status === 'hired').length;
    const hires = submissions.filter((s) => s.status === 'hired').length;
    return {
        submissions: submissions.length,
        interviews,
        hires,
        conversionRate: submissions.length > 0 ? (hires / submissions.length) * 100 : 0,
    };
}
// ============================================================================
// DIVERSITY RECRUITMENT FUNCTIONS
// ============================================================================
/**
 * Create diversity initiative
 */
async function createDiversityInitiative(initiativeData, transaction) {
    const validated = exports.DiversityInitiativeSchema.parse(initiativeData);
    return DiversityInitiativeModel.create(validated, { transaction });
}
/**
 * Update initiative metrics
 */
async function updateDiversityInitiativeMetrics(initiativeId, metrics, transaction) {
    await DiversityInitiativeModel.update({ metrics }, { where: { id: initiativeId }, transaction });
}
/**
 * Get active diversity initiatives
 */
async function getActiveDiversityInitiatives() {
    return DiversityInitiativeModel.findAll({
        where: { isActive: true },
        order: [['startDate', 'DESC']],
    });
}
// ============================================================================
// COMPLIANCE FUNCTIONS
// ============================================================================
/**
 * Generate EEO report
 */
async function generateEEOReport(reportData, transaction) {
    return EEOReportModel.create(reportData, { transaction });
}
/**
 * Get EEO reports by year
 */
async function getEEOReportsByYear(year) {
    return EEOReportModel.findAll({
        where: { reportYear: year },
        order: [['generatedAt', 'DESC']],
    });
}
// ============================================================================
// CANDIDATE ENGAGEMENT FUNCTIONS
// ============================================================================
/**
 * Track candidate engagement
 */
async function trackCandidateEngagement(engagementData, transaction) {
    return CandidateEngagementModel.create(engagementData, { transaction });
}
/**
 * Get candidate engagement history
 */
async function getCandidateEngagementHistory(candidateId) {
    return CandidateEngagementModel.findAll({
        where: { candidateId },
        order: [['sentAt', 'DESC']],
    });
}
/**
 * Calculate engagement rate
 */
async function calculateEngagementRate(candidateId) {
    const engagements = await getCandidateEngagementHistory(candidateId);
    const sent = engagements.filter((e) => e.sentAt).length;
    const opened = engagements.filter((e) => e.openedAt).length;
    const clicked = engagements.filter((e) => e.clickedAt).length;
    const responded = engagements.filter((e) => e.respondedAt).length;
    return {
        openRate: sent > 0 ? (opened / sent) * 100 : 0,
        clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
        responseRate: sent > 0 ? (responded / sent) * 100 : 0,
    };
}
// ============================================================================
// SOURCING CHANNEL FUNCTIONS
// ============================================================================
/**
 * Add sourcing channel
 */
async function addSourcingChannel(channelData, transaction) {
    return SourcingChannelModel.create(channelData, { transaction });
}
/**
 * Track sourcing channel performance
 */
async function trackSourcingChannelPerformance(channelId, applications, hires, transaction) {
    await SourcingChannelModel.increment({ applications, hires }, { where: { id: channelId }, transaction });
}
/**
 * Calculate sourcing channel ROI
 */
async function calculateSourcingChannelROI(channelId) {
    const channel = await SourcingChannelModel.findByPk(channelId);
    if (!channel || !channel.cost || channel.cost === 0 || channel.hires === 0) {
        return null;
    }
    return channel.cost / channel.hires; // Cost per hire
}
/**
 * Get top performing sourcing channels
 */
async function getTopPerformingSourcingChannels(limit = 10) {
    return SourcingChannelModel.findAll({
        where: { isActive: true },
        order: [['hires', 'DESC']],
        limit,
    });
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculate cost per hire by source
 */
function calculateCostPerHire(totalCost, totalHires) {
    return totalHires > 0 ? totalCost / totalHires : 0;
}
/**
 * Calculate quality of hire
 */
function calculateQualityOfHire(performanceRating, retentionRate, productivityScore) {
    return (performanceRating * 0.4 + retentionRate * 0.3 + productivityScore * 0.3);
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let TalentAcquisitionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TalentAcquisitionService = _classThis = class {
        async createTalentPool(data) {
            return createTalentPool(data);
        }
        async createJobPosting(data) {
            return createJobPosting(data);
        }
        async submitReferral(data) {
            return submitEmployeeReferral(data);
        }
        async createCampaign(data) {
            return createRecruitmentCampaign(data);
        }
        async createCampusEvent(data) {
            return createCampusRecruitmentEvent(data);
        }
    };
    __setFunctionName(_classThis, "TalentAcquisitionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TalentAcquisitionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TalentAcquisitionService = _classThis;
})();
exports.TalentAcquisitionService = TalentAcquisitionService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let TalentAcquisitionController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Talent Acquisition'), (0, common_1.Controller)('talent-acquisition'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createTalentPool_decorators;
    let _createJobPosting_decorators;
    let _submitReferral_decorators;
    let _getActivePostings_decorators;
    var TalentAcquisitionController = _classThis = class {
        constructor(talentService) {
            this.talentService = (__runInitializers(this, _instanceExtraInitializers), talentService);
        }
        async createTalentPool(data) {
            return this.talentService.createTalentPool(data);
        }
        async createJobPosting(data) {
            return this.talentService.createJobPosting(data);
        }
        async submitReferral(data) {
            return this.talentService.submitReferral(data);
        }
        async getActivePostings() {
            return getActiveJobPostings();
        }
    };
    __setFunctionName(_classThis, "TalentAcquisitionController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createTalentPool_decorators = [(0, common_1.Post)('talent-pools'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create talent pool' })];
        _createJobPosting_decorators = [(0, common_1.Post)('job-postings'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create job posting' })];
        _submitReferral_decorators = [(0, common_1.Post)('referrals'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Submit employee referral' })];
        _getActivePostings_decorators = [(0, common_1.Get)('job-postings/active'), (0, swagger_1.ApiOperation)({ summary: 'Get active job postings' })];
        __esDecorate(_classThis, null, _createTalentPool_decorators, { kind: "method", name: "createTalentPool", static: false, private: false, access: { has: obj => "createTalentPool" in obj, get: obj => obj.createTalentPool }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createJobPosting_decorators, { kind: "method", name: "createJobPosting", static: false, private: false, access: { has: obj => "createJobPosting" in obj, get: obj => obj.createJobPosting }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitReferral_decorators, { kind: "method", name: "submitReferral", static: false, private: false, access: { has: obj => "submitReferral" in obj, get: obj => obj.submitReferral }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivePostings_decorators, { kind: "method", name: "getActivePostings", static: false, private: false, access: { has: obj => "getActivePostings" in obj, get: obj => obj.getActivePostings }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TalentAcquisitionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TalentAcquisitionController = _classThis;
})();
exports.TalentAcquisitionController = TalentAcquisitionController;
//# sourceMappingURL=talent-acquisition-kit.js.map