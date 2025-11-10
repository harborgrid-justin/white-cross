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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Job requisition status
 */
export declare enum RequisitionStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    OPEN = "open",
    ON_HOLD = "on_hold",
    FILLED = "filled",
    CANCELLED = "cancelled",
    CLOSED = "closed"
}
/**
 * Requisition priority
 */
export declare enum RequisitionPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Application status
 */
export declare enum ApplicationStatus {
    NEW = "new",
    SCREENING = "screening",
    PHONE_SCREEN = "phone_screen",
    INTERVIEW = "interview",
    ASSESSMENT = "assessment",
    REFERENCE_CHECK = "reference_check",
    BACKGROUND_CHECK = "background_check",
    OFFER = "offer",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_DECLINED = "offer_declined",
    HIRED = "hired",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}
/**
 * Candidate source
 */
export declare enum CandidateSource {
    JOB_BOARD = "job_board",
    COMPANY_WEBSITE = "company_website",
    EMPLOYEE_REFERRAL = "employee_referral",
    RECRUITER = "recruiter",
    SOCIAL_MEDIA = "social_media",
    AGENCY = "agency",
    CAMPUS = "campus",
    CAREER_FAIR = "career_fair",
    DIRECT_APPLICATION = "direct_application",
    INTERNAL = "internal",
    OTHER = "other"
}
/**
 * Interview type
 */
export declare enum InterviewType {
    PHONE_SCREEN = "phone_screen",
    VIDEO = "video",
    IN_PERSON = "in_person",
    PANEL = "panel",
    TECHNICAL = "technical",
    BEHAVIORAL = "behavioral",
    CASE_STUDY = "case_study",
    PRESENTATION = "presentation",
    GROUP = "group"
}
/**
 * Interview status
 */
export declare enum InterviewStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULED = "rescheduled",
    NO_SHOW = "no_show"
}
/**
 * Interview rating
 */
export declare enum InterviewRating {
    STRONG_HIRE = "strong_hire",
    HIRE = "hire",
    MAYBE = "maybe",
    NO_HIRE = "no_hire",
    STRONG_NO_HIRE = "strong_no_hire"
}
/**
 * Offer status
 */
export declare enum OfferStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    SENT = "sent",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    EXPIRED = "expired",
    WITHDRAWN = "withdrawn"
}
/**
 * Background check status
 */
export declare enum BackgroundCheckStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    CLEAR = "clear",
    NEEDS_REVIEW = "needs_review",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Reference check status
 */
export declare enum ReferenceCheckStatus {
    PENDING = "pending",
    CONTACTED = "contacted",
    COMPLETED = "completed",
    UNREACHABLE = "unreachable",
    DECLINED = "declined"
}
/**
 * Job type
 */
export declare enum JobType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    TEMPORARY = "temporary",
    INTERN = "intern",
    PER_DIEM = "per_diem"
}
/**
 * Experience level
 */
export declare enum ExperienceLevel {
    ENTRY_LEVEL = "entry_level",
    JUNIOR = "junior",
    MID_LEVEL = "mid_level",
    SENIOR = "senior",
    LEAD = "lead",
    PRINCIPAL = "principal",
    EXECUTIVE = "executive"
}
/**
 * Job requisition interface
 */
export interface JobRequisition {
    id: string;
    requisitionNumber: string;
    title: string;
    departmentId: string;
    positionId?: string;
    hiringManagerId: string;
    recruiterId?: string;
    status: RequisitionStatus;
    priority: RequisitionPriority;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    numberOfPositions: number;
    positionsFilled: number;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
    location: string;
    remoteAllowed: boolean;
    description: string;
    requirements: string[];
    responsibilities: string[];
    qualifications: string[];
    benefits?: string[];
    targetStartDate?: Date;
    applicationDeadline?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    openedAt?: Date;
    closedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Candidate interface
 */
export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    coverLetterUrl?: string;
    currentTitle?: string;
    currentCompany?: string;
    yearsExperience?: number;
    skills?: string[];
    education?: Education[];
    location?: string;
    willingToRelocate?: boolean;
    expectedSalary?: number;
    availableDate?: Date;
    source: CandidateSource;
    sourceDetails?: string;
    referredBy?: string;
    talentPoolIds?: string[];
    tags?: string[];
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Education interface
 */
export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate?: Date;
    endDate?: Date;
    gpa?: number;
    honors?: string;
}
/**
 * Job application interface
 */
