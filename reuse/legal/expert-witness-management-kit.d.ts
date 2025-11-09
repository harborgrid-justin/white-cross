/**
 * LOC: EXPERT_WITNESS_MANAGEMENT_KIT_001
 * File: /reuse/legal/expert-witness-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal litigation modules
 *   - Expert witness controllers
 *   - Deposition management services
 *   - Trial preparation services
 *   - Legal billing services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Expert witness specialty areas
 */
export declare enum ExpertSpecialty {
    MEDICAL = "medical",
    NURSING = "nursing",
    PHARMACY = "pharmacy",
    MEDICAL_DEVICE = "medical_device",
    BIOMEDICAL_ENGINEERING = "biomedical_engineering",
    RADIOLOGY = "radiology",
    PATHOLOGY = "pathology",
    SURGERY = "surgery",
    ANESTHESIOLOGY = "anesthesiology",
    EMERGENCY_MEDICINE = "emergency_medicine",
    PSYCHIATRY = "psychiatry",
    NEUROLOGY = "neurology",
    CARDIOLOGY = "cardiology",
    ONCOLOGY = "oncology",
    ORTHOPEDICS = "orthopedics",
    ACCOUNTING = "accounting",
    ECONOMICS = "economics",
    ENGINEERING = "engineering",
    COMPUTER_FORENSICS = "computer_forensics",
    ACCIDENT_RECONSTRUCTION = "accident_reconstruction",
    TOXICOLOGY = "toxicology",
    VOCATIONAL = "vocational",
    LIFE_CARE_PLANNING = "life_care_planning",
    BIOMECHANICS = "biomechanics",
    EPIDEMIOLOGY = "epidemiology",
    OTHER = "other"
}
/**
 * Expert witness status lifecycle
 */
export declare enum ExpertStatus {
    CANDIDATE = "candidate",
    UNDER_REVIEW = "under_review",
    CONFLICT_CHECK = "conflict_check",
    APPROVED = "approved",
    RETAINED = "retained",
    ENGAGED = "engaged",
    REPORT_IN_PROGRESS = "report_in_progress",
    REPORT_SUBMITTED = "report_submitted",
    DEPOSITION_PREP = "deposition_prep",
    DEPOSED = "deposed",
    TRIAL_PREP = "trial_prep",
    TESTIFIED = "testified",
    COMPLETED = "completed",
    WITHDRAWN = "withdrawn",
    DISQUALIFIED = "disqualified"
}
/**
 * Expert witness engagement type
 */
export declare enum EngagementType {
    CONSULTING_ONLY = "consulting_only",
    TESTIFYING = "testifying",
    CONSULTING_AND_TESTIFYING = "consulting_and_testifying",
    REBUTTAL = "rebuttal",
    TECHNICAL_ADVISOR = "technical_advisor",
    SHADOW_EXPERT = "shadow_expert"
}
/**
 * Expert report status
 */
export declare enum ReportStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    DRAFT_SUBMITTED = "draft_submitted",
    UNDER_REVIEW = "under_review",
    REVISIONS_REQUESTED = "revisions_requested",
    FINAL_SUBMITTED = "final_submitted",
    DISCLOSED = "disclosed",
    SUPPLEMENTED = "supplemented",
    CHALLENGED = "challenged",
    EXCLUDED = "excluded",
    ADMITTED = "admitted"
}
/**
 * Deposition status
 */
export declare enum DepositionStatus {
    NOT_SCHEDULED = "not_scheduled",
    SCHEDULED = "scheduled",
    PREP_IN_PROGRESS = "prep_in_progress",
    READY = "ready",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    TRANSCRIPT_ORDERED = "transcript_ordered",
    TRANSCRIPT_RECEIVED = "transcript_received",
    ERRATA_PENDING = "errata_pending",
    FINALIZED = "finalized"
}
/**
 * Fee structure types
 */
export declare enum FeeStructure {
    HOURLY = "hourly",
    FLAT_FEE = "flat_fee",
    CONTINGENCY = "contingency",
    RETAINER_PLUS_HOURLY = "retainer_plus_hourly",
    PER_REPORT = "per_report",
    PER_DEPOSITION = "per_deposition",
    PER_TRIAL_DAY = "per_trial_day",
    BLENDED = "blended"
}
/**
 * Invoice status
 */
