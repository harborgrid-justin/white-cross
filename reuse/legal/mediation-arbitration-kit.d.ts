/**
 * LOC: MEDIATION_ARBITRATION_KIT_001
 * File: /reuse/legal/mediation-arbitration-kit.ts
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
 *   - Legal ADR modules
 *   - Mediation management controllers
 *   - Arbitration services
 *   - Settlement conference services
 *   - Dispute resolution services
 */
import { DynamicModule } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * ADR process types
 */
export declare enum ADRType {
    MEDIATION = "mediation",
    ARBITRATION = "arbitration",
    SETTLEMENT_CONFERENCE = "settlement_conference",
    NEUTRAL_EVALUATION = "neutral_evaluation",
    EARLY_NEUTRAL_EVALUATION = "early_neutral_evaluation",
    MINI_TRIAL = "mini_trial",
    SUMMARY_JURY_TRIAL = "summary_jury_trial",
    CONCILIATION = "conciliation",
    FACILITATION = "facilitation",
    MED_ARB = "med_arb",
    ARB_MED = "arb_med"
}
/**
 * ADR status lifecycle
 */
export declare enum ADRStatus {
    INITIATED = "initiated",
    MEDIATOR_SELECTION = "mediator_selection",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    SETTLEMENT_REACHED = "settlement_reached",
    IMPASSE = "impasse",
    AWARD_ISSUED = "award_issued",
    AWARD_CHALLENGED = "award_challenged",
    AWARD_CONFIRMED = "award_confirmed",
    AWARD_VACATED = "award_vacated",
    ENFORCEMENT_PENDING = "enforcement_pending",
    COMPLETED = "completed",
    TERMINATED = "terminated"
}
/**
 * Mediator certification levels
 */
export declare enum MediatorCertification {
    BASIC = "basic",
    ADVANCED = "advanced",
    MASTER = "master",
    SPECIALTY_MEDICAL = "specialty_medical",
    SPECIALTY_EMPLOYMENT = "specialty_employment",
    SPECIALTY_COMMERCIAL = "specialty_commercial",
    SPECIALTY_FAMILY = "specialty_family",
    SPECIALTY_CONSTRUCTION = "specialty_construction",
    AAA_CERTIFIED = "aaa_certified",
    JAMS_CERTIFIED = "jams_certified",
    CPR_CERTIFIED = "cpr_certified",
    IMI_CERTIFIED = "imi_certified"
}
/**
 * Arbitration binding types
 */
export declare enum ArbitrationType {
    BINDING = "binding",
    NON_BINDING = "non_binding",
    HIGH_LOW_ARBITRATION = "high_low_arbitration",
    BASEBALL_ARBITRATION = "baseball_arbitration",
    NIGHT_BASEBALL = "night_baseball"
}
/**
 * Arbitration rule sets
 */
export declare enum ArbitrationRules {
    AAA_COMMERCIAL = "aaa_commercial",
    AAA_EMPLOYMENT = "aaa_employment",
    AAA_HEALTHCARE = "aaa_healthcare",
    JAMS_COMPREHENSIVE = "jams_comprehensive",
    JAMS_STREAMLINED = "jams_streamlined",
    CPR_RULES = "cpr_rules",
    UNCITRAL = "uncitral",
    ICC = "icc",
    CUSTOM = "custom"
}
/**
 * Settlement offer status
 */
export declare enum SettlementOfferStatus {
    DRAFT = "draft",
    PROPOSED = "proposed",
    PENDING_REVIEW = "pending_review",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    COUNTERED = "countered",
    WITHDRAWN = "withdrawn",
    EXPIRED = "expired"
}
/**
 * Award status tracking
 */
export declare enum AwardStatus {
    DRAFT = "draft",
    ISSUED = "issued",
    SERVED = "served",
    MOTION_TO_CONFIRM = "motion_to_confirm",
    MOTION_TO_VACATE = "motion_to_vacate",
    MOTION_TO_MODIFY = "motion_to_modify",
    CONFIRMED = "confirmed",
    VACATED = "vacated",
    MODIFIED = "modified",
    ENFORCEMENT_INITIATED = "enforcement_initiated",
    SATISFIED = "satisfied"
}
/**
 * Session format types
 */
