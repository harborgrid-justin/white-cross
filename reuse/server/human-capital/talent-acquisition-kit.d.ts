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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Talent pool type
 */
export declare enum TalentPoolType {
    ACTIVE = "active",
    PASSIVE = "passive",
    SILVER_MEDALISTS = "silver_medalists",
    ALUMNI = "alumni",
    REFERRALS = "referrals",
    CAMPUS = "campus",
    DIVERSITY = "diversity",
    SPECIALIST = "specialist",
    EXECUTIVE = "executive"
}
/**
 * Job posting status
 */
export declare enum JobPostingStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    PAUSED = "paused",
    EXPIRED = "expired",
    CLOSED = "closed"
}
/**
 * Job board
 */
export declare enum JobBoard {
    LINKEDIN = "linkedin",
    INDEED = "indeed",
    GLASSDOOR = "glassdoor",
    MONSTER = "monster",
    ZIPRECRUITER = "ziprecruiter",
    CAREERBUILDER = "careerbuilder",
    HEALTHCAREJOBSITE = "healthcarejobsite",
    NURSE_COM = "nurse_com",
    COMPANY_WEBSITE = "company_website",
    FACEBOOK = "facebook",
    TWITTER = "twitter",
    INSTAGRAM = "instagram"
}
/**
 * Campaign type
 */
export declare enum CampaignType {
    EMAIL = "email",
    SMS = "sms",
    SOCIAL_MEDIA = "social_media",
    DISPLAY_AD = "display_ad",
    JOB_ALERT = "job_alert",
    EVENT = "event",
    WEBINAR = "webinar"
}
/**
 * Campaign status
 */
export declare enum CampaignStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Referral status
 */
export declare enum ReferralStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    CONTACTED = "contacted",
    INTERVIEWING = "interviewing",
    HIRED = "hired",
    NOT_SELECTED = "not_selected",
    WITHDRAWN = "withdrawn"
}
/**
 * Referral reward status
 */
export declare enum ReferralRewardStatus {
    PENDING = "pending",
    ELIGIBLE = "eligible",
    APPROVED = "approved",
    PAID = "paid",
    DENIED = "denied"
}
/**
 * Campus recruitment stage
 */
export declare enum CampusRecruitmentStage {
    PLANNING = "planning",
    REGISTRATION = "registration",
    PRE_EVENT = "pre_event",
    EVENT_DAY = "event_day",
    POST_EVENT = "post_event",
    FOLLOW_UP = "follow_up",
    COMPLETED = "completed"
}
/**
 * Agency status
 */
export declare enum AgencyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    TERMINATED = "terminated"
}
/**
 * Diversity category
 */
export declare enum DiversityCategory {
    GENDER = "gender",
    ETHNICITY = "ethnicity",
    VETERAN = "veteran",
    DISABILITY = "disability",
    LGBTQ = "lgbtq",
    AGE = "age"
}
/**
 * EEO category
 */
export declare enum EEOCategory {
    EXECUTIVES_SENIOR_OFFICIALS = "1.1",
    FIRST_MID_OFFICIALS_MANAGERS = "1.2",
    PROFESSIONALS = "2",
    TECHNICIANS = "3",
    SALES_WORKERS = "4",
    ADMINISTRATIVE_SUPPORT = "5",
    CRAFT_WORKERS = "6",
    OPERATIVES = "7",
    LABORERS_HELPERS = "8",
    SERVICE_WORKERS = "9"
}
/**
 * Talent pool interface
 */
export interface TalentPool {
    id: string;
    name: string;
    description?: string;
    type: TalentPoolType;
    criteria?: Record<string, any>;
    ownerId: string;
    isActive: boolean;
    tags?: string[];
    memberCount?: number;
    metadata?: Record<string, any>;
}
/**
 * Job posting interface
 */
export interface JobPosting {
    id: string;
    requisitionId: string;
    status: JobPostingStatus;
    title: string;
    description: string;
    shortDescription?: string;
    boards: JobBoard[];
    publishedAt?: Date;
    expiresAt?: Date;
    views: number;
    applications: number;
    clicks: number;
    seoKeywords?: string[];
    metadata?: Record<string, any>;
}
/**
 * Career site page interface
 */
export interface CareerSitePage {
    id: string;
    slug: string;
    title: string;
    content: string;
    metaDescription?: string;
    metaKeywords?: string[];
    isPublished: boolean;
    publishedAt?: Date;
    order: number;
}
/**
 * Recruitment campaign interface
 */