export declare enum InvoiceStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    DISPUTED = "disputed",
    PAID = "paid",
    OVERDUE = "overdue",
    WRITTEN_OFF = "written_off"
}
/**
 * Credential verification status
 */
export declare enum CredentialStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    EXPIRED = "expired",
    INVALID = "invalid",
    SUSPENDED = "suspended",
    REVOKED = "revoked"
}
/**
 * Conflict check result
 */
export declare enum ConflictCheckResult {
    CLEAR = "clear",
    POTENTIAL_CONFLICT = "potential_conflict",
    CONFLICT_IDENTIFIED = "conflict_identified",
    WAIVED = "waived",
    PENDING_REVIEW = "pending_review"
}
/**
 * Expert qualification verification result
 */
export interface QualificationVerification {
    expertId: string;
    verificationType: 'license' | 'certification' | 'education' | 'experience' | 'publication';
    status: CredentialStatus;
    verifiedDate: Date;
    expirationDate?: Date;
    issuingAuthority: string;
    credentialNumber?: string;
    verificationNotes: string;
    documentUrl?: string;
    verifiedBy: string;
}
/**
 * Expert selection criteria
 */
export interface ExpertSelectionCriteria {
    specialtyRequired: ExpertSpecialty[];
    jurisdictionRequired?: string[];
    minYearsExperience?: number;
    boardCertificationRequired?: boolean;
    priorTestimonyRequired?: boolean;
    maxHourlyRate?: number;
    availabilityRequired: Date;
    conflictCheckRequired: boolean;
    dauberChallengeHistory?: boolean;
}
/**
 * Expert report metadata
 */
export interface ExpertReportMetadata {
    reportId: string;
    expertId: string;
    caseId: string;
    reportType: 'initial' | 'supplemental' | 'rebuttal';
    version: number;
    submissionDate: Date;
    pageCount: number;
    attachmentCount: number;
    disclosureDate?: Date;
    dauberChallenged?: boolean;
    admissibilityStatus?: 'pending' | 'admitted' | 'excluded' | 'limited';
}
/**
 * Deposition preparation checklist
 */
export interface DepositionPrep {
    depositionId: string;
    expertId: string;
    scheduledDate: Date;
    location: string;
    estimatedDuration: number;
    prepSessionsCompleted: number;
    exhibitsReviewed: boolean;
    priorTestimonyReviewed: boolean;
    caseFactsReviewed: boolean;
    opposingCounselResearched: boolean;
    mockQuestionsCompleted: boolean;
    videoRecorded: boolean;
    interpreterNeeded: boolean;
    specialAccommodations?: string;
}
/**
 * Expert fee summary
 */
export interface ExpertFeeSummary {
    expertId: string;
    caseId: string;
    feeStructure: FeeStructure;
    hourlyRate?: number;
    retainerAmount?: number;
    totalHoursBilled: number;
    totalAmountBilled: number;
    totalAmountPaid: number;
    outstandingBalance: number;
    lastInvoiceDate?: Date;
    nextPaymentDue?: Date;
    budgetRemaining?: number;
}
/**
 * Expert performance metrics
 */
export interface ExpertPerformanceMetrics {
    expertId: string;
    totalCasesWorked: number;
    totalDepositions: number;
    totalTrials: number;
    dauberChallenges: number;
    dauberSuccessRate: number;
    averageReportTurnaround: number;
    clientSatisfactionScore: number;
    onTimeDeliveryRate: number;
    testimonyEffectivenessScore: number;
    communicationScore: number;
}
/**
 * Expert witness profile schema
 */
export declare const ExpertWitnessProfileSchema: any;
/**
 * Expert engagement schema
 */
export declare const ExpertEngagementSchema: any;
/**
 * Expert report schema
 */
export declare const ExpertReportSchema: any;
/**
 * Expert deposition schema
 */
export declare const ExpertDepositionSchema: any;
/**
 * Expert invoice schema
 */
export declare const ExpertInvoiceSchema: any;
/**
 * Expert credential verification schema
 */
export declare const CredentialVerificationSchema: any;
/**
 * Expert witness profile model
 */