export declare enum SessionFormat {
    IN_PERSON = "in_person",
    VIRTUAL = "virtual",
    HYBRID = "hybrid",
    TELEPHONIC = "telephonic",
    ASYNCHRONOUS = "asynchronous"
}
/**
 * Mediator interface
 */
export interface IMediator {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization?: string;
    certifications: MediatorCertification[];
    specializations: string[];
    yearsExperience: number;
    successRate?: number;
    totalCasesMediated: number;
    hourlyRate: number;
    dailyRate?: number;
    availability: Record<string, boolean>;
    bio: string;
    educationBackground: string[];
    languages: string[];
    jurisdictions: string[];
    conflictCheckIds: string[];
    rating?: number;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * ADR proceeding interface
 */
export interface IADRProceeding {
    id: string;
    adrNumber: string;
    adrType: ADRType;
    status: ADRStatus;
    matterId: string;
    matterName: string;
    claimantId: string;
    claimantName: string;
    respondentId: string;
    respondentName: string;
    mediatorId?: string;
    arbitratorIds: string[];
    disputeDescription: string;
    amountInControversy?: number;
    arbitrationType?: ArbitrationType;
    arbitrationRules?: ArbitrationRules;
    sessionFormat: SessionFormat;
    scheduledDate?: Date;
    scheduledDuration?: number;
    location?: string;
    virtualMeetingLink?: string;
    confidentialityAgreementSigned: boolean;
    isBinding: boolean;
    discoveryAllowed: boolean;
    filingFee?: number;
    administrativeFees?: number;
    neutralFees?: number;
    estimatedTotalCost?: number;
    actualTotalCost?: number;
    initiationDate: Date;
    completionDate?: Date;
    outcome?: string;
    settlementAmount?: number;
    tags: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Settlement offer interface
 */
export interface ISettlementOffer {
    id: string;
    adrProceedingId: string;
    offerNumber: string;
    offeringParty: 'claimant' | 'respondent';
    offeringPartyId: string;
    receivingPartyId: string;
    offerAmount: number;
    structuredPayment?: boolean;
    paymentTerms?: string;
    nonMonetaryTerms?: string[];
    conditions: string[];
    status: SettlementOfferStatus;
    proposedDate: Date;
    responseDeadline: Date;
    responseDate?: Date;
    counterOfferAmount?: number;
    rejectionReason?: string;
    acceptedDate?: Date;
    confidential: boolean;
    validityPeriod?: number;
    relatedOfferIds: string[];
    attachments: string[];
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Arbitration award interface
 */
export interface IArbitrationAward {
    id: string;
    adrProceedingId: string;
    awardNumber: string;
    arbitratorIds: string[];
    awardType: 'final' | 'interim' | 'partial' | 'consent' | 'default';
    status: AwardStatus;
    issuedDate?: Date;
    awardAmount?: number;
    prevailingParty?: 'claimant' | 'respondent' | 'split';
    findings: string;
    reasoning: string;
    costsAwarded?: number;
    costsAllocationClaimant?: number;
    costsAllocationRespondent?: number;
    interestRate?: number;
    interestStartDate?: Date;
    paymentDeadline?: Date;
    appealAllowed: boolean;
    appealDeadline?: Date;
    confirmationMotionDate?: Date;
    confirmationJudgment?: string;
    vacatureMotionDate?: Date;
    vacatureReason?: string;
    enforcementJurisdiction?: string;
    enforcementStatus?: string;
    satisfactionDate?: Date;
    documentPath: string;
    digitalSignature?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ADR session interface
 */
export interface IADRSession {
    id: string;
    adrProceedingId: string;
    sessionNumber: number;
    sessionDate: Date;
    duration: number;
    format: SessionFormat;
    location?: string;
    virtualMeetingLink?: string;
    attendees: string[];
    mediatorNotes?: string;
    progressNotes: string;
    nextSteps: string[];
    documentsExchanged: string[];
    settlementDiscussed: boolean;
    settlementRange?: {
        min: number;
        max: number;
    };
    nextSessionDate?: Date;
    caucusHeld: boolean;
    caucusDuration?: number;
    isSuccessful: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ADR outcome metrics interface
 */
export interface IADROutcomeMetrics {
    totalProceedings: number;
    settledProceedings: number;
    impasseProceedings: number;
    settlementRate: number;
    averageSettlementAmount: number;
    averageTimeToResolution: number;
    averageCost: number;
    costSavingsVsLitigation: number;
    mediatorSuccessRates: Record<string, number>;
    settlementRateByType: Record<ADRType, number>;
    averageSessionsToSettlement: number;
}
export declare const CreateMediatorSchema: any;
export declare const CreateADRProceedingSchema: any;
export declare const CreateSettlementOfferSchema: any;
export declare const CreateArbitrationAwardSchema: any;
export declare class Mediator extends Model<IMediator> {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization?: string;
    certifications: MediatorCertification[];
    specializations: string[];
    yearsExperience: number;
    successRate?: number;
    totalCasesMediated: number;
    hourlyRate: number;
    dailyRate?: number;
    availability: Record<string, boolean>;
    bio: string;
    educationBackground: string[];
    languages: string[];
    jurisdictions: string[];
    conflictCheckIds: string[];
    rating?: number;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    proceedings: ADRProceeding[];
}
export declare class ADRProceeding extends Model<IADRProceeding> {
    id: string;
    adrNumber: string;
    adrType: ADRType;
    status: ADRStatus;
    matterId: string;
    matterName: string;
    claimantId: string;
    claimantName: string;
    respondentId: string;
    respondentName: string;
    mediatorId?: string;
    arbitratorIds: string[];
    disputeDescription: string;
    amountInControversy?: number;
    arbitrationType?: ArbitrationType;
    arbitrationRules?: ArbitrationRules;
    sessionFormat: SessionFormat;
    scheduledDate?: Date;
    scheduledDuration?: number;
    location?: string;
    virtualMeetingLink?: string;
    confidentialityAgreementSigned: boolean;
    isBinding: boolean;
    discoveryAllowed: boolean;
    filingFee?: number;
    administrativeFees?: number;
    neutralFees?: number;
    estimatedTotalCost?: number;
    actualTotalCost?: number;
    initiationDate: Date;
    completionDate?: Date;
    outcome?: string;
    settlementAmount?: number;
    tags: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    mediator?: Mediator;
    settlementOffers: SettlementOffer[];
    awards: ArbitrationAward[];
    sessions: ADRSession[];
}
export declare class SettlementOffer extends Model<ISettlementOffer> {
    id: string;
    adrProceedingId: string;
    offerNumber: string;
    offeringParty: 'claimant' | 'respondent';
    offeringPartyId: string;
    receivingPartyId: string;
    offerAmount: number;
    structuredPayment?: boolean;
    paymentTerms?: string;
    nonMonetaryTerms?: string[];
    conditions: string[];
    status: SettlementOfferStatus;
    proposedDate: Date;
    responseDeadline: Date;
    responseDate?: Date;
    counterOfferAmount?: number;
    rejectionReason?: string;
    acceptedDate?: Date;
    confidential: boolean;
    validityPeriod?: number;
    relatedOfferIds: string[];
    attachments: string[];
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    adrProceeding: ADRProceeding;
}
export declare class ArbitrationAward extends Model<IArbitrationAward> {
    id: string;
    adrProceedingId: string;
    awardNumber: string;
    arbitratorIds: string[];
    awardType: 'final' | 'interim' | 'partial' | 'consent' | 'default';
    status: AwardStatus;
    issuedDate?: Date;
    awardAmount?: number;
    prevailingParty?: 'claimant' | 'respondent' | 'split';
    findings: string;
    reasoning: string;
    costsAwarded?: number;
    costsAllocationClaimant?: number;
    costsAllocationRespondent?: number;
    interestRate?: number;
    interestStartDate?: Date;
    paymentDeadline?: Date;
    appealAllowed: boolean;
    appealDeadline?: Date;
    confirmationMotionDate?: Date;
    confirmationJudgment?: string;
    vacatureMotionDate?: Date;
    vacatureReason?: string;
    enforcementJurisdiction?: string;
    enforcementStatus?: string;
    satisfactionDate?: Date;
    documentPath: string;
    digitalSignature?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    adrProceeding: ADRProceeding;
}
export declare class ADRSession extends Model<IADRSession> {
    id: string;
    adrProceedingId: string;
    sessionNumber: number;
    sessionDate: Date;
    duration: number;
    format: SessionFormat;
    location?: string;
    virtualMeetingLink?: string;
    attendees: string[];
    mediatorNotes?: string;
    progressNotes: string;
    nextSteps: string[];
    documentsExchanged: string[];
    settlementDiscussed: boolean;
    settlementRange?: {
        min: number;
        max: number;
    };
    nextSessionDate?: Date;
    caucusHeld: boolean;
    caucusDuration?: number;
    isSuccessful: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    adrProceeding: ADRProceeding;
}
/**
 * Generates unique ADR proceeding number
 */
export declare function generateADRNumber(prefix?: string): string;
/**
 * Generates unique settlement offer number
 */
export declare function generateOfferNumber(adrNumber: string, sequence: number): string;
/**
 * Generates unique arbitration award number
 */
export declare function generateAwardNumber(adrNumber: string): string;
/**
 * Calculates mediator conflict score
 */
export declare function calculateConflictScore(mediatorConflictIds: string[], partyIds: string[]): number;
/**
 * Ranks mediators by suitability
 */
export declare function rankMediatorsBySuitability(mediators: IMediator[], criteria: {
    specialization?: string;
    jurisdiction?: string;
    maxRate?: number;
    partyIds: string[];
}): IMediator[];
/**
 * Mediator Selection Service
 * Manages mediator profiles and selection algorithms
 */
export declare class MediatorSelectionService {
    private readonly mediatorRepository;
    private readonly logger;
    constructor(mediatorRepository: typeof Mediator);
    /**
     * Creates a new mediator profile
     */
    createMediator(data: z.infer<typeof CreateMediatorSchema>): Promise<Mediator>;
    /**
     * Finds qualified mediators based on criteria
     */
    findQualifiedMediators(criteria: {
        specialization?: string;
        jurisdiction?: string;
        certifications?: MediatorCertification[];
        maxRate?: number;
        minExperience?: number;
        partyIds: string[];
    }): Promise<Mediator[]>;
    /**
     * Performs conflict check for mediator
     */
    performConflictCheck(mediatorId: string, partyIds: string[]): Promise<{
        hasConflict: boolean;
        conflictingParties: string[];
    }>;
    /**
     * Updates mediator availability calendar
     */
    updateAvailability(mediatorId: string, availability: Record<string, boolean>): Promise<Mediator>;
    /**
     * Calculates mediator success metrics
     */
    calculateMediatorMetrics(mediatorId: string): Promise<{
        successRate: number;
        averageResolutionTime: number;
        totalCases: number;
    }>;
    /**
     * Validates mediator certification and renewal status
     */
    validateMediatorCertification(mediatorId: string): Promise<{
        isValid: boolean;
        certifications: MediatorCertification[];
        expiringCertifications: string[];
        renewalRequired: boolean;
    }>;
    /**
     * Searches mediators by party preferences
     */
    searchMediatorsByPreference(preferences: {
        preferredStyle?: 'facilitative' | 'evaluative' | 'transformative';
        preferredGender?: string;
        preferredLanguage?: string;
        industryExperience?: string;
        virtualCapable?: boolean;
    }): Promise<Mediator[]>;
    /**
     * Compares mediator costs and generates cost analysis
     */
    compareMediatorCosts(mediatorIds: string[]): Promise<{
        mediatorId: string;
        name: string;
        hourlyRate: number;
        estimatedCost: number;
        valueScore: number;
    }[]>;
}
/**
 * ADR Proceeding Management Service
 * Manages ADR proceedings lifecycle
 */
export declare class ADRProceedingService {
    private readonly adrRepository;
    private readonly mediatorRepository;
    private readonly logger;
    constructor(adrRepository: typeof ADRProceeding, mediatorRepository: typeof Mediator);
    /**
     * Initiates a new ADR proceeding
     */
    initiateADRProceeding(data: z.infer<typeof CreateADRProceedingSchema>): Promise<ADRProceeding>;
    /**
     * Assigns mediator to proceeding
     */
    assignMediator(proceedingId: string, mediatorId: string): Promise<ADRProceeding>;
    /**
     * Schedules ADR session
     */
    scheduleSession(proceedingId: string, sessionData: {
        scheduledDate: Date;
        scheduledDuration: number;
        location?: string;
        virtualMeetingLink?: string;
    }): Promise<ADRProceeding>;
    /**
     * Updates proceeding status
     */
    updateStatus(proceedingId: string, status: ADRStatus): Promise<ADRProceeding>;
    /**
     * Calculates estimated ADR costs
     */
    calculateEstimatedCosts(proceedingId: string): Promise<{
        filingFee: number;
        administrativeFees: number;
        neutralFees: number;
        estimatedTotal: number;
    }>;
    /**
     * Generates virtual meeting link for ADR session
     */
    generateVirtualMeetingLink(proceedingId: string): Promise<{
        meetingLink: string;
        meetingId: string;
        passcode: string;
    }>;
    /**
     * Sends ADR notifications to parties
     */
    sendADRNotifications(proceedingId: string, notificationType: 'scheduled' | 'reminder' | 'outcome'): Promise<{
        sent: boolean;
        recipients: string[];
    }>;
    /**
     * Generates confidentiality agreement
     */
    generateConfidentialityAgreement(proceedingId: string): Promise<{
        agreementPath: string;
        agreementContent: string;
    }>;
    /**
     * Tracks ADR communications and correspondence
     */
    trackADRCommunications(proceedingId: string, communication: {
        type: 'email' | 'phone' | 'document' | 'meeting';
        from: string;
        to: string;
        subject: string;
        content?: string;
    }): Promise<void>;
}
/**
 * Settlement Offer Management Service
 * Manages settlement offers and counteroffers
 */
export declare class SettlementOfferService {
    private readonly offerRepository;
    private readonly adrRepository;
    private readonly logger;
    constructor(offerRepository: typeof SettlementOffer, adrRepository: typeof ADRProceeding);
    /**
     * Creates a new settlement offer
     */
    createOffer(data: z.infer<typeof CreateSettlementOfferSchema>): Promise<SettlementOffer>;
    /**
     * Responds to settlement offer
     */
    respondToOffer(offerId: string, response: {
        action: 'accept' | 'reject' | 'counter';
        counterAmount?: number;
        rejectionReason?: string;
    }): Promise<SettlementOffer>;
    /**
     * Generates settlement valuation analysis
     */
    generateValuationAnalysis(offerId: string): Promise<{
        offerAmount: number;
        estimatedValue: number;
        valuationPercentage: number;
        recommendation: string;
    }>;
    /**
     * Tracks settlement negotiation history
     */
    getOfferHistory(adrProceedingId: string): Promise<SettlementOffer[]>;
    /**
     * Generates settlement agreement document
     */
    generateSettlementAgreement(offerId: string): Promise<{
        agreementPath: string;
        agreementContent: string;
    }>;
    /**
     * Validates offer compliance with legal requirements
     */
    validateOfferCompliance(offerId: string): Promise<{
        isCompliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
    /**
     * Calculates settlement offer trends
     */
    calculateOfferTrends(adrProceedingId: string): Promise<{
        offerCount: number;
        averageOfferAmount: number;
        lowestOffer: number;
        highestOffer: number;
        trendDirection: 'increasing' | 'decreasing' | 'stable';
    }>;
}
/**
 * Arbitration Award Management Service
 * Manages arbitration awards and enforcement
 */
export declare class ArbitrationAwardService {
    private readonly awardRepository;
    private readonly adrRepository;
    private readonly logger;
    constructor(awardRepository: typeof ArbitrationAward, adrRepository: typeof ADRProceeding);
    /**
     * Creates arbitration award
     */
    createAward(data: z.infer<typeof CreateArbitrationAwardSchema>): Promise<ArbitrationAward>;
    /**
     * Issues arbitration award
     */
    issueAward(awardId: string): Promise<ArbitrationAward>;
    /**
     * Confirms arbitration award
     */
    confirmAward(awardId: string, confirmationData: {
        confirmationJudgment: string;
        confirmationMotionDate: Date;
    }): Promise<ArbitrationAward>;
    /**
     * Tracks award enforcement
     */
    trackEnforcement(awardId: string, enforcementData: {
        jurisdiction: string;
        enforcementStatus: string;
    }): Promise<ArbitrationAward>;
    /**
     * Calculates award payment schedule
     */
    calculatePaymentSchedule(awardId: string): Promise<{
        principalAmount: number;
        interestAmount: number;
        totalDue: number;
        paymentDeadline: Date;
    }>;
}
/**
 * ADR Session Management Service
 * Manages ADR sessions and conferences
 */
export declare class ADRSessionService {
    private readonly sessionRepository;
    private readonly adrRepository;
    private readonly logger;
    constructor(sessionRepository: typeof ADRSession, adrRepository: typeof ADRProceeding);
    /**
     * Creates a new ADR session
     */
    createSession(sessionData: {
        adrProceedingId: string;
        sessionDate: Date;
        duration: number;
        format: SessionFormat;
        location?: string;
        virtualMeetingLink?: string;
        attendees: string[];
    }): Promise<ADRSession>;
    /**
     * Records session outcomes
     */
    recordSessionOutcome(sessionId: string, outcome: {
        progressNotes: string;
        nextSteps: string[];
        settlementDiscussed: boolean;
        settlementRange?: {
            min: number;
            max: number;
        };
        caucusHeld?: boolean;
        caucusDuration?: number;
        isSuccessful: boolean;
    }): Promise<ADRSession>;
    /**
     * Schedules follow-up session
     */
    scheduleFollowUp(sessionId: string, nextSessionData: {
        sessionDate: Date;
        duration: number;
        format: SessionFormat;
    }): Promise<ADRSession>;
    /**
     * Retrieves session history
     */
    getSessionHistory(adrProceedingId: string): Promise<ADRSession[]>;
}
/**
 * ADR Outcome Analytics Service
 * Provides outcome analysis and reporting
 */
export declare class ADROutcomeAnalyticsService {
    private readonly adrRepository;
    private readonly offerRepository;
    private readonly sessionRepository;
    private readonly logger;
    constructor(adrRepository: typeof ADRProceeding, offerRepository: typeof SettlementOffer, sessionRepository: typeof ADRSession);
    /**
     * Calculates overall ADR outcome metrics
     */
    calculateOutcomeMetrics(filters?: {
        dateFrom?: Date;
        dateTo?: Date;
        adrType?: ADRType;
        mediatorId?: string;
    }): Promise<IADROutcomeMetrics>;
    /**
     * Analyzes settlement patterns
     */
    analyzeSettlementPatterns(adrType?: ADRType): Promise<{
        averageOfferCount: number;
        averageNegotiationTime: number;
        acceptanceRate: number;
        averageDiscountFromInitial: number;
    }>;
    /**
     * Generates ADR suitability assessment
     */
    assessADRSuitability(caseData: {
        matterType: string;
        amountInControversy: number;
        relationshipPreservation: boolean;
        timeConstraints: boolean;
        confidentialityRequired: boolean;
    }): Promise<{
        suitabilityScore: number;
        recommendedADRType: ADRType;
        reasoning: string[];
    }>;
    /**
     * Compares ADR cost vs litigation cost
     */
    compareADRVsLitigationCost(proceedingId: string): Promise<{
        adrCost: number;
        estimatedLitigationCost: number;
        savings: number;
        savingsPercentage: number;
    }>;
}
export declare const mediationArbitrationConfig: any;
export declare class MediationArbitrationModule {
    static forRoot(): DynamicModule;
    static forFeature(): DynamicModule;
}
//# sourceMappingURL=mediation-arbitration-kit.d.ts.map