export interface JobApplication {
    id: string;
    requisitionId: string;
    candidateId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    currentStage?: string;
    rating?: number;
    notes?: string;
    screeningAnswers?: Record<string, any>;
    assignedTo?: string;
    rejectionReason?: string;
    withdrawalReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Interview interface
 */
export interface Interview {
    id: string;
    applicationId: string;
    requisitionId: string;
    candidateId: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: Date;
    duration: number;
    location?: string;
    meetingLink?: string;
    interviewers: string[];
    organizer: string;
    notes?: string;
    calendarEventId?: string;
    reminderSent?: boolean;
}
/**
 * Interview feedback interface
 */
export interface InterviewFeedback {
    id: string;
    interviewId: string;
    interviewerId: string;
    rating: InterviewRating;
    strengths?: string[];
    weaknesses?: string[];
    technicalSkills?: number;
    communicationSkills?: number;
    cultureFit?: number;
    overallScore?: number;
    recommendation?: string;
    notes?: string;
    submittedAt: Date;
}
/**
 * Job offer interface
 */
export interface JobOffer {
    id: string;
    applicationId: string;
    requisitionId: string;
    candidateId: string;
    status: OfferStatus;
    jobTitle: string;
    department: string;
    salary: number;
    currency: string;
    bonusAmount?: number;
    equityAmount?: number;
    startDate: Date;
    benefits?: string[];
    specialTerms?: string;
    expiryDate: Date;
    sentAt?: Date;
    respondedAt?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    offerLetterUrl?: string;
    metadata?: Record<string, any>;
}
/**
 * Background check interface
 */
export interface BackgroundCheck {
    id: string;
    candidateId: string;
    applicationId: string;
    status: BackgroundCheckStatus;
    provider?: string;
    orderedAt?: Date;
    completedAt?: Date;
    expiryDate?: Date;
    components: string[];
    results?: Record<string, any>;
    notes?: string;
}
/**
 * Reference check interface
 */
export interface ReferenceCheck {
    id: string;
    candidateId: string;
    applicationId: string;
    referenceName: string;
    referenceTitle?: string;
    referenceCompany?: string;
    referenceEmail?: string;
    referencePhone?: string;
    relationship: string;
    status: ReferenceCheckStatus;
    contactedAt?: Date;
    completedAt?: Date;
    rating?: number;
    wouldRehire?: boolean;
    strengths?: string[];
    areasForImprovement?: string[];
    notes?: string;
}
/**
 * Recruitment metrics
 */
export interface RecruitmentMetrics {
    totalRequisitions: number;
    openRequisitions: number;
    filledRequisitions: number;
    totalApplications: number;
    averageTimeToFill: number;
    averageTimeToHire: number;
    offerAcceptanceRate: number;
    sourceEffectiveness: Record<CandidateSource, number>;
    costPerHire: number;
    qualityOfHire: number;
}
/**
 * Resume parse result
 */
export interface ResumeParseResult {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    skills: string[];
    experience: Array<{
        title: string;
        company: string;
        startDate?: string;
        endDate?: string;
        description?: string;
    }>;
    education: Education[];
    certifications?: string[];
    languages?: string[];
    confidence: number;
}
/**
 * Education validation schema
 */
export declare const EducationSchema: any;
/**
 * Job requisition validation schema
 */
export declare const JobRequisitionSchema: any;
/**
 * Candidate validation schema
 */
export declare const CandidateSchema: any;
/**
 * Job application validation schema
 */
export declare const JobApplicationSchema: any;
/**
 * Interview validation schema
 */
export declare const InterviewSchema: any;
/**
 * Interview feedback validation schema
 */
export declare const InterviewFeedbackSchema: any;
/**
 * Job offer validation schema
 */
export declare const JobOfferSchema: any;
/**
 * Job Requisition Model
 */
export declare class JobRequisitionModel extends Model {
    id: string;
    requisitionNumber: string;
    title: string;
    departmentId: string;
    positionId: string;
    hiringManagerId: string;
    recruiterId: string;
    status: RequisitionStatus;
    priority: RequisitionPriority;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    numberOfPositions: number;
    positionsFilled: number;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    location: string;
    remoteAllowed: boolean;
    description: string;
    requirements: string[];
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
    targetStartDate: Date;
    applicationDeadline: Date;
    approvedBy: string;
    approvedAt: Date;
    openedAt: Date;
    closedAt: Date;
    metadata: Record<string, any>;
    applications: JobApplicationModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Candidate Model
 */
export declare class CandidateModel extends Model {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    resumeUrl: string;
    coverLetterUrl: string;
    currentTitle: string;
    currentCompany: string;
    yearsExperience: number;
    skills: string[];
    education: Education[];
    location: string;
    willingToRelocate: boolean;
    expectedSalary: number;
    availableDate: Date;
    source: CandidateSource;
    sourceDetails: string;
    referredBy: string;
    talentPoolIds: string[];
    tags: string[];
    notes: string;
    metadata: Record<string, any>;
    applications: JobApplicationModel[];
    referenceChecks: ReferenceCheckModel[];
    backgroundChecks: BackgroundCheckModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Job Application Model
 */
export declare class JobApplicationModel extends Model {
    id: string;
    requisitionId: string;
    candidateId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    currentStage: string;
    rating: number;
    notes: string;
    screeningAnswers: Record<string, any>;
    assignedTo: string;
    rejectionReason: string;
    withdrawalReason: string;
    metadata: Record<string, any>;
    requisition: JobRequisitionModel;
    candidate: CandidateModel;
    interviews: InterviewModel[];
    offers: JobOfferModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Interview Model
 */
export declare class InterviewModel extends Model {
    id: string;
    applicationId: string;
    requisitionId: string;
    candidateId: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: Date;
    duration: number;
    location: string;
    meetingLink: string;
    interviewers: string[];
    organizer: string;
    notes: string;
    calendarEventId: string;
    reminderSent: boolean;
    application: JobApplicationModel;
    feedback: InterviewFeedbackModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Interview Feedback Model
 */
export declare class InterviewFeedbackModel extends Model {
    id: string;
    interviewId: string;
    interviewerId: string;
    rating: InterviewRating;
    strengths: string[];
    weaknesses: string[];
    technicalSkills: number;
    communicationSkills: number;
    cultureFit: number;
    overallScore: number;
    recommendation: string;
    notes: string;
    submittedAt: Date;
    interview: InterviewModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Job Offer Model
 */
export declare class JobOfferModel extends Model {
    id: string;
    applicationId: string;
    requisitionId: string;
    candidateId: string;
    status: OfferStatus;
    jobTitle: string;
    department: string;
    salary: number;
    currency: string;
    bonusAmount: number;
    equityAmount: number;
    startDate: Date;
    benefits: string[];
    specialTerms: string;
    expiryDate: Date;
    sentAt: Date;
    respondedAt: Date;
    approvedBy: string;
    approvedAt: Date;
    offerLetterUrl: string;
    metadata: Record<string, any>;
    application: JobApplicationModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Background Check Model
 */
export declare class BackgroundCheckModel extends Model {
    id: string;
    candidateId: string;
    applicationId: string;
    status: BackgroundCheckStatus;
    provider: string;
    orderedAt: Date;
    completedAt: Date;
    expiryDate: Date;
    components: string[];
    results: Record<string, any>;
    notes: string;
    candidate: CandidateModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Reference Check Model
 */
export declare class ReferenceCheckModel extends Model {
    id: string;
    candidateId: string;
    applicationId: string;
    referenceName: string;
    referenceTitle: string;
    referenceCompany: string;
    referenceEmail: string;
    referencePhone: string;
    relationship: string;
    status: ReferenceCheckStatus;
    contactedAt: Date;
    completedAt: Date;
    rating: number;
    wouldRehire: boolean;
    strengths: string[];
    areasForImprovement: string[];
    notes: string;
    candidate: CandidateModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create job requisition
 */
export declare function createJobRequisition(requisitionData: Partial<JobRequisition>, transaction?: Transaction): Promise<JobRequisitionModel>;
/**
 * Update job requisition
 */
export declare function updateJobRequisition(requisitionId: string, updates: Partial<JobRequisition>, transaction?: Transaction): Promise<JobRequisitionModel>;
/**
 * Get requisition by ID
 */
export declare function getRequisitionById(requisitionId: string, includeApplications?: boolean): Promise<JobRequisitionModel | null>;
/**
 * Approve requisition
 */
export declare function approveRequisition(requisitionId: string, approvedBy: string, transaction?: Transaction): Promise<void>;
/**
 * Open requisition
 */
export declare function openRequisition(requisitionId: string, transaction?: Transaction): Promise<void>;
/**
 * Close requisition
 */
export declare function closeRequisition(requisitionId: string, transaction?: Transaction): Promise<void>;
/**
 * Search requisitions
 */
export declare function searchRequisitions(filters: {
    status?: RequisitionStatus[];
    departmentId?: string;
    hiringManagerId?: string;
    priority?: RequisitionPriority[];
}, page?: number, limit?: number): Promise<{
    requisitions: JobRequisitionModel[];
    total: number;
}>;
/**
 * Generate requisition number
 */
export declare function generateRequisitionNumber(prefix: string | undefined, sequence: number): string;
/**
 * Create candidate
 */
export declare function createCandidate(candidateData: Partial<Candidate>, transaction?: Transaction): Promise<CandidateModel>;
/**
 * Update candidate
 */
export declare function updateCandidate(candidateId: string, updates: Partial<Candidate>, transaction?: Transaction): Promise<CandidateModel>;
/**
 * Get candidate by ID
 */
export declare function getCandidateById(candidateId: string): Promise<CandidateModel | null>;
/**
 * Get candidate by email
 */
export declare function getCandidateByEmail(email: string): Promise<CandidateModel | null>;
/**
 * Search candidates
 */
export declare function searchCandidates(filters: {
    source?: CandidateSource[];
    skills?: string[];
    location?: string;
    minExperience?: number;
    maxExperience?: number;
}, page?: number, limit?: number): Promise<{
    candidates: CandidateModel[];
    total: number;
}>;
/**
 * Add candidate to talent pool
 */
export declare function addCandidateToTalentPool(candidateId: string, talentPoolId: string, transaction?: Transaction): Promise<void>;
/**
 * Parse resume (simple implementation)
 */
export declare function parseResume(resumeText: string): ResumeParseResult;
/**
 * Match candidate to requisition (skill-based)
 */
export declare function matchCandidateToRequisition(candidate: Candidate, requisition: JobRequisition): number;
/**
 * Submit application
 */
export declare function submitApplication(applicationData: Partial<JobApplication>, transaction?: Transaction): Promise<JobApplicationModel>;
/**
 * Update application status
 */
export declare function updateApplicationStatus(applicationId: string, newStatus: ApplicationStatus, notes?: string, transaction?: Transaction): Promise<void>;
/**
 * Get application by ID
 */
export declare function getApplicationById(applicationId: string): Promise<JobApplicationModel | null>;
/**
 * Get applications by requisition
 */
export declare function getApplicationsByRequisition(requisitionId: string, status?: ApplicationStatus[]): Promise<JobApplicationModel[]>;
/**
 * Assign application to recruiter
 */
export declare function assignApplicationToRecruiter(applicationId: string, recruiterId: string, transaction?: Transaction): Promise<void>;
/**
 * Reject application
 */
export declare function rejectApplication(applicationId: string, reason: string, transaction?: Transaction): Promise<void>;
/**
 * Withdraw application
 */
export declare function withdrawApplication(applicationId: string, reason: string, transaction?: Transaction): Promise<void>;
/**
 * Schedule interview
 */
export declare function scheduleInterview(interviewData: Partial<Interview>, transaction?: Transaction): Promise<InterviewModel>;
/**
 * Update interview status
 */
export declare function updateInterviewStatus(interviewId: string, newStatus: InterviewStatus, transaction?: Transaction): Promise<void>;
/**
 * Cancel interview
 */
export declare function cancelInterview(interviewId: string, transaction?: Transaction): Promise<void>;
/**
 * Reschedule interview
 */
export declare function rescheduleInterview(interviewId: string, newScheduledAt: Date, transaction?: Transaction): Promise<void>;
/**
 * Get interviews by application
 */
export declare function getInterviewsByApplication(applicationId: string): Promise<InterviewModel[]>;
/**
 * Get upcoming interviews
 */
export declare function getUpcomingInterviews(interviewerId?: string, days?: number): Promise<InterviewModel[]>;
/**
 * Submit interview feedback
 */
export declare function submitInterviewFeedback(feedbackData: Partial<InterviewFeedback>, transaction?: Transaction): Promise<InterviewFeedbackModel>;
/**
 * Get interview feedback
 */
export declare function getInterviewFeedback(interviewId: string): Promise<InterviewFeedbackModel[]>;
/**
 * Calculate aggregate interview score
 */
export declare function calculateAggregateInterviewScore(interviewId: string): Promise<number | null>;
/**
 * Create job offer
 */
export declare function createJobOffer(offerData: Partial<JobOffer>, transaction?: Transaction): Promise<JobOfferModel>;
/**
 * Send offer
 */
export declare function sendOffer(offerId: string, transaction?: Transaction): Promise<void>;
/**
 * Accept offer
 */
export declare function acceptOffer(offerId: string, transaction?: Transaction): Promise<void>;
/**
 * Decline offer
 */
export declare function declineOffer(offerId: string, transaction?: Transaction): Promise<void>;
/**
 * Get offers by candidate
 */
export declare function getOffersByCandidate(candidateId: string): Promise<JobOfferModel[]>;
/**
 * Get expiring offers
 */
export declare function getExpiringOffers(days?: number): Promise<JobOfferModel[]>;
/**
 * Initiate background check
 */
export declare function initiateBackgroundCheck(checkData: Partial<BackgroundCheck>, transaction?: Transaction): Promise<BackgroundCheckModel>;
/**
 * Update background check status
 */
export declare function updateBackgroundCheckStatus(checkId: string, status: BackgroundCheckStatus, results?: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * Get background checks by candidate
 */
export declare function getBackgroundChecksByCandidate(candidateId: string): Promise<BackgroundCheckModel[]>;
/**
 * Add reference check
 */
export declare function addReferenceCheck(checkData: Partial<ReferenceCheck>, transaction?: Transaction): Promise<ReferenceCheckModel>;
/**
 * Update reference check
 */
export declare function updateReferenceCheck(checkId: string, updates: Partial<ReferenceCheck>, transaction?: Transaction): Promise<void>;
/**
 * Complete reference check
 */
export declare function completeReferenceCheck(checkId: string, results: {
    rating: number;
    wouldRehire: boolean;
    strengths: string[];
    areasForImprovement: string[];
    notes: string;
}, transaction?: Transaction): Promise<void>;
/**
 * Get reference checks by candidate
 */
export declare function getReferenceChecksByCandidate(candidateId: string): Promise<ReferenceCheckModel[]>;
/**
 * Calculate time to fill
 */
export declare function calculateTimeToFill(requisitionId: string): Promise<number | null>;
/**
 * Calculate time to hire
 */
export declare function calculateTimeToHire(applicationId: string): Promise<number | null>;
/**
 * Get recruitment metrics
 */
export declare function getRecruitmentMetrics(startDate: Date, endDate: Date): Promise<RecruitmentMetrics>;
/**
 * Get pipeline conversion rates
 */
export declare function getPipelineConversionRates(requisitionId: string): Promise<Record<string, number>>;
/**
 * Format candidate name
 */
export declare function formatCandidateName(candidate: {
    firstName: string;
    lastName: string;
}): string;
/**
 * Generate offer letter content
 */
export declare function generateOfferLetterContent(offer: JobOffer, candidate: Candidate): string;
export declare class RecruitmentService {
    createRequisition(data: Partial<JobRequisition>): Promise<JobRequisitionModel>;
    createCandidate(data: Partial<Candidate>): Promise<CandidateModel>;
    submitApplication(data: Partial<JobApplication>): Promise<JobApplicationModel>;
    scheduleInterview(data: Partial<Interview>): Promise<InterviewModel>;
    createOffer(data: Partial<JobOffer>): Promise<JobOfferModel>;
    getMetrics(startDate: Date, endDate: Date): Promise<RecruitmentMetrics>;
}
export declare class RecruitmentController {
    private readonly recruitmentService;
    constructor(recruitmentService: RecruitmentService);
    createRequisition(data: Partial<JobRequisition>): Promise<JobRequisitionModel>;
    createCandidate(data: Partial<Candidate>): Promise<CandidateModel>;
    submitApplication(data: Partial<JobApplication>): Promise<JobApplicationModel>;
    getMetrics(startDate: string, endDate: string): Promise<RecruitmentMetrics>;
}
export { JobRequisitionModel, CandidateModel, JobApplicationModel, InterviewModel, InterviewFeedbackModel, JobOfferModel, BackgroundCheckModel, ReferenceCheckModel, RecruitmentService, RecruitmentController, };
//# sourceMappingURL=recruitment-management-kit.d.ts.map