export declare class ExpertWitnessProfile extends Model {
    id: string;
    firstName: string;
    lastName: string;
    credentials?: string;
    specialty: ExpertSpecialty;
    subSpecialties: string[];
    licenseNumber?: string;
    licenseState?: string;
    licenseExpiration?: Date;
    boardCertified: boolean;
    boardCertifications: string[];
    yearsExperience: number;
    currentEmployer?: string;
    currentPosition?: string;
    cvUrl?: string;
    photoUrl?: string;
    email: string;
    phone: string;
    address?: string;
    hourlyRate?: number;
    depositRequired: number;
    feeStructure: FeeStructure;
    availableForTravel: boolean;
    languagesSpoken: string[];
    publications: string[];
    priorTestimonyCount: number;
    dauberChallenges: number;
    dauberSuccesses: number;
    rating?: number;
    notes?: string;
    status: ExpertStatus;
    createdBy: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    engagements: ExpertEngagement[];
    credentials: CredentialVerification[];
}
/**
 * Expert engagement model
 */
export declare class ExpertEngagement extends Model {
    id: string;
    expertId: string;
    caseId: string;
    engagementType: EngagementType;
    retainedDate: Date;
    engagementLetterSigned: boolean;
    conflictCheckCompleted: boolean;
    conflictCheckResult?: ConflictCheckResult;
    expectedReportDate?: Date;
    expectedDepositionDate?: Date;
    expectedTrialDate?: Date;
    retainerAmount?: number;
    hourlyRate?: number;
    budgetCap?: number;
    currentSpend: number;
    status: ExpertStatus;
    assignedAttorney: string;
    notes?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    expert: ExpertWitnessProfile;
    reports: ExpertReport[];
    depositions: ExpertDeposition[];
    invoices: ExpertInvoice[];
}
/**
 * Expert report model
 */
export declare class ExpertReport extends Model {
    id: string;
    expertEngagementId: string;
    reportType: 'initial' | 'supplemental' | 'rebuttal';
    version: number;
    requestedDate: Date;
    dueDate: Date;
    submittedDate?: Date;
    disclosureDeadline?: Date;
    disclosedDate?: Date;
    reportUrl?: string;
    pageCount: number;
    attachmentCount: number;
    status: ReportStatus;
    dauberChallenged: boolean;
    dauberChallengeDate?: Date;
    dauberHearingDate?: Date;
    admissibilityStatus?: 'pending' | 'admitted' | 'excluded' | 'limited';
    reviewNotes?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    engagement: ExpertEngagement;
}
/**
 * Expert deposition model
 */
export declare class ExpertDeposition extends Model {
    id: string;
    expertEngagementId: string;
    noticeReceivedDate?: Date;
    scheduledDate?: Date;
    scheduledTime?: string;
    location?: string;
    remoteDeposition: boolean;
    estimatedDuration: number;
    videoRecorded: boolean;
    courtReporter?: string;
    opposingCounsel?: string;
    defendingAttorney?: string;
    prepSessionsCompleted: number;
    exhibitsIdentified: number;
    status: DepositionStatus;
    transcriptOrderedDate?: Date;
    transcriptReceivedDate?: Date;
    transcriptUrl?: string;
    errataDeadline?: Date;
    errataSubmitted: boolean;
    notes?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    engagement: ExpertEngagement;
}
/**
 * Expert invoice model
 */
export declare class ExpertInvoice extends Model {
    id: string;
    expertEngagementId: string;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    periodStart: Date;
    periodEnd: Date;
    hoursWorked: number;
    hourlyRate?: number;
    laborAmount: number;
    expensesAmount: number;
    totalAmount: number;
    status: InvoiceStatus;
    approvedBy?: string;
    approvedDate?: Date;
    paidDate?: Date;
    paymentMethod?: string;
    invoiceUrl?: string;
    notes?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    engagement: ExpertEngagement;
}
/**
 * Credential verification model
 */
export declare class CredentialVerification extends Model {
    id: string;
    expertId: string;
    verificationType: 'license' | 'certification' | 'education' | 'experience' | 'publication';
    credentialName: string;
    issuingAuthority: string;
    credentialNumber?: string;
    issueDate?: Date;
    expirationDate?: Date;
    verifiedDate: Date;
    verifiedBy: string;
    verificationMethod: string;
    status: CredentialStatus;
    documentUrl?: string;
    notes?: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    expert: ExpertWitnessProfile;
}
/**
 * Create expert witness profile DTO
 */