export interface RecruitmentCampaign {
    id: string;
    name: string;
    description?: string;
    type: CampaignType;
    status: CampaignStatus;
    targetAudience?: string;
    talentPoolIds?: string[];
    requisitionIds?: string[];
    startDate: Date;
    endDate?: Date;
    budget?: number;
    spent?: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    createdBy: string;
    metadata?: Record<string, any>;
}
/**
 * Employee referral interface
 */
export interface EmployeeReferral {
    id: string;
    referrerId: string;
    candidateEmail: string;
    candidateName: string;
    candidatePhone?: string;
    candidateResume?: string;
    requisitionId: string;
    status: ReferralStatus;
    submittedAt: Date;
    contactedAt?: Date;
    hiredAt?: Date;
    rewardStatus: ReferralRewardStatus;
    rewardAmount?: number;
    rewardPaidAt?: Date;
    notes?: string;
}
/**
 * Campus recruitment event interface
 */
export interface CampusRecruitmentEvent {
    id: string;
    universityId: string;
    universityName: string;
    eventType: string;
    eventName: string;
    eventDate: Date;
    location?: string;
    stage: CampusRecruitmentStage;
    recruiters: string[];
    targetPositions: string[];
    budget?: number;
    attendees?: number;
    resumesCollected?: number;
    interviewsScheduled?: number;
    offersExtended?: number;
    hires?: number;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Recruiting agency interface
 */
export interface RecruitingAgency {
    id: string;
    name: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    status: AgencyStatus;
    specializations: string[];
    feeStructure?: string;
    feePercentage?: number;
    contractStartDate: Date;
    contractEndDate?: Date;
    performanceRating?: number;
    placements?: number;
    activePlacements?: number;
    metadata?: Record<string, any>;
}
/**
 * Agency submission interface
 */
export interface AgencySubmission {
    id: string;
    agencyId: string;
    requisitionId: string;
    candidateEmail: string;
    candidateName: string;
    candidateResume: string;
    submittedAt: Date;
    status: string;
    applicationId?: string;
    fee?: number;
    notes?: string;
}
/**
 * Diversity initiative interface
 */
export interface DiversityInitiative {
    id: string;
    name: string;
    description?: string;
    categories: DiversityCategory[];
    goals?: Record<string, any>;
    startDate: Date;
    endDate?: Date;
    ownerId: string;
    partnerOrganizations?: string[];
    budget?: number;
    requisitionIds?: string[];
    metrics?: Record<string, any>;
    isActive: boolean;
}
/**
 * EEO report interface
 */
export interface EEOReport {
    id: string;
    reportYear: number;
    reportType: string;
    facilityId?: string;
    totalEmployees: number;
    jobCategories: Record<EEOCategory, Record<string, number>>;
    newHires: Record<string, number>;
    promotions: Record<string, number>;
    terminations: Record<string, number>;
    generatedAt: Date;
    generatedBy: string;
    metadata?: Record<string, any>;
}
/**
 * Candidate engagement interface
 */
export interface CandidateEngagement {
    id: string;
    candidateId: string;
    engagementType: string;
    channel: string;
    subject?: string;
    content?: string;
    sentAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    respondedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Sourcing channel interface
 */
export interface SourcingChannel {
    id: string;
    name: string;
    type: string;
    description?: string;
    cost?: number;
    costType?: 'fixed' | 'per_hire' | 'per_click' | 'per_application';
    applications: number;
    hires: number;
    qualityScore?: number;
    isActive: boolean;
}
/**
 * Talent pool validation schema
 */
export declare const TalentPoolSchema: any;
/**
 * Job posting validation schema
 */
export declare const JobPostingSchema: any;
/**
 * Career site page validation schema
 */
export declare const CareerSitePageSchema: any;
/**
 * Recruitment campaign validation schema
 */
export declare const RecruitmentCampaignSchema: any;
/**
 * Employee referral validation schema
 */
export declare const EmployeeReferralSchema: any;
/**
 * Campus recruitment event validation schema
 */
export declare const CampusRecruitmentEventSchema: any;
/**
 * Recruiting agency validation schema
 */
export declare const RecruitingAgencySchema: any;
/**
 * Diversity initiative validation schema
 */
export declare const DiversityInitiativeSchema: any;
/**
 * Talent Pool Model
 */
export declare class TalentPoolModel extends Model {
    id: string;
    name: string;
    description: string;
    type: TalentPoolType;
    criteria: Record<string, any>;
    ownerId: string;
    isActive: boolean;
    tags: string[];
    memberCount: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Job Posting Model
 */
export declare class JobPostingModel extends Model {
    id: string;
    requisitionId: string;
    status: JobPostingStatus;
    title: string;
    description: string;
    shortDescription: string;
    boards: JobBoard[];
    publishedAt: Date;
    expiresAt: Date;
    views: number;
    applications: number;
    clicks: number;
    seoKeywords: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Career Site Page Model
 */
export declare class CareerSitePageModel extends Model {
    id: string;
    slug: string;
    title: string;
    content: string;
    metaDescription: string;
    metaKeywords: string[];
    isPublished: boolean;
    publishedAt: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Recruitment Campaign Model
 */
export declare class RecruitmentCampaignModel extends Model {
    id: string;
    name: string;
    description: string;
    type: CampaignType;
    status: CampaignStatus;
    targetAudience: string;
    talentPoolIds: string[];
    requisitionIds: string[];
    startDate: Date;
    endDate: Date;
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    createdBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Employee Referral Model
 */
export declare class EmployeeReferralModel extends Model {
    id: string;
    referrerId: string;
    candidateEmail: string;
    candidateName: string;
    candidatePhone: string;
    candidateResume: string;
    requisitionId: string;
    status: ReferralStatus;
    submittedAt: Date;
    contactedAt: Date;
    hiredAt: Date;
    rewardStatus: ReferralRewardStatus;
    rewardAmount: number;
    rewardPaidAt: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Campus Recruitment Event Model
 */
export declare class CampusRecruitmentEventModel extends Model {
    id: string;
    universityId: string;
    universityName: string;
    eventType: string;
    eventName: string;
    eventDate: Date;
    location: string;
    stage: CampusRecruitmentStage;
    recruiters: string[];
    targetPositions: string[];
    budget: number;
    attendees: number;
    resumesCollected: number;
    interviewsScheduled: number;
    offersExtended: number;
    hires: number;
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Recruiting Agency Model
 */
export declare class RecruitingAgencyModel extends Model {
    id: string;
    name: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    status: AgencyStatus;
    specializations: string[];
    feeStructure: string;
    feePercentage: number;
    contractStartDate: Date;
    contractEndDate: Date;
    performanceRating: number;
    placements: number;
    activePlacements: number;
    metadata: Record<string, any>;
    submissions: AgencySubmissionModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Agency Submission Model
 */
export declare class AgencySubmissionModel extends Model {
    id: string;
    agencyId: string;
    requisitionId: string;
    candidateEmail: string;
    candidateName: string;
    candidateResume: string;
    submittedAt: Date;
    status: string;
    applicationId: string;
    fee: number;
    notes: string;
    agency: RecruitingAgencyModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Diversity Initiative Model
 */
export declare class DiversityInitiativeModel extends Model {
    id: string;
    name: string;
    description: string;
    categories: DiversityCategory[];
    goals: Record<string, any>;
    startDate: Date;
    endDate: Date;
    ownerId: string;
    partnerOrganizations: string[];
    budget: number;
    requisitionIds: string[];
    metrics: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * EEO Report Model
 */
export declare class EEOReportModel extends Model {
    id: string;
    reportYear: number;
    reportType: string;
    facilityId: string;
    totalEmployees: number;
    jobCategories: Record<string, any>;
    newHires: Record<string, number>;
    promotions: Record<string, number>;
    terminations: Record<string, number>;
    generatedAt: Date;
    generatedBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Candidate Engagement Model
 */
export declare class CandidateEngagementModel extends Model {
    id: string;
    candidateId: string;
    engagementType: string;
    channel: string;
    subject: string;
    content: string;
    sentAt: Date;
    openedAt: Date;
    clickedAt: Date;
    respondedAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Sourcing Channel Model
 */
export declare class SourcingChannelModel extends Model {
    id: string;
    name: string;
    type: string;
    description: string;
    cost: number;
    costType: string;
    applications: number;
    hires: number;
    qualityScore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create talent pool
 */
export declare function createTalentPool(poolData: Partial<TalentPool>, transaction?: Transaction): Promise<TalentPoolModel>;
/**
 * Update talent pool
 */
export declare function updateTalentPool(poolId: string, updates: Partial<TalentPool>, transaction?: Transaction): Promise<TalentPoolModel>;
/**
 * Get talent pool by ID
 */
export declare function getTalentPoolById(poolId: string): Promise<TalentPoolModel | null>;
/**
 * Get all talent pools
 */
export declare function getAllTalentPools(activeOnly?: boolean): Promise<TalentPoolModel[]>;
/**
 * Delete talent pool
 */
export declare function deleteTalentPool(poolId: string, transaction?: Transaction): Promise<void>;
/**
 * Create job posting
 */
export declare function createJobPosting(postingData: Partial<JobPosting>, transaction?: Transaction): Promise<JobPostingModel>;
/**
 * Publish job posting
 */
export declare function publishJobPosting(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Pause job posting
 */
export declare function pauseJobPosting(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Close job posting
 */
export declare function closeJobPosting(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Track job posting view
 */
export declare function trackJobPostingView(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Track job posting click
 */
export declare function trackJobPostingClick(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Track job posting application
 */
export declare function trackJobPostingApplication(postingId: string, transaction?: Transaction): Promise<void>;
/**
 * Get active job postings
 */
export declare function getActiveJobPostings(): Promise<JobPostingModel[]>;
/**
 * Create career site page
 */
export declare function createCareerSitePage(pageData: Partial<CareerSitePage>, transaction?: Transaction): Promise<CareerSitePageModel>;
/**
 * Update career site page
 */
export declare function updateCareerSitePage(pageId: string, updates: Partial<CareerSitePage>, transaction?: Transaction): Promise<CareerSitePageModel>;
/**
 * Publish career site page
 */
export declare function publishCareerSitePage(pageId: string, transaction?: Transaction): Promise<void>;
/**
 * Get career site page by slug
 */
export declare function getCareerSitePageBySlug(slug: string): Promise<CareerSitePageModel | null>;
/**
 * Get all published career site pages
 */
export declare function getPublishedCareerSitePages(): Promise<CareerSitePageModel[]>;
/**
 * Create recruitment campaign
 */
export declare function createRecruitmentCampaign(campaignData: Partial<RecruitmentCampaign>, transaction?: Transaction): Promise<RecruitmentCampaignModel>;
/**
 * Launch campaign
 */
export declare function launchCampaign(campaignId: string, transaction?: Transaction): Promise<void>;
/**
 * Pause campaign
 */
export declare function pauseCampaign(campaignId: string, transaction?: Transaction): Promise<void>;
/**
 * Track campaign metrics
 */
export declare function trackCampaignMetrics(campaignId: string, metrics: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spent?: number;
}, transaction?: Transaction): Promise<void>;
/**
 * Get campaign ROI
 */
export declare function getCampaignROI(campaignId: string): Promise<number | null>;
/**
 * Submit employee referral
 */
export declare function submitEmployeeReferral(referralData: Partial<EmployeeReferral>, transaction?: Transaction): Promise<EmployeeReferralModel>;
/**
 * Update referral status
 */
export declare function updateReferralStatus(referralId: string, newStatus: ReferralStatus, transaction?: Transaction): Promise<void>;
/**
 * Approve referral reward
 */
export declare function approveReferralReward(referralId: string, rewardAmount: number, transaction?: Transaction): Promise<void>;
/**
 * Pay referral reward
 */
export declare function payReferralReward(referralId: string, transaction?: Transaction): Promise<void>;
/**
 * Get referrals by employee
 */
export declare function getReferralsByEmployee(employeeId: string): Promise<EmployeeReferralModel[]>;
/**
 * Calculate referral program metrics
 */
export declare function calculateReferralProgramMetrics(startDate: Date, endDate: Date): Promise<{
    totalReferrals: number;
    hiredReferrals: number;
    totalRewardsPaid: number;
    conversionRate: number;
}>;
/**
 * Create campus recruitment event
 */
export declare function createCampusRecruitmentEvent(eventData: Partial<CampusRecruitmentEvent>, transaction?: Transaction): Promise<CampusRecruitmentEventModel>;
/**
 * Update event stage
 */
export declare function updateCampusEventStage(eventId: string, newStage: CampusRecruitmentStage, transaction?: Transaction): Promise<void>;
/**
 * Update event metrics
 */
export declare function updateCampusEventMetrics(eventId: string, metrics: {
    attendees?: number;
    resumesCollected?: number;
    interviewsScheduled?: number;
    offersExtended?: number;
    hires?: number;
}, transaction?: Transaction): Promise<void>;
/**
 * Get upcoming campus events
 */
export declare function getUpcomingCampusEvents(days?: number): Promise<CampusRecruitmentEventModel[]>;
/**
 * Calculate campus recruitment ROI
 */
export declare function calculateCampusRecruitmentROI(eventId: string): Promise<number | null>;
/**
 * Add recruiting agency
 */
export declare function addRecruitingAgency(agencyData: Partial<RecruitingAgency>, transaction?: Transaction): Promise<RecruitingAgencyModel>;
/**
 * Update agency status
 */
export declare function updateAgencyStatus(agencyId: string, newStatus: AgencyStatus, transaction?: Transaction): Promise<void>;
/**
 * Rate agency performance
 */
export declare function rateAgencyPerformance(agencyId: string, rating: number, transaction?: Transaction): Promise<void>;
/**
 * Submit agency candidate
 */
export declare function submitAgencyCandidate(submissionData: Partial<AgencySubmission>, transaction?: Transaction): Promise<AgencySubmissionModel>;
/**
 * Get agency submissions
 */
export declare function getAgencySubmissions(agencyId: string, status?: string): Promise<AgencySubmissionModel[]>;
/**
 * Calculate agency performance metrics
 */
export declare function calculateAgencyPerformanceMetrics(agencyId: string, startDate: Date, endDate: Date): Promise<{
    submissions: number;
    interviews: number;
    hires: number;
    conversionRate: number;
}>;
/**
 * Create diversity initiative
 */
export declare function createDiversityInitiative(initiativeData: Partial<DiversityInitiative>, transaction?: Transaction): Promise<DiversityInitiativeModel>;
/**
 * Update initiative metrics
 */
export declare function updateDiversityInitiativeMetrics(initiativeId: string, metrics: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * Get active diversity initiatives
 */
export declare function getActiveDiversityInitiatives(): Promise<DiversityInitiativeModel[]>;
/**
 * Generate EEO report
 */
export declare function generateEEOReport(reportData: Partial<EEOReport>, transaction?: Transaction): Promise<EEOReportModel>;
/**
 * Get EEO reports by year
 */
export declare function getEEOReportsByYear(year: number): Promise<EEOReportModel[]>;
/**
 * Track candidate engagement
 */
export declare function trackCandidateEngagement(engagementData: Partial<CandidateEngagement>, transaction?: Transaction): Promise<CandidateEngagementModel>;
/**
 * Get candidate engagement history
 */
export declare function getCandidateEngagementHistory(candidateId: string): Promise<CandidateEngagementModel[]>;
/**
 * Calculate engagement rate
 */
export declare function calculateEngagementRate(candidateId: string): Promise<{
    openRate: number;
    clickRate: number;
    responseRate: number;
}>;
/**
 * Add sourcing channel
 */
export declare function addSourcingChannel(channelData: Partial<SourcingChannel>, transaction?: Transaction): Promise<SourcingChannelModel>;
/**
 * Track sourcing channel performance
 */
export declare function trackSourcingChannelPerformance(channelId: string, applications: number, hires: number, transaction?: Transaction): Promise<void>;
/**
 * Calculate sourcing channel ROI
 */
export declare function calculateSourcingChannelROI(channelId: string): Promise<number | null>;
/**
 * Get top performing sourcing channels
 */
export declare function getTopPerformingSourcingChannels(limit?: number): Promise<SourcingChannelModel[]>;
/**
 * Calculate cost per hire by source
 */
export declare function calculateCostPerHire(totalCost: number, totalHires: number): number;
/**
 * Calculate quality of hire
 */
export declare function calculateQualityOfHire(performanceRating: number, retentionRate: number, productivityScore: number): number;
export declare class TalentAcquisitionService {
    createTalentPool(data: Partial<TalentPool>): Promise<TalentPoolModel>;
    createJobPosting(data: Partial<JobPosting>): Promise<JobPostingModel>;
    submitReferral(data: Partial<EmployeeReferral>): Promise<EmployeeReferralModel>;
    createCampaign(data: Partial<RecruitmentCampaign>): Promise<RecruitmentCampaignModel>;
    createCampusEvent(data: Partial<CampusRecruitmentEvent>): Promise<CampusRecruitmentEventModel>;
}
export declare class TalentAcquisitionController {
    private readonly talentService;
    constructor(talentService: TalentAcquisitionService);
    createTalentPool(data: Partial<TalentPool>): Promise<TalentPoolModel>;
    createJobPosting(data: Partial<JobPosting>): Promise<JobPostingModel>;
    submitReferral(data: Partial<EmployeeReferral>): Promise<EmployeeReferralModel>;
    getActivePostings(): Promise<JobPostingModel[]>;
}
export { TalentPoolModel, JobPostingModel, CareerSitePageModel, RecruitmentCampaignModel, EmployeeReferralModel, CampusRecruitmentEventModel, RecruitingAgencyModel, AgencySubmissionModel, DiversityInitiativeModel, EEOReportModel, CandidateEngagementModel, SourcingChannelModel, TalentAcquisitionService, TalentAcquisitionController, };
//# sourceMappingURL=talent-acquisition-kit.d.ts.map