export declare class CreateExpertWitnessProfileDto {
    firstName: string;
    lastName: string;
    credentials?: string;
    specialty: ExpertSpecialty;
    subSpecialties?: string[];
    licenseNumber?: string;
    licenseState?: string;
    licenseExpiration?: Date;
    boardCertified?: boolean;
    boardCertifications?: string[];
    yearsExperience: number;
    currentEmployer?: string;
    currentPosition?: string;
    cvUrl?: string;
    email: string;
    phone: string;
    address?: string;
    hourlyRate?: number;
    depositRequired?: number;
    feeStructure?: FeeStructure;
    availableForTravel?: boolean;
    languagesSpoken?: string[];
    publications?: string[];
    priorTestimonyCount?: number;
    createdBy: string;
    organizationId: string;
}
/**
 * Update expert witness profile DTO
 */
export declare class UpdateExpertWitnessProfileDto {
    firstName?: string;
    lastName?: string;
    credentials?: string;
    specialty?: ExpertSpecialty;
    subSpecialties?: string[];
    hourlyRate?: number;
    phone?: string;
    status?: ExpertStatus;
    rating?: number;
    notes?: string;
}
/**
 * Create expert engagement DTO
 */
export declare class CreateExpertEngagementDto {
    expertId: string;
    caseId: string;
    engagementType: EngagementType;
    retainedDate: Date;
    expectedReportDate?: Date;
    expectedDepositionDate?: Date;
    retainerAmount?: number;
    hourlyRate?: number;
    budgetCap?: number;
    assignedAttorney: string;
    organizationId: string;
}
/**
 * Create expert report DTO
 */
export declare class CreateExpertReportDto {
    expertEngagementId: string;
    reportType: 'initial' | 'supplemental' | 'rebuttal';
    requestedDate: Date;
    dueDate: Date;
    disclosureDeadline?: Date;
    organizationId: string;
}
/**
 * Create expert deposition DTO
 */
export declare class CreateExpertDepositionDto {
    expertEngagementId: string;
    noticeReceivedDate?: Date;
    scheduledDate?: Date;
    scheduledTime?: string;
    location?: string;
    remoteDeposition?: boolean;
    estimatedDuration?: number;
    organizationId: string;
}
/**
 * Create expert invoice DTO
 */
export declare class CreateExpertInvoiceDto {
    expertEngagementId: string;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    periodStart: Date;
    periodEnd: Date;
    hoursWorked: number;
    hourlyRate?: number;
    laborAmount: number;
    expensesAmount?: number;
    totalAmount: number;
    invoiceUrl?: string;
    organizationId: string;
}
/**
 * Expert search filters DTO
 */
export declare class ExpertSearchFiltersDto {
    specialty?: ExpertSpecialty;
    licenseState?: string;
    boardCertified?: boolean;
    minYearsExperience?: number;
    maxHourlyRate?: number;
    availableForTravel?: boolean;
    status?: ExpertStatus;
    minRating?: number;
}
/**
 * Expert witness management service
 * Handles all expert witness coordination operations
 */
export declare class ExpertWitnessManagementService {
    private readonly sequelize;
    private readonly configService;
    private readonly logger;
    constructor(sequelize: Sequelize, configService: ConfigService);
    /**
     * Verify expert professional license
     * Validates active license status and expiration
     */
    verifyProfessionalLicense(expertId: string, licenseNumber: string, licenseState: string, verifiedBy: string, organizationId: string, transaction?: Transaction): Promise<CredentialVerification>;
    /**
     * Verify board certification credentials
     * Validates board certification status and specialty
     */
    verifyBoardCertification(expertId: string, certificationName: string, certifyingBoard: string, verifiedBy: string, organizationId: string, transaction?: Transaction): Promise<CredentialVerification>;
    /**
     * Verify educational credentials
     * Validates degrees and educational background
     */
    verifyEducationalCredentials(expertId: string, degreeName: string, institution: string, graduationYear: number, verifiedBy: string, organizationId: string, transaction?: Transaction): Promise<CredentialVerification>;
    /**
     * Verify professional experience
     * Validates work history and expertise claims
     */
    verifyProfessionalExperience(expertId: string, employerName: string, position: string, startYear: number, endYear: number | null, verifiedBy: string, organizationId: string, transaction?: Transaction): Promise<CredentialVerification>;
    /**
     * Verify published works and research
     * Validates publications and scholarly contributions
     */
    verifyPublications(expertId: string, publicationTitle: string, journal: string, publicationYear: number, verifiedBy: string, organizationId: string, transaction?: Transaction): Promise<CredentialVerification>;
    /**
     * Check credential expiration status
     * Monitors and alerts on expiring credentials
     */
    checkCredentialExpirations(expertId: string, daysThreshold?: number): Promise<CredentialVerification[]>;
    /**
     * Analyze expert CV and extract qualifications
     * Automated CV parsing and qualification extraction
     */
    analyzeExpertCV(expertId: string, cvUrl: string, organizationId: string): Promise<{
        education: string[];
        certifications: string[];
        experience: string[];
        publications: string[];
    }>;
    /**
     * Search experts by specialty and criteria
     * Advanced search with multiple filter options
     */
    searchExperts(filters: ExpertSearchFiltersDto, organizationId: string): Promise<ExpertWitnessProfile[]>;
    /**
     * Match experts to case requirements
     * Intelligent matching based on case needs
     */
    matchExpertsToCase(criteria: ExpertSelectionCriteria, organizationId: string): Promise<ExpertWitnessProfile[]>;
    /**
     * Perform conflict of interest check
     * Comprehensive conflict screening
     */
    performConflictCheck(expertId: string, caseId: string, opposingParties: string[], organizationId: string): Promise<ConflictCheckResult>;
    /**
     * Evaluate expert qualifications score
     * Calculate comprehensive qualification score
     */
    evaluateExpertQualifications(expertId: string): Promise<number>;
    /**
     * Research expert's prior testimony history
     * Compile testimony record and outcomes
     */
    researchPriorTestimony(expertId: string): Promise<{
        totalCases: number;
        depositions: number;
        trials: number;
        dauberChallenges: number;
        outcomes: string[];
    }>;
    /**
     * Check expert availability for case timeline
     * Verify availability for key dates
     */
    checkExpertAvailability(expertId: string, requiredDates: Date[]): Promise<{
        available: boolean;
        conflicts: Date[];
    }>;
    /**
     * Create expert engagement and retain expert
     * Formal retention process
     */
    retainExpert(data: CreateExpertEngagementDto, transaction?: Transaction): Promise<ExpertEngagement>;
    /**
     * Generate engagement letter for expert
     * Create formal engagement agreement
     */
    generateEngagementLetter(engagementId: string): Promise<{
        letterContent: string;
        letterUrl: string;
    }>;
    /**
     * Update engagement status
     * Track engagement lifecycle
     */
    updateEngagementStatus(engagementId: string, newStatus: ExpertStatus, notes?: string, transaction?: Transaction): Promise<ExpertEngagement>;
    /**
     * Track retainer and budget utilization
     * Monitor spend against budget
     */
    trackRetainerUtilization(engagementId: string): Promise<{
        retainerAmount: number;
        currentSpend: number;
        remainingRetainer: number;
        budgetCap?: number;
        budgetRemaining?: number;
        utilizationPercent: number;
    }>;
    /**
     * Create expert report tracking record
     * Initialize report tracking
     */
    createExpertReport(data: CreateExpertReportDto, transaction?: Transaction): Promise<ExpertReport>;
    /**
     * Update report status and track progress
     * Monitor report development
     */
    updateReportStatus(reportId: string, status: ReportStatus, submittedDate?: Date, reviewNotes?: string, transaction?: Transaction): Promise<ExpertReport>;
    /**
     * Track report deadline compliance
     * Monitor deadlines and send alerts
     */
    trackReportDeadlines(organizationId: string, daysThreshold?: number): Promise<ExpertReport[]>;
    /**
     * Manage report version control
     * Track report revisions
     */
    createReportVersion(reportId: string, reportUrl: string, pageCount: number, transaction?: Transaction): Promise<ExpertReport>;
    /**
     * Track Daubert challenges to expert reports
     * Monitor admissibility challenges
     */
    trackDauberChallenge(reportId: string, challengeDate: Date, hearingDate?: Date, transaction?: Transaction): Promise<ExpertReport>;
    /**
     * Update report admissibility status
     * Track court rulings on expert testimony
     */
    updateReportAdmissibility(reportId: string, admissibilityStatus: 'admitted' | 'excluded' | 'limited', transaction?: Transaction): Promise<ExpertReport>;
    /**
     * Schedule expert deposition
     * Create deposition record and tracking
     */
    scheduleDeposition(data: CreateExpertDepositionDto, transaction?: Transaction): Promise<ExpertDeposition>;
    /**
     * Create deposition preparation checklist
     * Generate comprehensive prep tasks
     */
    createDepositionPrepChecklist(depositionId: string): Promise<DepositionPrep>;
    /**
     * Track deposition preparation sessions
     * Log prep meetings and progress
     */
    trackPrepSession(depositionId: string, sessionNotes: string, transaction?: Transaction): Promise<ExpertDeposition>;
    /**
     * Generate deposition question outline
     * Create structured question list
     */
    generateDepositionQuestions(depositionId: string, reportId?: string): Promise<{
        questions: string[];
        exhibits: string[];
    }>;
    /**
     * Manage deposition exhibits
     * Track and organize deposition evidence
     */
    manageDepositionExhibits(depositionId: string, exhibitList: string[], transaction?: Transaction): Promise<ExpertDeposition>;
    /**
     * Update deposition status
     * Track deposition lifecycle
     */
    updateDepositionStatus(depositionId: string, status: DepositionStatus, transaction?: Transaction): Promise<ExpertDeposition>;
    /**
     * Track transcript receipt and review
     * Manage deposition transcripts
     */
    trackTranscript(depositionId: string, transcriptUrl: string, transcriptReceivedDate: Date, transaction?: Transaction): Promise<ExpertDeposition>;
    /**
     * Create expert invoice
     * Generate billing record
     */
    createExpertInvoice(data: CreateExpertInvoiceDto, transaction?: Transaction): Promise<ExpertInvoice>;
    /**
     * Calculate expert fees for period
     * Compute billable amounts
     */
    calculateExpertFees(engagementId: string, hoursWorked: number): Promise<{
        hourlyRate: number;
        laborAmount: number;
        subtotal: number;
    }>;
    /**
     * Approve expert invoice
     * Review and approve billing
     */
    approveInvoice(invoiceId: string, approvedBy: string, transaction?: Transaction): Promise<ExpertInvoice>;
    /**
     * Record invoice payment
     * Track payment receipt
     */
    recordInvoicePayment(invoiceId: string, paymentDate: Date, paymentMethod: string, transaction?: Transaction): Promise<ExpertInvoice>;
    /**
     * Generate fee summary for expert engagement
     * Comprehensive financial summary
     */
    generateFeeSummary(engagementId: string): Promise<ExpertFeeSummary>;
    /**
     * Track budget compliance and alerts
     * Monitor budget overruns
     */
    trackBudgetCompliance(engagementId: string): Promise<{
        budgetCap: number;
        totalSpend: number;
        remainingBudget: number;
        percentUtilized: number;
        overBudget: boolean;
    }>;
    /**
     * Calculate expert performance metrics
     * Comprehensive performance assessment
     */
    calculatePerformanceMetrics(expertId: string): Promise<ExpertPerformanceMetrics>;
    /**
     * Rate expert performance
     * Collect and store ratings
     */
    rateExpertPerformance(expertId: string, rating: number, feedback: string, transaction?: Transaction): Promise<ExpertWitnessProfile>;
    /**
     * Generate comprehensive expert engagement summary
     * Compile all engagement details for reporting
     */
    generateEngagementSummary(engagementId: string): Promise<{
        engagement: ExpertEngagement;
        expert: ExpertWitnessProfile;
        reports: ExpertReport[];
        depositions: ExpertDeposition[];
        invoices: ExpertInvoice[];
        feeSummary: ExpertFeeSummary;
        performanceMetrics: ExpertPerformanceMetrics;
    }>;
    /**
     * Check if two dates are on the same day
     */
    private isSameDay;
}
/**
 * Configuration factory for expert witness management
 */
export declare const expertWitnessManagementConfig: any;
/**
 * Expert witness management module
 */
export declare class ExpertWitnessManagementModule {
    /**
     * Register module with Sequelize models
     */
    static forRoot(sequelize: Sequelize): DynamicModule;
}
//# sourceMappingURL=expert-witness-management-kit.d.ts.map